/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Buyer } from './Buyer';
import type { Product } from './Product';
import type { Quote } from './Quote';

export type CheckoutSession = {
    /**
     * Expiry time of the checkout session
     */
    expiresAt?: string;
    /**
     * Time the checkout session was created
     */
    createdAt?: string;
    /**
     * Time the checkout session was updated
     */
    updatedAt?: string;
    /**
     * Checkout session ID
     */
    id?: string;
    /**
     * Product items
     */
    products?: Array<Product>;
    buyer?: Buyer;
    quote?: Quote;
    /**
     * Checkout Status
     */
    status?: CheckoutSession.status;
};

export namespace CheckoutSession {

    /**
     * Checkout Status
     */
    export enum status {
        CHECKOUT_INITIATED = 'CHECKOUT_INITIATED',
        PAYMENT_INITIATED = 'PAYMENT_INITIATED',
        PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
        PAYMENT_FAILED = 'PAYMENT_FAILED',
        TOKEN_TRANSFER_INITIATED = 'TOKEN_TRANSFER_INITIATED',
        TOKEN_TRANSFER_COMPLETED = 'TOKEN_TRANSFER_COMPLETED',
        TOKEN_TRANSFER_FAILED = 'TOKEN_TRANSFER_FAILED',
    }


}

