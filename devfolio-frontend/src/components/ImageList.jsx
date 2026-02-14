import React from "react";

export default function ImageList({ images = [], getImageSrc, onDelete, loading, selectedProjectId }) {
  if (loading) return <p>Loading images...</p>;
  if (!selectedProjectId) return null;

  return (
    <div className="mt-6 space-y-4">
      {images.length === 0 && <p>No images for this project yet.</p>}

      {images.map((img) => (
        <div key={img.id} className="flex items-start gap-4 p-3 bg-black/20 rounded">
          <div>
            <img src={getImageSrc(img.image_path)} alt={img.caption || "Project image"} className="max-w-[160px] max-h-[120px] object-cover rounded" />
          </div>
          <div className="flex-1">
            <p className="text-beige"><strong>Path:</strong> {img.image_path}</p>
            {img.caption && <p className="text-[#C9B7A5]">Caption: {img.caption}</p>}
            <p className="text-sm text-[#C9B7A5]">Sort: {img.sort_order}</p>
          </div>
          <div>
            <button onClick={() => onDelete(img.id)} className="bg-red-600 text-white py-2 px-3 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
