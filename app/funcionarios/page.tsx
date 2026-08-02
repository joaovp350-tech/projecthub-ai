import Link from "next/link";
import FuncionariosTable from "@/components/funcionarios/FuncionariosTable";

export default function FuncionariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Funcionários
        </h1>

        <Link
          href="/funcionarios/nova"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Novo Funcionário
        </Link>
      </div>

      <FuncionariosTable />
    </div>
  );
}