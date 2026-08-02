import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";

import PageHeader from "@/components/ui/PageHeader";
import ObraTabs from "@/components/obras/ObraTabs";
import DocumentosObra from "@/components/obras/DocumentosObra";



type Props = {
  params: Promise<{
    id: string;
  }>;
};



export default async function DocumentosObraPage({
  params,
}: Props) {


  const { id } = await params;



  const { data: obra, error } =
    await supabase
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

        description="Documentos e arquivos da obra"

      />



      <ObraTabs
        id={id}
      />



      <DocumentosObra

        obraId={
          Number(id)
        }

      />


    </div>

  );

}