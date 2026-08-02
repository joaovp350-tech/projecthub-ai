export default function Sidebar() {
  const menu = [
    "🏠 Dashboard",
    "🏗 Obras",
    "👥 Clientes",
    "👷 Funcionários",
    "📦 Materiais",
    "💰 Financeiro",
    "📄 Relatórios",
    "⚙ Configurações",
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">
          ProjectHub AI
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Gestão inteligente de obras
        </p>
      </div>

      <nav className="flex-1 p-4">
        {menu.map((item) => (
          <button
            key={item}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition mb-2"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}