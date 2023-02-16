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

### **initPaymentSession**
> PaymentSession initPaymentSession(initPaymentRequest)

Create a new payment session based on the transaction data


```typescript
const paymentSession = await client.initPaymentSession({
  address: '0x6f9ce307c114f443',
  code: 'test script',
  arguments: [
    {
      value: '3',
      type: 'UFix64',
    },
  ],
})
```

The initPaymentSession method returns a `Promise` which resolves the paymentSession response.

```js
{
  currency: 'USDC',
  status: 'PAYMENT_INITIATED',
  amount: '13',
  address: '0x6f9ce307c114f443',
  id: '23999587-b312-4e1f-950e-5e95984fea44',
  transactionHash: 'cea6b2d18abce452e0b57a7393642a9358de23ebd5dffa1589563162d0ab44c4',
}
```

### **initPayment**
> Payment initPayment(initPaymentRequest)

The initPaynent method returns a `Promise` which resolves the Payment object.
Payment is a helper class for polling the payment session status and provides with other convenience methods.

```typescript
const payment = await client.initPayment({
  address: '0x6f9ce307c114f443',
  code: 'test script',
  arguments: [
    {
      value: '3',
      type: 'UFix64',
    },
  ],
})
```

### **Payment object with convinience methods**
> getPaymentPage()

Convenience method to get the url for the payment page where users can complete their payment.
```typescript
const paymentPageUrl = payment.getPaymentPage()
```


> getCurrentStatus()

Convenience method to retrieve the current payment status associated with the payment.
```typescript
const currentStatus = await payment.getCurrentStatus()
```
Posible payment status:

- PAYMENT_INITIATED
- PAYMENT_SUCCEEDED
- PAYMENT_FAILED
- TOKEN_TRANSFER_INITIATED
- TOKEN_TRANSFER_COMPLETED


> PaymentSession onTransactionComplete()

Convenience method to poll the payment status and resolve the promise when the payment is complete.
```typescript
const finalSession = await payment.onTransactionComplete()
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
