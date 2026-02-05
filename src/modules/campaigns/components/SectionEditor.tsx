'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { MediaGalleryManager } from './MediaGalleryManager';
import { usePropertyFeedEditor } from '../hooks/usePropertyFeedEditor';
import type { PropertyFeedContent, PropertyFeedSection, MediaType } from '../types/property-feed.types';

interface SectionEditorProps {
  section: PropertyFeedSection;
  content: PropertyFeedContent;
  propertyId: string;
  onUpdate?: () => void;
}

export function SectionEditor({ section, content, propertyId, onUpdate }: SectionEditorProps) {
  const [localMedia, setLocalMedia] = useState(content.media);
  const {
    uploadMedia,
    isUploading,
    deleteMedia,
    isDeleting,
    updateSection,
    reorderMedia,
    isReordering
  } = usePropertyFeedEditor(propertyId);

  useEffect(() => {
    setLocalMedia(content.media);
  }, [content.media]);

  const getMediaTypeFromSectionKey = (sectionKey: string): MediaType => {
    const sectionKeyLower = sectionKey.toLowerCase();

    if (sectionKeyLower.includes('document')) {
      return 'PDF';
    }
    if (sectionKeyLower.includes('video')) {
      return 'VIDEO';
    }
    return 'IMAGE';
  };

  const handleUpload = (files: File[], mediaType: MediaType, fileName?: string) => {
    uploadMedia(
      { files, mediaType, sectionKey: section.sectionKey, fileName },
      {
        onSuccess: () => {
          onUpdate?.();
        }
      }
    );
  };

  const handleDelete = (mediaId: string) => {
    deleteMedia(mediaId, {
      onSuccess: () => {
        onUpdate?.();
      }
    });
  };

  const handleReorder = (reorderedMedia: typeof localMedia) => {
    setLocalMedia(reorderedMedia);

    const mediaOrder = reorderedMedia.map((m) => ({
      id: m.id,
      displayOrder: m.displayOrder
    }));

    reorderMedia(mediaOrder, {
      onSuccess: () => {
        onUpdate?.();
      }
    });
  };

  const handleTogglePublish = () => {
    updateSection(
      {
        sectionKey: section.sectionKey,
        payload: { isPublished: content.isPublished === 1 ? 0 : 1 }
      },
      {
        onSuccess: () => {
          onUpdate?.();
        }
      }
    );
  };

  return (
    <div className="space-y-4 p-6 bg-secondary/5 rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold">{section.sectionName}</h4>
          <p className="text-xs text-muted-foreground">
            {content.media.length} multimedia item{content.media.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={handleTogglePublish}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            content.isPublished === 1
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-secondary text-muted-foreground border border-border'
          }`}
        >
          {content.isPublished === 1 ? (
            <>
              <Eye className="w-4 h-4" />
              Publicado
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              No Publicado
            </>
          )}
        </button>
      </div>

      <MediaGalleryManager
        media={localMedia}
        onUpload={handleUpload}
        onDelete={handleDelete}
        onReorder={handleReorder}
        isUploading={isUploading}
        isDeleting={isDeleting}
        mediaType={getMediaTypeFromSectionKey(section.sectionKey)}
      />
    </div>
  );
}
