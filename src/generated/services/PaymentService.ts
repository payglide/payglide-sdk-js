/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitPaymentRequest } from '../models/InitPaymentRequest';
import type { PaymentSession } from '../models/PaymentSession';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaymentService {

    /**
     * Initialise a payment
     * Create a new payment session based on the transaction data
     * @param requestBody Initialise a payment
     * @returns PaymentSession Successful operation
     * @throws ApiError
     */
    public static initPayment(
        requestBody: InitPaymentRequest,
    ): CancelablePromise<PaymentSession> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/init-payment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                405: `Invalid input`,
            },
        });
    }

    /**
     * Find session by ID
     * Returns the session information
     * @param sessionId ID of session to return
     * @returns PaymentSession successful operation
     * @throws ApiError
     */
    public static getSessionById(
        sessionId: string,
    ): CancelablePromise<PaymentSession> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payment-session/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            errors: {
                400: `Invalid ID supplied`,
                404: `Session not found`,
            },
        });
    }

}
