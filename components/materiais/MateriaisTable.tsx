"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type Material = {
  id: number;
  nome: string;
  categoria: string | null;
  unidade: string | null;
  preco: number | null;
  estoque: number | null;
  estoque_minimo: number | null;
  fornecedor: string | null;
};

export default function MateriaisTable() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarMateriais() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("materiais")
      .select(
        `
        id,
        nome,
        categoria,
        unidade,
        preco,
        estoque,
        estoque_minimo,
        fornecedor
        `
      )
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErro(
        `Não foi possível carregar os materiais: ${error.message}`
      );
      setCarregando(false);
      return;
    }

    setMateriais(data ?? []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarMateriais();
  }, []);

  async function excluirMaterial(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este material?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("materiais")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(`Erro ao excluir o material: ${error.message}`);
      return;
    }

    await carregarMateriais();
  }

  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return materiais;

    return materiais.filter((material) => {
      const campos = [
        material.nome,
        material.categoria,
        material.unidade,
        material.fornecedor,
      ];

      return campos.some((campo) =>
        campo?.toLowerCase().includes(termo)
      );
    });
  }, [busca, materiais]);

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Carregando materiais...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="busca" className="sr-only">
          Buscar materiais
        </label>

        <input
          id="busca"
          type="search"
          placeholder="Buscar por nome, categoria, unidade ou fornecedor..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Material</th>
              <th className="p-4 text-left">Categoria</th>
              <th className="p-4 text-left">Unidade</th>
              <th className="p-4 text-right">Preço</th>
              <th className="p-4 text-right">Estoque</th>
              <th className="p-4 text-left">Fornecedor</th>
              <th className="p-4 text-center">Situação</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {materiaisFiltrados.map((material) => {
              const estoque = Number(material.estoque ?? 0);
              const estoqueMinimo = Number(
                material.estoque_minimo ?? 0
              );

              const estoqueBaixo =
                estoque <= estoqueMinimo;

              return (
                <tr
                  key={material.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4 font-medium text-slate-800">
                    {material.nome}
                  </td>

                  <td className="p-4">
                    {material.categoria || "—"}
                  </td>

                  <td className="p-4">
                    {material.unidade || "—"}
                  </td>

                  <td className="p-4 text-right">
                    {Number(material.preco ?? 0).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {estoque.toLocaleString("pt-BR")}
                  </td>

                  <td className="p-4">
                    {material.fornecedor || "—"}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={
                        estoqueBaixo
                          ? "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                          : "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                      }
                    >
                      {estoqueBaixo
                        ? "Estoque baixo"
                        : "Estoque normal"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/materiais/editar/${material.id}`}
                        aria-label={`Editar ${material.nome}`}
                        className="rounded-lg bg-amber-500 px-3 py-2 text-white transition hover:bg-amber-600"
                      >
                        ✏️
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          excluirMaterial(material.id)
                        }
                        aria-label={`Excluir ${material.nome}`}
                        className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {materiaisFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-slate-500"
                >
                  {busca
                    ? "Nenhum material encontrado."
                    : "Nenhum material cadastrado."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}