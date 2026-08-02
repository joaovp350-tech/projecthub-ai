"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  Building2,
  Users,
  UserRound,
  CircleDollarSign,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type DashboardStats = {
  obras: number;
  clientes: number;
  funcionarios: number;
  valorTotal: number;
};

const initialStats: DashboardStats = {
  obras: 0,
  clientes: 0,
  funcionarios: 0,
  valorTotal: 0,
};

export default function StatsCards() {
  const [stats, setStats] =
    useState<DashboardStats>(initialStats);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEstatisticas() {
      setCarregando(true);
      setErro("");

      const [
        obrasResponse,
        clientesResponse,
        funcionariosResponse,
        valoresResponse,
      ] = await Promise.all([
        supabase
          .from("obras")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("clientes")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("funcionarios")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("obras")
          .select("valor"),
      ]);

      const primeiroErro =
        obrasResponse.error ||
        clientesResponse.error ||
        funcionariosResponse.error ||
        valoresResponse.error;

      if (primeiroErro) {
        console.error(primeiroErro);

        setErro(
          `Não foi possível carregar os indicadores: ${primeiroErro.message}`
        );

        setCarregando(false);
        return;
      }

      const valorTotal = (valoresResponse.data ?? []).reduce(
        (total, obra) =>
          total + Number(obra.valor ?? 0),
        0
      );

      setStats({
        obras: obrasResponse.count ?? 0,
        clientes: clientesResponse.count ?? 0,
        funcionarios: funcionariosResponse.count ?? 0,
        valorTotal,
      });

      setCarregando(false);
    }

    carregarEstatisticas();
  }, []);

  const cards = [
    {
      titulo: "Obras cadastradas",
      valor: stats.obras,
      icone: Building2,
      prefixo: "",
      casasDecimais: 0,
    },
    {
      titulo: "Clientes",
      valor: stats.clientes,
      icone: Users,
      prefixo: "",
      casasDecimais: 0,
    },
    {
      titulo: "Funcionários",
      valor: stats.funcionarios,
      icone: UserRound,
      prefixo: "",
      casasDecimais: 0,
    },
    {
      titulo: "Valor total das obras",
      valor: stats.valorTotal,
      icone: CircleDollarSign,
      prefixo: "R$ ",
      casasDecimais: 2,
    },
  ];

  if (carregando) {
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
    <div className="mt-8">
      {erro && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
                  decimals={card.casasDecimais}
                  decimal=","
                  separator="."
                  prefix={card.prefixo}
                />
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}