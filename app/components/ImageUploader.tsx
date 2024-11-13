'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  onUpload: (files: File[] | { [filename: string]: File }, previews: { [filename: string]: string }) => void
  isLoading: boolean
}

export default function ImageUploader({ onUpload, isLoading }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<{ [filename: string]: string }>({})

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newPreviews: { [filename: string]: string } = {}
    const fileMap: { [filename: string]: File } = {}

    for (const file of acceptedFiles) {
      const preview = URL.createObjectURL(file)
      newPreviews[file.name] = preview
      fileMap[file.name] = file
    }

    setPreviews(newPreviews)
    onUpload(acceptedFiles.length === 1 ? [acceptedFiles[0]] : fileMap, newPreviews)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-amber-500 bg-amber-50' : 'border-amber-300 hover:border-amber-500'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <Upload className="w-12 h-12 text-amber-500" />
        {isLoading ? (
          <p className="text-amber-900">Analyzing images...</p>
        ) : (
          <div>
            <p className="text-amber-900 font-medium">
              {isDragActive ? 'Drop the images here' : 'Drag & drop images here'}
            </p>
            <p className="text-amber-700 text-sm mt-1">or click to select files</p>
          </div>
        )}
      </div>
      {Object.keys(previews).length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(previews).map(([filename, src]) => (
            <div key={filename} className="relative aspect-square">
              <Image
                src={src}
                alt={`Preview of ${filename}`}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}