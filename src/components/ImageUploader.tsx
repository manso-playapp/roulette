import React, { useRef, useState } from "react";
import { Upload, X, AlertCircle, Check } from "lucide-react";
import { useFirebaseStorage } from "../hooks/useFirebaseStorage";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  path?: string;
  className?: string;  
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImageUrl,
  path = "hero-images",
  className = "",
  acceptedTypes = "image/*",
  maxSizeMB = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  
  const { uploadImage } = useFirebaseStorage();

  const handleFileSelect = (file: File) => {
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const downloadURL = await uploadImage(
        file, 
        path, 
        (progress) => setUploadProgress(progress),
        acceptedTypes
      );

      URL.revokeObjectURL(previewUrl);
      setPreview(downloadURL);
      onImageUploaded(downloadURL);
      
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo");
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const mediaFile = files.find(file => 
      acceptedTypes.includes("image/*") ? file.type.startsWith("image/") :
      acceptedTypes.includes("video/*") ? file.type.startsWith("video/") :
      file.type.match(acceptedTypes)
    );
    
    if (mediaFile) {
      handleFileSelect(mediaFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreview(null);
    setError(null);
    onImageUploaded("");
  };

  const isVideo = acceptedTypes.includes("video/*");

  return (
    <div className={"w-full " + className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={"relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 " + 
          (dragOver 
            ? "border-purple-500 bg-purple-50" 
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          ) + " " + (uploading ? "pointer-events-none" : "")}
      >
        {preview && !uploading ? (
          <div className="relative">
            {isVideo ? (
              <video
                src={preview}
                className="max-h-48 mx-auto rounded-lg shadow-sm"
                controls
                muted
                onError={() => setPreview(null)}
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg shadow-sm"
                onError={() => setPreview(null)}
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="mt-3 text-sm text-gray-600">
              Click para cambiar {isVideo ? "el video" : "la imagen"}
            </div>
          </div>
        ) : (
          <div className="py-8">
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin mx-auto w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                <div className="text-sm text-gray-600">
                  Subiendo {isVideo ? "video" : "imagen"}... {uploadProgress}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: uploadProgress + "%" }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <Upload size={48} className="mx-auto" />
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-700">
                    Subir {isVideo ? "video" : "imagen"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Arrastra {isVideo ? "un video" : "una imagen"} aquí o haz click para seleccionar
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {isVideo ? "MP4, WebM, MOV" : "PNG, JPG, WEBP"} hasta {maxSizeMB}MB
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {preview && !uploading && !error && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
          <Check size={16} className="text-green-500 flex-shrink-0" />
          <span className="text-sm text-green-700">
            {isVideo ? "Video subido correctamente" : "Imagen subida correctamente"}
          </span>
        </div>
      )}
    </div>
  );
};
