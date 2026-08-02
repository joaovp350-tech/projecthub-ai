export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold">
          ProjectHub AI
        </h1>

        <nav className="flex gap-6">
          <button className="hover:text-blue-200 transition">
            Dashboard
          </button>

          <button className="hover:text-blue-200 transition">
            Obras
          </button>

          <button className="hover:text-blue-200 transition">
            Financeiro
          </button>

          <button className="hover:text-blue-200 transition">
            Configurações
          </button>
        </nav>
      </div>
    </header>
  );
}