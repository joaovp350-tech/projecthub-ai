import MaterialForm from "@/components/forms/MaterialForm";

export default function NovoMaterialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Novo Material
        </h1>

        <p className="mt-2 text-slate-500">
          Cadastre um novo material no estoque.
        </p>
      </div>

      <MaterialForm />
    </div>
  );
}