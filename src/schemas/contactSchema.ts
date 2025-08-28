import { z } from 'zod'

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid phone number'),
})

export type Contact = z.infer<typeof contactSchema>

export const defaultContact: Contact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}
