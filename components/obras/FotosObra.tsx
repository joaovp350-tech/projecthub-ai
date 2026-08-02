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


type Foto = {
  id: number;
  imagem: string;
  descricao: string | null;
  data: string | null;
};



export default function FotosObra({
  obraId,
}: Props) {


  const [fotos, setFotos] =
    useState<Foto[]>([]);


  const [arquivo, setArquivo] =
    useState<File | null>(null);


  const [preview, setPreview] =
    useState<string>("");


  const [descricao, setDescricao] =
    useState("");


  const [data, setData] =
    useState("");



  const [carregando, setCarregando] =
    useState(false);







  async function carregarFotos() {


    const { data, error } =
      await supabase
        .from("fotos_obras")
        .select("*")
        .eq(
          "obra_id",
          obraId
        )
        .order(
          "id",
          {
            ascending:false,
          }
        );



    if(error){

      console.error(error);

      return;

    }



    setFotos(
      data ?? []
    );


  }







  useEffect(()=>{

    carregarFotos();

  },[obraId]);









  function selecionarArquivo(
    e: React.ChangeEvent<HTMLInputElement>
  ){


    const file =
      e.target.files?.[0];


    if(!file)
      return;



    setArquivo(file);



    setPreview(
      URL.createObjectURL(file)
    );


  }









  async function adicionarFoto(
    e: FormEvent<HTMLFormElement>
  ){


    e.preventDefault();



    if(!arquivo){

      alert(
        "Selecione uma imagem"
      );

      return;

    }





    setCarregando(true);





    const nomeArquivo =
      `${Date.now()}-${arquivo.name}`;





    const upload =
      await supabase.storage
        .from("fotos-obras")
        .upload(
          nomeArquivo,
          arquivo
        );





    if(upload.error){

      console.error(
        upload.error
      );

      alert(
        "Erro no upload"
      );

      setCarregando(false);

      return;

    }







    const url =
      supabase.storage
        .from("fotos-obras")
        .getPublicUrl(
          nomeArquivo
        )
        .data
        .publicUrl;








    const { error } =
      await supabase
        .from("fotos_obras")
        .insert({

          obra_id:
            obraId,

          imagem:
            url,

          descricao:
            descricao || null,

          data:
            data || null,

        });








    if(error){

      console.error(error);

      alert(
        "Erro ao salvar foto"
      );

      setCarregando(false);

      return;

    }







    setArquivo(null);

    setPreview("");

    setDescricao("");

    setData("");



    setCarregando(false);



    carregarFotos();



  }









  async function excluirFoto(
    id:number
  ){



    await supabase
      .from("fotos_obras")
      .delete()
      .eq(
        "id",
        id
      );



    carregarFotos();


  }








  return (

    <div className="space-y-6">






      <form

        onSubmit={adicionarFoto}

        className="rounded-2xl bg-white p-6 shadow"

      >



        <h2 className="mb-6 text-2xl font-bold text-slate-800">

          Adicionar foto

        </h2>






        <div className="grid gap-4 md:grid-cols-3">





          <input

            type="file"

            accept="image/*"

            onChange={selecionarArquivo}

            className="rounded-xl border p-3"

          />






          <input

            value={descricao}

            onChange={(e)=>
              setDescricao(
                e.target.value
              )
            }

            placeholder="Descrição"

            className="rounded-xl border p-3"

          />






          <input

            type="date"

            value={data}

            onChange={(e)=>
              setData(
                e.target.value
              )
            }

            className="rounded-xl border p-3"

          />



        </div>







        {preview && (

          <img

            src={preview}

            className="mt-5 h-40 rounded-xl object-cover"

          />

        )}







        <button

          disabled={carregando}

          className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"

        >

          {carregando
            ? "Enviando..."
            : "Adicionar Foto"}

        </button>



      </form>








      <div className="rounded-2xl bg-white p-6 shadow">



        <h2 className="mb-6 text-2xl font-bold">

          Galeria da obra

        </h2>






        <div className="grid gap-6 md:grid-cols-3">





          {fotos.map(
            (foto)=>(


              <div

                key={foto.id}

                className="overflow-hidden rounded-xl border"

              >



                <img

                  src={foto.imagem}

                  className="h-48 w-full object-cover"

                />




                <div className="p-4">


                  <p className="font-semibold">

                    {foto.descricao ||
                    "Sem descrição"}

                  </p>




                  <button

                    onClick={()=>
                      excluirFoto(
                        foto.id
                      )
                    }

                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"

                  >

                    🗑️ Excluir

                  </button>



                </div>



              </div>


            )
          )}






        </div>



      </div>




    </div>

  );


}