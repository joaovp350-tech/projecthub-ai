import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopBar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}