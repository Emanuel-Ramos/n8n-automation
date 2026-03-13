import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Corpo */}
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Bem-vindo ao n8n Automation
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Plataforma de automação de workflows. Conecte seus aplicativos e
            automatize tarefas de forma simples e eficiente.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 px-6 py-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm">&copy; 2026 n8n Automation. Todos os direitos reservados.</p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
