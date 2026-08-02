import Link from "next/link";

export default function Sidebar() {
  const menu = [
    { label: "🏠 Dashboard", href: "/" },
    { label: "🏗 Obras", href: "/obras" },
    { label: "👥 Clientes", href: "/clientes" },
    { label: "👷 Funcionários", href: "/funcionarios" },
    { label: "📦 Materiais", href: "/materiais" },
    { label: "💰 Financeiro", href: "#" },
    { label: "📄 Relatórios", href: "#" },
    { label: "⚙ Configurações", href: "#" },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold text-blue-400">
          ProjectHub AI
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Gestão inteligente de obras
        </p>
      </div>

      <nav className="flex-1 p-4">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="mb-2 block rounded-lg px-4 py-3 transition hover:bg-slate-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}