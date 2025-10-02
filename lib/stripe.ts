import Stripe from 'stripe'

/**
 * Returns a Stripe client using the secret key from the environment.
 * Do NOT hardcode secret keys in the codebase.
 */
export function getStripeFromEnv(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.trim().length === 0) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }
  return new Stripe(secretKey, { apiVersion: '2023-10-16' })
}

/**
 * Builds per-request Stripe RequestOptions, supporting Stripe Connect.
 * Provide `STRIPE_CONNECT_ACCOUNT` in env to route requests on behalf of a connected account.
 */
export function buildStripeRequestOptions(): Stripe.RequestOptions {
  const stripeAccount = process.env.STRIPE_CONNECT_ACCOUNT
  const options: Stripe.RequestOptions = {}
  if (stripeAccount && stripeAccount.trim().length > 0) {
    options.stripeAccount = stripeAccount
  }
  return options
}
