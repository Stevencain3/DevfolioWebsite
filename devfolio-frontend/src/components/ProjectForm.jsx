import React, { useState, useEffect } from "react";

export default function ProjectForm({ onCreate, onUpdate, editingProject, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [projectTags, setProjectTags] = useState([]);
  const [projectTagInput, setProjectTagInput] = useState("");
  const [toolsUsed, setToolsUsed] = useState([]);
  const [toolsUsedInput, setToolsUsedInput] = useState("");
  const [type, setType] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  // Load editing project data
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title || "");
      setShortDescription(editingProject.short_description || "");
      setLongDescription(editingProject.long_description || "");
      setGithubUrl(editingProject.github_url || "");
      setLiveUrl(editingProject.live_url || "");
      setType(editingProject.type || 0);
      setIsPublished(editingProject.is_published ? true : false);
      
      // Parse tags from comma-separated string
      const tagsStr = editingProject.tags || "";
      const allTags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);
      
      // Separate project tags and tools (you can customize this logic)
      // For now, just put all in projectTags
      setProjectTags(allTags);
      setToolsUsed([]);
    } else {
      // Reset form
      setTitle("");
      setShortDescription("");
      setLongDescription("");
      setGithubUrl("");
      setLiveUrl("");
      setProjectTags([]);
      setToolsUsed([]);
      setType(0);
      setIsPublished(true);
    }
  }, [editingProject]);

  const addProjectTag = () => {
    const tag = projectTagInput.trim().toUpperCase();
    if (tag && !projectTags.includes(tag) && projectTags.length < 10) {
      setProjectTags([...projectTags, tag]);
      setProjectTagInput("");
    }
  };

  const removeProjectTag = (tagToRemove) => {
    setProjectTags(projectTags.filter(t => t !== tagToRemove));
  };

  const addTool = () => {
    const tool = toolsUsedInput.trim().toUpperCase();
    if (tool && !toolsUsed.includes(tool) && toolsUsed.length < 10) {
      setToolsUsed([...toolsUsed, tool]);
      setToolsUsedInput("");
    }
  };

  const removeTool = (toolToRemove) => {
    setToolsUsed(toolsUsed.filter(t => t !== toolToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    // Combine project tags and tools into single comma-separated string
    const allTags = [...projectTags, ...toolsUsed].join(", ");

    const payload = {
      title,
      short_description: shortDescription,
      long_description: longDescription,
      github_url: githubUrl,
      live_url: liveUrl,
      tags: allTags,
      type: Number(type),
      is_published: isPublished ? 1 : 0,
    };

    if (editingProject) {
      if (onUpdate) onUpdate(editingProject.id, payload);
    } else {
      if (onCreate) onCreate(payload);
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <section className="bg-olive-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-beige mb-4">
        {editingProject ? "Edit Project" : "Create Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Project Title <span className="text-red-400">*</span></label>
          <input 
            className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            placeholder="Enter project title"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Short Description</label>
          <input 
            className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
            value={shortDescription} 
            onChange={(e) => setShortDescription(e.target.value)} 
            placeholder="Brief description for card view"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Long Description</label>
          <textarea 
            className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
            rows={5} 
            value={longDescription} 
            onChange={(e) => setLongDescription(e.target.value)} 
            placeholder="Detailed project description"
          />
        </div>

        {/* Project Tags */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Project Tags <span className="text-sm text-[#C9B7A5]">(up to 10)</span></label>
          <div className="flex gap-2 mb-2">
            <input 
              className="flex-1 p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
              value={projectTagInput} 
              onChange={(e) => setProjectTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addProjectTag();
                }
              }}
              placeholder="e.g., Machining, Electronics"
            />
            <button 
              type="button"
              onClick={addProjectTag}
              className="bg-beige text-olive-dark px-4 py-2 rounded font-bold hover:bg-beige/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectTags.map((tag) => (
              <span 
                key={tag}
                className="bg-black text-beige px-4 py-2 rounded font-semibold text-sm flex items-center gap-2"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => removeProjectTag(tag)}
                  className="text-beige hover:text-red-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Tools Used */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Tools Used <span className="text-sm text-[#C9B7A5]">(up to 10)</span></label>
          <div className="flex gap-2 mb-2">
            <input 
              className="flex-1 p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
              value={toolsUsedInput} 
              onChange={(e) => setToolsUsedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTool();
                }
              }}
              placeholder="e.g., VsCode, MySQL, Arduino"
            />
            <button 
              type="button"
              onClick={addTool}
              className="bg-beige text-olive-dark px-4 py-2 rounded font-bold hover:bg-beige/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {toolsUsed.map((tool) => (
              <span 
                key={tool}
                className="bg-black text-beige px-4 py-2 rounded font-semibold text-sm flex items-center gap-2"
              >
                {tool}
                <button 
                  type="button"
                  onClick={() => removeTool(tool)}
                  className="text-beige hover:text-red-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block mb-2 text-beige font-semibold">GitHub URL</label>
          <input 
            className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
            value={githubUrl} 
            onChange={(e) => setGithubUrl(e.target.value)} 
            placeholder="https://github.com/..."
          />
        </div>

        {/* Live URL */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Live URL</label>
          <input 
            className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
            value={liveUrl} 
            onChange={(e) => setLiveUrl(e.target.value)} 
            placeholder="https://..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-2 text-beige font-semibold">Project Type <span className="text-red-400">*</span></label>
          <select 
            className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value={0}>Physical</option>
            <option value={1}>Digital</option>
          </select>
        </div>

        {/* Published Checkbox */}
        <div>
          <label className="flex items-center gap-2 text-beige font-semibold cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="w-5 h-5 cursor-pointer"
            />
            Published
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button 
            type="submit"
            className="bg-beige text-olive-dark py-3 px-6 rounded font-bold hover:bg-beige/90 transition-colors"
          >
            {editingProject ? "Update Project" : "Create Project"}
          </button>
          {editingProject && (
            <button 
              type="button"
              onClick={handleCancel}
              className="bg-transparent border-2 border-beige text-beige py-3 px-6 rounded font-bold hover:bg-beige hover:text-olive-dark transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
