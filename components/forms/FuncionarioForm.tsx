"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Obra = {
  id: number;
  nome: string;
};

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
  obraId: string;
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
  obraId: "",
  observacoes: "",
};

export default function FuncionarioForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<FuncionarioFormData>(initialForm);

  const [obras, setObras] = useState<Obra[]>([]);
  const [carregandoObras, setCarregandoObras] =
    useState(true);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarObras() {
      setCarregandoObras(true);

      const { data, error } = await supabase
        .from("obras")
        .select("id, nome")
        .order("nome", { ascending: true });

      if (error) {
        console.error(error);

        setErro(
          `Não foi possível carregar as obras: ${error.message}`
        );

        setCarregandoObras(false);
        return;
      }

      setObras(data ?? []);
      setCarregandoObras(false);
    }

    carregarObras();
  }, []);

  function handleChange(
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
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

    const salarioNumerico = form.salario
      ? Number(
          form.salario
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
        )
      : null;

    if (
      form.salario.trim() &&
      (salarioNumerico === null ||
        Number.isNaN(salarioNumerico))
    ) {
      setErro("Informe um salário válido.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("funcionarios")
      .insert({
        nome: form.nome.trim(),
        cpf: form.cpf.trim() || null,
        rg: form.rg.trim() || null,
        telefone: form.telefone.trim() || null,
        email: form.email.trim() || null,
        cargo: form.cargo.trim() || null,
        salario: salarioNumerico,
        endereco: form.endereco.trim() || null,
        cidade: form.cidade.trim() || null,
        estado:
          form.estado.trim().toUpperCase() || null,
        cep: form.cep.trim() || null,
        data_admissao: form.dataAdmissao || null,
        obra_id: form.obraId
          ? Number(form.obraId)
          : null,
        observacoes:
          form.observacoes.trim() || null,
      });

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível cadastrar o funcionário: ${error.message}`
      );

      setSalvando(false);
      return;
    }

    alert("Funcionário cadastrado com sucesso!");

    setForm(initialForm);
    router.push("/funcionarios");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        Cadastro de Funcionário
      </h2>

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
            placeholder="Exemplo: Pedreiro"
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
            placeholder="Exemplo: 2500,00"
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
            htmlFor="obraId"
            className="mb-2 block text-sm font-medium"
          >
            Obra vinculada
          </label>

          <select
            id="obraId"
            name="obraId"
            value={form.obraId}
            onChange={handleChange}
            disabled={carregandoObras}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {carregandoObras
                ? "Carregando obras..."
                : "Sem obra vinculada"}
            </option>

            {obras.map((obra) => (
              <option
                key={obra.id}
                value={obra.id}
              >
                {obra.nome}
              </option>
            ))}
          </select>
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
            placeholder="SP"
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
          onClick={() =>
            router.push("/funcionarios")
          }
          disabled={salvando}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={salvando || carregandoObras}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {salvando
            ? "Salvando..."
            : "Salvar Funcionário"}
        </button>
      </div>
    </form>
  );
}