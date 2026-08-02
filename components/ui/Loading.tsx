type LoadingProps = {
  text?: string;
};

export default function Loading({
  text = "Carregando...",
}: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        <p className="text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}