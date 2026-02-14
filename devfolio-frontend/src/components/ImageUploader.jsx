import React, { useState } from "react";

export default function ImageUploader({ projects = [], selectedProjectId, onChangeSelectedProject, onUpload }) {
  const [mode, setMode] = useState("file"); // 'file' or 'url'
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageSortOrder, setImageSortOrder] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return alert("Select a project first.");
    if (mode === "file" && !imageFile) return alert("Choose an image file first.");
    if (mode === "url" && !imageUrl) return alert("Enter an image URL first.");

    if (onUpload) {
      const payload = {
        file: mode === "file" ? imageFile : null,
        url: mode === "url" ? imageUrl : null,
        caption: imageCaption,
        sortOrder: imageSortOrder,
      };
      await onUpload(payload);
      setImageFile(null);
      setImageUrl("");
      setImageCaption("");
      setImageSortOrder(0);
    }
  };

  return (
    <div className="bg-olive-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-beige mb-4">Project Images</h2>

      <label className="block mb-3">Select Project</label>
      <select className="w-full mb-4 p-2 rounded text-black" value={selectedProjectId} onChange={onChangeSelectedProject}>
        <option value="">-- choose a project --</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Upload Mode</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2"><input type="radio" checked={mode==="file"} onChange={() => setMode("file")} /> File</label>
            <label className="flex items-center gap-2"><input type="radio" checked={mode==="url"} onChange={() => setMode("url")} /> URL</label>
          </div>

          {mode === "file" ? (
            <div>
              <label className="block mb-1">Image File</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)} className="w-full" />
            </div>
          ) : (
            <div>
              <label className="block mb-1">Image URL</label>
              <input className="w-full p-2 rounded text-black" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1">Caption</label>
          <input className="w-full p-2 rounded text-black" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1">Sort Order</label>
          <input type="number" className="w-full p-2 rounded text-black" value={imageSortOrder} onChange={(e) => setImageSortOrder(e.target.value)} />
        </div>

        <div>
          <button type="submit" disabled={!selectedProjectId} className="bg-beige text-olive-dark py-2 px-4 rounded font-bold">Upload Image</button>
        </div>
      </form>
    </div>
  );
}
