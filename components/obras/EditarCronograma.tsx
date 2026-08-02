"use client";

import {
  useState
} from "react";

import { supabase } from "@/lib/supabase";


type Props = {
  id: number;
  etapaAtual: string;
  inicioAtual: string | null;
  fimAtual: string | null;
  progressoAtual: number;
  statusAtual: string;
  onAtualizar: () => void;
};


export default function EditarCronograma({
  id,
  etapaAtual,
  inicioAtual,
  fimAtual,
  progressoAtual,
  statusAtual,
  onAtualizar,
}: Props) {


  const [abrir, setAbrir] =
    useState(false);


  const [etapa, setEtapa] =
    useState(etapaAtual);


  const [inicio, setInicio] =
    useState(inicioAtual ?? "");


  const [fim, setFim] =
    useState(fimAtual ?? "");


  const [progresso, setProgresso] =
    useState(
      String(progressoAtual ?? 0)
    );


  const [status, setStatus] =
    useState(statusAtual ?? "Planejamento");



  async function salvar() {


    const progressoNumero =
      Number(progresso);



    let novoStatus = status;



    if (progressoNumero === 0) {

      novoStatus = "Planejamento";

    } else if (
      progressoNumero >= 100
    ) {

      novoStatus = "Concluído";

    } else {

      novoStatus = "Em andamento";

    }




    const { error } =
      await supabase
        .from("cronogramas")
        .update({

          etapa,

          data_inicio:
            inicio || null,

          data_fim:
            fim || null,

          progresso:
            progressoNumero,

          status:
            novoStatus,

        })
        .eq(
          "id",
          id
        );



    if (error) {

      console.error(error);

      alert(
        "Erro ao atualizar etapa."
      );

      return;

    }



    setAbrir(false);

    onAtualizar();

  }





  return (

    <div>


      <button

        type="button"

        onClick={() =>
          setAbrir(!abrir)
        }

        className="rounded-lg bg-amber-500 px-3 py-2 text-white"

      >

        ✏️

      </button>





      {abrir && (

        <div className="mt-4 space-y-3 rounded-xl border bg-slate-50 p-4">


          <input

            value={etapa}

            onChange={(e) =>
              setEtapa(
                e.target.value
              )
            }

            className="w-full rounded-lg border p-2"

          />



          <div className="grid gap-3 md:grid-cols-2">


            <input

              type="date"

              value={inicio}

              onChange={(e) =>
                setInicio(
                  e.target.value
                )
              }

              className="rounded-lg border p-2"

            />



            <input

              type="date"

              value={fim}

              onChange={(e) =>
                setFim(
                  e.target.value
                )
              }

              className="rounded-lg border p-2"

            />


          </div>





          <input

            type="number"

            min="0"

            max="100"

            value={progresso}

            onChange={(e) =>
              setProgresso(
                e.target.value
              )
            }

            className="w-full rounded-lg border p-2"

          />





          <select

            value={status}

            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }

            className="w-full rounded-lg border p-2"

          >

            <option>
              Planejamento
            </option>

            <option>
              Em andamento
            </option>

            <option>
              Concluído
            </option>

            <option>
              Atrasado
            </option>


          </select>





          <button

            onClick={salvar}

            className="rounded-lg bg-blue-600 px-5 py-2 text-white"

          >

            Salvar alterações

          </button>



        </div>

      )}



    </div>

  );

}