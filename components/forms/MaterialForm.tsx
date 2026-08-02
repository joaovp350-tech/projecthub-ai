"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type MaterialFormData = {
  nome: string;
  categoria: string;
  unidade: string;
  preco: string;
  estoque: string;
  estoqueMinimo: string;
  fornecedor: string;
  observacoes: string;
};

const initialForm: MaterialFormData = {
  nome: "",
  categoria: "",
  unidade: "",
  preco: "",
  estoque: "",
  estoqueMinimo: "",
  fornecedor: "",
  observacoes: "",
};

function converterNumero(valor: string) {
  if (!valor.trim()) return 0;

  return Number(
    valor
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );
}

export default function MaterialForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<MaterialFormData>(initialForm);

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
      setErro("Preencha o nome do material.");
      return;
    }

    if (!form.unidade.trim()) {
      setErro("Selecione a unidade do material.");
      return;
    }

    const precoNumerico = converterNumero(form.preco);
    const estoqueNumerico = converterNumero(form.estoque);
    const estoqueMinimoNumerico = converterNumero(
      form.estoqueMinimo
    );

    if (
      Number.isNaN(precoNumerico) ||
      Number.isNaN(estoqueNumerico) ||
      Number.isNaN(estoqueMinimoNumerico)
    ) {
      setErro("Confira os valores numéricos informados.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("materiais")
      .insert({
        nome: form.nome.trim(),
        categoria: form.categoria.trim() || null,
        unidade: form.unidade,
        preco: precoNumerico,
        estoque: estoqueNumerico,
        estoque_minimo: estoqueMinimoNumerico,
        fornecedor: form.fornecedor.trim() || null,
        observacoes: form.observacoes.trim() || null,
      });

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível cadastrar o material: ${error.message}`
      );

      setSalvando(false);
      return;
    }

    alert("Material cadastrado com sucesso!");

    setForm(initialForm);
    router.push("/materiais");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        Cadastro de Material
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
            Nome do material *
          </label>

          <input
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            placeholder="Exemplo: Cimento CP II"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="mb-2 block text-sm font-medium"
          >
            Categoria
          </label>

          <input
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Exemplo: Estrutura"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="unidade"
            className="mb-2 block text-sm font-medium"
          >
            Unidade *
          </label>

          <select
            id="unidade"
            name="unidade"
            value={form.unidade}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          >
            <option value="">Selecione</option>
            <option value="un">Unidade</option>
            <option value="saco">Saco</option>
            <option value="kg">Quilograma</option>
            <option value="m">Metro</option>
            <option value="m2">Metro quadrado</option>
            <option value="m3">Metro cúbico</option>
            <option value="litro">Litro</option>
            <option value="caixa">Caixa</option>
            <option value="pacote">Pacote</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="preco"
            className="mb-2 block text-sm font-medium"
          >
            Preço unitário
          </label>

          <input
            id="preco"
            name="preco"
            inputMode="decimal"
            value={form.preco}
            onChange={handleChange}
            placeholder="Exemplo: 42,90"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="estoque"
            className="mb-2 block text-sm font-medium"
          >
            Quantidade em estoque
          </label>

          <input
            id="estoque"
            name="estoque"
            inputMode="decimal"
            value={form.estoque}
            onChange={handleChange}
            placeholder="Exemplo: 100"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="estoqueMinimo"
            className="mb-2 block text-sm font-medium"
          >
            Estoque mínimo
          </label>

          <input
            id="estoqueMinimo"
            name="estoqueMinimo"
            inputMode="decimal"
            value={form.estoqueMinimo}
            onChange={handleChange}
            placeholder="Exemplo: 20"
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="fornecedor"
            className="mb-2 block text-sm font-medium"
          >
            Fornecedor
          </label>

          <input
            id="fornecedor"
            name="fornecedor"
            value={form.fornecedor}
            onChange={handleChange}
            placeholder="Nome do fornecedor"
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
          onClick={() => router.push("/materiais")}
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
            : "Salvar Material"}
        </button>
      </div>
    </form>
  );
}