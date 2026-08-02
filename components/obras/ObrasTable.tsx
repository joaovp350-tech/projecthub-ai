"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import Loading from "@/components/ui/Loading";
import SearchInput from "@/components/ui/SearchInput";

type Obra = {
  id: number;
  nome: string;
  cliente: string | null;
  status: string | null;
  valor: number | null;
};

export default function ObrasTable() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");
  const [obraParaExcluir, setObraParaExcluir] =
    useState<Obra | null>(null);

  async function carregarObras() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("obras")
      .select("id, nome, cliente, status, valor")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível carregar as obras: ${error.message}`
      );

      setCarregando(false);
      return;
    }

    setObras(data ?? []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarObras();
  }, []);

  function abrirConfirmacao(obra: Obra) {
    setObraParaExcluir(obra);
  }

  function fecharConfirmacao() {
    if (excluindo) return;

    setObraParaExcluir(null);
  }

  async function confirmarExclusao() {
    if (!obraParaExcluir) return;

    setExcluindo(true);
    setErro("");

    const { error } = await supabase
      .from("obras")
      .delete()
      .eq("id", obraParaExcluir.id);

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível excluir a obra: ${error.message}`
      );

      setExcluindo(false);
      setObraParaExcluir(null);
      return;
    }

    setObraParaExcluir(null);
    setExcluindo(false);

    await carregarObras();
  }

  const obrasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return obras;

    return obras.filter((obra) => {
      const campos = [
        obra.nome,
        obra.cliente,
        obra.status,
      ];

      return campos.some((campo) =>
        campo?.toLowerCase().includes(termo)
      );
    });
  }, [busca, obras]);

  const colunas = [
    {
      header: "Obra",
      accessor: (obra: Obra) => (
        <Link
          href={`/obras/${obra.id}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {obra.nome}
        </Link>
      ),
    },
    {
      header: "Cliente",
      accessor: (obra: Obra) =>
        obra.cliente || "—",
    },
    {
      header: "Status",
      accessor: (obra: Obra) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {obra.status || "Não informado"}
        </span>
      ),
    },
    {
      header: "Valor",
      className: "text-right",
      accessor: (obra: Obra) =>
        Number(obra.valor ?? 0).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      header: "Ações",
      className: "text-center",
      accessor: (obra: Obra) => (
        <div className="flex justify-center gap-2">
          <Link
            href={`/obras/${obra.id}`}
            aria-label={`Ver detalhes de ${obra.nome}`}
            className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
          >
            👁️
          </Link>

          <Link
            href={`/obras/editar/${obra.id}`}
            aria-label={`Editar ${obra.nome}`}
            className="rounded-lg bg-amber-500 px-3 py-2 text-white transition hover:bg-amber-600"
          >
            ✏️
          </Link>

          <button
            type="button"
            onClick={() => abrirConfirmacao(obra)}
            aria-label={`Excluir ${obra.nome}`}
            className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  if (carregando) {
    return <Loading text="Carregando obras..." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          id="busca"
          placeholder="Buscar por obra, cliente ou status..."
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
        data={obrasFiltradas}
        emptyMessage={
          busca
            ? "Nenhuma obra encontrada."
            : "Nenhuma obra cadastrada."
        }
      />

      <ConfirmDialog
        aberto={obraParaExcluir !== null}
        titulo="Excluir obra"
        descricao={
          obraParaExcluir
            ? `Deseja realmente excluir a obra “${obraParaExcluir.nome}”?`
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