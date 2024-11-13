'use client'

import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import TagList from './components/TagList'
import SettingsPanel from './components/SettingsPanel'
import useImageAnalysis from './hooks/useImageAnalysis'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Settings } from 'lucide-react'
import { Button } from "./components/ui/button"

export default function Component() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [prompt, setPrompt] = useState("Generate a comma-separated list of relevant tags for this image. Only return the tags, no other text. Use single words. Optimize tags for use when making an image search, for concepts which could be represented by this image; specifically for use on developers.android.com")
  const [temperature, setTemperature] = useState(0.4)
  const [activeTab, setActiveTab] = useState("single")
  const { 
    analyzeImage, 
    analyzeBulkImages, 
    tags, 
    bulkTags, 
    isLoading, 
    isBulkLoading, 
    error 
  } = useImageAnalysis()

  const handleSingleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('prompt', prompt)
    formData.append('temperature', temperature.toString())
    formData.append('max_completion_tokens', '300')
    await analyzeImage(formData)
  }

  const handleBulkUpload = async (files: FileList) => {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }
    formData.append('prompt', prompt)
    formData.append('temperature', temperature.toString())
    formData.append('max_completion_tokens', '300')
    await analyzeBulkImages(formData)
  }

  return (
    <main className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-amber-800 mb-2">
          Image Tag Generator
        </h1>
        <p className="text-amber-600 mb-8">Android Developers Edition</p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2" aria-label="Upload options">
            <TabsTrigger value="single">Single Upload</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <ImageUploader 
              onSingleUpload={handleSingleUpload}
              isLoading={isLoading}
              mode="single"
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {activeTab === "single" && <TagList tags={tags} />}
          </TabsContent>
          <TabsContent value="bulk">
            <ImageUploader 
              onBulkUpload={handleBulkUpload}
              isLoading={isBulkLoading}
              mode="bulk"
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {isBulkLoading && <p className="text-amber-600 mt-4">Processing bulk upload...</p>}
            {activeTab === "bulk" && <TagList bulkTags={bulkTags} />}
          </TabsContent>
        </Tabs>

        <Button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          variant="outline"
          className="mt-4"
        >
          <Settings className="w-4 h-4 mr-2" />
          {isSettingsOpen ? 'Close Settings' : 'Open Settings'}
        </Button>

        <SettingsPanel 
          isOpen={isSettingsOpen}
          prompt={prompt}
          onPromptChange={setPrompt}
          temperature={temperature}
          onTemperatureChange={setTemperature}
        />
      </div>
    </main>
  )
}