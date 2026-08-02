import type { ReactNode } from "react";

type FormSectionProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3;
};

export default function FormSection({
  children,
  columns = 2,
}: FormSectionProps) {
  const grid =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "grid-cols-3"
      : "md:grid-cols-2";

  return (
    <div className={`grid gap-6 ${grid}`}>
      {children}
    </div>
  );
}