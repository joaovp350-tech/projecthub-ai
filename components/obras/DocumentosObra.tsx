"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";


type Props = {
  obraId: number;
};


type Documento = {
  id: number;
  arquivo: string;
  nome: string;
  tipo: string | null;
  data: string | null;
};




export default function DocumentosObra({
  obraId,
}: Props) {


  const [documentos, setDocumentos] =
    useState<Documento[]>([]);


  const [arquivo, setArquivo] =
    useState<File | null>(null);


  const [nome, setNome] =
    useState("");


  const [tipo, setTipo] =
    useState("");


  const [enviando, setEnviando] =
    useState(false);







  async function carregarDocumentos() {


    const { data, error } =
      await supabase
        .from("documentos_obras")
        .select("*")
        .eq(
          "obra_id",
          obraId
        )
        .order(
          "id",
          {
            ascending: false,
          }
        );



    if (error) {

      console.error(error);

      return;

    }



    setDocumentos(
      data ?? []
    );


  }







  useEffect(() => {

    carregarDocumentos();

  }, [obraId]);









  async function adicionarDocumento(
    e: FormEvent<HTMLFormElement>
  ) {


    e.preventDefault();



    if (!arquivo) {

      alert(
        "Selecione um arquivo"
      );

      return;

    }




    setEnviando(true);






    const nomeLimpo =
      arquivo.name
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /\s+/g,
          "-"
        )
        .replace(
          /[^a-zA-Z0-9.-]/g,
          ""
        );





    const nomeArquivo =
      `${Date.now()}-${nomeLimpo}`;







    const upload =
      await supabase.storage
        .from(
          "documentos-obras"
        )
        .upload(
          nomeArquivo,
          arquivo
        );






    if (upload.error) {


      console.error(
        upload.error
      );


      alert(
        upload.error.message
      );


      setEnviando(false);


      return;

    }








    const url =
      supabase.storage
        .from(
          "documentos-obras"
        )
        .getPublicUrl(
          nomeArquivo
        )
        .data
        .publicUrl;









    const { error } =
      await supabase
        .from(
          "documentos_obras"
        )
        .insert({

          obra_id:
            obraId,

          arquivo:
            url,

          nome:
            nome ||
            arquivo.name,

          tipo:
            tipo ||
            arquivo.type,

        });








    if (error) {


      console.error(error);


      alert(
        error.message
      );


      setEnviando(false);


      return;


    }








    setArquivo(null);

    setNome("");

    setTipo("");

    setEnviando(false);



    carregarDocumentos();


  }









  async function excluirDocumento(
    id:number
  ) {


    const confirmar =
      confirm(
        "Excluir documento?"
      );


    if (!confirmar)
      return;






    const { error } =
      await supabase
        .from(
          "documentos_obras"
        )
        .delete()
        .eq(
          "id",
          id
        );





    if(error){

      console.error(error);

      return;

    }





    carregarDocumentos();


  }









  return (

    <div className="space-y-6">







      <form

        onSubmit={
          adicionarDocumento
        }

        className="rounded-2xl bg-white p-6 shadow"

      >




        <h2 className="mb-6 text-2xl font-bold text-slate-800">

          Adicionar documento

        </h2>








        <div className="grid gap-4 md:grid-cols-3">






          <input

            type="file"

            onChange={(e)=>
              setArquivo(
                e.target.files?.[0] ?? null
              )
            }

            className="rounded-xl border p-3"

          />








          <input

            value={nome}

            onChange={(e)=>
              setNome(
                e.target.value
              )
            }

            placeholder="Nome do documento"

            className="rounded-xl border p-3"

          />








          <input

            value={tipo}

            onChange={(e)=>
              setTipo(
                e.target.value
              )
            }

            placeholder="Tipo (PDF, contrato...)"

            className="rounded-xl border p-3"

          />





        </div>







        <button

          disabled={enviando}

          className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"

        >

          {enviando
            ? "Enviando..."
            : "Adicionar Documento"}

        </button>





      </form>









      <div className="rounded-2xl bg-white p-6 shadow">





        <h2 className="mb-6 text-2xl font-bold text-slate-800">

          Documentos da obra

        </h2>








        <div className="space-y-4">






          {documentos.map(
            (documento)=>(


              <div

                key={
                  documento.id
                }

                className="flex items-center justify-between rounded-xl border p-4"

              >





                <div>


                  <p className="font-semibold">

                    {documento.nome}

                  </p>




                  <p className="text-sm text-slate-500">

                    {documento.tipo ||
                    "Arquivo"}

                  </p>


                </div>








                <div className="flex gap-3">





                  <a

                    href={
                      documento.arquivo
                    }

                    target="_blank"

                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"

                  >

                    Abrir

                  </a>







                  <button

                    onClick={()=>
                      excluirDocumento(
                        documento.id
                      )
                    }

                    className="rounded-lg bg-red-600 px-4 py-2 text-white"

                  >

                    🗑️

                  </button>





                </div>





              </div>


            )
          )}








          {documentos.length === 0 && (

            <p className="text-slate-500">

              Nenhum documento cadastrado.

            </p>

          )}






        </div>





      </div>





    </div>

  );


}