import ClienteForm from "@/components/forms/ClienteForm";

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Novo Cliente
        </h1>

        <p className="mt-2 text-slate-500">
          Cadastre um novo cliente.
        </p>
      </div>

      <ClienteForm />
    </div>
  );
}