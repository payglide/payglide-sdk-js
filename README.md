<div align="center">
	<h1>PayGlide SDK for JavaScript</h1>
</div>

## Installation

Use your favorite package manager to install the sdk and save to your `package.json`:

```shell
$ npm install @payglide/sdk-js

# Or, you can use yarn
$ yarn add @payglide/sdk-js
```

## Usage

Import and initialize a client using an **api key**

```typescript
import { PayGlideClient } from '@payglide/sdk-js';

// Initializing a client
const client = new PayGlideClient({
  apiKey: process.env.PAYGLIDE_API_KEY,
})
```

### **initCheckoutSession**
> CheckoutSession initCheckoutSession(initCheckoutRequest)

Create a new checkout session based on the transaction data


```typescript
const checkoutSession = await client.initCheckoutSession({
  address: '0x6f9ce307c114f443',
  code: 'test script',
  arguments: [
    {
      value: '5.0',
      type: 'UFix64',
    },
  ],
})
```

The initCheckoutSession method returns a `Promise` which resolves the checkoutSession response.

```json
{
    "id": "1234abcd-1234-abcd-8c19-1234abcd56ef",
    "expiresAt": "2023-05-25T23:23:56.360Z",
    "createdAt": "2023-05-25T23:08:56.360Z",
    "updatedAt": "2023-05-25T23:08:56.360Z",
    "status": "CHECKOUT_INITIATED",
    "transactionHash": "",
    "buyer": {
        "address": "0x6f9ce307c114f443"
    },
    "products": [
        {
            "pricing": {
                "amount": "5.00000000",
                "currency": "USDC"
            }
        }
    ],
    "quote": {
        "details": [
            {
                "description": "1 x NFT",
                "amount": "5.00",
                "currency": "USD"
            },
            {
                "description": "Processing Fee",
                "amount": "0.49",
                "currency": "USD"
            },
            {
                "description": "Network Fee",
                "amount": "0",
                "currency": "USD"
            }
        ],
        "total": {
            "description": "Total Price",
            "amount": "5.49",
            "currency": "USD"
        },
        "expiresAt": "2023-05-25T23:18:56.360Z",
        "createdAt": "2023-05-25T23:08:56.360Z",
        "updatedAt": "2023-05-25T23:18:56.360Z"
    }
}
```

### **initCheckout**
> Checkout initCheckout(initCheckoutRequest)

The initCheckout method returns a `Promise` which resolves the Checkout object.
Checkout is a helper class for polling the checkout session status and provides with other convenience methods.

```typescript
const checkout = await client.initCheckout({
  address: '0x6f9ce307c114f443',
  code: 'test script',
  arguments: [
    {
      value: '5.0',
      type: 'UFix64',
    },
  ],
})
```

### **Checkout object with convenience methods**
> getCheckoutPage(walletId)

Convenience method to get the url for the wallet specific checkout page.
```typescript
const checkoutPageUrl = checkout.getCheckoutPage(walletId)
```


> getCurrentStatus()

Convenience method to retrieve the current checkout status associated with the checkout.
```typescript
const currentStatus = await checkout.getCurrentStatus()
```
Posible checkout status:
- CHECKOUT_INITIATED
- PAYMENT_INITIATED
- PAYMENT_SUCCEEDED
- PAYMENT_FAILED
- TOKEN_TRANSFER_INITIATED
- TOKEN_TRANSFER_COMPLETED
- TOKEN_TRANSFER_FAILED


> CheckoutSession onTransactionComplete()

Convenience method to poll the checkout status and resolve the promise when the checkout is complete.
```typescript
const finalSession = await checkout.onTransactionComplete()
```

### PayGlideClient options

The `PayGlideClient` supports the following options on initialization. These options are all keys in the constructor parameter.

| Option        | Default value            | Type         | Description                                                                                                                                                  |
| ------------- | ------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiKey`      | `undefined`              |   `string`   | API Key provided to individual projects.                                                      |
| `pollInterval`| `5000 (5 seconds)`       |   `number`   | Milliseconds interval between attempting to resolve the promise again.                                                 |
| `pollTimeout` | `300000 (5 minutes)`     |   `number`   | Maximum time in milliseconds to continue polling to receive a successful resolved response. If the promise doesn't resolve before the poll timeout then the poller rejects with a timeout error.                                                 |


## Requirements

This package supports the following minimum versions:

- Runtime: `node >= 14`


## LICENSE

[Apache-2.0](LICENSE)
