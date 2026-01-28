import { useQuery } from '@tanstack/react-query';
import { PropertyFeedService } from '../services/property-feed.service';
import type { PropertyFeed, PropertyFeedSection } from '../types/property-feed.types';

export function usePropertyFeed(propertyId: string | null) {
  return useQuery<PropertyFeed>({
    queryKey: ['feed', propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      try {
        return await PropertyFeedService.getPropertyFeed(propertyId);
      } catch (error) {
        return [];
      }
    },
    enabled: !!propertyId,
    staleTime: 0,
    retry: false
  });
}

export function usePropertyFeedSections() {
  return useQuery<PropertyFeedSection[]>({
    queryKey: ['feed-sections'],
    queryFn: () => PropertyFeedService.getAllSections(),
    staleTime: 60000 * 5
  });
}
