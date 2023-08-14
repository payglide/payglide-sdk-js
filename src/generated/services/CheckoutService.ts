/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CheckoutSession } from '../models/CheckoutSession';
import type { InitCheckoutFromTxRequest } from '../models/InitCheckoutFromTxRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CheckoutService {

    /**
     * Initialise a checkout with a blockchain transaction
     * Create a new checkout session based on the flow blockchain transaction data
     * @param requestBody Initialise a checkout with a flow blockchain transaction
     * @returns CheckoutSession Successful operation
     * @throws ApiError
     */
    public static initCheckout(
        requestBody: InitCheckoutFromTxRequest,
    ): CancelablePromise<CheckoutSession> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/checkout/init/tx',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                405: `Invalid input`,
            },
        });
    }

    /**
     * Find checkout session by ID
     * Returns the checkout session information
     * @param sessionId ID of session to return
     * @returns CheckoutSession successful operation
     * @throws ApiError
     */
    public static getCheckoutSessionById(
        sessionId: string,
    ): CancelablePromise<CheckoutSession> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/checkout/sessions/{sessionId}',
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
