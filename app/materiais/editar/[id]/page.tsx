"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditarMaterialPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarMaterial();
  }, []);

  async function carregarMaterial() {
    const { data, error } = await supabase
      .from("materiais")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      nome: data.nome ?? "",
      categoria: data.categoria ?? "",
      unidade: data.unidade ?? "",
      preco: String(data.preco ?? ""),
      estoque: String(data.estoque ?? ""),
      estoqueMinimo: String(data.estoque_minimo ?? ""),
      fornecedor: data.fornecedor ?? "",
      observacoes: data.observacoes ?? "",
    });

    setCarregando(false);
  }

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();

    setSalvando(true);

    const { error } = await supabase
      .from("materiais")
      .update({
        nome: form.nome,
        categoria: form.categoria,
        unidade: form.unidade,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
        estoque_minimo: Number(form.estoqueMinimo),
        fornecedor: form.fornecedor,
        observacoes: form.observacoes,
      })
      .eq("id", id);

    setSalvando(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Material atualizado com sucesso!");
    router.push("/materiais");
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Editar Material
      </h1>

      <form
        onSubmit={salvar}
        className="space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full rounded border p-3"
        />

        <input
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          placeholder="Categoria"
          className="w-full rounded border p-3"
        />

        <input
          name="unidade"
          value={form.unidade}
          onChange={handleChange}
          placeholder="Unidade"
          className="w-full rounded border p-3"
        />

        <input
          name="preco"
          value={form.preco}
          onChange={handleChange}
          placeholder="Preço"
          className="w-full rounded border p-3"
        />

        <input
          name="estoque"
          value={form.estoque}
          onChange={handleChange}
          placeholder="Estoque"
          className="w-full rounded border p-3"
        />

        <input
          name="estoqueMinimo"
          value={form.estoqueMinimo}
          onChange={handleChange}
          placeholder="Estoque mínimo"
          className="w-full rounded border p-3"
        />

        <input
          name="fornecedor"
          value={form.fornecedor}
          onChange={handleChange}
          placeholder="Fornecedor"
          className="w-full rounded border p-3"
        />

        <textarea
          name="observacoes"
          value={form.observacoes}
          onChange={handleChange}
          placeholder="Observações"
          className="w-full rounded border p-3"
        />

        <button
          disabled={salvando}
          className="rounded bg-blue-600 px-6 py-3 text-white"
        >
          {salvando
            ? "Salvando..."
            : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}