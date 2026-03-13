import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

const validPlans: Record<string, number> = {
  starter: 4900,
  pro: 14900,
  enterprise: 49900,
};

export async function POST(request: NextRequest) {
  try {
    const { planId, amount } = await request.json();

    if (!planId || !validPlans[planId] || validPlans[planId] !== amount) {
      return NextResponse.json(
        { error: "Plano inválido." },
        { status: 400 }
      );
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: validPlans[planId],
      currency: "brl",
      metadata: { planId },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erro ao criar PaymentIntent:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pagamento." },
      { status: 500 }
    );
  }
}
