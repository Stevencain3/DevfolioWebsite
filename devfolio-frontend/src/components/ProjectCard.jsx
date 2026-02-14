import React from "react";

const getImageSrc = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `http://localhost:8080${cleanPath}`;
};

export default function ProjectCard({ project, onClick }) {
  const imgPath = project.image_path || project.cover_image || project.thumbnail || "";
  const imgSrc = imgPath ? getImageSrc(imgPath) : null;

  return (
    <article 
      className="bg-olive-dark rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform transition-transform duration-200 cursor-pointer hover:scale-105"
      onClick={() => onClick(project)}
    >
      <div className="w-full bg-black/30 flex items-center justify-center h-44 sm:h-48 md:h-56 lg:h-48">
        {imgSrc ? (
          <img src={imgSrc} alt={project.title || "Project image"} className="w-full h-full object-cover" />
        ) : (
          <div className="text-beige text-lg font-bold">{project.title?.slice(0, 1) || "P"}</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg sm:text-xl font-bold text-beige truncate">{project.title}</h3>
        {project.short_description && <p className="mt-2 text-[#C9B7A5] text-sm line-clamp-3">{project.short_description}</p>}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-[#C9B7A5]">
            {Number(project.type) === 0 ? "Physical" : "Digital"}
            {project.is_published ? <span className="text-beige ml-2">[Published]</span> : <span className="ml-2">[Draft]</span>}
          </div>

          <div className="text-right">
            <a
              href={project.live_url || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-transparent border border-beige text-beige font-semibold py-1 px-3 rounded hover:bg-beige hover:text-olive-dark transition-colors text-sm"
            >
              Live
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
