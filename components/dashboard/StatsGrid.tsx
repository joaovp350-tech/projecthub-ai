import {
  Building2,
  Users,
  Wallet,
  ChartColumn,
} from "lucide-react";

import StatCard from "./cards/StatCard";

export default function StatsGrid() {
  return (
    <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Obras Ativas"
        value="12"
        change="+8%"
        icon={Building2}
      />

      <StatCard
        title="Funcionários"
        value="28"
        change="+2%"
        icon={Users}
      />

      <StatCard
        title="Receita"
        value="R$ 582 mil"
        change="+15%"
        icon={Wallet}
      />

      <StatCard
        title="Lucro"
        value="R$ 138 mil"
        change="+12%"
        icon={ChartColumn}
      />
    </section>
  );
}