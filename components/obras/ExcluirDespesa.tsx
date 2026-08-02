"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type Props = {
  id: number;
};

export default function ExcluirDespesa({
  id,
}: Props) {
  const router = useRouter();

  const [excluindo, setExcluindo] = useState(false);


  async function excluir() {
    const confirmar = confirm(
      "Deseja realmente excluir esta despesa?"
    );

    if (!confirmar) return;


    setExcluindo(true);


    const { error } = await supabase
      .from("despesas_obras")
      .delete()
      .eq("id", id);



    if (error) {
      console.error(error);

      alert(
        "Erro ao excluir despesa."
      );

      setExcluindo(false);
      return;
    }


    router.refresh();

    setExcluindo(false);
  }



  return (
    <button
      type="button"
      onClick={excluir}
      disabled={excluindo}
      className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700 disabled:bg-red-300"
    >
      {excluindo
        ? "..."
        : "🗑️"}
    </button>
  );
}