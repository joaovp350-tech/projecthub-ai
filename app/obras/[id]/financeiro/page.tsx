import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";

import PageHeader from "@/components/ui/PageHeader";
import AppCard from "@/components/ui/AppCard";

import DespesaForm from "@/components/obras/DespesaForm";
import ExcluirDespesa from "@/components/obras/ExcluirDespesa";
import FinanceiroGrafico from "@/components/obras/FinanceiroGrafico";
import EvolucaoFinanceiraGrafico from "@/components/obras/EvolucaoFinanceiraGrafico";
import ObraTabs from "@/components/obras/ObraTabs";


type Props = {
  params: Promise<{
    id: string;
  }>;
};



export default async function FinanceiroObraPage({
  params,
}: Props) {


  const { id } = await params;



  const { data: obra, error: obraError } =
    await supabase
      .from("obras")
      .select("*")
      .eq("id", id)
      .single();



  if (obraError || !obra) {

    notFound();

  }





  const { data: despesas } =
    await supabase
      .from("despesas_obras")
      .select("*")
      .eq(
        "obra_id",
        id
      )
      .order(
        "id",
        {
          ascending:false,
        }
      );




  const listaDespesas =
    despesas ?? [];




  const totalDespesas =
    listaDespesas.reduce(
      (
        total,
        despesa
      ) =>
        total +
        Number(
          despesa.valor ?? 0
        ),
      0
    );







  const { data: equipe } =
    await supabase
      .from("equipe_obras")
      .select(
        "funcionario_id"
      )
      .eq(
        "obra_id",
        id
      );





  const idsFuncionarios =
    (equipe ?? [])
    .map(
      item =>
        item.funcionario_id
    );





  let totalEquipe = 0;





  if(idsFuncionarios.length > 0){


    const { data: funcionarios } =
      await supabase
        .from("funcionarios")
        .select(
          "salario"
        )
        .in(
          "id",
          idsFuncionarios
        );




    totalEquipe =
      (funcionarios ?? [])
      .reduce(
        (
          total,
          funcionario
        ) =>
          total +
          Number(
            funcionario.salario ?? 0
          ),
        0
      );


  }






  const valorObra =
    Number(
      obra.valor ?? 0
    );



  const custos =
    totalDespesas +
    totalEquipe;



  const lucro =
    valorObra -
    custos;







  function formatarData(
    valor:string
  ){

    if(!valor)
      return "-";


    const partes =
      valor.split("-");


    if(partes.length !== 3)
      return "-";


    const ano =
      Number(partes[0]);


    const mes =
      Number(partes[1]);


    const dia =
      Number(partes[2]);



    if(
      ano < 2000 ||
      ano > 2100
    ){

      return "-";

    }



    return new Date(
      ano,
      mes - 1,
      dia
    )
    .toLocaleDateString(
      "pt-BR"
    );

  }








  return (

    <div className="space-y-6">



      <PageHeader

        title={obra.nome}

        description="Controle financeiro da obra"

      />



      <ObraTabs
        id={id}
      />





      <div className="grid gap-6 md:grid-cols-4">



        <AppCard>

          <p className="text-sm text-slate-500">
            Valor da obra
          </p>

          <h2 className="mt-2 text-2xl font-bold">

          {valorObra.toLocaleString(
            "pt-BR",
            {
              style:"currency",
              currency:"BRL"
            }
          )}

          </h2>

        </AppCard>






        <AppCard>

          <p className="text-sm text-slate-500">
            Materiais / despesas
          </p>


          <h2 className="mt-2 text-2xl font-bold text-red-600">

          {totalDespesas.toLocaleString(
            "pt-BR",
            {
              style:"currency",
              currency:"BRL"
            }
          )}

          </h2>


        </AppCard>







        <AppCard>

          <p className="text-sm text-slate-500">
            Mão de obra
          </p>


          <h2 className="mt-2 text-2xl font-bold text-orange-600">

          {totalEquipe.toLocaleString(
            "pt-BR",
            {
              style:"currency",
              currency:"BRL"
            }
          )}

          </h2>


        </AppCard>








        <AppCard>

          <p className="text-sm text-slate-500">
            Lucro estimado
          </p>


          <h2
          className={`mt-2 text-2xl font-bold ${
            lucro >= 0
            ?
            "text-green-600"
            :
            "text-red-600"
          }`}
          >

          {lucro.toLocaleString(
            "pt-BR",
            {
              style:"currency",
              currency:"BRL"
            }
          )}

          </h2>


        </AppCard>



      </div>






      <DespesaForm
        obraId={
          Number(id)
        }
      />








      <div className="grid gap-6 xl:grid-cols-2">


        <FinanceiroGrafico

        despesas={
          listaDespesas.map(
            despesa=>({

              tipo:
              despesa.tipo,

              valor:
              despesa.valor

            })
          )
        }

        />




        <EvolucaoFinanceiraGrafico

        despesas={
          listaDespesas.map(
            despesa=>({

              data:
              despesa.data,

              valor:
              despesa.valor

            })
          )
        }

        />


      </div>








      <AppCard className="p-8">


      <h2 className="mb-6 text-2xl font-bold">

        Despesas da obra

      </h2>





      <table className="w-full">


      <thead className="bg-slate-100">

      <tr>

      <th className="p-4 text-left">
      Descrição
      </th>


      <th className="p-4 text-left">
      Tipo
      </th>


      <th className="p-4 text-left">
      Data
      </th>


      <th className="p-4 text-right">
      Valor
      </th>


      <th className="p-4">
      Ações
      </th>


      </tr>

      </thead>






      <tbody>


      {
      listaDespesas.map(
      despesa=>(


      <tr
      key={despesa.id}
      className="border-t"
      >


      <td className="p-4">
      {despesa.descricao}
      </td>



      <td className="p-4">
      {despesa.tipo}
      </td>




      <td className="p-4">

      {
      formatarData(
        despesa.data
      )
      }

      </td>





      <td className="p-4 text-right">

      {
      Number(
        despesa.valor ?? 0
      )
      .toLocaleString(
        "pt-BR",
        {
          style:"currency",
          currency:"BRL"
        }
      )
      }

      </td>





      <td className="p-4 text-center">


      <ExcluirDespesa
      id={despesa.id}
      />


      </td>


      </tr>


      )
      )
      }



      </tbody>


      </table>



      </AppCard>




    </div>

  );


}