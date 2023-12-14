import { Buyer, CheckoutService, CheckoutSession, Quote, Product } from './generated'
import { asyncPoll } from './utils/session-poller'

export class CheckoutSessionError extends Error {
  __proto__ = Error

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, CheckoutSessionError.prototype)
  }
}

/**
 * Checkout object provides convenience methods for interacting with a Checkout session.
 */
export class Checkout {
  /**
   * Checkout session ID
   */
  readonly sessionId: string
  /**
   * The product items being purchased
   */
  readonly products: Product[]
  /**
   * The buyer's information
   */
  readonly buyer: Buyer
  /**
   * The quote for the payment
   */
  readonly quote: Quote

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
    session: CheckoutSession,
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
    if (!session.products) {
      errors.push(`Invalid products: ${session.products}`)
    }
    if (!session.buyer) {
      errors.push(`Invalid buyer: ${session.buyer}`)
    }
    if (!session.quote) {
      errors.push(`Invalid quote: ${session.quote}`)
    }
    if (errors.length) {
      throw new CheckoutSessionError(`Found ${errors.length} errors in CheckoutSession object:\n${errors.join('\n')}`)
    }
    this.sessionId = session.id!
    this.products = session.products!
    this.buyer = session.buyer!
    this.quote = session.quote!
    this.pollInterval = pollInterval
    this.pollTimeout = pollTimeout
  }

  /**
   * Function to retrieve checkout session information periodically until
   * it resolves or rejects.
   *
   * It returns a promise that resolves with a CheckoutSession object,
   * when the checkout session status is transaction completed.
   *
   * The checkout session API will be reinvoked in `pollInterval` until it times out.
   * It will throw an error if the polling interval is exceeded.
   */
  onTransactionComplete(): Promise<CheckoutSession | CheckoutSession> {
    return asyncPoll({
      getSessionFn: CheckoutService.getCheckoutSessionById,
      sessionId: this.sessionId,
      expectedStatus: CheckoutSession.status.TOKEN_TRANSFER_COMPLETED,
      failureStatus: [CheckoutSession.status.PAYMENT_FAILED],
      pollInterval: this.pollInterval,
      pollTimeout: this.pollTimeout,
    })
  }
  /**
   * Returns the checkout page url, that can be used in an iframe.
   */
  getCheckoutPage(walletId: string): string {
    return `https://test.buy.payglide.xyz/wallet/${walletId}?sessionId=${this.sessionId}`
  }

  /**
   * Returns the current checkout session status
   */
  getCurrentStatus(): Promise<CheckoutSession.status> {
    return new Promise<CheckoutSession.status>(async (resolve, reject) => {
      const checkoutSession = await CheckoutService.getCheckoutSessionById(this.sessionId)
      if (!checkoutSession.status) {
        reject(new CheckoutSessionError('Invalid Checkout session status returned from the server'))
      } else {
        resolve(checkoutSession.status)
      }
    })
  }
}
