import { Checkout, CheckoutSessionError, CheckoutSession } from '../../src'

describe('Checkout', () => {
  it('should initialise with correct checkout session data', () => {
    const A_SESSION_ID = 'A_SESSION_ID'
    const AN_AMOUNT = '42'
    const A_CURRENCY = 'USDC'
    const AN_ADDRESS = '0x123'
    const valid_session: CheckoutSession = {
      id: A_SESSION_ID,
      products: [
        {
          pricing: {
            amount: AN_AMOUNT,
            currency: A_CURRENCY,
          },
        },
      ],
      buyer: { address: AN_ADDRESS },
      quote: {},
      status: CheckoutSession.status.TOKEN_TRANSFER_COMPLETED,
    }

    const checkout = new Checkout(valid_session, {})

    expect(checkout.sessionId).toEqual(A_SESSION_ID)
    expect(checkout.quote).not.toBeNull()
    expect(checkout.products[0].pricing?.amount).toEqual(AN_AMOUNT)
    expect(checkout.products[0].pricing?.currency).toEqual(A_CURRENCY)
    expect(checkout.buyer.address).toEqual(AN_ADDRESS)
    expect(checkout.getCheckoutPage('test')).toEqual(
      `https://test.buy.payglide.xyz/wallet/test?sessionId=${A_SESSION_ID}`,
    )
  })

  it('should fail with error if invalid session provided', () => {
    const invalid_session = {
      id: undefined,
      quote: undefined,
      buyer: undefined,
      product: undefined,
      status: undefined,
    }
    try {
      new Checkout(invalid_session, {})
    } catch (e) {
      expect(e).toBeInstanceOf(CheckoutSessionError)
    }
  })
})
