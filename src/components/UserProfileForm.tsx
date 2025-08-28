'use client'
import React, { useReducer } from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Send, Add, Edit, Delete } from '@mui/icons-material'
import {
  userProfileSchema,
  UserProfileFormData,
  defaultUserProfileValues,
} from '../schemas/userProfileSchema'
import { Address } from '../schemas/addressSchema'
import AddressFormDialog from './AddressFormDialog'
import ContactFields from './ContactFields'

// --- State Management with Reducer ---
type State = {
  submitted: boolean
  loading: boolean
  isModalOpen: boolean
  editingAddress: Address | null
  addressError: string | null
}

type Action =
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_RESET' }
  | { type: 'OPEN_MODAL'; payload?: Address | null }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ADDRESS_ERROR'; payload: string | null }

const initialState: State = {
  submitted: false,
  loading: false,
  isModalOpen: false,
  editingAddress: null,
  addressError: null,
}

const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SUBMIT_START':
      return { ...state, loading: true }
    case 'SUBMIT_SUCCESS':
      return { ...state, loading: false, submitted: true }
    case 'SUBMIT_RESET':
      return { ...initialState }
    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        editingAddress: action.payload || null,
        addressError: null,
      }
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, editingAddress: null }
    case 'SET_ADDRESS_ERROR':
      return { ...state, addressError: action.payload }
    default:
      return state
  }
}
// --- End State Management ---

export default function UserProfileForm(): React.ReactElement {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: defaultUserProfileValues,
    mode: 'onChange',
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'addresses',
    keyName: 'key',
  })

  const handleOpenAdd = () => dispatch({ type: 'OPEN_MODAL' })
  const handleOpenEdit = (index: number) =>
    dispatch({ type: 'OPEN_MODAL', payload: fields[index] })
  const handleCloseModal = () => dispatch({ type: 'CLOSE_MODAL' })

  const handleSaveAddress = (data: Address) => {
    const isDuplicate = fields.some((field) => {
      if (data.id && data.id === field.id) return false
      return (
        field.streetAddress === data.streetAddress &&
        field.city === data.city &&
        field.country === data.country
      )
    })

    if (isDuplicate) {
      dispatch({
        type: 'SET_ADDRESS_ERROR',
        payload: 'This address already exists.',
      })
      return
    }

    const index = fields.findIndex((field) => field.id === data.id)
    if (index > -1) {
      update(index, data)
    } else {
      append({ ...data, id: crypto.randomUUID() })
    }
    handleCloseModal()
  }

  const onFinalSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    dispatch({ type: 'SUBMIT_START' })
    console.log('Final Profile Submitted:', data)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      dispatch({ type: 'SUBMIT_SUCCESS' })
      setTimeout(() => {
        reset(defaultUserProfileValues)
        dispatch({ type: 'SUBMIT_RESET' })
      }, 3000)
    } catch (error) {
      console.error('Error:', error)
      dispatch({ type: 'SUBMIT_RESET' }) // Reset state on error
    }
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Card sx={{ p: { xs: 2, sm: 4 }, boxShadow: 3 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          User Profile
        </Typography>
        {state.submitted && (
          <Alert severity='success' sx={{ mb: 3 }}>
            Profile saved successfully!
          </Alert>
        )}
        {errors.addresses && !errors.addresses.root && (
          <Alert severity='warning' sx={{ mb: 3 }}>
            {errors.addresses.message}
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit(onFinalSubmit)} noValidate>
          <Stack spacing={3}>
            <Typography variant='h6'>Personal Details</Typography>
            <ContactFields
              register={register}
              errors={errors}
              loading={state.loading}
            />

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6'>My Addresses</Typography>
              <Button
                variant='outlined'
                startIcon={<Add />}
                onClick={handleOpenAdd}
              >
                Add New
              </Button>
            </Box>

            {state.addressError && (
              <Alert
                severity='error'
                onClose={() =>
                  dispatch({ type: 'SET_ADDRESS_ERROR', payload: null })
                }
              >
                {state.addressError}
              </Alert>
            )}

            {fields.length === 0 && (
              <Card
                variant='outlined'
                sx={{ textAlign: 'center', py: 3, borderColor: 'divider' }}
              >
                <Typography color='text.secondary'>
                  No addresses added yet. You must add at least one.
                </Typography>
              </Card>
            )}

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Card key={field.key} variant='outlined'>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant='h6'
                        component='div'
                        sx={{ fontWeight: 500 }}
                      >
                        {field.addressType} Address
                      </Typography>
                      <Typography color='text.secondary'>
                        {field.streetAddress}, {field.city}, {field.country}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => handleOpenEdit(index)}
                        aria-label='edit address'
                      >
                        <Edit fontSize='small' />
                      </IconButton>
                      <IconButton
                        onClick={() => remove(index)}
                        aria-label='delete address'
                      >
                        <Delete fontSize='small' />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Card>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <TextField
              {...register('deliveryInstructions')}
              label='Delivery Instructions (Optional)'
              multiline
              rows={3}
              error={!!errors.deliveryInstructions}
              helperText={errors.deliveryInstructions?.message}
              fullWidth
              disabled={state.loading}
            />
            <FormControlLabel
              control={<Checkbox {...register('newsletter')} />}
              label='Subscribe to our newsletter'
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type='submit'
                variant='contained'
                size='large'
                startIcon={
                  state.loading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <Send />
                  )
                }
                disabled={state.loading || !isValid}
              >
                {state.loading ? 'Saving Profile...' : 'Save Profile'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Card>

      <AddressFormDialog
        open={state.isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        initialData={state.editingAddress}
      />
    </Container>
  )
}
