import { z } from 'zod'
import { ENUMS } from './common'

const baseAddressSchema = z.object({
  id: z.string().optional(),
  addressType: z.enum(ENUMS.addressTypes),
  streetAddress: z.string().min(5, 'Street address is too short'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
})

export const addressSchema = z.discriminatedUnion('country', [
  // USA
  baseAddressSchema.extend({
    country: z.literal('USA'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid ZIP code'),
  }),
  // Canada
  baseAddressSchema.extend({
    country: z.literal('Canada'),
    province: z.string().min(2, 'Province is required'),
    postalCode: z
      .string()
      .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid postal code'),
  }),
  // UK
  baseAddressSchema.extend({
    country: z.literal('UK'),
    postcode: z
      .string()
      .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid postcode'),
  }),
  // Other
  baseAddressSchema.extend({
    country: z.literal('Other'),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
])

export type Address = z.infer<typeof addressSchema>

export const defaultAddress: Address = {
  addressType: 'Home',
  country: 'USA',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
}
