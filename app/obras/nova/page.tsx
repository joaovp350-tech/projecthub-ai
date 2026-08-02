import Link from "next/link";
import ObraForm from "@/components/forms/ObraForm";

export default function NovaObraPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Nova Obra
        </h1>

        <p className="mt-2 text-slate-500">
          Cadastre uma nova obra no sistema.
        </p>
      </div>

      <ObraForm />
    </div>
  );
}