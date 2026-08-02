"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  id: string;
};

const tabs = [
  {
    label: "🏠 Resumo",
    href: (id: string) => `/obras/${id}`,
  },
  {
    label: "👷 Equipe",
    href: (id: string) => `/obras/${id}/equipe`,
  },
  {
    label: "📦 Materiais",
    href: (id: string) => `/obras/${id}/materiais`,
  },
  {
    label: "💰 Financeiro",
    href: (id: string) => `/obras/${id}/financeiro`,
  },
  {
    label: "📅 Cronograma",
    href: (id: string) => `/obras/${id}/cronograma`,
  },
  {
    label: "📷 Fotos",
    href: (id: string) => `/obras/${id}/fotos`,
  },
  {
    label: "📄 Documentos",
    href: (id: string) => `/obras/${id}/documentos`,
  },
];

export default function ObraTabs({ id }: Props) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => {
          const href = tab.href(id);
          const ativo = pathname === href;

          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-xl px-5 py-3 font-medium transition ${
                ativo
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}