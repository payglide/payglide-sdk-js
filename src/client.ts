import {
  CheckoutService,
  CheckoutSession,
  InitCheckoutFromTxRequest,
  InitPaymentRequest,
  OpenAPI,
  PaymentService,
  PaymentSession,
} from './generated'
import { Payment } from './payment'
import { Checkout } from './checkout'

/**
 * A client for PayGlide's API
 *
 * This client provides convenience methods to make requests to the PayGlide API.
 *
 * @class PayGlideClient
 */
export class PayGlideClient {
  private pollInterval?: number
  private pollTimeout?: number

  /**
   * @param {Object} config Map of client configuration parameters.
   * @param {string} [config.apiKey] PayGlide API key.
   * @param {String} [config.url]
   * @param {String} [config.token]
   * @param {String} [config.username]
   * @param {String} [config.password]
   * @param {String} [config.pollInterval]
   * @param {String} [config.pollTimeout]
   *
   * @description
   * Creates a new PayGlideClient instance.
   */
  constructor(config?: {
    apiKey?: string
    url?: string
    token?: string
    username?: string
    password?: string
    pollInterval?: number
    pollTimeout?: number
  }) {
    if (config?.apiKey) {
      OpenAPI.HEADERS = {
        'x-api-key': config.apiKey,
      }
    }
    if (config?.url) {
      OpenAPI.BASE = config.url
    }
    if (config?.token) {
      OpenAPI.TOKEN = config.token
    }
    if (config?.username) {
      OpenAPI.USERNAME = config.username
    }
    if (config?.password) {
      OpenAPI.PASSWORD = config.password
    }
    if (config?.pollInterval) {
      this.pollInterval = config.pollInterval
    }
    if (config?.pollTimeout) {
      this.pollTimeout = config.pollTimeout
    }
  }

  /**
   * Initialise a payment
   * Create a new payment object based on the transaction data
   *
   * @param initPaymentRequest Data required to intialise a payment
   * @returns Payment - provides method to poll the payment status
   * @throws ApiError
   */
  public async initPayment(initPaymentRequest: InitPaymentRequest): Promise<Payment> {
    return new Payment(await PaymentService.initPayment(initPaymentRequest), {
      pollInterval: this.pollInterval,
      pollTimeout: this.pollTimeout,
    })
  }

  /**
   * Initialise a payment session
   * Create a new payment session based on the transaction data
   *
   * @param initPaymentRequest Data required to intialise a payment
   * @returns PaymentSession - payment session object
   * @throws ApiError
   */
  public async initPaymentSession(initPaymentRequest: InitPaymentRequest): Promise<PaymentSession> {
    return PaymentService.initPayment(initPaymentRequest)
  }

  /**
   * Returns the payment session information
   * @param sessionId - the ID of the payment session
   * @returns PaymentSession - payment session object
   */
  public static async getSessionById(sessionId: string): Promise<PaymentSession> {
    return PaymentService.getSessionById(sessionId)
  }

  /**
   * Initialise a checkout
   * Create a new checkout object based on the transaction data
   *
   * @param initCheckoutRequest Data required to intialise a checkout
   * @returns Checkout - provides method to poll the checkout status
   * @throws ApiError
   */
  public async initCheckout(initCheckoutRequest: InitCheckoutFromTxRequest): Promise<Checkout> {
    return new Checkout(await CheckoutService.initCheckout(initCheckoutRequest), {
      pollInterval: this.pollInterval,
      pollTimeout: this.pollTimeout,
    })
  }

  /**
   * Initialise a checkout session
   * Create a new checkout session based on the transaction data
   *
   * @param initCheckoutRequest Data required to intialise a checkout
   * @returns CheckoutSession - checkout session object
   * @throws ApiError
   */
  public async initCheckoutSession(initCheckoutRequest: InitCheckoutFromTxRequest): Promise<CheckoutSession> {
    return CheckoutService.initCheckout(initCheckoutRequest)
  }

  /**
   * Returns the checkout session information
   * @param sessionId - the ID of the checkout session
   * @returns CheckoutSession - checkout session object
   */
  public static async getCheckoutSessionById(sessionId: string): Promise<CheckoutSession> {
    return CheckoutService.getCheckoutSessionById(sessionId)
  }
}
