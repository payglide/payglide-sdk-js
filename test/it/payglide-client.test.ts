import { PayGlideClient } from '../../src'

jest.unmock('nock')
import nock from 'nock'
nock.disableNetConnect()

const COMPLETED_PAYMENT_SESSION = {
  currency: 'USDC',
  status: 'TOKEN_TRANSFER_COMPLETED',
  amount: '13',
  address: '0x6f9ce307c114f443',
  id: '23999587-b312-4e1f-950e-5e95984fea44',
  transactionHash: 'cea6b2d18abce452e0b57a7393642a9358de23ebd5dffa1589563162d0ab44c4',
}

describe('Payglide Client', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should be able to create a client', () => {
    const client = new PayGlideClient({
      url: 'https://test.payglide.io/api',
      apiKey: '1234567890',
      token: 'token',
      username: 'username',
      password: 'password',
      pollInterval: 5000,
      pollTimeout: 10000,
    })
    expect(client).toBeDefined()
  })

  it('should be able to initialise a payment session', async () => {
    const INITIAL_PAYMENT_SESSION = {
      currency: 'USDC',
      status: 'PAYMENT_INITIATED',
      amount: '13',
      address: '0x6f9ce307c114f443',
      id: '23999587-b312-4e1f-950e-5e95984fea44',
      transactionHash: 'cea6b2d18abce452e0b57a7393642a9358de23ebd5dffa1589563162d0ab44c4',
    }
    nock('https://test.payglide.io/api').post('/init-payment').reply(201, INITIAL_PAYMENT_SESSION)

    const paymentSession = await new PayGlideClient().initPaymentSession({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '3',
          type: 'UFix64',
        },
      ],
    })

    expect(paymentSession).toEqual(INITIAL_PAYMENT_SESSION)
  })

  it('should be able to initialise a payment', async () => {
    nock('https://test.payglide.io/api').post('/init-payment').reply(201, COMPLETED_PAYMENT_SESSION)
    nock('https://test.payglide.io/api/payment-session')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, COMPLETED_PAYMENT_SESSION)

    const payment = await new PayGlideClient().initPayment({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '3',
          type: 'UFix64',
        },
      ],
    })

    expect(payment.getPaymentPage()).toEqual(
      'https://test.payglide.io/wallet-pay?sessionId=23999587-b312-4e1f-950e-5e95984fea44',
    )
    const response = await payment.onTransactionComplete()
    expect(response).toEqual(COMPLETED_PAYMENT_SESSION)
  })

  it('should be return current status', async () => {
    nock('https://test.payglide.io/api').post('/init-payment').reply(201, COMPLETED_PAYMENT_SESSION)
    nock('https://test.payglide.io/api/payment-session')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, COMPLETED_PAYMENT_SESSION)

    const payment = await new PayGlideClient().initPayment({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '3',
          type: 'UFix64',
        },
      ],
    })

    const currentStatus = await payment.getCurrentStatus()
    expect(currentStatus).toEqual('TOKEN_TRANSFER_COMPLETED')
  })

  it('should throw exception when invalid session status is returned from current session', async () => {
    const invalid_payment_session = {
      currency: 'USDC',
      status: undefined,
      amount: '13',
      address: '0x6f9ce307c114f443',
      id: '23999587-b312-4e1f-950e-5e95984fea44',
      transactionHash: 'cea6b2d18abce452e0b57a7393642a9358de23ebd5dffa1589563162d0ab44c4',
    }
    nock('https://test.payglide.io/api').post('/init-payment').reply(201, COMPLETED_PAYMENT_SESSION)
    nock('https://test.payglide.io/api/payment-session')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, invalid_payment_session)

    const payment = await new PayGlideClient().initPayment({
      address: '0x6f9ce307c114f443',
      code: 'test script',
      arguments: [
        {
          value: '3',
          type: 'UFix64',
        },
      ],
    })

    try {
      await payment.getCurrentStatus()
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it('should be able to return a session', async () => {
    nock('https://test.payglide.io/api/payment-session')
      .get('/23999587-b312-4e1f-950e-5e95984fea44')
      .reply(200, COMPLETED_PAYMENT_SESSION)

    const data = await PayGlideClient.getSessionById('23999587-b312-4e1f-950e-5e95984fea44')
    expect(data).toEqual(COMPLETED_PAYMENT_SESSION)
  })
})
