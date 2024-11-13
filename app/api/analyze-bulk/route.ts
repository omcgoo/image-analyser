import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getOpenAIApiKey } from '../config/openai'
import sharp from 'sharp'

const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
})

const MAX_IMAGE_SIZE = 256
const MAX_BASE64_LENGTH = 60000

async function resizeAndCompressImage(buffer: Buffer, mimeType: string): Promise<string> {
  const image = sharp(buffer)
  const metadata = await image.metadata()
  
  if (metadata.width && metadata.height) {
    const resizeOptions = metadata.width > metadata.height
      ? { width: MAX_IMAGE_SIZE }
      : { height: MAX_IMAGE_SIZE }
    
    let quality = 80
    let resizedBuffer: Buffer
    let base64Image: string

    do {
      resizedBuffer = await image
        .resize(resizeOptions)
        .webp({ quality })
        .toBuffer()

      base64Image = resizedBuffer.toString('base64')
      quality -= 5
    } while (base64Image.length > MAX_BASE64_LENGTH && quality > 20)

    return `data:image/webp;base64,${base64Image}`
  }
  
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const images = formData.getAll('images') as File[]
    const prompt = formData.get('prompt') as string
    const temperature = parseFloat(formData.get('temperature') as string)
    const maxCompletionTokens = parseInt(formData.get('max_completion_tokens') as string) || 300

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const results: { [filename: string]: string[] } = {}

    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const mimeType = image.type

      const compressedImageData = await resizeAndCompressImage(buffer, mimeType)
      const base64Image = compressedImageData.split(',')[1];


      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: maxCompletionTokens,
        temperature: temperature,
      })

      const generatedTags = response.choices[0].message.content
        ?.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0) || []

      results[image.name] = generatedTags
    }

    return NextResponse.json({ tags: results })
  } catch (error) {
    console.error('Error in bulk API route:', error)
    return NextResponse.json({ error: 'Failed to analyze images' }, { status: 500 })
  }
}