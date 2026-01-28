import { fetchApi } from '@/utils/api';
import type {
  PropertyFeed,
  PropertyFeedSection,
  PropertyFeedContent,
  MediaType,
  CreateSectionPayload,
  UpdateSectionPayload
} from '../types/property-feed.types';

export class PropertyFeedService {
  static async getPropertyFeed(propertyId: string): Promise<PropertyFeed> {
    const response = await fetchApi(`/properties/${propertyId}/feed`);
    return response.data || response;
  }

  static async getAllSections(): Promise<PropertyFeedSection[]> {
    const response = await fetchApi('/feed/sections');
    return response.data || response;
  }

  static async createSection(
    propertyId: string,
    sectionKey: string,
    payload: CreateSectionPayload = {}
  ): Promise<PropertyFeedContent> {
    const response = await fetchApi(
      `/properties/${propertyId}/feed/sections/${sectionKey}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    );
    return response.data || response;
  }

  static async updateSection(
    propertyId: string,
    sectionKey: string,
    payload: UpdateSectionPayload
  ): Promise<PropertyFeedContent> {
    const response = await fetchApi(
      `/properties/${propertyId}/feed/sections/${sectionKey}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    );
    return response.data || response;
  }

  static async togglePublish(
    propertyId: string,
    sectionKey: string,
    isPublished: boolean
  ): Promise<PropertyFeedContent> {
    return this.updateSection(propertyId, sectionKey, { isPublished });
  }

  static async uploadMedia(
    propertyId: string,
    files: File[],
    mediaType: MediaType,
    sectionKey: string
  ): Promise<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('mediaType', mediaType);
    formData.append('sectionKey', sectionKey);

    const response = await fetchApi(
      `/properties/${propertyId}/feed/media`,
      {
        method: 'POST',
        body: formData
      }
    );

    return response.data || response;
  }

  static async deleteMedia(mediaId: string): Promise<void> {
    await fetchApi(`/feed/media/${mediaId}`, {
      method: 'DELETE'
    });
  }

  static async reorderMedia(
    mediaOrder: { id: string; displayOrder: number }[]
  ): Promise<void> {
    await fetchApi('/feed/media/reorder', {
      method: 'PUT',
      body: JSON.stringify({ mediaOrder })
    });
  }
}
