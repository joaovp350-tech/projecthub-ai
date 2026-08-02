import Link from "next/link";
import MateriaisTable from "@/components/materiais/MateriaisTable";

export default function MateriaisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Materiais
        </h1>

        <Link
          href="/materiais/nova"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Novo Material
        </Link>
      </div>

      <MateriaisTable />
    </div>
  );
}