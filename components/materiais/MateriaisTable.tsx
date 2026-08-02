"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import Loading from "@/components/ui/Loading";
import SearchInput from "@/components/ui/SearchInput";

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
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");
  const [materialParaExcluir, setMaterialParaExcluir] =
    useState<Material | null>(null);

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

  function abrirConfirmacao(material: Material) {
    setMaterialParaExcluir(material);
  }

  function fecharConfirmacao() {
    if (excluindo) return;

    setMaterialParaExcluir(null);
  }

  async function confirmarExclusao() {
    if (!materialParaExcluir) return;

    setExcluindo(true);
    setErro("");

    const { error } = await supabase
      .from("materiais")
      .delete()
      .eq("id", materialParaExcluir.id);

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível excluir o material: ${error.message}`
      );

      setExcluindo(false);
      setMaterialParaExcluir(null);
      return;
    }

    setMaterialParaExcluir(null);
    setExcluindo(false);

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

  const colunas = [
    {
      header: "Material",
      accessor: (material: Material) => (
        <span className="font-medium text-slate-800">
          {material.nome}
        </span>
      ),
    },
    {
      header: "Categoria",
      accessor: (material: Material) =>
        material.categoria || "—",
    },
    {
      header: "Unidade",
      accessor: (material: Material) =>
        material.unidade || "—",
    },
    {
      header: "Preço",
      className: "text-right",
      accessor: (material: Material) =>
        Number(material.preco ?? 0).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      header: "Estoque",
      className: "text-right",
      accessor: (material: Material) =>
        Number(material.estoque ?? 0).toLocaleString("pt-BR"),
    },
    {
      header: "Fornecedor",
      accessor: (material: Material) =>
        material.fornecedor || "—",
    },
    {
      header: "Situação",
      className: "text-center",
      accessor: (material: Material) => {
        const estoque = Number(material.estoque ?? 0);
        const estoqueMinimo = Number(
          material.estoque_minimo ?? 0
        );

        const estoqueBaixo = estoque <= estoqueMinimo;

        return (
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
        );
      },
    },
    {
      header: "Ações",
      className: "text-center",
      accessor: (material: Material) => (
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
            onClick={() => abrirConfirmacao(material)}
            aria-label={`Excluir ${material.nome}`}
            className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  if (carregando) {
    return <Loading text="Carregando materiais..." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          id="busca"
          placeholder="Buscar por nome, categoria, unidade ou fornecedor..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
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

      <DataTable
        columns={colunas}
        data={materiaisFiltrados}
        emptyMessage={
          busca
            ? "Nenhum material encontrado."
            : "Nenhum material cadastrado."
        }
      />

      <ConfirmDialog
        aberto={materialParaExcluir !== null}
        titulo="Excluir material"
        descricao={
          materialParaExcluir
            ? `Deseja realmente excluir o material “${materialParaExcluir.nome}”?`
            : ""
        }
        textoConfirmar="Excluir"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharConfirmacao}
      />
    </div>
  );
}