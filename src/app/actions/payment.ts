
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
 * Translates the "Penebusan Dosa" (Redemption) logic into a secure payment session.
 */
export async function createPaymentTransaction(input: CreateTransactionInput) {
  const { user, plan } = input;

  // Order ID format: "AUDIT-{userId}-{timestamp}" for easy parsing in webhooks
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
      name: `Penebusan Dosa: Paket ${plan.name}`
    }],
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
    // Return a structured error message that implies user/system failure
    throw new Error("Gagal menginisialisasi protokol pembayaran. Sistem terganggu. Periksa Environment Variables atau koneksi dashboard.");
  }
}
