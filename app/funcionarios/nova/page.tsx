import FuncionarioForm from "@/components/forms/FuncionarioForm";

export default function NovoFuncionarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Novo Funcionário
        </h1>

        <p className="mt-2 text-slate-500">
          Cadastre um novo funcionário.
        </p>
      </div>

      <FuncionarioForm />
    </div>
  );
}