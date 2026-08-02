"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DashboardStats = {
  obras: number;
  clientes: number;
  funcionarios: number;
  materiais: number;
};

export default function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    obras: 0,
    clientes: 0,
    funcionarios: 0,
    materiais: 0,
  });

  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const [
      obras,
      clientes,
      funcionarios,
      materiais,
    ] = await Promise.all([
      supabase.from("obras").select("*", { count: "exact", head: true }),
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase.from("funcionarios").select("*", { count: "exact", head: true }),
      supabase.from("materiais").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      obras: obras.count ?? 0,
      clientes: clientes.count ?? 0,
      funcionarios: funcionarios.count ?? 0,
      materiais: materiais.count ?? 0,
    });

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  return {
    stats,
    loading,
    recarregar: carregar,
  };
}