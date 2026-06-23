import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export const PLAN_PRICE_ID={
  'user_pro':'price_1TlLmXCi3GOPWqHxjMUTnTke' ,
  'user_premium':'price_1TlMjmCi3GOPWqHxpMj0Ipgf'
}