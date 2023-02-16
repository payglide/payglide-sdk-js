import { PaymentSession, ApiError } from '../generated'

export interface AsyncFunction extends Function {
  (sessionId: string): PromiseLike<PaymentSession>
}

export class PollTimeoutError extends Error {
  __proto__ = Error

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, PollTimeoutError.prototype)
  }
}

export class SessionFailureStateError extends Error {
  __proto__ = Error

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, SessionFailureStateError.prototype)
  }
}

export async function asyncPoll({
  /**
   * Function to retrieve payment session information periodically until it resolves or rejects.
   *
   * The function will be reinvoked in `pollInterval` until it times out.
   *
   * Rejections will stop the polling and will be propagated.
   */
  getPaymentSessionFn,

  /**
   * Session ID if the payment session.
   */
  sessionId,

  /**
   * Expected status of the payment session that results in a successful poll.
   */
  expectedStatus,

  /**
   * Array of status codes that indicate a failure state.
   */
  failureStatus,

  /**
   * Milliseconds interval between attempting to resolve the promise again.
   */
  pollInterval,

  /**
   * Maximum time to continue polling to receive a successful resolved response.
   * If the promise doesn't resolve before the poll timeout then the poller
   * rejects with a timeout error.
   */
  pollTimeout,
}: {
  getPaymentSessionFn: AsyncFunction
  sessionId: string
  expectedStatus: string
  failureStatus: Array<string>
  pollInterval: number
  pollTimeout: number
}): Promise<PaymentSession> {
  const endTime = new Date().getTime() + pollTimeout
  const checkCondition = (resolve: (arg: PaymentSession) => void, reject: (arg: Error) => void): void => {
    Promise.resolve(getPaymentSessionFn(sessionId))
      .then(result => {
        const now = new Date().getTime()
        const status = result.status
        if (status === expectedStatus) {
          resolve(result)
        } else if (!status || failureStatus.includes(status)) {
          reject(new SessionFailureStateError(`Session failed with status: ${status}`))
        } else if (now < endTime) {
          setTimeout(checkCondition, pollInterval, resolve, reject)
        } else {
          reject(new PollTimeoutError('Poller reached timeout'))
        }
      })
      .catch(err => {
        if (err instanceof ApiError) {
          // if server is down, retry
          if (err.status >= 500) {
            const now = new Date().getTime()
            if (now < endTime) {
              setTimeout(checkCondition, pollInterval, resolve, reject)
            } else {
              reject(new PollTimeoutError('Poller reached timeout with server down'))
            }
          } else {
            reject(err)
          }
        } else {
          reject(err)
        }
      })
  }
  return new Promise(checkCondition)
}
