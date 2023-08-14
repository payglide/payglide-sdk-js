/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

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
    products?: Array<{
        /**
         * Pricing of the product item
         */
        pricing?: {
            /**
             * Amount to be paid
             */
            amount?: string;
            /**
             * Currency of payment
             */
            currency?: string;
        };
    }>;
    buyer?: {
        /**
         * The flow blockchain account address of the recipient
         */
        address?: string;
    };
    /**
     * Quote containg the fiat price and fees of the NFT purchase
     */
    quote?: {
        details?: Array<{
            /**
             * Description of the item
             */
            description?: string;
            /**
             * Amount to be paid associated with this quote item
             */
            amount?: string;
            /**
             * The payment currency associated with this quote item
             */
            currency?: string;
        }>;
        total?: {
            /**
             * Description for the quote total
             */
            description?: string;
            /**
             * Amount to be paid in total
             */
            amount?: string;
            /**
             * Currency of payment
             */
            currency?: string;
        };
        /**
         * Time the quote was created
         */
        createdAt?: string;
        /**
         * Time the quote was updated
         */
        updatedAt?: string;
        /**
         * Expiry time of the quote
         */
        expiresAt?: string;
    };
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

