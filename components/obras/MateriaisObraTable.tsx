"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Loading from "@/components/ui/Loading";
import SearchInput from "@/components/ui/SearchInput";

type Props = {
  obraId: number;
};

type Material = {
  id: number;
  nome: string;
  unidade: string | null;
  preco: number | null;
  estoque: number | null;
};

type MaterialVinculado = {
  id: number;
  obra_id: number;
  material_id: number;
  quantidade: number;
  preco_unitario: number;
  created_at: string;
  materiais:
    | {
        id: number;
        nome: string;
        unidade: string | null;
      }
    | {
        id: number;
        nome: string;
        unidade: string | null;
      }[]
    | null;
};

type FormData = {
  materialId: string;
  quantidade: string;
  precoUnitario: string;
};

const initialForm: FormData = {
  materialId: "",
  quantidade: "",
  precoUnitario: "",
};

function converterNumero(valor: string) {
  if (!valor.trim()) return 0;

  const numero = Number(
    valor
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );

  return numero;
}

function obterMaterial(
  relacionamento: MaterialVinculado
) {
  if (Array.isArray(relacionamento.materiais)) {
    return relacionamento.materiais[0] ?? null;
  }

  return relacionamento.materiais;
}

export default function MateriaisObraTable({
  obraId,
}: Props) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [materiaisVinculados, setMateriaisVinculados] =
    useState<MaterialVinculado[]>([]);

  const [form, setForm] = useState<FormData>(initialForm);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const [
    materialParaExcluir,
    setMaterialParaExcluir,
  ] = useState<MaterialVinculado | null>(null);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    const [
      materiaisResponse,
      vinculadosResponse,
    ] = await Promise.all([
      supabase
        .from("materiais")
        .select("id, nome, unidade, preco, estoque")
        .order("nome", { ascending: true }),

      supabase
        .from("obra_materiais")
        .select(
          `
            id,
            obra_id,
            material_id,
            quantidade,
            preco_unitario,
            created_at,
            materiais (
              id,
              nome,
              unidade
            )
          `
        )
        .eq("obra_id", obraId)
        .order("id", { ascending: false }),
    ]);

    const primeiroErro =
      materiaisResponse.error ||
      vinculadosResponse.error;

    if (primeiroErro) {
      console.error(primeiroErro);

      setErro(
        `Não foi possível carregar os materiais: ${primeiroErro.message}`
      );

      setCarregando(false);
      return;
    }

    setMateriais(materiaisResponse.data ?? []);

    setMateriaisVinculados(
      (vinculadosResponse.data ??
        []) as MaterialVinculado[]
    );

    setCarregando(false);
  }

  useEffect(() => {
    carregarDados();
  }, [obraId]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((formAtual) => ({
      ...formAtual,
      [name]: value,
    }));
  }

  function selecionarMaterial(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const materialId = event.target.value;

    const materialSelecionado = materiais.find(
      (material) =>
        material.id === Number(materialId)
    );

    setForm((formAtual) => ({
      ...formAtual,
      materialId,
      precoUnitario:
        materialSelecionado?.preco !== null &&
        materialSelecionado?.preco !== undefined
          ? String(materialSelecionado.preco).replace(
              ".",
              ","
            )
          : "",
    }));
  }

  async function adicionarMaterial(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErro("");

    if (!form.materialId) {
      setErro("Selecione um material.");
      return;
    }

    const quantidade = converterNumero(form.quantidade);
    const precoUnitario = converterNumero(
      form.precoUnitario
    );

    if (
      Number.isNaN(quantidade) ||
      quantidade <= 0
    ) {
      setErro(
        "Informe uma quantidade maior que zero."
      );
      return;
    }

    if (
      Number.isNaN(precoUnitario) ||
      precoUnitario < 0
    ) {
      setErro("Informe um preço válido.");
      return;
    }

    const materialJaVinculado =
      materiaisVinculados.some(
        (item) =>
          item.material_id === Number(form.materialId)
      );

    if (materialJaVinculado) {
      setErro(
        "Este material já está vinculado à obra."
      );
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("obra_materiais")
      .insert({
        obra_id: obraId,
        material_id: Number(form.materialId),
        quantidade,
        preco_unitario: precoUnitario,
      });

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível adicionar o material: ${error.message}`
      );

      setSalvando(false);
      return;
    }

    setForm(initialForm);
    setSalvando(false);

    await carregarDados();
  }

  async function confirmarExclusao() {
    if (!materialParaExcluir) return;

    setExcluindo(true);
    setErro("");

    const { error } = await supabase
      .from("obra_materiais")
      .delete()
      .eq("id", materialParaExcluir.id);

    if (error) {
      console.error(error);

      setErro(
        `Não foi possível remover o material: ${error.message}`
      );

      setExcluindo(false);
      setMaterialParaExcluir(null);
      return;
    }

    setMaterialParaExcluir(null);
    setExcluindo(false);

    await carregarDados();
  }

  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return materiaisVinculados;

    return materiaisVinculados.filter(
      (relacionamento) => {
        const material = obterMaterial(relacionamento);

        return material?.nome
          .toLowerCase()
          .includes(termo);
      }
    );
  }, [busca, materiaisVinculados]);

  const custoTotal = materiaisVinculados.reduce(
    (total, material) =>
      total +
      Number(material.quantidade ?? 0) *
        Number(material.preco_unitario ?? 0),
    0
  );

  if (carregando) {
    return (
      <Loading text="Carregando materiais da obra..." />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Adicionar material
        </h2>

        <form
          onSubmit={adicionarMaterial}
          className="mt-6 grid gap-4 md:grid-cols-4"
        >
          <div>
            <label
              htmlFor="materialId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Material *
            </label>

            <select
              id="materialId"
              name="materialId"
              value={form.materialId}
              onChange={selecionarMaterial}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            >
              <option value="">
                Selecione um material
              </option>

              {materiais.map((material) => (
                <option
                  key={material.id}
                  value={material.id}
                >
                  {material.nome}
                  {material.unidade
                    ? ` — ${material.unidade}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quantidade"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Quantidade *
            </label>

            <input
              id="quantidade"
              name="quantidade"
              inputMode="decimal"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="Exemplo: 20"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="precoUnitario"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Preço unitário
            </label>

            <input
              id="precoUnitario"
              name="precoUnitario"
              inputMode="decimal"
              value={form.precoUnitario}
              onChange={handleChange}
              placeholder="Exemplo: 42,90"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={salvando}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {salvando
                ? "Adicionando..."
                : "Adicionar Material"}
            </button>
          </div>
        </form>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Materiais vinculados
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {materiaisVinculados.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Custo total dos materiais
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {custoTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          placeholder="Buscar material desta obra..."
          value={busca}
          onChange={(event) =>
            setBusca(event.target.value)
          }
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Material
              </th>

              <th className="p-4 text-left">
                Unidade
              </th>

              <th className="p-4 text-right">
                Quantidade
              </th>

              <th className="p-4 text-right">
                Preço unitário
              </th>

              <th className="p-4 text-right">
                Total
              </th>

              <th className="p-4 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {materiaisFiltrados.map(
              (relacionamento) => {
                const material = obterMaterial(
                  relacionamento
                );

                const total =
                  Number(
                    relacionamento.quantidade ?? 0
                  ) *
                  Number(
                    relacionamento.preco_unitario ?? 0
                  );

                return (
                  <tr
                    key={relacionamento.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {material?.nome ||
                        "Material não encontrado"}
                    </td>

                    <td className="p-4">
                      {material?.unidade || "—"}
                    </td>

                    <td className="p-4 text-right">
                      {Number(
                        relacionamento.quantidade
                      ).toLocaleString("pt-BR")}
                    </td>

                    <td className="p-4 text-right">
                      {Number(
                        relacionamento.preco_unitario
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>

                    <td className="p-4 text-right font-semibold">
                      {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setMaterialParaExcluir(
                            relacionamento
                          )
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
                        aria-label={`Remover ${
                          material?.nome || "material"
                        }`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              }
            )}

            {materiaisFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-slate-500"
                >
                  {busca
                    ? "Nenhum material encontrado."
                    : "Nenhum material vinculado a esta obra."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        aberto={materialParaExcluir !== null}
        titulo="Remover material"
        descricao={
          materialParaExcluir
            ? `Deseja remover “${
                obterMaterial(materialParaExcluir)
                  ?.nome || "este material"
              }” desta obra?`
            : ""
        }
        textoConfirmar="Remover"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => {
          if (!excluindo) {
            setMaterialParaExcluir(null);
          }
        }}
      />
    </div>
  );
}