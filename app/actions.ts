'use server'

import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeSVG(prevState: any, formData: FormData) {
  const svgContent = formData.get('svgContent') as string
  if (!svgContent) {
    return { error: 'No SVG content provided' }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes an SVG appearance and provides relevant tags for searching. Return only a comma-separated list of tags, with no additional text or explanation.'
        },
        {
          role: 'user',
          content: `Analyze this SVG and provide a list of relevant tags for searching (eg. a disk may be used for saving): ${svgContent}`
        }
      ],
    })

    const tags = response.choices[0]?.message?.content || ''
    return { tags: tags.split(',').map(tag => tag.trim()) }
  } catch (error) {
    console.error('Error in analyzeSVG:', error)
    return { error: 'Failed to analyze SVG' }
  }
}