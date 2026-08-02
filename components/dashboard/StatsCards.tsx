"use client";

import CountUp from "react-countup";
import {
  Building2,
  Package,
  UserRound,
  Users,
} from "lucide-react";

import useDashboardStats from "@/hooks/useDashboardStats";

export default function StatsCards() {
  const { stats, loading } = useDashboardStats();

  const cards = [
    {
      titulo: "Obras cadastradas",
      valor: stats.obras,
      icone: Building2,
    },
    {
      titulo: "Clientes",
      valor: stats.clientes,
      icone: Users,
    },
    {
      titulo: "Funcionários",
      valor: stats.funcionarios,
      icone: UserRound,
    },
    {
      titulo: "Materiais",
      valor: stats.materiais,
      icone: Package,
    },
  ];

  if (loading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icone = card.icone;

        return (
          <div
            key={card.titulo}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-100 p-3">
                <Icone className="h-6 w-6 text-blue-600" />
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Dados reais
              </span>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">
              {card.titulo}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              <CountUp
                end={card.valor}
                duration={1.2}
                decimals={0}
                separator="."
              />
            </p>
          </div>
        );
      })}
    </section>
  );
}