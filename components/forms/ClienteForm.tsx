"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
import AppInput from "@/components/ui/AppInput";

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
        estado: form.estado.trim().toUpperCase() || null,
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
    <AppCard className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <AppInput
            label="Nome *"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <AppInput
            label="CPF ou CNPJ"
            id="documento"
            name="documento"
            value={form.documento}
            onChange={handleChange}
          />

          <AppInput
            label="Telefone"
            id="telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <AppInput
            label="E-mail"
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <AppInput
              label="Endereço"
              id="endereco"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          <AppInput
            label="Cidade"
            id="cidade"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
          />

          <AppInput
            label="Estado"
            id="estado"
            name="estado"
            maxLength={2}
            placeholder="SP"
            value={form.estado}
            onChange={handleChange}
            className="uppercase"
          />

          <AppInput
            label="CEP"
            id="cep"
            name="cep"
            value={form.cep}
            onChange={handleChange}
          />
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
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <AppButton
            type="button"
            variant="secondary"
            onClick={() => router.push("/clientes")}
            disabled={salvando}
          >
            Cancelar
          </AppButton>

          <AppButton
            type="submit"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar Cliente"}
          </AppButton>
        </div>
      </form>
    </AppCard>
  );
}