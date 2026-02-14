import React from "react";

export default function ProjectList({ projects = [], onReload, onDelete, onTogglePublish, onEdit }) {
  return (
    <div className="bg-olive-dark p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-beige">Projects in Database</h2>
        <button onClick={onReload} className="bg-beige text-olive-dark py-2 px-4 rounded font-bold">Reload</button>
      </div>

      {!projects || projects.length === 0 ? (
        <p>No projects found yet.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="border-l-4 border-beige p-3 bg-black/20 rounded">
              <div className="flex items-baseline justify-between">
                <strong className="text-xl">{p.title}</strong>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-[#C9B7A5]">{Number(p.type) === 0 ? "Physical" : "Digital"}</div>
                  <button
                    onClick={() => onEdit(p)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded font-bold text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onTogglePublish(p.id, !p.is_published)}
                    className={`py-1 px-3 rounded font-bold text-sm transition-colors ${
                      p.is_published
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </button>
                  <button 
                    onClick={() => onDelete(p.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded font-bold text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {p.short_description && <p className="mt-2 text-[#C9B7A5]">{p.short_description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
