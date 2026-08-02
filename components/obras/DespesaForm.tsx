"use client";

import {
  FormEvent,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";


type Props = {
  obraId: number;
};



export default function DespesaForm({
  obraId,
}: Props) {


  const [tipo, setTipo] =
    useState("Material");


  const [descricao, setDescricao] =
    useState("");


  const [valor, setValor] =
    useState("");


  const [data, setData] =
    useState("");



  const [salvando, setSalvando] =
    useState(false);








  async function salvar(
    e: FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();



    if (
      !descricao ||
      !valor ||
      !data
    ) {

      alert(
        "Preencha todos os campos"
      );

      return;

    }




    setSalvando(true);





    const { error } =
      await supabase
        .from("despesas_obras")
        .insert({

          obra_id:
            obraId,

          tipo,

          descricao,

          valor:
            Number(valor),

          // formato correto do banco
          data,

        });







    setSalvando(false);





    if(error){

      console.error(error);

      alert(
        error.message
      );

      return;

    }





    setDescricao("");

    setValor("");

    setData("");



    window.location.reload();


  }









  return (

    <form

      onSubmit={
        salvar
      }

      className="rounded-2xl bg-white p-6 shadow"

    >



      <h2 className="mb-6 text-2xl font-bold text-slate-800">

        Adicionar despesa

      </h2>






      <div className="grid gap-4 md:grid-cols-4">






        <select

          value={
            tipo
          }

          onChange={
            e =>
            setTipo(
              e.target.value
            )
          }

          className="rounded-xl border p-3"

        >


          <option>
            Material
          </option>


          <option>
            Mão de obra
          </option>


          <option>
            Equipamento
          </option>


          <option>
            Outros
          </option>



        </select>









        <input

          value={
            descricao
          }

          onChange={
            e =>
            setDescricao(
              e.target.value
            )
          }

          placeholder="Descrição"

          className="rounded-xl border p-3"

        />








        <input

          type="number"

          value={
            valor
          }

          onChange={
            e =>
            setValor(
              e.target.value
            )
          }

          placeholder="Valor"

          className="rounded-xl border p-3"

        />









        <input

          type="date"

          value={
            data
          }

          onChange={
            e =>
            setData(
              e.target.value
            )
          }

          className="rounded-xl border p-3"

        />





      </div>








      <button

        disabled={
          salvando
        }

        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"

      >

        {
          salvando
          ?
          "Salvando..."
          :
          "Adicionar Despesa"
        }

      </button>





    </form>

  );

}