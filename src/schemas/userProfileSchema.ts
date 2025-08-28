import { z } from 'zod'
import { contactSchema, defaultContact } from './contactSchema'
import { addressSchema } from './addressSchema'

export const userProfileSchema = z.object({
  contact: contactSchema,
  addresses: z
    .array(addressSchema)
    .min(1, { message: 'At least one address is required' }),
  deliveryInstructions: z
    .string()
    .max(200, 'Instructions cannot exceed 200 characters')
    .optional(),
  newsletter: z.boolean(),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>

export const defaultUserProfileValues: UserProfileFormData = {
  contact: defaultContact,
  addresses: [],
  deliveryInstructions: '',
  newsletter: false,
}
