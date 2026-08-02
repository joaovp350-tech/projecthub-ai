"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type Funcionario = {
  id: number;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  cargo: string | null;
  salario: number | null;
  cidade: string | null;
  estado: string | null;
};

export default function FuncionariosTable() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarFuncionarios() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("funcionarios")
      .select(
        "id, nome, cpf, telefone, email, cargo, salario, cidade, estado"
      )
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErro(
        `Não foi possível carregar os funcionários: ${error.message}`
      );
      setCarregando(false);
      return;
    }

    setFuncionarios(data ?? []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function excluirFuncionario(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este funcionário?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("funcionarios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(`Erro ao excluir o funcionário: ${error.message}`);
      return;
    }

    await carregarFuncionarios();
  }

  const funcionariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return funcionarios;

    return funcionarios.filter((funcionario) => {
      const campos = [
        funcionario.nome,
        funcionario.cpf,
        funcionario.telefone,
        funcionario.email,
        funcionario.cargo,
        funcionario.cidade,
        funcionario.estado,
      ];

      return campos.some((campo) =>
        campo?.toLowerCase().includes(termo)
      );
    });
  }, [busca, funcionarios]);

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Carregando funcionários...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="busca" className="sr-only">
          Buscar funcionários
        </label>

        <input
          id="busca"
          type="search"
          placeholder="Buscar por nome, CPF, telefone, e-mail ou cargo..."
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
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">CPF</th>
              <th className="p-4 text-left">Cargo</th>
              <th className="p-4 text-left">Telefone</th>
              <th className="p-4 text-left">E-mail</th>
              <th className="p-4 text-left">Cidade/UF</th>
              <th className="p-4 text-right">Salário</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {funcionariosFiltrados.map((funcionario) => (
              <tr
                key={funcionario.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4 font-medium text-slate-800">
                  {funcionario.nome}
                </td>

                <td className="p-4">
                  {funcionario.cpf || "—"}
                </td>

                <td className="p-4">
                  {funcionario.cargo || "—"}
                </td>

                <td className="p-4">
                  {funcionario.telefone || "—"}
                </td>

                <td className="p-4">
                  {funcionario.email || "—"}
                </td>

                <td className="p-4">
                  {[funcionario.cidade, funcionario.estado]
                    .filter(Boolean)
                    .join(" - ") || "—"}
                </td>

                <td className="p-4 text-right">
                  {Number(funcionario.salario ?? 0).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/funcionarios/editar/${funcionario.id}`}
                      aria-label={`Editar ${funcionario.nome}`}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-white transition hover:bg-amber-600"
                    >
                      ✏️
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        excluirFuncionario(funcionario.id)
                      }
                      aria-label={`Excluir ${funcionario.nome}`}
                      className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {funcionariosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-slate-500"
                >
                  {busca
                    ? "Nenhum funcionário encontrado."
                    : "Nenhum funcionário cadastrado."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}