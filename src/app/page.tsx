'use client'
import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import CustomThemeProvider from '../components/CustomThemeProvider'
import ReactQueryProvider from '../components/ReactQueryProvider'
import UserProfileForm from '../components/UserProfileForm'

export default function HomePage() {
  return (
    <ReactQueryProvider>
      <CustomThemeProvider>
        <main>
          <Container maxWidth='lg'>
            <Box
              sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant='h3' component='h1' gutterBottom>
                Form Demo
              </Typography>
              <Typography color='text.secondary' sx={{ mb: 4 }}>
                A complete user profile form with dynamic fields and validation.
              </Typography>

              <UserProfileForm />
            </Box>
          </Container>
        </main>
      </CustomThemeProvider>
    </ReactQueryProvider>
  )
}
