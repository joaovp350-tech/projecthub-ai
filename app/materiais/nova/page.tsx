import MaterialForm from "@/components/forms/MaterialForm";
import PageHeader from "@/components/ui/PageHeader";

export default function NovoMaterialPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo Material"
        description="Cadastre um novo material no estoque."
      />

      <MaterialForm />
    </div>
  );
}