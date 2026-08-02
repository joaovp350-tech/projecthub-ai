import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";

import PageHeader from "@/components/ui/PageHeader";
import ObraTabs from "@/components/obras/ObraTabs";
import FotosObra from "@/components/obras/FotosObra";



type Props = {
  params: Promise<{
    id: string;
  }>;
};



export default async function FotosObraPage({
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

        description="Fotos e evolução da obra"

      />



      <ObraTabs
        id={id}
      />



      <FotosObra

        obraId={
          Number(id)
        }

      />


    </div>

  );

}