import Link from "next/link";

import MateriaisTable from "@/components/materiais/MateriaisTable";
import PageHeader from "@/components/ui/PageHeader";

export default function MateriaisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Materiais"
        description="Gerencie o estoque, preços e fornecedores."
        action={
          <Link
            href="/materiais/nova"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Novo Material
          </Link>
        }
      />

      <MateriaisTable />
    </div>
  );
}