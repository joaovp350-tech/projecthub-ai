"use client";

import { useState } from "react";

export default function ObraForm() {
  const [form, setForm] = useState({
    nome: "",
    cliente: "",
    endereco: "",
    responsavel: "",
    inicio: "",
    previsao: "",
    valor: "",
    status: "Planejamento",
    observacoes: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    alert("Obra cadastrada com sucesso!");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        Cadastro de Obra
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Nome da Obra
          </label>

          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Cliente
          </label>

          <input
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Endereço
          </label>

          <input
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Responsável
          </label>

          <input
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Data de início
          </label>

          <input
            type="date"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Previsão de término
          </label>

          <input
            type="date"
            name="previsao"
            value={form.previsao}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Valor da obra
          </label>

          <input
            name="valor"
            value={form.valor}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >
            <option>Planejamento</option>
            <option>Em andamento</option>
            <option>Finalizada</option>
            <option>Pausada</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Observações
        </label>

        <textarea
          name="observacoes"
          rows={5}
          value={form.observacoes}
          onChange={handleChange}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div className="flex justify-end">
        <button
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Salvar Obra
        </button>
      </div>
    </form>
  );
}