import { describe, it, expect } from 'vitest'
import { userProfileSchema } from '../schemas/userProfileSchema'

const validContact = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
}

const validAddress = {
  id: 'test-id',
  addressType: 'Home',
  country: 'USA',
  streetAddress: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345',
}

describe('userProfileSchema', () => {
  it('should validate a correct user profile object', () => {
    const validProfile = {
      contact: validContact,
      addresses: [validAddress],
      newsletter: false,
    }

    const result = userProfileSchema.safeParse(validProfile)

    if (!result.success) {
      console.error(result.error.issues)
    }
    expect(result.success).toBe(true)
  })

  it('should fail validation if the addresses array is empty', () => {
    const invalidProfile = {
      contact: validContact,
      addresses: [],
      newsletter: false,
    }

    const result = userProfileSchema.safeParse(invalidProfile)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'At least one address is required'
      )
    }
  })

  it('should fail validation if the contact information is invalid', () => {
    const invalidProfile = {
      contact: { ...validContact, email: 'not-an-email' },
      addresses: [validAddress],
      newsletter: false,
    }

    const result = userProfileSchema.safeParse(invalidProfile)
    expect(result.success).toBe(false)
  })
})
