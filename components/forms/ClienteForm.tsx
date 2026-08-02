"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type ClienteFormData = {
  nome: string;
  documento: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
};

const initialForm: ClienteFormData = {
  nome: "",
  documento: "",
  telefone: "",
  email: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  observacoes: "",
};

export default function ClienteForm() {
  const router = useRouter();

  const [form, setForm] = useState<ClienteFormData>(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
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

    if (!form.nome.trim()) {
      setErro("Preencha o nome do cliente.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("clientes")
      .insert({
        nome: form.nome.trim(),
        documento: form.documento.trim() || null,
        telefone: form.telefone.trim() || null,
        email: form.email.trim() || null,
        endereco: form.endereco.trim() || null,
        cidade: form.cidade.trim() || null,
        estado: form.estado.trim() || null,
        cep: form.cep.trim() || null,
        observacoes: form.observacoes.trim() || null,
      });

    if (error) {
      console.error(error);
      setErro(
        `Não foi possível cadastrar o cliente: ${error.message}`
      );
      setSalvando(false);
      return;
    }

    alert("Cliente cadastrado com sucesso!");
    setForm(initialForm);
    router.push("/clientes");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        Cadastro de Cliente
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
            htmlFor="documento"
            className="mb-2 block text-sm font-medium"
          >
            CPF ou CNPJ
          </label>

          <input
            id="documento"
            name="documento"
            value={form.documento}
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
          onClick={() => router.push("/clientes")}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {salvando ? "Salvando..." : "Salvar Cliente"}
        </button>
      </div>
    </form>
  );
}