
'use server';

import { snap } from '@/lib/midtrans';

export interface CreateTransactionInput {
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
  };
}

/**
 * Server Action to create a Midtrans transaction token.
 */
export async function createPaymentTransaction(input: CreateTransactionInput) {
  const { user, plan } = input;

  // We embed the userId in the order_id so the webhook can parse it back
  const orderId = `AUDIT-${user.id}-${Date.now()}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: plan.price
    },
    credit_card: {
      secure: true
    },
    customer_details: {
      first_name: user.name,
      email: user.email
    },
    item_details: [{
      id: plan.id,
      price: plan.price,
      quantity: 1,
      name: `Akses Premium: ${plan.name}`
    }],
    // Optional: Add metadata for webhook processing
    metadata: {
      userId: user.id,
      planId: plan.id
    }
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId: orderId
    };
  } catch (error: any) {
    console.error("MIDTRANS_TRANSACTION_ERROR:", error);
    throw new Error("Gagal menginisialisasi gateway pembayaran.");
  }
}
