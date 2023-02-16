/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Argument } from './Argument';

export type InitPaymentRequest = {
    /**
     * The wallet address used to execute the transaction
     */
    address?: string;
    /**
     * The blockchain transaction code
     */
    code?: string;
    /**
     * The blockchain transaction arguments
     */
    arguments?: Array<Argument>;
};

