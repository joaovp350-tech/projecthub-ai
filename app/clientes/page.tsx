import Link from "next/link";

import ClientesTable from "@/components/clientes/ClientesTable";
import PageHeader from "@/components/ui/PageHeader";
import AppButton from "@/components/ui/AppButton";

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie todos os clientes cadastrados."
        action={
          <Link href="/clientes/nova">
            <AppButton>
              + Novo Cliente
            </AppButton>
          </Link>
        }
      />

      <ClientesTable />
    </div>
  );
}