'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../theme/theme'
import { ReactNode } from 'react'

interface CustomThemeProviderProps {
  children: ReactNode
}

export default function CustomThemeProvider({
  children,
}: CustomThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets browser default styles for consistency */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
