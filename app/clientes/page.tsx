import Link from "next/link";
import ClientesTable from "@/components/clientes/ClientesTable";

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Clientes
        </h1>

        <Link
          href="/clientes/nova"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Novo Cliente
        </Link>
      </div>

      <ClientesTable />
    </div>
  );
}