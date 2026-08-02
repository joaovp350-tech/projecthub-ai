"use client";

import AppButton from "@/components/ui/AppButton";

type ConfirmDialogProps = {
  aberto: boolean;
  titulo?: string;
  descricao?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ConfirmDialog({
  aberto,
  titulo = "Confirmar ação",
  descricao = "Tem certeza de que deseja continuar?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  carregando = false,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2
          id="confirm-dialog-title"
          className="text-xl font-bold text-slate-800"
        >
          {titulo}
        </h2>

        <p className="mt-3 text-slate-600">
          {descricao}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <AppButton
            type="button"
            variant="secondary"
            onClick={onCancelar}
            disabled={carregando}
          >
            {textoCancelar}
          </AppButton>

          <AppButton
            type="button"
            variant="danger"
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? "Aguarde..." : textoConfirmar}
          </AppButton>
        </div>
      </div>
    </div>
  );
}