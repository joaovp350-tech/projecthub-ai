import ClienteForm from "@/components/forms/ClienteForm";
import PageHeader from "@/components/ui/PageHeader";

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo Cliente"
        description="Cadastre um novo cliente."
      />

      <ClienteForm />
    </div>
  );
}