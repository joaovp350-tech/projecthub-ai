"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import EditarCronograma from "./EditarCronograma";


type Props = {
  obraId: number;
};


type Etapa = {
  id: number;
  etapa: string;
  data_inicio: string | null;
  data_fim: string | null;
  progresso: number | null;
  status: string | null;
};



const statusOptions = [
  "Planejamento",
  "Em andamento",
  "Concluído",
  "Atrasado",
];



export default function CronogramaObra({
  obraId,
}: Props) {


  const [etapas, setEtapas] =
    useState<Etapa[]>([]);


  const [etapa, setEtapa] =
    useState("");

  const [dataInicio, setDataInicio] =
    useState("");

  const [dataFim, setDataFim] =
    useState("");

  const [progresso, setProgresso] =
    useState("0");

  const [status, setStatus] =
    useState("Planejamento");


  const [carregando, setCarregando] =
    useState(true);


  const [salvando, setSalvando] =
    useState(false);




  async function carregarCronograma() {

    setCarregando(true);


    const { data, error } =
      await supabase
        .from("cronogramas")
        .select("*")
        .eq("obra_id", obraId)
        .order("id", {
          ascending: false,
        });



    if (error) {

      console.error(error);

      setCarregando(false);

      return;

    }


    setEtapas(data ?? []);

    setCarregando(false);

  }





  useEffect(() => {

    carregarCronograma();

  }, [obraId]);







  async function adicionarEtapa(
    event: FormEvent<HTMLFormElement>
  ) {


    event.preventDefault();


    if (!etapa.trim()) {

      alert(
        "Digite o nome da etapa."
      );

      return;

    }



    setSalvando(true);



    const { error } =
      await supabase
        .from("cronogramas")
        .insert({

          obra_id: obraId,

          etapa,

          data_inicio:
            dataInicio || null,

          data_fim:
            dataFim || null,

          progresso:
            Number(progresso),

          status,

        });




    if (error) {

      console.error(error);

      alert(
        "Erro ao salvar etapa."
      );

      setSalvando(false);

      return;

    }




    setEtapa("");

    setDataInicio("");

    setDataFim("");

    setProgresso("0");

    setStatus("Planejamento");


    setSalvando(false);


    carregarCronograma();

  }







  async function excluirEtapa(
    id:number
  ) {


    const confirmar =
      confirm(
        "Excluir esta etapa?"
      );


    if (!confirmar) return;




    const { error } =
      await supabase
        .from("cronogramas")
        .delete()
        .eq(
          "id",
          id
        );



    if(error){

      console.error(error);

      return;

    }



    carregarCronograma();


  }







  if(carregando){

    return (

      <div className="rounded-2xl bg-white p-6 shadow">

        Carregando cronograma...

      </div>

    );

  }






  return (

    <div className="space-y-6">





      <form

        onSubmit={adicionarEtapa}

        className="rounded-2xl bg-white p-6 shadow"

      >


        <h2 className="mb-6 text-2xl font-bold text-slate-800">

          Adicionar etapa

        </h2>



        <div className="grid gap-4 md:grid-cols-3">



          <input

            value={etapa}

            onChange={(e)=>
              setEtapa(
                e.target.value
              )
            }

            placeholder="Ex: Fundação"

            className="rounded-xl border p-3"

          />




          <input

            type="date"

            value={dataInicio}

            onChange={(e)=>
              setDataInicio(
                e.target.value
              )
            }

            className="rounded-xl border p-3"

          />




          <input

            type="date"

            value={dataFim}

            onChange={(e)=>
              setDataFim(
                e.target.value
              )
            }

            className="rounded-xl border p-3"

          />





          <input

            type="number"

            min="0"

            max="100"

            value={progresso}

            onChange={(e)=>
              setProgresso(
                e.target.value
              )
            }

            className="rounded-xl border p-3"

          />





          <select

            value={status}

            onChange={(e)=>
              setStatus(
                e.target.value
              )
            }

            className="rounded-xl border p-3"

          >

            {statusOptions.map(
              (item)=>(

                <option key={item}>
                  {item}
                </option>

              )
            )}

          </select>



        </div>





        <button

          disabled={salvando}

          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white"

        >

          {salvando
            ? "Salvando..."
            : "Adicionar Etapa"}

        </button>



      </form>







      <div className="rounded-2xl bg-white p-6 shadow">


        <h2 className="mb-6 text-2xl font-bold text-slate-800">

          Cronograma

        </h2>




        <div className="space-y-5">



          {etapas.map(
            (item)=>(


              <div

                key={item.id}

                className="rounded-xl border p-5"

              >




                <div className="flex items-center justify-between">


                  <h3 className="font-bold text-slate-800">

                    {item.etapa}

                  </h3>




                  <div className="flex gap-2">


                    <EditarCronograma

                      id={item.id}

                      etapaAtual={item.etapa}

                      inicioAtual={item.data_inicio}

                      fimAtual={item.data_fim}

                      progressoAtual={
                        item.progresso ?? 0
                      }

                      statusAtual={
                        item.status ??
                        "Planejamento"
                      }

                      onAtualizar={
                        carregarCronograma
                      }

                    />




                    <button

                      onClick={()=>
                        excluirEtapa(
                          item.id
                        )
                      }

                      className="rounded-lg bg-red-600 px-3 py-2 text-white"

                    >

                      🗑️

                    </button>



                  </div>



                </div>





                <p className="mt-3 text-sm text-slate-500">

                  {item.status}

                </p>





                <div className="mt-4">


                  <div className="mb-2 flex justify-between">


                    <span>
                      Progresso
                    </span>


                    <strong>
                      {item.progresso ?? 0}%
                    </strong>


                  </div>





                  <div className="h-3 rounded-full bg-slate-200">


                    <div

                      className="h-3 rounded-full bg-blue-600"

                      style={{
                        width:
                        `${item.progresso ?? 0}%`
                      }}

                    />


                  </div>


                </div>



              </div>


            )
          )}






          {etapas.length === 0 && (

            <p className="text-center text-slate-500">

              Nenhuma etapa cadastrada.

            </p>

          )}



        </div>


      </div>



    </div>

  );

}