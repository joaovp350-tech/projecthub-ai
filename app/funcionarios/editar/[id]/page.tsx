"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type FuncionarioFormData = {
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  cargo: string;
  salario: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataAdmissao: string;
  observacoes: string;
};

const initialForm: FuncionarioFormData = {
  nome: "",
  cpf: "",
  rg: "",
  telefone: "",
  email: "",
  cargo: "",
  salario: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  dataAdmissao: "",
  observacoes: "",
};

export default function EditarFuncionarioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] =
    useState<FuncionarioFormData>(initialForm);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarFuncionario() {
      setErro("");
      setCarregando(true);

      const { data, error } = await supabase
        .from("funcionarios")
        .select(
          `
            nome,
            cpf,
            rg,
            telefone,
            email,
            cargo,
            salario,
            endereco,
            cidade,
            estado,
            cep,
            data_admissao,
            observacoes
          `
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);

        setErro(
          `Não foi possível carregar o funcionário: ${error.message}`
        );

        setCarregando(false);
        return;
      }

      setForm({
        nome: data.nome ?? "",
        cpf: data.cpf ?? "",
        rg: data.rg ?? "",
        telefone: data.telefone ?? "",
        email: data.email ?? "",
        cargo: data.cargo ?? "",
        salario:
          data.salario !== null &&
          data.salario !== undefined
            ? String(data.salario).replace(".", ",")
            : "",
        endereco: data.endereco ?? "",
        cidade: data.cidade ?? "",
        estado: data.estado ?? "",
        cep: data.cep ?? "",
        dataAdmissao: data.data_admissao ?? "",
        observacoes: data.observacoes ?? "",
      });

      setCarregando(false);
    }

    carregarFuncionario();
  }, [params.id]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((formAtual) => ({
      ...formAtual,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErro("");

    if (!form.nome.trim()) {
      setErro("Preencha o nome do funcionário.");
      return;
    }

    setSalvando(true);

    const salarioNumerico = form.salario
      ? Number(
          form.salario
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
        )
      : null;

    const { error } = await supabase
      .from("funcionarios")
      .update({
        nome: form.nome.trim(),
        cpf: form.cpf.trim() || null,
        rg: form.rg.trim() || null,
        telefone: form.telefone.trim() || null,
        email: form.email.trim() || null,
        cargo: form.cargo.trim() || null,
        salario: salarioNumerico,
        endereco: form.endereco.trim() || null,
        cidade: form.cidade.trim() || null,
        estado: form.estado.trim().toUpperCase() || null,
        cep: form.cep.trim() || null,
        data_admissao: form.dataAdmissao || null,
        observacoes: form.observacoes.trim() || null,
      })
      .eq("id", params.id);

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível atualizar o funcionário: ${error.message}`
      );

      setSalvando(false);
      return;
    }

    alert("Funcionário atualizado com sucesso!");

    router.push("/funcionarios");
    router.refresh();
  }

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        Carregando funcionário...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Editar Funcionário
        </h1>

        <p className="mt-2 text-slate-500">
          Altere os dados do funcionário.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="nome"
              className="mb-2 block text-sm font-medium"
            >
              Nome *
            </label>

            <input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cargo"
              className="mb-2 block text-sm font-medium"
            >
              Cargo
            </label>

            <input
              id="cargo"
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="mb-2 block text-sm font-medium"
            >
              CPF
            </label>

            <input
              id="cpf"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="rg"
              className="mb-2 block text-sm font-medium"
            >
              RG
            </label>

            <input
              id="rg"
              name="rg"
              value={form.rg}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="mb-2 block text-sm font-medium"
            >
              Telefone
            </label>

            <input
              id="telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="salario"
              className="mb-2 block text-sm font-medium"
            >
              Salário
            </label>

            <input
              id="salario"
              name="salario"
              inputMode="decimal"
              value={form.salario}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="dataAdmissao"
              className="mb-2 block text-sm font-medium"
            >
              Data de admissão
            </label>

            <input
              id="dataAdmissao"
              type="date"
              name="dataAdmissao"
              value={form.dataAdmissao}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="endereco"
              className="mb-2 block text-sm font-medium"
            >
              Endereço
            </label>

            <input
              id="endereco"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cidade"
              className="mb-2 block text-sm font-medium"
            >
              Cidade
            </label>

            <input
              id="cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="estado"
              className="mb-2 block text-sm font-medium"
            >
              Estado
            </label>

            <input
              id="estado"
              name="estado"
              maxLength={2}
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 uppercase outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cep"
              className="mb-2 block text-sm font-medium"
            >
              CEP
            </label>

            <input
              id="cep"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="observacoes"
            className="mb-2 block text-sm font-medium"
          >
            Observações
          </label>

          <textarea
            id="observacoes"
            name="observacoes"
            rows={5}
            value={form.observacoes}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/funcionarios")}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {salvando
              ? "Salvando..."
              : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}