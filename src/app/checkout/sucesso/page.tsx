import Link from "next/link";

export default function CheckoutSucessoPage() {
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
            Pagamento realizado com sucesso!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Seu plano foi ativado. Obrigado pela sua compra.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </main>

      <footer className="bg-zinc-900 text-zinc-400 px-6 py-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm">
            &copy; 2026 n8n Automation. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
