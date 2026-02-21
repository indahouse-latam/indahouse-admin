'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Loader2, Upload } from 'lucide-react';
import { DragDropUpload } from '@/components/DragDropUpload';
import type { PropertyFeedMedia, MediaType } from '../types/property-feed.types';

interface SortableMediaItemProps {
  media: PropertyFeedMedia;
  onDelete: (mediaId: string) => void;
  isDeleting: boolean;
}

function SortableMediaItem({ media, onDelete, isDeleting }: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: media.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const urlLower = media.fileUrl?.toLowerCase() || '';
  const isVideo = urlLower.endsWith('.mp4') ||
                  urlLower.endsWith('mp4') ||
                  urlLower.includes('.mp4') ||
                  urlLower.includes('/video/') ||
                  urlLower.includes('video');

  const isDocument = media.mediaType === 'DOCUMENT' || media.mediaType === 'PDF' || urlLower.endsWith('.pdf');

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.currentTime = 1;
    console.log('Video loaded:', media.fileUrl);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-video bg-secondary/30 rounded-lg overflow-hidden border border-border group"
    >
      {isDocument ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/10">
          <svg className="w-16 h-16 text-red-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H11V9H16V20H6Z" />
          </svg>
          <span className="text-xs text-red-500 font-bold">PDF</span>
          <span className="text-xs text-muted-foreground mt-1 px-2 text-center truncate w-full">
            {media.fileName}
          </span>
        </div>
      ) : isVideo ? (
        <video
          src={media.fileUrl}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={handleVideoLoad}
          onMouseEnter={(e) => {
            const video = e.currentTarget;
            video.currentTime = 0;
            video.play();
          }}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 1;
          }}
          onError={(e) => {
            console.error('Error loading video:', media.fileUrl);
          }}
        >
          <source src={media.fileUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={media.fileUrl}
          alt="Property media"
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(media.id)}
          disabled={isDeleting}
          className="p-2 bg-white/20 rounded-full hover:bg-red-500 transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <X className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
        {media.displayOrder}
      </span>
      {isVideo && (
        <span className="absolute top-2 right-2 text-xs text-white bg-black/70 px-2 py-1 rounded">
          VIDEO
        </span>
      )}
      {isDocument && (
        <span className="absolute top-2 right-2 text-xs text-white bg-red-500/90 px-2 py-1 rounded">
          PDF
        </span>
      )}
    </div>
  );
}

interface MediaGalleryManagerProps {
  media: PropertyFeedMedia[];
  onUpload: (files: File[], mediaType: MediaType, fileName?: string) => void;
  onDelete: (mediaId: string) => void;
  onReorder: (reorderedMedia: PropertyFeedMedia[]) => void;
  isUploading: boolean;
  isDeleting: boolean;
  mediaType?: MediaType;
}

export function MediaGalleryManager({
  media,
  onUpload,
  onDelete,
  onReorder,
  isUploading,
  isDeleting,
  mediaType
}: MediaGalleryManagerProps) {
  const [localMedia, setLocalMedia] = useState(media);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [documentName, setDocumentName] = useState('');
  const [wasUploading, setWasUploading] = useState(false);

  useEffect(() => {
    setLocalMedia(media);
  }, [media]);

  useEffect(() => {
    // Limpiar pendingFiles cuando termine la subida
    if (wasUploading && !isUploading) {
      setPendingFiles([]);
      setDocumentName('');
    }
    setWasUploading(isUploading);
  }, [isUploading]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localMedia.findIndex((m) => m.id === active.id);
      const newIndex = localMedia.findIndex((m) => m.id === over.id);

      const reordered = arrayMove(localMedia, oldIndex, newIndex).map((m, idx) => ({
        ...m,
        displayOrder: idx + 1
      }));

      setLocalMedia(reordered);
      onReorder(reordered);
    }
  };

  const handleFilesDrop = (files: File[]) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Para PDFs/Documentos, solo permitir 1 archivo
    const filesToProcess = (mediaType === 'PDF' || mediaType === 'DOCUMENT') ? files.slice(0, 1) : files;

    filesToProcess.forEach(file => {
      // Validar tamaño
      if (file.size > MAX_SIZE) {
        invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB - máximo 10MB)`);
        return;
      }

      // Validar tipo de archivo según mediaType
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (mediaType === 'PDF' || mediaType === 'DOCUMENT') {
        if (!isPDF) {
          invalidFiles.push(`${file.name} - Solo se permiten archivos PDF en esta sección`);
          return;
        }
      } else if (mediaType === 'IMAGE') {
        if (!isImage) {
          invalidFiles.push(`${file.name} - Solo se permiten imágenes en esta sección`);
          return;
        }
      } else if (mediaType === 'VIDEO') {
        if (!isVideo) {
          invalidFiles.push(`${file.name} - Solo se permiten videos en esta sección`);
          return;
        }
      } else if (!mediaType) {
        if (!isImage && !isVideo) {
          invalidFiles.push(`${file.name} - Solo se permiten imágenes o videos en esta sección`);
          return;
        }
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      alert(`Los siguientes archivos no son válidos:\n\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      // Para PDFs/Documentos, guardar en pendingFiles y mostrar formulario
      if (mediaType === 'PDF' || mediaType === 'DOCUMENT') {
        setPendingFiles(validFiles);
        setDocumentName('');
        return;
      }

      // Para imágenes y videos, subir directamente
      let detectedMediaType: MediaType = 'IMAGE';

      if (!mediaType) {
        const firstFile = validFiles[0];
        detectedMediaType = firstFile.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
      } else if (mediaType === 'IMAGE') {
        const firstFile = validFiles[0];
        detectedMediaType = firstFile.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
      } else {
        detectedMediaType = mediaType;
      }

      onUpload(validFiles, detectedMediaType);
    }
  };

  const handleUploadDocument = () => {
    if (!documentName.trim()) {
      alert('Por favor ingresa un nombre para el documento');
      return;
    }

    if (pendingFiles.length > 0) {
      onUpload(pendingFiles, mediaType ?? 'DOCUMENT', documentName.trim());
      setPendingFiles([]);
      setDocumentName('');
    }
  };

  const handleCancelDocument = () => {
    setPendingFiles([]);
    setDocumentName('');
  };

  const getAcceptedFileTypes = (): Record<string, string[]> => {
    if (mediaType === 'PDF' || mediaType === 'DOCUMENT') {
      return {
        'application/pdf': ['.pdf']
      };
    }
    if (mediaType === 'IMAGE') {
      return {
        'image/*': ['.jpeg', '.jpg', '.png']
      };
    }
    if (mediaType === 'VIDEO') {
      return {
        'video/mp4': ['.mp4']
      };
    }
    // Por defecto (ej. portada), aceptar imágenes y videos
    return {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/mp4': ['.mp4']
    };
  };

  const getUploadTitle = () => {
    if (isUploading) return "Subiendo...";
    if (mediaType === 'PDF' || mediaType === 'DOCUMENT') return "Arrastra archivos PDF aquí";
    if (mediaType === 'IMAGE') return "Arrastra imágenes aquí";
    if (mediaType === 'VIDEO') return "Arrastra videos aquí";
    return "Arrastra imágenes o videos aquí";
  };

  const getFileTypeDescription = () => {
    if (mediaType === 'PDF' || mediaType === 'DOCUMENT') return "(.pdf - máx 10MB)";
    if (mediaType === 'IMAGE') return "(.jpg, .png - máx 10MB)";
    if (mediaType === 'VIDEO') return "(.mp4 - máx 10MB)";
    return "(.jpg, .png, .mp4 - máx 10MB)";
  };

  return (
    <div className="space-y-4">
      {pendingFiles.length === 0 && (
        <DragDropUpload
          title={getUploadTitle()}
          onFilesDrop={handleFilesDrop}
          accept={getAcceptedFileTypes()}
          maxSize={10485760}
          fileTypeDescription={getFileTypeDescription()}
        />
      )}

      {pendingFiles.length > 0 && (
        <div className="p-6 bg-secondary/10 rounded-xl border-2 border-primary/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">Archivo seleccionado:</p>
              <p className="text-sm font-bold">{pendingFiles[0].name}</p>
              <p className="text-xs text-muted-foreground">
                {(pendingFiles[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nombre del documento <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Ej: Certificado de Tradición y Libertad"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancelDocument}
              className="flex-1 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleUploadDocument}
              disabled={!documentName.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subir Documento
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center gap-2 p-4 bg-secondary/20 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Subiendo multimedia...</span>
        </div>
      )}

      {localMedia.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={localMedia.map(m => m.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {localMedia.map((item) => (
                <SortableMediaItem
                  key={item.id}
                  media={item}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay multimedia en esta sección</p>
        </div>
      )}
    </div>
  );
}
