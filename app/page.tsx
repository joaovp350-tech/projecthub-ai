import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen p-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-3 text-slate-600">
          Bem-vindo ao ProjectHub AI.
        </p>
      </main>
    </div>
  );
}