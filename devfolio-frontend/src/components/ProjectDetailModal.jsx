import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchImages } from "../store/slices/mediaSlice";

const getImageSrc = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `http://localhost:8080${cleanPath}`;
};

export default function ProjectDetailModal({ project, onClose }) {
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = useSelector((s) => s.media.byProject[project?.id] || []);

  useEffect(() => {
    if (project?.id) {
      dispatch(fetchImages(project.id));
    }
  }, [project?.id, dispatch]);

  if (!project) return null;

  const tags = project.tags ? project.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-olive-dark rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="sticky top-0 bg-olive-dark border-b border-beige/20 p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-beige">{project.title}</h2>
          <button 
            onClick={onClose}
            className="text-beige hover:text-white text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Badge */}
          <div className="flex items-center gap-3">
            <span className="bg-beige text-olive-dark px-4 py-1 rounded-full font-bold text-sm">
              {Number(project.type) === 0 ? "Physical Project" : "Digital Project"}
            </span>
          </div>

          {/* Image Carousel */}
          {hasImages && (
            <div className="relative bg-black/30 rounded-lg overflow-hidden">
              <div className="aspect-video flex items-center justify-center">
                <img 
                  src={getImageSrc(images[currentImageIndex].image_path)} 
                  alt={images[currentImageIndex].caption || `Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image Caption */}
              {images[currentImageIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-beige p-3 text-sm">
                  {images[currentImageIndex].caption}
                </div>
              )}

              {/* Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  >
                    ›
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Long Description */}
          {project.long_description && (
            <div>
              <h3 className="text-xl font-bold text-beige mb-2">About This Project</h3>
              <p className="text-[#C9B7A5] whitespace-pre-wrap leading-relaxed">{project.long_description}</p>
            </div>
          )}

          {/* Project Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-beige mb-3">Project Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-black/40 border border-beige/30 text-beige px-4 py-2 rounded font-semibold text-sm uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.github_url || project.live_url) && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-beige/20">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-transparent border-2 border-beige text-beige font-bold py-3 px-6 rounded hover:bg-beige hover:text-olive-dark transition-colors"
                >
                  View on GitHub
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-beige text-olive-dark font-bold py-3 px-6 rounded hover:bg-beige/90 transition-colors"
                >
                  View Live Project
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
