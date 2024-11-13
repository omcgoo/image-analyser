import React, { createContext, useContext } from 'react'

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function Tabs({ value, onValueChange, children }: { value: string, onValueChange: (value: string) => void, children: React.ReactNode }) {
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex mb-4 border-b border-amber-200">{children}</div>
}

export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  return (
    <button
      className={`px-4 py-2 ${context.activeTab === value ? 'border-b-2 border-amber-500 text-amber-700' : 'text-amber-600 hover:text-amber-700'}`}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string, children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  if (context.activeTab !== value) return null
  return <div>{children}</div>
}