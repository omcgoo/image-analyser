import { useState, useEffect } from 'react'

interface AnalysisResult {
  [filename: string]: string[]
}

export default function useImageAnalysis(isTestMode: boolean) {
  const [tags, setTags] = useState<AnalysisResult>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateTestTags = (filename: string): string[] => {
    const baseTags = ['android', 'mobile', 'app', 'development', 'ui', 'ux', 'design', 'code', 'programming', 'software']
    const uniqueTags = filename.split(/[.-]/).filter(tag => tag.length > 2)
    const combinedTags = [...new Set([...baseTags, ...uniqueTags])]
    return combinedTags.slice(0, Math.min(10, combinedTags.length))
  }

  const analyzeImages = async (formData: FormData, isBulk: boolean) => {
    setIsLoading(true)
    setError(null)
    try {
      if (!isTestMode) {
        // GPT mode logic (API calls)
        const endpoint = isBulk ? '/api/analyze-bulk' : '/api/analyze'
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          throw new Error(`Failed to analyze ${isBulk ? 'bulk images' : 'image'}`)
        }
        const data = await response.json()
        if (data.tags) {
          setTags(data.tags)
        } else {
          throw new Error('No tags returned from the API')
        }
      } else {
        // Test mode logic (dummy data)
        await new Promise(resolve => setTimeout(resolve, isBulk ? 2000 : 1000))
        const testTags: AnalysisResult = {}
        const filenames = isBulk
          ? formData.getAll('filenames') as string[]
          : [formData.get('filename') as string];
        filenames.forEach(filename => {
          testTags[filename] = generateTestTags(filename)
        })
        setTags(testTags)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setTags({})
    } finally {
      setIsLoading(false)
    }
  }

  // Reset tags when switching modes
  useEffect(() => {
    setTags({})
  }, [isTestMode])

  return {
    analyzeImages,
    tags,
    isLoading,
    error,
  }
}