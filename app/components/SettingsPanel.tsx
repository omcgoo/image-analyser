'use client'

import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Settings } from 'lucide-react'

interface SettingsPanelProps {
  prompt: string
  onPromptChange: (prompt: string) => void
  temperature: number
  onTemperatureChange: (temperature: number) => void
}

export default function SettingsPanel({
  prompt,
  onPromptChange,
  temperature,
  onTemperatureChange
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full text-left cursor-pointer text-amber-600 hover:text-amber-700 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-expanded={isOpen}
        aria-controls="settings-panel"
      >
        <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
        <span>{isOpen ? 'Close Settings' : 'Open Settings'}</span>
        {isOpen ? <ChevronUp className="ml-auto" aria-hidden="true" /> : <ChevronDown className="ml-auto" aria-hidden="true" />}
      </button>
      {isOpen && (
        <div id="settings-panel" className="mt-2 p-4 bg-amber-100 rounded-md">
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-amber-900 mb-2">
              Customize AI Prompt:
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={4}
              className="shadow-sm focus:ring-amber-500 focus:border-amber-500 mt-1 block w-full sm:text-sm border border-amber-300 rounded-md p-2 text-amber-900 bg-amber-50"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              aria-describedby="prompt-description"
            />
            <p id="prompt-description" className="mt-2 text-sm text-amber-700">
              Customize the instructions given to the AI for generating tags.
            </p>
          </div>
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-amber-900 mb-2">
              AI Temperature: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              id="temperature"
              name="temperature"
              min="0"
              max="1"
              step="0.1"
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              aria-describedby="temperature-description"
            />
            <p id="temperature-description" className="mt-2 text-sm text-amber-700">
              Adjust the creativity of the AI. Lower values produce more focused results, higher values more diverse results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}