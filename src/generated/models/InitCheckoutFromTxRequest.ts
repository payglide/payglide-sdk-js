/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Argument } from './Argument';

export type InitCheckoutFromTxRequest = {
    /**
     * The wallet address of the user who is executing the transaction
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

