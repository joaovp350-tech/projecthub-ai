import Link from "next/link";
import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import AppCard from "@/components/ui/AppCard";
import ObraTabs from "@/components/obras/ObraTabs";
import PageHeader from "@/components/ui/PageHeader";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


type Equipe = {
  id: number;
  cargo: string | null;
  salario: number | null;
  horas_trabalhadas: number | null;
  funcionario_id: number;
};


type Funcionario = {
  id: number;
  nome: string;
  telefone: string | null;
  email: string | null;
  data_admissao: string | null;
};




export default async function EquipeObraPage({
  params,
}: Props) {


  const { id } = await params;



  const {
    data: obra,
    error: obraError
  } = await supabase
    .from("obras")
    .select(
      "id,nome"
    )
    .eq(
      "id",
      id
    )
    .single();





  if (
    obraError ||
    !obra
  ) {

    console.error(
      obraError
    );

    notFound();

  }






  const {
    data: equipe,
    error: equipeError
  } = await supabase
    .from("equipe_obras")
    .select(`
      id,
      cargo,
      salario,
      horas_trabalhadas,
      funcionario_id
    `)
    .eq(
      "obra_id",
      id
    )
    .order(
      "id",
      {
        ascending:false
      }
    );






  const listaEquipe =
    (equipe ?? []) as Equipe[];





  const idsFuncionarios =
    listaEquipe.map(
      item =>
        item.funcionario_id
    );







  let funcionarios: Funcionario[] = [];





  if(idsFuncionarios.length > 0){


    const {
      data
    } = await supabase
      .from("funcionarios")
      .select(`
        id,
        nome,
        telefone,
        email,
        data_admissao
      `)
      .in(
        "id",
        idsFuncionarios
      );



    funcionarios =
      (data ?? []) as Funcionario[];


  }









  return (

    <div className="space-y-6">





      <PageHeader

        title={obra.nome}

        description="Equipe vinculada à obra"

        action={

          <Link

            href="/funcionarios/nova"

            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"

          >

            + Novo Funcionário

          </Link>

        }

      />






      <ObraTabs
        id={id}
      />







      {equipeError && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

          Erro ao carregar equipe:

          {" "}

          {equipeError.message}

        </div>

      )}









      <AppCard className="p-0">


        <div className="border-b border-slate-200 p-6">


          <h2 className="text-2xl font-bold text-slate-800">

            Funcionários da obra

          </h2>


          <p className="mt-1 text-sm text-slate-500">

            {listaEquipe.length}

            {" "}

            funcionário(s) vinculado(s)

          </p>


        </div>








        <div className="overflow-x-auto">


          <table className="w-full min-w-[900px]">


            <thead className="bg-slate-100">


              <tr>


                <th className="p-4 text-left">
                  Nome
                </th>


                <th className="p-4 text-left">
                  Cargo
                </th>


                <th className="p-4 text-left">
                  Telefone
                </th>


                <th className="p-4 text-left">
                  Salário
                </th>


                <th className="p-4 text-left">
                  Horas
                </th>


                <th className="p-4 text-center">
                  Ações
                </th>


              </tr>


            </thead>







            <tbody>


              {listaEquipe.map(
                (item)=>(


                  <tr

                    key={
                      item.id
                    }

                    className="border-t hover:bg-slate-50"

                  >




                    <td className="p-4 font-semibold text-slate-800">


                      {
                        funcionarios.find(
                          f =>
                          f.id === item.funcionario_id
                        )?.nome
                        ||
                        "—"
                      }


                    </td>






                    <td className="p-4">


                      {
                        item.cargo
                        ||
                        "—"
                      }


                    </td>






                    <td className="p-4">


                      {
                        funcionarios.find(
                          f =>
                          f.id === item.funcionario_id
                        )?.telefone
                        ||
                        "—"
                      }


                    </td>







                    <td className="p-4">


                      {Number(
                        item.salario ?? 0
                      ).toLocaleString(
                        "pt-BR",
                        {
                          style:"currency",
                          currency:"BRL"
                        }
                      )}


                    </td>







                    <td className="p-4">


                      {
                        item.horas_trabalhadas ?? 0
                      }h


                    </td>







                    <td className="p-4 text-center">


                      <Link

                        href={
                          `/funcionarios/editar/${item.funcionario_id}`
                        }

                        className="rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"

                      >

                        ✏️

                      </Link>


                    </td>




                  </tr>


                )

              )}








              {listaEquipe.length === 0 && (

                <tr>

                  <td

                    colSpan={6}

                    className="p-10 text-center text-slate-500"

                  >

                    Nenhum funcionário vinculado a esta obra.

                  </td>


                </tr>

              )}




            </tbody>


          </table>


        </div>




      </AppCard>





    </div>

  );


}