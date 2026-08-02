import Link from "next/link";
import ObrasTable from "@/components/obras/ObrasTable";

export default function ObrasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Obras
        </h1>

        <Link
  href="/obras/nova"
  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
>
  + Nova Obra
</Link>
      </div>

      <ObrasTable />
    </div>
  );
}