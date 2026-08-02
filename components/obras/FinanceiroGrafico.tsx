"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";


type Despesa = {
  tipo: string | null;
  valor: number | null;
};


type Props = {
  despesas: Despesa[];
};



export default function FinanceiroGrafico({
  despesas,
}: Props) {


  const dados = despesas.reduce(
    (acc, despesa) => {

      const tipo =
        despesa.tipo || "Outros";


      const valor =
        Number(despesa.valor ?? 0);



      const existente =
        acc.find(
          (item) =>
            item.tipo === tipo
        );


      if (existente) {

        existente.valor += valor;

      } else {

        acc.push({
          tipo,
          valor,
        });

      }


      return acc;

    },
    [] as {
      tipo: string;
      valor: number;
    }[]
  );





  if (!dados.length) {

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Nenhuma despesa cadastrada.
      </div>
    );

  }





  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Gastos por categoria
      </h2>



      <div className="h-[350px]">


        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={dados}
            margin={{
              top: 30,
              right: 20,
              left: 10,
              bottom: 20,
            }}
          >


            <CartesianGrid
              strokeDasharray="3 3"
            />



            <XAxis
              dataKey="tipo"
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



            <Bar
              dataKey="valor"
              fill="#2563eb"
              radius={[
                8,
                8,
                0,
                0,
              ]}
              barSize={80}
            >

              <LabelList
                dataKey="valor"
                position="top"
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

            </Bar>


          </BarChart>


        </ResponsiveContainer>


      </div>


    </div>

  );

}