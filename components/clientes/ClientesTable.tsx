"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nome: string;
  documento: string | null;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  estado: string | null;
};

export default function ClientesTable() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarClientes() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("clientes")
      .select(
        "id, nome, documento, telefone, email, cidade, estado"
      )
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErro(
        `Não foi possível carregar os clientes: ${error.message}`
      );
      setCarregando(false);
      return;
    }

    setClientes(data ?? []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function excluirCliente(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(`Erro ao excluir o cliente: ${error.message}`);
      return;
    }

    await carregarClientes();
  }

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return clientes;

    return clientes.filter((cliente) => {
      const campos = [
        cliente.nome,
        cliente.documento,
        cliente.telefone,
        cliente.email,
        cliente.cidade,
        cliente.estado,
      ];

      return campos.some((campo) =>
        campo?.toLowerCase().includes(termo)
      );
    });
  }, [busca, clientes]);

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Carregando clientes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="busca" className="sr-only">
          Buscar clientes
        </label>

        <input
          id="busca"
          type="search"
          placeholder="Buscar por nome, documento, telefone ou e-mail..."
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
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">CPF/CNPJ</th>
              <th className="p-4 text-left">Telefone</th>
              <th className="p-4 text-left">E-mail</th>
              <th className="p-4 text-left">Cidade/UF</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr
                key={cliente.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4 font-medium text-slate-800">
                  {cliente.nome}
                </td>

                <td className="p-4">
                  {cliente.documento || "—"}
                </td>

                <td className="p-4">
                  {cliente.telefone || "—"}
                </td>

                <td className="p-4">
                  {cliente.email || "—"}
                </td>

                <td className="p-4">
                  {[cliente.cidade, cliente.estado]
                    .filter(Boolean)
                    .join(" - ") || "—"}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/clientes/editar/${cliente.id}`}
                      aria-label={`Editar ${cliente.nome}`}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-white transition hover:bg-amber-600"
                    >
                      ✏️
                    </Link>

                    <button
                      type="button"
                      onClick={() => excluirCliente(cliente.id)}
                      aria-label={`Excluir ${cliente.nome}`}
                      className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {clientesFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-slate-500"
                >
                  {busca
                    ? "Nenhum cliente encontrado."
                    : "Nenhum cliente cadastrado."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}