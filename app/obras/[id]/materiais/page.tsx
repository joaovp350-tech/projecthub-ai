import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import MateriaisObraTable from "@/components/obras/MateriaisObraTable";
import ObraTabs from "@/components/obras/ObraTabs";
import PageHeader from "@/components/ui/PageHeader";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MateriaisObraPage({
  params,
}: Props) {
  const { id } = await params;

  const { data: obra, error } = await supabase
    .from("obras")
    .select("id, nome")
    .eq("id", id)
    .single();

  if (error || !obra) {
    console.error(error);
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={obra.nome}
        description="Materiais utilizados nesta obra"
      />

      <ObraTabs id={id} />

      <MateriaisObraTable obraId={Number(id)} />
    </div>
  );
}