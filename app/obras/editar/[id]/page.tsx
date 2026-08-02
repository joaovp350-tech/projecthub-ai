"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type FormData = {
  nome: string;
  cliente: string;
  endereco: string;
  responsavel: string;
  inicio: string;
  previsao: string;
  valor: string;
  status: string;
  observacoes: string;
};

const initialForm: FormData = {
  nome: "",
  cliente: "",
  endereco: "",
  responsavel: "",
  inicio: "",
  previsao: "",
  valor: "",
  status: "Planejamento",
  observacoes: "",
};

export default function EditarObraPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarObra() {
      setErro("");

      const { data, error } = await supabase
        .from("obras")
        .select(
          `
          nome,
          cliente,
          endereco,
          responsavel,
          data_inicio,
          data_fim,
          valor,
          status,
          observacoes
        `
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
        setErro(
          `Não foi possível carregar a obra: ${error.message}`
        );
        setCarregando(false);
        return;
      }

      setForm({
        nome: data.nome ?? "",
        cliente: data.cliente ?? "",
        endereco: data.endereco ?? "",
        responsavel: data.responsavel ?? "",
        inicio: data.data_inicio ?? "",
        previsao: data.data_fim ?? "",
        valor:
          data.valor !== null && data.valor !== undefined
            ? String(data.valor).replace(".", ",")
            : "",
        status: data.status ?? "Planejamento",
        observacoes: data.observacoes ?? "",
      });

      setCarregando(false);
    }

    carregarObra();
  }, [params.id]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErro("");

    if (!form.nome.trim() || !form.cliente.trim()) {
      setErro("Preencha o nome da obra e o cliente.");
      return;
    }

    setSalvando(true);

    const valorNumerico = form.valor
      ? Number(
          form.valor
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
        )
      : null;

    const { error } = await supabase
      .from("obras")
      .update({
        nome: form.nome.trim(),
        cliente: form.cliente.trim(),
        endereco: form.endereco.trim() || null,
        responsavel: form.responsavel.trim() || null,
        data_inicio: form.inicio || null,
        data_fim: form.previsao || null,
        valor: valorNumerico,
        status: form.status,
        observacoes: form.observacoes.trim() || null,
      })
      .eq("id", params.id);

    if (error) {
      console.error(error);
      setErro(
        `Não foi possível atualizar a obra: ${error.message}`
      );
      setSalvando(false);
      return;
    }

    alert("Obra atualizada com sucesso!");
    router.push("/obras");
    router.refresh();
  }

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        Carregando obra...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Editar Obra
        </h1>

        <p className="mt-2 text-slate-500">
          Altere as informações da obra.
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
              Nome da Obra *
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
              htmlFor="cliente"
              className="mb-2 block text-sm font-medium"
            >
              Cliente *
            </label>

            <input
              id="cliente"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
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
              htmlFor="responsavel"
              className="mb-2 block text-sm font-medium"
            >
              Responsável
            </label>

            <input
              id="responsavel"
              name="responsavel"
              value={form.responsavel}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="inicio"
              className="mb-2 block text-sm font-medium"
            >
              Data de início
            </label>

            <input
              id="inicio"
              type="date"
              name="inicio"
              value={form.inicio}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="previsao"
              className="mb-2 block text-sm font-medium"
            >
              Previsão de término
            </label>

            <input
              id="previsao"
              type="date"
              name="previsao"
              value={form.previsao}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="valor"
              className="mb-2 block text-sm font-medium"
            >
              Valor da obra
            </label>

            <input
              id="valor"
              name="valor"
              inputMode="decimal"
              value={form.valor}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            >
              <option value="Planejamento">Planejamento</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Pausada">Pausada</option>
            </select>
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
            onClick={() => router.push("/obras")}
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