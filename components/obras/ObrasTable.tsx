"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Obra = {
  id: number;
  nome: string;
  cliente: string;
  status: string;
  valor: number | null;
};

export default function ObrasTable() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarObras() {
    setLoading(true);

    const { data, error } = await supabase
      .from("obras")
      .select("id, nome, cliente, status, valor")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setObras(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    carregarObras();
  }, []);

  async function excluirObra(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir esta obra?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("obras")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir a obra.");
      console.error(error);
      return;
    }

    await carregarObras();
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        Carregando obras...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Obra</th>
            <th className="p-4 text-left">Cliente</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Valor</th>
            <th className="p-4 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {obras.map((obra) => (
            <tr
              key={obra.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="p-4">{obra.nome}</td>

              <td className="p-4">{obra.cliente}</td>

              <td className="p-4">{obra.status}</td>

              <td className="p-4 text-right">
                {Number(obra.valor ?? 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <Link
                    href={`/obras/editar/${obra.id}`}
                    aria-label={`Editar ${obra.nome}`}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                  >
                    ✏️
                  </Link>

                  <button
                    type="button"
                    onClick={() => excluirObra(obra.id)}
                    aria-label={`Excluir ${obra.nome}`}
                    className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {obras.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-slate-500"
              >
                Nenhuma obra cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}