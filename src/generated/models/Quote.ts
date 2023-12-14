/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Quote containg the fiat price and fees of the NFT purchase
 */
export type Quote = {
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

