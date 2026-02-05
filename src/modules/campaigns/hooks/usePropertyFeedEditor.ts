import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyFeedService } from '../services/property-feed.service';
import type {
  MediaType,
  CreateSectionPayload,
  UpdateSectionPayload
} from '../types/property-feed.types';
import { toast } from 'sonner';

export function usePropertyFeedEditor(propertyId: string | null) {
  const queryClient = useQueryClient();

  const uploadMediaMutation = useMutation({
    mutationFn: ({
      files,
      mediaType,
      sectionKey,
      fileName
    }: {
      files: File[];
      mediaType: MediaType;
      sectionKey: string;
      fileName?: string;
    }) => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      return PropertyFeedService.uploadMedia(propertyId, files, mediaType, sectionKey, fileName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', propertyId] });
      toast.success('Multimedia subido exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al subir multimedia: ${error.message}`);
    }
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (mediaId: string) => {
      return PropertyFeedService.deleteMedia(mediaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', propertyId] });
      toast.success('Multimedia eliminado');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar multimedia: ${error.message}`);
    }
  });

  const createSectionMutation = useMutation({
    mutationFn: ({
      sectionKey,
      payload
    }: {
      sectionKey: string;
      payload?: CreateSectionPayload;
    }) => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      return PropertyFeedService.createSection(propertyId, sectionKey, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', propertyId] });
      toast.success('Sección creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear sección: ${error.message}`);
    }
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({
      sectionKey,
      payload
    }: {
      sectionKey: string;
      payload: UpdateSectionPayload;
    }) => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      return PropertyFeedService.updateSection(propertyId, sectionKey, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', propertyId] });
      toast.success('Sección actualizada');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar sección: ${error.message}`);
    }
  });

  const reorderMediaMutation = useMutation({
    mutationFn: (mediaOrder: { id: string; displayOrder: number }[]) => {
      return PropertyFeedService.reorderMedia(mediaOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', propertyId] });
    },
    onError: (error: Error) => {
      toast.error(`Error al reordenar: ${error.message}`);
    }
  });

  return {
    uploadMedia: uploadMediaMutation.mutate,
    isUploading: uploadMediaMutation.isPending,
    deleteMedia: deleteMediaMutation.mutate,
    isDeleting: deleteMediaMutation.isPending,
    createSection: createSectionMutation.mutate,
    isCreatingSection: createSectionMutation.isPending,
    updateSection: updateSectionMutation.mutate,
    isUpdatingSection: updateSectionMutation.isPending,
    reorderMedia: reorderMediaMutation.mutate,
    isReordering: reorderMediaMutation.isPending
  };
}
