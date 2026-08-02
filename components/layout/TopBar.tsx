import { Bell, Search, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h1 className="text-2xl font-bold text-slate-800">
        Dashboard
      </h1>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Pesquisar"
          className="text-slate-500 hover:text-slate-800"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Notificações"
          className="text-slate-500 hover:text-slate-800"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-slate-700" />

          <span className="font-medium text-slate-800">
            João
          </span>
        </div>
      </div>
    </header>
  );
}