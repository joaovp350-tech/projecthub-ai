import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";

import PageHeader from "@/components/ui/PageHeader";
import AppCard from "@/components/ui/AppCard";
import ObraTabs from "@/components/obras/ObraTabs";


type Props = {
  params: Promise<{
    id: string;
  }>;
};



export default async function ObraDetalhesPage({
  params,
}: Props) {


  const { id } = await params;




  const { data: obra, error } =
    await supabase
      .from("obras")
      .select("*")
      .eq("id", id)
      .single();




  if (error || !obra) {

    console.error(error);

    notFound();

  }





  const { data: etapas } =
    await supabase
      .from("cronogramas")
      .select(
        "progresso, data_fim"
      )
      .eq(
        "obra_id",
        id
      );





  const progresso = etapas?.length
    ? Math.round(
        etapas.reduce(
          (total, etapa) =>
            total +
            Number(
              etapa.progresso ?? 0
            ),
          0
        ) /
        etapas.length
      )
    : 0;






  const hoje = new Date();



  const obraAtrasada =
    etapas?.some(
      (etapa) => {

        if (
          !etapa.data_fim ||
          progresso >= 100
        ) {
          return false;
        }


        return (
          new Date(
            `${etapa.data_fim}T00:00:00`
          ) < hoje
        );

      }
    );






  let statusAutomatico =
    "Planejamento";



  if (obraAtrasada) {

    statusAutomatico =
      "Atrasada";

  } else if (
    progresso >= 100
  ) {

    statusAutomatico =
      "Concluída";

  } else if (
    progresso > 0
  ) {

    statusAutomatico =
      "Em andamento";

  }





  const statusStyle =
    {

      Planejamento:
        "bg-slate-100 text-slate-700",

      "Em andamento":
        "bg-blue-100 text-blue-700",

      Concluída:
        "bg-green-100 text-green-700",

      Atrasada:
        "bg-red-100 text-red-700",

    }[
      statusAutomatico
    ];






  return (

    <div className="space-y-6">


      <PageHeader

        title={obra.nome}

        description="Detalhes da obra"

      />



      <ObraTabs
        id={id}
      />






      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">





        <AppCard>

          <h3 className="text-sm font-medium text-slate-500">
            Cliente
          </h3>


          <p className="mt-2 text-xl font-bold text-slate-800">

            {obra.cliente ||
              "Não informado"}

          </p>


        </AppCard>







        <AppCard>

          <h3 className="text-sm font-medium text-slate-500">
            Status
          </h3>


          <span
            className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold ${statusStyle}`}
          >

            {statusAutomatico}

          </span>


        </AppCard>








        <AppCard>

          <h3 className="text-sm font-medium text-slate-500">
            Valor
          </h3>



          <p className="mt-2 text-xl font-bold text-slate-800">

            {Number(
              obra.valor ?? 0
            ).toLocaleString(
              "pt-BR",
              {
                style:
                  "currency",
                currency:
                  "BRL",
              }
            )}

          </p>


        </AppCard>








        <AppCard>

          <h3 className="text-sm font-medium text-slate-500">
            Progresso
          </h3>




          <div className="mt-4">


            <div className="mb-2 flex justify-between">

              <span className="text-sm text-slate-500">
                Andamento
              </span>


              <strong className="text-blue-600">
                {progresso}%
              </strong>


            </div>





            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div

                className="h-full rounded-full bg-blue-600 transition-all"

                style={{
                  width:
                    `${progresso}%`,
                }}

              />


            </div>



          </div>



        </AppCard>



      </div>






      <AppCard className="p-8">


        <h2 className="text-2xl font-bold text-slate-800">
          Resumo da obra
        </h2>




        <div className="mt-6 grid gap-6 md:grid-cols-2">


          <div>

            <p className="text-sm text-slate-500">
              Endereço
            </p>

            <p className="mt-1">
              {obra.endereco ||
                "Não informado"}
            </p>

          </div>




          <div>

            <p className="text-sm text-slate-500">
              Responsável
            </p>

            <p className="mt-1">
              {obra.responsavel ||
                "Não informado"}
            </p>

          </div>




          <div>

            <p className="text-sm text-slate-500">
              Data de início
            </p>


            <p className="mt-1">

              {obra.data_inicio
                ? new Date(
                    `${obra.data_inicio}T00:00:00`
                  ).toLocaleDateString(
                    "pt-BR"
                  )
                : "Não informada"}

            </p>

          </div>





          <div>

            <p className="text-sm text-slate-500">
              Previsão de término
            </p>


            <p className="mt-1">

              {obra.data_fim
                ? new Date(
                    `${obra.data_fim}T00:00:00`
                  ).toLocaleDateString(
                    "pt-BR"
                  )
                : "Não informada"}

            </p>


          </div>


        </div>





        <div className="mt-6">

          <p className="text-sm text-slate-500">
            Observações
          </p>


          <p className="mt-1 whitespace-pre-wrap">
            {obra.observacoes ||
              "Nenhuma observação cadastrada."}
          </p>


        </div>



      </AppCard>



    </div>

  );

}