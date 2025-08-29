'use client'
import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import {
  useForm,
  Controller,
  SubmitHandler,
  useWatch,
  FieldPath,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Address,
  addressSchema,
  defaultAddress,
} from '../schemas/addressSchema'
import { ENUMS } from '../schemas/common'

// --- Configuration ---
interface AddressFieldConfig {
  name: FieldPath<Address>
  label: string
  required: boolean
}

type AddressFieldsConfig = {
  [key in Address['country']]: AddressFieldConfig[]
}

const addressFieldsConfig: AddressFieldsConfig = {
  USA: [
    { name: 'streetAddress', label: 'Street Address', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'state', label: 'State', required: true },
    { name: 'zipCode', label: 'ZIP Code', required: true },
  ],
  Canada: [
    { name: 'streetAddress', label: 'Street Address', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'province', label: 'Province', required: true },
    { name: 'postalCode', label: 'Postal Code', required: true },
  ],
  UK: [
    { name: 'streetAddress', label: 'Street Address', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'postcode', label: 'Postcode', required: true },
  ],
  Other: [
    { name: 'streetAddress', label: 'Street Address', required: true },
    { name: 'city', label: 'City', required: true },
    {
      name: 'state',
      label: 'State/Province/Region (Optional)',
      required: false,
    },
    { name: 'zipCode', label: 'ZIP/Postal Code (Optional)', required: false },
  ],
}
// --- End Configuration ---

interface AddressFormDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Address) => void
  initialData: Address | null
}

export default function AddressFormDialog({
  open,
  onClose,
  onSave,
  initialData,
}: AddressFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || defaultAddress,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (open) {
      reset(initialData || defaultAddress)
    }
  }, [open, initialData, reset])

  const selectedCountry = useWatch({ control, name: 'country' })

  const onSubmit: SubmitHandler<Address> = (data) => {
    onSave(data)
    onClose()
  }

  const handleCountryChange = (e: SelectChangeEvent) => {
    const newCountry = e.target.value as Address['country']
    setValue('country', newCountry)
    setValue('state', '')
    setValue('province', '')
    setValue('zipCode', '')
    setValue('postalCode', '')
    setValue('postcode', '')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Address' : 'Add New Address'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name='addressType'
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin='normal'
                error={!!errors.addressType}
              >
                <InputLabel id='address-type-label'>Address Type</InputLabel>
                <Select
                  {...field}
                  label='Address Type'
                  labelId='address-type-label'
                >
                  {ENUMS.addressTypes.map((type: string) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin='normal' error={!!errors.country}>
                <InputLabel id='country-label'>Country</InputLabel>
                <Select
                  {...field}
                  label='Country'
                  labelId='country-label'
                  onChange={handleCountryChange}
                >
                  {ENUMS.countries.map((country: string) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {selectedCountry &&
            addressFieldsConfig[selectedCountry]?.map((addressField) => (
              <Controller
                key={addressField.name}
                name={addressField.name}
                control={control}
                render={({ field: inputField }) => {
                  const fieldError = errors[addressField.name as keyof Address]

                  return (
                    <TextField
                      {...inputField}
                      value={inputField.value || ''}
                      margin='normal'
                      label={addressField.label}
                      required={addressField.required}
                      fullWidth
                      error={!!fieldError}
                      helperText={fieldError?.message}
                    />
                  )
                }}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' variant='contained'>
            Save Address
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
