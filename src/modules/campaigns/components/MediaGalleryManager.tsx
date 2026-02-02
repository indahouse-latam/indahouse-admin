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
      {isVideo ? (
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
    </div>
  );
}

interface MediaGalleryManagerProps {
  media: PropertyFeedMedia[];
  onUpload: (files: File[], mediaType: MediaType) => void;
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
  mediaType = 'IMAGE'
}: MediaGalleryManagerProps) {
  const [localMedia, setLocalMedia] = useState(media);

  useEffect(() => {
    setLocalMedia(media);
  }, [media]);

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

    files.forEach(file => {
      if (file.type.startsWith('video/') && file.size > MAX_SIZE) {
        invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB - máximo 10MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Los siguientes archivos exceden el límite de 10MB:\n\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      // Detectar automáticamente el tipo de medio del primer archivo
      const detectedMediaType: MediaType = validFiles[0].type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
      onUpload(validFiles, detectedMediaType);
    }
  };

  return (
    <div className="space-y-4">
      <DragDropUpload
        title={isUploading ? "Subiendo..." : "Arrastra imágenes o videos aquí"}
        onFilesDrop={handleFilesDrop}
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png'],
          'video/mp4': ['.mp4']
        }}
        maxSize={10485760}
        fileTypeDescription="(.jpg, .png, .mp4 - máx 10MB)"
      />

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
