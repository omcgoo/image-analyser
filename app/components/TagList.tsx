/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { Check, Copy, FileImage } from 'lucide-react'
import Image from 'next/image'

interface TagListProps {
  tags: { [filename: string]: string[] }
  previews: { [filename: string]: string }
}

export default function TagList({ tags, previews }: TagListProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  if (Object.keys(tags).length === 0) {
    return null
  }

  const copyToClipboard = (text: string, filename: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStates(prev => ({ ...prev, [filename]: true }))
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [filename]: false })), 2000)
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">Generated Tags</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-amber-100">
            <th className="border border-amber-300 px-4 py-2 text-left text-amber-900">Image</th>
            <th className="border border-amber-300 px-4 py-2 text-left text-amber-900">Filename</th>
            <th className="border border-amber-300 px-4 py-2 text-left text-amber-900">Tags</th>
            <th className="border border-amber-300 px-4 py-2 text-left text-amber-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tags).map(([filename, tagList]) => (
            <tr key={filename} className="hover:bg-amber-50">
              <td className="border border-amber-300 px-4 py-2">
                <div className="w-14 h-14 relative bg-amber-50 rounded-md flex items-center justify-center overflow-hidden">
                  {previews[filename] ? (
                    <Image 
                      src={previews[filename]}
                      alt={`Preview of ${filename}`}
                      fill
                      className="object-contain"
                      sizes="56px"
                    />
                  ) : (
                    <FileImage className="w-6 h-6 text-amber-400" />
                  )}
                </div>
              </td>
              <td className="border border-amber-300 px-4 py-2 text-amber-900 whitespace-nowrap text-sm">
                {filename.length > 30 ? filename.substring(0, 27) + '...' : filename}
              </td>
              <td className="border border-amber-300 px-4 py-2">
                <ul className="flex flex-wrap gap-1">
                  {tagList.map((tag, index) => (
                    <li 
                      key={index} 
                      className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-amber-300 px-4 py-2 whitespace-nowrap">
                <button
                  onClick={() => copyToClipboard(tagList.join(', '), filename)}
                  className="flex items-center justify-center w-full px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
                  aria-label={`Copy tags for ${filename} to clipboard`}
                >
                  {copiedStates[filename] ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      <span className="text-sm">Copy Tags</span>
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}