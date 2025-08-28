'use client'
import React from 'react'
import { Box, TextField } from '@mui/material'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { UserProfileFormData } from '../schemas/userProfileSchema'

interface ContactFieldsProps {
  register: UseFormRegister<UserProfileFormData>
  errors: FieldErrors<UserProfileFormData>
  loading: boolean
}

export default function ContactFields({
  register,
  errors,
  loading,
}: ContactFieldsProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          {...register('contact.firstName')}
          label='First Name'
          error={!!errors.contact?.firstName}
          helperText={errors.contact?.firstName?.message}
          fullWidth
          required
          disabled={loading}
        />
        <TextField
          {...register('contact.lastName')}
          label='Last Name'
          error={!!errors.contact?.lastName}
          helperText={errors.contact?.lastName?.message}
          fullWidth
          required
          disabled={loading}
        />
      </Box>
      <TextField
        {...register('contact.email')}
        label='Email Address'
        type='email'
        error={!!errors.contact?.email}
        helperText={errors.contact?.email?.message}
        fullWidth
        required
        disabled={loading}
      />
      <TextField
        {...register('contact.phone')}
        label='Phone Number'
        type='tel'
        error={!!errors.contact?.phone}
        helperText={errors.contact?.phone?.message}
        fullWidth
        required
        disabled={loading}
      />
    </>
  )
}
