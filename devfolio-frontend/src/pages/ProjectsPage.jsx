import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/slices/projectsSlice";
import SideNav from "../components/SideNav";
import ProjectCard from "../components/ProjectCard";
import ProjectDetailModal from "../components/ProjectDetailModal";
import MobileMenu from "../components/MobileMenu";

const getImageSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `http://localhost:8080${cleanPath}`;
};

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.items || []);
  const loading = useSelector((s) => s.projects.status === "loading");
  const error = useSelector((s) => s.projects.error || "");
  const [filter, setFilter] = useState("all"); // "all", "digital", "physical"
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Filter projects - only show published projects
  const filteredProjects = projects.filter((p) => {
    // Hide drafts (unpublished projects)
    if (!p.is_published) return false;
    
    if (filter === "all") return true;
    if (filter === "digital") return Number(p.type) === 1;
    if (filter === "physical") return Number(p.type) === 0;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-olive text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-black leading-tight">Projects</h1>
          <p className="text-beige mt-2 text-sm sm:text-base">A curated list of my work — click to view details.</p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-[#C9B7A5]">{filteredProjects.length} projects</div>
          <div className="flex items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter("all")}
                className={`py-2 px-4 rounded font-bold transition-colors ${
                  filter === "all" 
                    ? "bg-beige text-olive-dark" 
                    : "bg-olive-dark text-beige border border-beige hover:bg-beige hover:text-olive-dark"
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("digital")}
                className={`py-2 px-4 rounded font-bold transition-colors ${
                  filter === "digital" 
                    ? "bg-beige text-olive-dark" 
                    : "bg-olive-dark text-beige border border-beige hover:bg-beige hover:text-olive-dark"
                }`}
              >
                Digital
              </button>
              <button 
                onClick={() => setFilter("physical")}
                className={`py-2 px-4 rounded font-bold transition-colors ${
                  filter === "physical" 
                    ? "bg-beige text-olive-dark" 
                    : "bg-olive-dark text-beige border border-beige hover:bg-beige hover:text-olive-dark"
                }`}
              >
                Physical
              </button>
            </div>
            <button onClick={() => dispatch(fetchProjects())} className="bg-beige text-olive-dark py-2 px-4 rounded font-bold">Reload</button>
          </div>
        </div>

        {loading && <p className="text-sm text-[#C9B7A5]">Loading projects...</p>}
        {error && <div className="text-red-400 mb-4">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={setSelectedProject} />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* Mobile hamburger menu for small screens */}
      <MobileMenu
        items={[
          { label: "BACK HOME", path: "/" },
          { label: "ABOUT ME", path: "/about" },
          { label: "LET'S CHAT", path: "/contact" },
        ]} alwaysVisible={true}
      />

      {/* SIDE NAV COMPONENT WITH CUSTOM ITEMS
      <SideNav
        items={[
          { label: "BACK HOME", path: "/" },
          { label: "ABOUT ME", path: "/about" },
          { label: "LET'S CHAT", path: "/contact" },
        ]}
      /> */}
    </div>
  );
}
