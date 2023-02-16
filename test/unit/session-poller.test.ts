import { asyncPoll } from '../../src/utils/session-poller'
import { ApiError, PollTimeoutError, SessionFailureStateError } from '../../src'

jest.spyOn(global, 'setTimeout')

const POLL_INTERVAL = 1
const POLL_TIMEOUT = 10
const A_SESSION_ID = 'a session ID'

const COMPLETED_SESSION = {
  currency: 'USDC',
  status: 'COMPLETED_STATUS',
  amount: '13',
  address: '0x1234',
  id: 'theSessionId',
  transactionHash: 'abc123def456',
}

const sessionWithStatus = (status: string | undefined | null) => {
  return {
    ...COMPLETED_SESSION,
    status,
  }
}

const mockGetSessionById = jest.fn()

export class MockApiError extends ApiError {
  constructor(status: number) {
    super(
      { method: 'GET', url: 'some url' },
      {
        url: 'some url',
        ok: false,
        status: status,
        statusText: '',
        body: '',
      },
      'mock api error',
    )
  }
}

describe('session poller (asyncPoll)', () => {
  it('should return session immediately when status is COMPLETED_STATUS the first time', async () => {
    mockGetSessionById.mockReturnValue(sessionWithStatus('COMPLETED_STATUS'))

    const result = await asyncPoll({
      getPaymentSessionFn: mockGetSessionById,
      sessionId: A_SESSION_ID,
      expectedStatus: 'COMPLETED_STATUS',
      failureStatus: [],
      pollInterval: 1000,
      pollTimeout: 2000,
    })

    expect(result).toStrictEqual(COMPLETED_SESSION)
    expect(setTimeout).toHaveBeenCalledTimes(0)
    expect(mockGetSessionById.mock.calls[0][0]).toBe(A_SESSION_ID)
  })

  it('should return session only when status is COMPLETED_STATUS', async () => {
    mockGetSessionById
      .mockReturnValueOnce(sessionWithStatus('SOMETHING_ELSE'))
      .mockReturnValueOnce(sessionWithStatus('STILL_NOT_COMPLETED'))
      .mockReturnValue(sessionWithStatus('COMPLETED_STATUS'))

    const result = await asyncPoll({
      getPaymentSessionFn: mockGetSessionById,
      sessionId: A_SESSION_ID,
      expectedStatus: 'COMPLETED_STATUS',
      failureStatus: [],
      pollInterval: POLL_INTERVAL,
      pollTimeout: 2000,
    })

    expect(mockGetSessionById.mock.calls[0][0]).toBe(A_SESSION_ID)
    expect(mockGetSessionById.mock.calls[1][0]).toBe(A_SESSION_ID)
    expect(mockGetSessionById.mock.calls[2][0]).toBe(A_SESSION_ID)
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      POLL_INTERVAL,
      expect.any(Function),
      expect.any(Function),
    )
    expect(result).toStrictEqual(COMPLETED_SESSION)
  })

  it('should timeout when no COMPLETED_STATUS status returned', async () => {
    mockGetSessionById.mockReturnValue(sessionWithStatus('SOMETHING_ELSE'))

    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: [],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(new PollTimeoutError('Poller reached timeout'))
    }
  })

  it('should fail with error when FAILURE_STATUS returned', async () => {
    mockGetSessionById.mockReturnValue(sessionWithStatus('FAILURE_STATUS'))
    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: ['FAILURE_STATUS'],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(new SessionFailureStateError('Session failed with status: FAILURE_STATUS'))
    }
  })

  it('should fail with error when status is undefined', async () => {
    mockGetSessionById.mockReturnValue(sessionWithStatus(undefined))
    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: ['FAILURE_STATUS'],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(new SessionFailureStateError('Session failed with status: undefined'))
    }
  })

  it('should fail with error when status is null', async () => {
    mockGetSessionById.mockReturnValue(sessionWithStatus(null))
    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: ['FAILURE_STATUS'],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(new SessionFailureStateError('Session failed with status: null'))
    }
  })

  it('should fail with an error when the getStatusById fails', async () => {
    const GET_SESSION_ERROR = new Error('Get session error')
    mockGetSessionById.mockRejectedValue(GET_SESSION_ERROR)
    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: ['FAILURE_STATUS'],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(GET_SESSION_ERROR)
    }
  })

  it('should fail with an error when server returns 4xx', async () => {
    const API_ERROR_400 = new MockApiError(400)
    mockGetSessionById.mockRejectedValue(API_ERROR_400)
    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: ['FAILURE_STATUS'],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(API_ERROR_400)
    }
  })

  it('should retry until timeout when server returns 5xx', async () => {
    const API_ERROR_500 = new MockApiError(500)
    mockGetSessionById.mockRejectedValue(API_ERROR_500)
    try {
      await asyncPoll({
        getPaymentSessionFn: mockGetSessionById,
        sessionId: A_SESSION_ID,
        expectedStatus: 'COMPLETED_STATUS',
        failureStatus: ['FAILURE_STATUS'],
        pollInterval: POLL_INTERVAL,
        pollTimeout: POLL_TIMEOUT,
      })
    } catch (e) {
      expect(e).toEqual(new PollTimeoutError('Poller reached timeout with server down'))
    }
  })
})
