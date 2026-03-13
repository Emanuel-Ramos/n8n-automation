"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 4900,
    description: "Ideal para pequenos negócios",
    features: ["5 workflows", "1.000 execuções/mês", "Suporte por email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 14900,
    description: "Para equipes em crescimento",
    features: [
      "Workflows ilimitados",
      "50.000 execuções/mês",
      "Suporte prioritário",
      "Integrações avançadas",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49900,
    description: "Para grandes organizações",
    features: [
      "Tudo do Pro",
      "Execuções ilimitadas",
      "SLA dedicado",
      "Suporte 24/7",
      "Deploy on-premise",
    ],
  },
];

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Erro ao processar pagamento.");
      setProcessing(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/sucesso`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Erro ao confirmar pagamento.");
      setProcessing(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {processing ? "Processando..." : "Pagar"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
    null
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectPlan(plan: (typeof plans)[0]) {
    setSelectedPlan(plan);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, amount: plan.price }),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar sessão de pagamento.");
      }

      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="bg-zinc-900 text-white px-6 py-4 shadow-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              n8n Automation
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Pagamento realizado!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Seu plano {selectedPlan?.name} foi ativado com sucesso.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Voltar ao início
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-zinc-900 text-white px-6 py-4 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            n8n Automation
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Checkout
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Escolha seu plano e finalize o pagamento.
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-6 transition-all ${
                  selectedPlan?.id === plan.id
                    ? "border-indigo-500 ring-2 ring-indigo-500 bg-white dark:bg-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {plan.description}
                </p>
                <p className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {formatPrice(plan.price)}
                  <span className="text-sm font-normal text-zinc-500">
                    /mês
                  </span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <svg
                        className="h-4 w-4 text-indigo-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loading}
                  className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading && selectedPlan?.id === plan.id
                    ? "Carregando..."
                    : "Selecionar"}
                </button>
              </div>
            ))}
          </div>

          {clientSecret && selectedPlan && (
            <div className="mt-10 mx-auto max-w-md">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                  Pagamento — {selectedPlan.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  Total: {formatPrice(selectedPlan.price)}
                </p>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "stripe" },
                  }}
                >
                  <CheckoutForm onSuccess={() => setSuccess(true)} />
                </Elements>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-zinc-900 text-zinc-400 px-6 py-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm">
            &copy; 2026 n8n Automation. Todos os direitos reservados.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
