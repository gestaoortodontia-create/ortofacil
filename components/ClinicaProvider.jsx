'use client'

import { createContext, useContext } from 'react'

const ClinicaContext = createContext(null)

export function ClinicaProvider({ value, children }) {
  return <ClinicaContext.Provider value={value}>{children}</ClinicaContext.Provider>
}

export function useClinica() {
  const ctx = useContext(ClinicaContext)
  if (!ctx) throw new Error('useClinica deve ser usado dentro do painel')
  return ctx
}
