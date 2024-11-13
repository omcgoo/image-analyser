'use client'

import React, { useState, useCallback } from 'react'
import ImageUploader from './components/ImageUploader'
import TagList from './components/TagList'
import SettingsPanel from './components/SettingsPanel'
import useImageAnalysis from './hooks/useImageAnalysis'
import CustomSwitch from './components/ui/custom-switch'


export default function Page() {
  const [prompt, setPrompt] = useState("Generate a comma-separated list of relevant tags for this image. Only return the tags, no other text. Use single words. Optimize tags for use when making an image search, for concepts which could be represented by this image; specifically for use on developers.android.com")
  const [temperature, setTemperature] = useState(0.4)
  const [isTestMode, setIsTestMode] = useState(true)
  const [previews, setPreviews] = useState<{ [filename: string]: string }>({})
  const { analyzeImages, tags, isLoading, error } = useImageAnalysis(isTestMode)

  const handleUpload = useCallback(async (files: File[] | { [filename: string]: File }, filePreviews: { [filename: string]: string }) => {
    const formData = new FormData()
    const isBulk = !Array.isArray(files)

    if (isBulk) {
      Object.entries(files as { [filename: string]: File }).forEach(([filename, file]) => {
        formData.append('images', file)
        formData.append('filenames', filename)
      })
    } else {
      const file = files[0] as File
      formData.append('image', file)
      formData.append('filename', file.name)
    }
    formData.append('prompt', prompt)
    formData.append('temperature', temperature.toString())
    formData.append('max_completion_tokens', '300')
    setPreviews(filePreviews)
    await analyzeImages(formData, isBulk)
  }, [prompt, temperature, analyzeImages])

  const handleTestModeToggle = useCallback(() => {
    setIsTestMode(prev => !prev)
    setPreviews({})
  }, [])


  return (
    <main className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-amber-900">
              Image Tag Generator
            </h1>
          </div>
          <CustomSwitch
            isOn={!isTestMode}
            handleToggle={handleTestModeToggle}
            onLabel="GPT on"
            offLabel="GPT off"
          />
        </div>

        <ImageUploader 
          onUpload={handleUpload}
          isLoading={isLoading}
        />

        {error && (
          <p className="text-red-700 mt-4 font-medium" role="alert">
            Error: {error}
          </p>
        )}

        <TagList tags={tags} previews={previews} />

        <SettingsPanel 
          prompt={prompt}
          onPromptChange={setPrompt}
          temperature={temperature}
          onTemperatureChange={setTemperature}
        />
      </div>
    </main>
  )
}