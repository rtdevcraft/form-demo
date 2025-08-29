import { describe, it, expect } from 'vitest'
import { addressSchema, defaultAddress } from './addressSchema'

describe('addressSchema', () => {
  it('should validate a correct USA address', () => {
    const validUsaAddress = {
      ...defaultAddress,
      streetAddress: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
    }
    const result = addressSchema.safeParse(validUsaAddress)
    expect(result.success).toBe(true)
  })

  it('should fail validation for a USA address with an invalid ZIP code', () => {
    const invalidUsaAddress = {
      ...defaultAddress,
      streetAddress: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '123',
    }
    const result = addressSchema.safeParse(invalidUsaAddress)
    expect(result.success).toBe(false)
  })

  it('should validate a correct Canadian address', () => {
    const validCanadaAddress = {
      ...defaultAddress,
      country: 'Canada',
      streetAddress: '456 Maple Ave',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5V 2J5',
    }
    const result = addressSchema.safeParse(validCanadaAddress)
    expect(result.success).toBe(true)
  })

  it('should fail if a required field is missing', () => {
    const incompleteAddress = {
      ...defaultAddress,
      streetAddress: '123 Main St',

      state: 'CA',
      zipCode: '12345',
    }
    const result = addressSchema.safeParse(incompleteAddress)
    expect(result.success).toBe(false)
  })
})
