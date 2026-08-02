const projects = [
  {
    name: "Residencial Oliveira",
    progress: 72,
  },
  {
    name: "Edifício Central",
    progress: 48,
  },
  {
    name: "Condomínio Jardim",
    progress: 91,
  },
  {
    name: "Centro Empresarial Alpha",
    progress: 35,
  },
];

export default function RecentProjects() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">
        Obras Recentes
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Acompanhe o progresso das obras.
      </p>

      <div className="mt-6 space-y-6">
        {projects.map((project) => (
          <div key={project.name}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-slate-700">
                {project.name}
              </span>

              <span className="font-semibold text-blue-600">
                {project.progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-700"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}