import RecentProjects from "./widgets/RecentProjects";
import RevenueChart from "./widgets/RevenueChart";
import StatsGrid from "./StatsGrid";
import TaskList from "./TaskList";

export default function Dashboard() {
  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Bem-vindo ao ProjectHub AI
        </h2>

        <p className="mt-2 text-slate-500">
          Acompanhe o desempenho das suas obras.
        </p>
      </div>

      <StatsGrid />

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="min-h-80 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-800">
            Visão financeira
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Receitas e despesas dos últimos meses.
          </p>

          <div className="mt-8">
            <RevenueChart />
          </div>
        </div>

        <TaskList />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RecentProjects />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Atividades recentes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Últimas movimentações do sistema.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="font-medium text-slate-800">
                ✔ João cadastrou uma nova obra
              </p>

              <span className="text-sm text-slate-500">
                há 5 minutos
              </span>
            </div>

            <div>
              <p className="font-medium text-slate-800">
                ✔ Cliente aprovou orçamento
              </p>

              <span className="text-sm text-slate-500">
                há 32 minutos
              </span>
            </div>

            <div>
              <p className="font-medium text-slate-800">
                ✔ Material entregue na obra
              </p>

              <span className="text-sm text-slate-500">
                hoje às 14:20
              </span>
            </div>

            <div>
              <p className="font-medium text-slate-800">
                ✔ Equipe concluiu a fundação
              </p>

              <span className="text-sm text-slate-500">
                ontem
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}