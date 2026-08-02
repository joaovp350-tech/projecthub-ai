"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type ObraFormData = {
  nome: string;
  cliente: string;
  endereco: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  valor: string;
  status: string;
  progresso: string;
  observacoes: string;
};

const initialForm: ObraFormData = {
  nome: "",
  cliente: "",
  endereco: "",
  responsavel: "",
  dataInicio: "",
  dataFim: "",
  valor: "",
  status: "Planejamento",
  progresso: "0",
  observacoes: "",
};

function converterValor(valor: string) {
  if (!valor.trim()) return null;

  const valorLimpo = valor
    .replace(/\s/g, "")
    .replace(/^R\$/i, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const numero = Number(valorLimpo);

  return Number.isNaN(numero) ? null : numero;
}

export default function ObraForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<ObraFormData>(initialForm);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
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
      setErro("Preencha o nome da obra.");
      return;
    }

    if (!form.cliente.trim()) {
      setErro("Preencha o nome do cliente.");
      return;
    }

    const valorNumerico = converterValor(form.valor);
    const progressoNumerico = Number(form.progresso);

    if (form.valor.trim() && valorNumerico === null) {
      setErro("Informe um valor válido para a obra.");
      return;
    }

    if (
      Number.isNaN(progressoNumerico) ||
      progressoNumerico < 0 ||
      progressoNumerico > 100
    ) {
      setErro(
        "O progresso deve ser um número entre 0 e 100."
      );
      return;
    }

    if (
      form.dataInicio &&
      form.dataFim &&
      form.dataFim < form.dataInicio
    ) {
      setErro(
        "A previsão de término não pode ser anterior à data de início."
      );
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("obras")
      .insert({
        nome: form.nome.trim(),
        cliente: form.cliente.trim(),
        endereco: form.endereco.trim() || null,
        responsavel: form.responsavel.trim() || null,
        data_inicio: form.dataInicio || null,
        data_fim: form.dataFim || null,
        valor: valorNumerico,
        status: form.status,
        progresso: progressoNumerico,
        observacoes: form.observacoes.trim() || null,
      });

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível salvar a obra: ${error.message}`
      );

      setSalvando(false);
      return;
    }

    alert("Obra cadastrada com sucesso!");

    setForm(initialForm);
    router.push("/obras");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        Cadastro de Obra
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
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nome da obra *
          </label>

          <input
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            placeholder="Exemplo: Residencial Oliveira"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="cliente"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Cliente *
          </label>

          <input
            id="cliente"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            required
            placeholder="Nome do cliente"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="endereco"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Endereço
          </label>

          <input
            id="endereco"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Endereço da obra"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="responsavel"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Responsável
          </label>

          <input
            id="responsavel"
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            placeholder="Responsável pela obra"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="dataInicio"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Data de início
          </label>

          <input
            id="dataInicio"
            type="date"
            name="dataInicio"
            value={form.dataInicio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="dataFim"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Previsão de término
          </label>

          <input
            id="dataFim"
            type="date"
            name="dataFim"
            value={form.dataFim}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="valor"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Valor da obra
          </label>

          <input
            id="valor"
            name="valor"
            inputMode="decimal"
            value={form.valor}
            onChange={handleChange}
            placeholder="Exemplo: 150000,00"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          >
            <option value="Planejamento">
              Planejamento
            </option>

            <option value="Em andamento">
              Em andamento
            </option>

            <option value="Pausada">
              Pausada
            </option>

            <option value="Concluída">
              Concluída
            </option>

            <option value="Cancelada">
              Cancelada
            </option>
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="progresso"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Progresso da obra
            </label>

            <span className="text-sm font-semibold text-blue-600">
              {form.progresso}%
            </span>
          </div>

          <input
            id="progresso"
            name="progresso"
            type="range"
            min={0}
            max={100}
            step={1}
            value={form.progresso}
            onChange={handleChange}
            className="w-full cursor-pointer accent-blue-600"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="observacoes"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Observações
        </label>

        <textarea
          id="observacoes"
          name="observacoes"
          rows={5}
          value={form.observacoes}
          onChange={handleChange}
          placeholder="Informações adicionais sobre a obra..."
          className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/obras")}
          disabled={salvando}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {salvando ? "Salvando..." : "Salvar Obra"}
        </button>
      </div>
    </form>
  );
}