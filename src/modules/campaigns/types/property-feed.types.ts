export interface PropertyFeedSection {
  id: string;
  sectionKey: string;
  sectionName: string;
  sectionDescription: string;
  displayOrder: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFeedMedia {
  id: string;
  propertyId: string;
  feedContentId: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  fileName: string;
  fileUrl: string;
  bucketName: string;
  bucketPath: string;
  displayOrder: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFeedContent {
  id: string;
  propertyId: string;
  sectionId: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  displayOrder: number;
  isPublished: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  media: PropertyFeedMedia[];
}

export interface PropertyFeedSectionWithContent {
  section: PropertyFeedSection;
  content: PropertyFeedContent | null;
}

export type PropertyFeed = PropertyFeedSectionWithContent[];

export interface PropertyFeedResponse {
  success: boolean;
  data: PropertyFeed;
}

export interface CreateSectionPayload {
  isPublished?: number;
  metadata?: Record<string, any>;
}

export interface UpdateSectionPayload {
  isPublished?: number;
  metadata?: Record<string, any>;
}

export interface ReorderMediaPayload {
  mediaId: string;
  newOrder: number;
}

export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';
