import React, { useState } from 'react'
import CustomSwitch from './custom-switch'

interface PasswordProtectedSwitchProps {
  isOn: boolean
  handleToggle: () => void
  onLabel: string
  offLabel: string
  password: string
}

const PasswordProtectedSwitch: React.FC<PasswordProtectedSwitchProps> = ({
  isOn,
  handleToggle,
  onLabel,
  offLabel,
  password
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')

  const handleSwitchToggle = () => {
    if (!isOn) {
      // Trying to turn on GPT - require password
      setShowPasswordModal(true)
      setError('')
      setInputPassword('')
    } else {
      // Turning off GPT - no password needed
      handleToggle()
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPassword === password) {
      setShowPasswordModal(false)
      setError('')
      setInputPassword('')
      handleToggle()
    } else {
      setError('Incorrect password')
    }
  }

  const handleCancel = () => {
    setShowPasswordModal(false)
    setError('')
    setInputPassword('')
  }

  return (
    <>
      <CustomSwitch
        isOn={isOn}
        handleToggle={handleSwitchToggle}
        onLabel={onLabel}
        offLabel={offLabel}
      />

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              Enter Password to Enable GPT
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-amber-700 mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter password"
                  autoFocus
                />
                {error && (
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Enable GPT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default PasswordProtectedSwitch 