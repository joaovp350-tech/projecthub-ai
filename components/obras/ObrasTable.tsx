const obras = [
  {
    nome: "Residencial Oliveira",
    cliente: "João Oliveira",
    status: "Em andamento",
    progresso: "72%",
  },
  {
    nome: "Edifício Central",
    cliente: "Maria Souza",
    status: "Planejamento",
    progresso: "48%",
  },
  {
    nome: "Condomínio Jardim",
    cliente: "Pedro Santos",
    status: "Finalizada",
    progresso: "100%",
  },
];

export default function ObrasTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Obra</th>
            <th className="p-4 text-left">Cliente</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Progresso</th>
          </tr>
        </thead>

        <tbody>
          {obras.map((obra) => (
            <tr
              key={obra.nome}
              className="border-t hover:bg-slate-50"
            >
              <td className="p-4">{obra.nome}</td>

              <td className="p-4">{obra.cliente}</td>

              <td className="p-4">{obra.status}</td>

              <td className="p-4 font-semibold text-blue-600">
                {obra.progresso}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}