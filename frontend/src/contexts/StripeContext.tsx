import React, { createContext, useContext } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S23EsEiAibFBvoAcRhsYQj1fNiqfWKTJqrMgHlf76AjyFOyM81AU3DSqgboUKpIdClQmcMIEhUMOtOeYiz4eX4v00JEPCpKeA')

const StripeContext = createContext<{ stripe: any }>({ stripe: null })

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    stripe: stripePromise
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={value}>
        {children}
      </StripeContext.Provider>
    </Elements>
  )
}