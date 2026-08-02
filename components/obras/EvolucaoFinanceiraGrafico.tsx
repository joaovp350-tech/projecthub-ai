"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


type Despesa = {
  data: string | null;
  valor: number | null;
};


type Props = {
  despesas: Despesa[];
};



export default function EvolucaoFinanceiraGrafico({
  despesas,
}: Props) {


  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];



  const dados = despesas.reduce(
    (acc, despesa) => {

      if (!despesa.data) {
        return acc;
      }


      const data =
        new Date(
          despesa.data +
          "T00:00:00"
        );


      const mes =
        meses[data.getMonth()];


      const valor =
        Number(
          despesa.valor ?? 0
        );



      const existente =
        acc.find(
          (item) =>
            item.mes === mes
        );



      if (existente) {

        existente.valor += valor;

      } else {

        acc.push({
          mes,
          valor,
          ordem:
            data.getMonth(),
        });

      }


      return acc;

    },
    [] as {
      mes: string;
      valor: number;
      ordem: number;
    }[]
  );



  dados.sort(
    (a, b) =>
      a.ordem - b.ordem
  );





  if (!dados.length) {

    return (

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">

        Nenhuma despesa com data cadastrada.

      </div>

    );

  }





  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Evolução dos gastos
      </h2>



      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={dados}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 20,
            }}
          >


            <CartesianGrid
              strokeDasharray="3 3"
            />


            <XAxis
              dataKey="mes"
            />


            <YAxis />


            <Tooltip
              formatter={(value) =>
                Number(value).toLocaleString(
                  "pt-BR",
                  {
                    style:
                      "currency",
                    currency:
                      "BRL",
                  }
                )
              }
            />


            <Line
              type="monotone"
              dataKey="valor"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
            />


          </LineChart>


        </ResponsiveContainer>


      </div>


    </div>

  );

}