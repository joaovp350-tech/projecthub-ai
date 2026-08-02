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


type Funcionario = {
  id:number;
  nome:string;
};


type Equipe = {
  id:number;
  funcionario_id:number;
  cargo:string | null;
  salario:number | null;
  horas_trabalhadas:number | null;

  funcionario:{
    nome:string;
  }[] | null;
};





export default function EquipeObra({
  obraId,
}:Props){



const [funcionarios,setFuncionarios]
=
useState<Funcionario[]>([]);


const [equipe,setEquipe]
=
useState<Equipe[]>([]);



const [funcionarioId,setFuncionarioId]
=
useState("");

const [cargo,setCargo]
=
useState("");

const [salario,setSalario]
=
useState("");

const [horas,setHoras]
=
useState("");



const [editando,setEditando]
=
useState<number | null>(null);






async function carregarDados(){


const {data:funcs}
=
await supabase
.from("funcionarios")
.select(
"id,nome"
)
.order(
"nome"
);



const {data:eq}
=
await supabase
.from("equipe_obras")
.select(`
id,
funcionario_id,
cargo,
salario,
horas_trabalhadas,

funcionario:funcionarios(
nome
)
`)
.eq(
"obra_id",
obraId
)
.order(
"id",
{
ascending:false
}
);



setFuncionarios(
funcs ?? []
);


setEquipe(
(eq ?? []) as Equipe[]
);


}





useEffect(()=>{

carregarDados();

},[obraId]);










async function salvar(
e:FormEvent
){

e.preventDefault();



if(!funcionarioId)
return;



await supabase
.from("equipe_obras")
.insert({

obra_id:obraId,

funcionario_id:
Number(funcionarioId),

cargo,

salario:
Number(salario || 0),

horas_trabalhadas:
Number(horas || 0)

});



limpar();

carregarDados();

}





function limpar(){

setFuncionarioId("");

setCargo("");

setSalario("");

setHoras("");

}









async function remover(id:number){


if(
!confirm(
"Remover funcionário?"
)
)
return;



await supabase
.from("equipe_obras")
.delete()
.eq(
"id",
id
);



carregarDados();

}









function editar(item:Equipe){


setEditando(
item.id
);


setCargo(
item.cargo ?? ""
);


setSalario(
String(
item.salario ?? ""
)
);


setHoras(
String(
item.horas_trabalhadas ?? ""
)
);


}









async function atualizar(){


if(!editando)
return;



await supabase
.from("equipe_obras")
.update({

cargo,

salario:
Number(salario || 0),

horas_trabalhadas:
Number(horas || 0)

})
.eq(
"id",
editando
);



setEditando(null);

limpar();

carregarDados();


}









return (

<div className="space-y-6">






<form
onSubmit={salvar}
className="rounded-2xl bg-white p-6 shadow"
>


<h2 className="mb-5 text-2xl font-bold">

Adicionar funcionário

</h2>



<div className="grid gap-4 md:grid-cols-4">


<select

value={funcionarioId}

onChange={
e=>setFuncionarioId(
e.target.value
)
}

className="rounded-xl border p-3"

>


<option value="">

Selecionar funcionário

</option>



{
funcionarios.map(
f=>(

<option
key={f.id}
value={f.id}
>

{f.nome}

</option>

)
)
}


</select>





<input

placeholder="Cargo"

value={cargo}

onChange={
e=>setCargo(e.target.value)
}

className="rounded-xl border p-3"

/>





<input

placeholder="Salário"

type="number"

value={salario}

onChange={
e=>setSalario(e.target.value)
}

className="rounded-xl border p-3"

/>





<input

placeholder="Horas"

type="number"

value={horas}

onChange={
e=>setHoras(e.target.value)
}

className="rounded-xl border p-3"

/>



</div>





<button

className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-white"

>

Adicionar funcionário

</button>



</form>









<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="mb-5 text-2xl font-bold">

Equipe da obra

</h2>





<div className="space-y-4">


{
equipe.map(
item=>(


<div

key={item.id}

className="flex justify-between rounded-xl border p-4"

>


<div>


<p className="font-bold">

{
item.funcionario?.[0]?.nome
}

</p>


<p>

Cargo:
{
item.cargo || "-"
}

</p>


<p>

Salário:
{
Number(
item.salario ?? 0
)
.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
)
}

</p>


<p>

Horas:
{
item.horas_trabalhadas ?? 0
}h

</p>


</div>





<div className="flex gap-2">


<button

onClick={()=>
editar(item)
}

className="rounded-lg bg-amber-500 px-4 py-2 text-white"

>

✏️

</button>




<button

onClick={()=>
remover(item.id)
}

className="rounded-lg bg-red-600 px-4 py-2 text-white"

>

🗑️

</button>



</div>



</div>


)
)
}



</div>


</div>









{
editando && (

<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-xl font-bold">

Editar funcionário

</h2>



<div className="mt-4 grid gap-4 md:grid-cols-3">


<input

value={cargo}

onChange={
e=>setCargo(e.target.value)
}

className="rounded-xl border p-3"

/>



<input

value={salario}

onChange={
e=>setSalario(e.target.value)
}

type="number"

className="rounded-xl border p-3"

/>



<input

value={horas}

onChange={
e=>setHoras(e.target.value)
}

type="number"

className="rounded-xl border p-3"

/>



</div>




<button

onClick={atualizar}

className="mt-4 rounded-xl bg-green-600 px-6 py-3 text-white"

>

Salvar alteração

</button>



</div>

)
}





</div>

);

}