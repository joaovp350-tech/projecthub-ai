import { LucideIcon, TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-100 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
          <TrendingUp className="h-4 w-4" />
          {change}
        </div>
      </div>

      <h3 className="mt-6 text-3xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {title}
      </p>
    </div>
  );
}