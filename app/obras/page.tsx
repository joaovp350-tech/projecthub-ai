import Link from "next/link";

import ObrasTable from "@/components/obras/ObrasTable";
import PageHeader from "@/components/ui/PageHeader";
import AppButton from "@/components/ui/AppButton";

export default function ObrasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Obras"
        description="Gerencie todas as obras cadastradas."
        action={
          <Link href="/obras/nova">
            <AppButton>
              + Nova Obra
            </AppButton>
          </Link>
        }
      />

      <ObrasTable />
    </div>
  );
}