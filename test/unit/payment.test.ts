import { Payment, PaymentSessionError, PaymentSession } from '../../src/'

describe('Payment', () => {
  it('should initialise with correct payment session data', () => {
    const A_SESSION_ID = 'A_SESSION_ID'
    const AN_AMOUNT = 42
    const A_CURRENCY = 'USDC'
    const AN_ADDRESS = '0x123'
    const A_HASH = 'hash'
    const valid_session: PaymentSession = {
      id: A_SESSION_ID,
      amount: AN_AMOUNT,
      currency: A_CURRENCY,
      address: AN_ADDRESS,
      status: PaymentSession.status.TOKEN_TRANSFER_COMPLETED,
      transactionHash: A_HASH,
    }

    const payment = new Payment(valid_session, {})

    expect(payment.sessionId).toEqual(A_SESSION_ID)
    expect(payment.amount).toEqual(AN_AMOUNT)
    expect(payment.currency).toEqual(A_CURRENCY)
    expect(payment.address).toEqual(AN_ADDRESS)
    expect(payment.transactionHash).toEqual(A_HASH)
    expect(payment.getPaymentPage()).toEqual(`https://test.payglide.io/wallet-pay?sessionId=${A_SESSION_ID}`)
  })

  it('should fail with error if invalid session provided', () => {
    const invalid_session = {
      id: undefined,
      amount: undefined,
      currency: undefined,
      address: undefined,
      status: undefined,
      transactionHash: undefined,
    }
    try {
      new Payment(invalid_session, {})
    } catch (e) {
      expect(e).toBeInstanceOf(PaymentSessionError)
    }
  })
})
