import { OpenAI } from 'openai'

type ChatResponse = {
  choices: Array<{
    message: {
      content: string | null;
    };
  }>;
};

type ImageAnalysisResponse = {
  tags: {
    [filename: string]: string[]
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeImage(formData: FormData): Promise<ImageAnalysisResponse> {
  try {
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string
    const temperature = parseFloat(formData.get('temperature') as string)
    
    const response: ChatResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: await fileToBase64(image),
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: temperature,
    })

    return { tags: { [image.name]: response.choices[0].message.content?.split(',').map(tag => tag.trim()) || [] } }
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw new Error('Failed to analyze image')
  }
}

async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return `data:${file.type};base64,${buffer.toString('base64')}`
}