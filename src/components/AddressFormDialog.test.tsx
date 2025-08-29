import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import AddressFormDialog from './AddressFormDialog'
import { defaultAddress } from '../schemas/addressSchema'

describe('AddressFormDialog', () => {
  const user = userEvent.setup()

  const mockInitialData = {
    ...defaultAddress,
    id: '123',
    streetAddress: '456 Oak Ave',
    city: 'Oakville',
    state: 'CA',
    zipCode: '90210',
  }

  it('renders the form with initial data and allows submission', async () => {
    const onSaveMock = vi.fn()
    render(
      <AddressFormDialog
        open={true}
        onClose={() => {}}
        onSave={onSaveMock}
        initialData={mockInitialData}
      />
    )

    const streetInput = screen.getByRole('textbox', { name: /street address/i })
    expect(streetInput).toHaveValue(mockInitialData.streetAddress)

    await user.clear(streetInput)
    await user.type(streetInput, '789 Pine St')

    await user.click(screen.getByRole('button', { name: /save address/i }))

    expect(onSaveMock).toHaveBeenCalledOnce()
    expect(onSaveMock).toHaveBeenCalledWith(
      expect.objectContaining({ streetAddress: '789 Pine St' })
    )
  })

  it('shows validation errors for empty required fields', async () => {
    const onSaveMock = vi.fn()
    render(
      <AddressFormDialog
        open={true}
        onClose={() => {}}
        onSave={onSaveMock}
        initialData={null} // Start with an empty form
      />
    )

    // The form is already empty, so just click save to trigger validation
    await user.click(screen.getByRole('button', { name: /save address/i }))

    // Wait for the inputs to be marked as invalid
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /street address/i })
      ).toHaveAttribute('aria-invalid', 'true')

      expect(screen.getByRole('textbox', { name: /city/i })).toHaveAttribute(
        'aria-invalid',
        'true'
      )

      expect(screen.getByRole('textbox', { name: /state/i })).toHaveAttribute(
        'aria-invalid',
        'true'
      )

      expect(
        screen.getByRole('textbox', { name: /zip code/i })
      ).toHaveAttribute('aria-invalid', 'true')
    })

    // Ensure the save function was not called due to validation errors
    expect(onSaveMock).not.toHaveBeenCalled()
  })

  it('displays different fields when the country is changed to Canada', async () => {
    render(
      <AddressFormDialog
        open={true}
        onClose={() => {}}
        onSave={() => {}}
        initialData={mockInitialData}
      />
    )

    expect(screen.getByRole('textbox', { name: /state/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: /province/i })
    ).not.toBeInTheDocument()

    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    await user.click(countrySelect)
    await user.click(screen.getByRole('option', { name: 'Canada' }))

    await waitFor(() => {
      expect(
        screen.queryByRole('textbox', { name: /state/i })
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: /province/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: /postal code/i })
      ).toBeInTheDocument()
    })
  })
})
