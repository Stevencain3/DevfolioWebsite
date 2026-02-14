import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject, deleteProject, togglePublishProject, updateProject } from "../../store/slices/projectsSlice";
import { fetchImages, uploadImage, deleteImage } from "../../store/slices/mediaSlice";
import { signOut as signOutAction } from "../../store/slices/authSlice";
import ProjectForm from "../../components/ProjectForm";
import ProjectList from "../../components/ProjectList";
import ImageUploader from "../../components/ImageUploader";
import ImageList from "../../components/ImageList";
import MobileMenu from "../../components/MobileMenu";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((s) => s.auth.admin);

  // Redirect if not logged in
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  // Helper to map image_path to a full URL
  const getImageSrc = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:8080${cleanPath}`;
  };

  // ===== PROJECT LIST STATE (from Redux) =====
  const projects = useSelector((s) => s.projects.items || []);
  const loadingProjects = useSelector((s) => s.projects.status === "loading");

  // ===== IMAGE MANAGEMENT STATE =====
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const loadingImages = useSelector((s) => s.media.status === "loading");

  const handleSignOut = () => {
    dispatch(signOutAction());
    navigate("/admin/login");
  };

  // Load projects on mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      const firstId = projects[0].id;
      setSelectedProjectId(firstId);
      dispatch(fetchImages(firstId));
    }
  }, [projects, selectedProjectId, dispatch]);

  const handleCreateProject = async (payload) => {
    try {
      const result = await dispatch(createProject(payload)).unwrap();
      alert("Project created with id: " + (result.id || "(created)"));
      // refresh projects
      dispatch(fetchProjects());
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Error creating project. Check console.");
    }
  };

  const handleUpdateProject = async (projectId, payload) => {
    try {
      await dispatch(updateProject({ projectId, payload })).unwrap();
      dispatch(fetchProjects());
      setEditingProject(null);
      alert("Project updated successfully!");
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Error updating project. Check console.");
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project and all its images?")) return;

    try {
      await dispatch(deleteProject(projectId)).unwrap();
      dispatch(fetchProjects());
      // If this was the selected project, clear selection
      if (selectedProjectId === projectId) {
        setSelectedProjectId("");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project. Check console.");
    }
  };

  const handleTogglePublish = async (projectId, is_published) => {
    try {
      await dispatch(togglePublishProject({ projectId, is_published })).unwrap();
    } catch (err) {
      console.error("Error toggling publish status:", err);
      alert("Error updating publish status. Check console.");
    }
  };

  // ===== IMAGE FUNCTIONS =====
  const loadImages = (projectId) => {
    if (!projectId) return;
    dispatch(fetchImages(projectId));
  };

  const handleChangeSelectedProject = (e) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    if (id) {
      loadImages(id);
    }
  };

  const handleAddImage = async (e) => {
    // kept for compatibility but not used; replaced by handleAddImageWithFile
  };

  const handleAddImageWithFile = async (payload) => {
    if (!selectedProjectId) {
      alert("Select a project first.");
      return;
    }

    const { file, url, caption, sortOrder } = payload || {};
    if (!file && !url) {
      alert("Provide a file or a URL for the image.");
      return;
    }

    try {
      await dispatch(uploadImage({ projectId: selectedProjectId, file, url, caption, sortOrder })).unwrap();
      await dispatch(fetchImages(selectedProjectId));
    } catch (err) {
      console.error("Error uploading project image:", err);
      alert("Error uploading image. Check console.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await dispatch(deleteImage(imageId)).unwrap();
      await dispatch(fetchImages(selectedProjectId));
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Error deleting image. Check console.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-olive text-white">
      <MobileMenu alwaysVisible items={[{ label: "BACK HOME", path: "/" }, { label: "VIEW PROJECTS", path: "/projects" }, { label: "LOGOUT", path: "/admin" }]} />
      <div className="max-w-[1200px] mx-auto p-8">
        {/* Admin header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-black">DEVFOLIO</h1>
            <p className="text-beige mt-1">Admin Dashboard</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-[#C9B7A5]">Logged in as</div>
            <div className="font-bold text-beige">{admin?.username}</div>
            <button onClick={handleSignOut} className="mt-3 bg-beige text-olive-dark py-2 px-4 rounded font-bold">Sign Out</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CREATE/EDIT PROJECT */}
          <ProjectForm 
            onCreate={handleCreateProject} 
            onUpdate={handleUpdateProject}
            editingProject={editingProject}
            onCancelEdit={handleCancelEdit}
          />

          {/* PROJECT LIST + IMAGES */}
          <section className="space-y-6">
            <ProjectList 
              projects={projects} 
              onReload={() => dispatch(fetchProjects())} 
              onDelete={handleDeleteProject} 
              onTogglePublish={handleTogglePublish}
              onEdit={handleEditProject}
            />

            <ImageUploader
              projects={projects}
              selectedProjectId={selectedProjectId}
              onChangeSelectedProject={handleChangeSelectedProject}
              onUpload={handleAddImageWithFile}
            />

            <ImageList images={useSelector((s) => s.media.byProject[selectedProjectId] || [])} getImageSrc={getImageSrc} onDelete={handleDeleteImage} loading={loadingImages} selectedProjectId={selectedProjectId} />
          </section>
        </div>
      </div>
    </div>
  );
}
