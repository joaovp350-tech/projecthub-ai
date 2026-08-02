const tasks = [
  {
    title: "Comprar 40 sacos de cimento",
    project: "Residencial Oliveira",
    status: "Urgente",
  },
  {
    title: "Revisar instalação elétrica",
    project: "Casa Jardim Europa",
    status: "Hoje",
  },
  {
    title: "Enviar relatório para o cliente",
    project: "Edifício Central",
    status: "Amanhã",
  },
];

export default function TaskList() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Próximas tarefas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Atividades que precisam da sua atenção.
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={`${task.project}-${task.title}`}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
          >
            <div>
              <h3 className="font-semibold text-slate-800">
                {task.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {task.project}
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}