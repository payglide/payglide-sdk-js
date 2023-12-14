/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Product = {
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
};

