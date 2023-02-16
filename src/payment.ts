import { PaymentService, PaymentSession } from './generated'
import { asyncPoll } from './utils/session-poller'

export class PaymentSessionError extends Error {
  __proto__ = Error

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, PaymentSessionError.prototype)
  }
}

/**
 * Payment object provides convenience methods for interacting with a payment session.
 */
export class Payment {
  /**
   * Payment session ID
   */
  readonly sessionId: string
  /**
   * The amount of cryprocurrency required to run the transaction
   */
  readonly amount: number
  /**
   * The cryprocurrency used for the transaction
   */
  readonly currency: string
  /**
   * The wallet address used to execute the transaction
   */
  readonly address: string
  /**
   * Hash of the blockchain transaction the session was initialised with
   */
  readonly transactionHash: string

  /**
   * Milliseconds interval between calling the session service when using
   * the onTransactionComplete() method.
   * The call is repeated until the transaction is completed,
   * an error is returned, or the poll timeout is reached.
   *
   * Default 5 seconds.
   */
  private pollInterval: number

  /**
   * Max time in milliseconds to keep polling if no transaction completed
   * status is returned.
   * If the transaction completed status is not received before the timeout
   * then the onTransactionComplete method rejects with a timeout error.
   *
   * Default 300 seconds.
   */
  private pollTimeout: number

  constructor(
    session: PaymentSession,
    {
      pollInterval = 5 * 1000,
      pollTimeout = 300 * 1000,
    }: {
      pollInterval?: number
      pollTimeout?: number
    },
  ) {
    const errors: string[] = []
    if (!session.id) {
      errors.push(`Invalid Session ID: ${session.id}`)
    }
    if (!session.amount) {
      errors.push(`Invalid amount: ${session.amount}`)
    }
    if (!session.currency) {
      errors.push(`Invalid currency: ${session.currency}`)
    }
    if (!session.address) {
      errors.push(`Invalid address: ${session.address}`)
    }
    if (!session.transactionHash) {
      errors.push(`Invalid transactionHash: ${session.transactionHash}`)
    }
    if (errors.length) {
      throw new PaymentSessionError(`Found ${errors.length} errors in PaymentSession object:\n${errors.join('\n')}`)
    }
    this.sessionId = session.id!
    this.amount = session.amount!
    this.currency = session.currency!
    this.address = session.address!
    this.transactionHash = session.transactionHash!
    this.pollInterval = pollInterval
    this.pollTimeout = pollTimeout
  }

  /**
   * Function to retrieve payment session information periodically until
   * it resolves or rejects.
   *
   * It returns a promise that resolves with a PaymentSession object,
   * when the payment session status is transaction completed.
   *
   * The payment session API will be reinvoked in `pollInterval` until it times out.
   * It will throw an error if the polling interval is exceeded.
   */
  onTransactionComplete(): Promise<PaymentSession> {
    return asyncPoll({
      getPaymentSessionFn: PaymentService.getSessionById,
      sessionId: this.sessionId,
      expectedStatus: PaymentSession.status.TOKEN_TRANSFER_COMPLETED,
      failureStatus: [PaymentSession.status.PAYMENT_FAILED],
      pollInterval: this.pollInterval,
      pollTimeout: this.pollTimeout,
    })
  }
  /**
   * Returns the payment page url, that can be used in an iframe.
   */
  getPaymentPage(): string {
    return `https://test.payglide.io/wallet-pay?sessionId=${this.sessionId}`
  }

  /**
   * Returns the current payment session status
   */
  getCurrentStatus(): Promise<PaymentSession.status> {
    return new Promise<PaymentSession.status>(async (resolve, reject) => {
      const paymentSession = await PaymentService.getSessionById(this.sessionId)
      if (!paymentSession.status) {
        reject(new PaymentSessionError('Invalid payment session status returned from the server'))
      } else {
        resolve(paymentSession.status)
      }
    })
  }
}
