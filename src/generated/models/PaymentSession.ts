/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentSession = {
    /**
     * Payment session ID
     */
    id?: string;
    /**
     * The amount of cryprocurrency required to run the transaction
     */
    amount?: number;
    /**
     * The cryprocurrency used for the transaction
     */
    currency?: string;
    /**
     * The wallet address used to execute the transaction
     */
    address?: string;
    /**
     * Payment Status
     */
    status?: PaymentSession.status;
    /**
     * Hash of the blockchain transaction the session was initialised with
     */
    transactionHash?: string;
};

export namespace PaymentSession {

  /**
   * Payment Status
   */
  export enum status {
      PAYMENT_INITIATED = 'PAYMENT_INITIATED',
      PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
      PAYMENT_FAILED = 'PAYMENT_FAILED',
      TOKEN_TRANSFER_INITIATED = 'TOKEN_TRANSFER_INITIATED',
      TOKEN_TRANSFER_COMPLETED = 'TOKEN_TRANSFER_COMPLETED',
  }

}

