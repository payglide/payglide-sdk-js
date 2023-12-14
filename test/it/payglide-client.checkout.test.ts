import { CheckoutSession, PayGlideClient } from '../../src'

jest.unmock('nock')
import nock from 'nock'
nock.disableNetConnect()

const A_SESSION_ID = '23999587-b312-4e1f-950e-5e95984fea44'
const AN_AMOUNT = '5.0'
const A_CURRENCY = 'USDC'
const AN_ADDRESS = '0x6f9ce307c114f443'
const COMPLETED_CHECKOUT_SESSION: CheckoutSession = {
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

describe('Payglide Client', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should be able to initialise a checkout session', async () => {
    const INITIAL_CHECKOUT_SESSION = {
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
      status: CheckoutSession.status.CHECKOUT_INITIATED,
    }
    nock('https://test.payglide.io/api').post('/v1/checkout/init/tx').reply(201, INITIAL_CHECKOUT_SESSION)

    const checkoutSession = await new PayGlideClient().initCheckoutSession({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '5.0',
          type: 'UFix64',
        },
      ],
    })

    expect(checkoutSession).toEqual(INITIAL_CHECKOUT_SESSION)
  })

  it('should be able to initialise a checkout', async () => {
    nock('https://test.payglide.io/api').post('/v1/checkout/init/tx').reply(201, COMPLETED_CHECKOUT_SESSION)
    nock('https://test.payglide.io/api/v1/checkout/sessions')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, COMPLETED_CHECKOUT_SESSION)

    const checkout = await new PayGlideClient().initCheckout({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '5.0',
          type: 'UFix64',
        },
      ],
    })

    expect(checkout.getCheckoutPage('test')).toEqual(
      'https://test.buy.payglide.xyz/wallet/test?sessionId=23999587-b312-4e1f-950e-5e95984fea44',
    )
    const response = await checkout.onTransactionComplete()
    expect(response).toEqual(COMPLETED_CHECKOUT_SESSION)
  })

  it('should be return current status', async () => {
    nock('https://test.payglide.io/api').post('/v1/checkout/init/tx').reply(201, COMPLETED_CHECKOUT_SESSION)
    nock('https://test.payglide.io/api/v1/checkout/sessions')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, COMPLETED_CHECKOUT_SESSION)

    const checkout = await new PayGlideClient().initCheckout({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '5.0',
          type: 'UFix64',
        },
      ],
    })

    const currentStatus = await checkout.getCurrentStatus()
    expect(currentStatus).toEqual('TOKEN_TRANSFER_COMPLETED')
  })

  it('should throw exception when invalid session status is returned from current session', async () => {
    const invalid_checkout_session = {
      currency: 'USDC',
      status: undefined,
    }
    nock('https://test.payglide.io/api').post('/v1/checkout/init/tx').reply(201, COMPLETED_CHECKOUT_SESSION)
    nock('https://test.payglide.io/api/v1/checkout/sessions')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, invalid_checkout_session)

    const checkout = await new PayGlideClient().initCheckout({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '5.0',
          type: 'UFix64',
        },
      ],
    })

    try {
      await checkout.getCurrentStatus()
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it('should be able to return a session', async () => {
    nock('https://test.payglide.io/api/v1/checkout/sessions')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, COMPLETED_CHECKOUT_SESSION)

    const data = await PayGlideClient.getCheckoutSessionById('23999587-b312-4e1f-950e-5e95984fea44')
    expect(data).toEqual(COMPLETED_CHECKOUT_SESSION)
  })
})
