import { useState, useMemo } from 'react';
import { MediaGalleryManager } from '@/modules/campaigns/components/MediaGalleryManager';
import { useProperties } from '@/modules/properties/hooks/useProperties';
import type { PropertyFeedMedia } from '@/modules/campaigns/types/property-feed.types';

interface FinancialDocumentsSectionProps {
    property: any;
}

export function FinancialDocumentsSection({ property }: FinancialDocumentsSectionProps) {
    const { uploadDocument, isUploadingDocument } = useProperties();

    // Map backend property files to frontend Media format
    const financialMedia: PropertyFeedMedia[] = useMemo(() => {
        const docs = property.files?.financial_documents || property.financial_documents || [];
        return docs.map((doc: any, index: number) => {
            const url = doc.resource_link || doc.url || '';
            const name = url.split('/').pop() || `Documento ${index + 1}`;
            return {
                id: String(doc.id),
                propertyId: property.id,
                feedContentId: '', // Not applicable
                mediaType: 'FINANCIAL',
                fileName: name,
                fileUrl: url,
                bucketName: '',
                bucketPath: '',
                displayOrder: index,
                metadata: {},
                createdAt: doc.created_at || new Date().toISOString(),
                updatedAt: doc.updated_at || new Date().toISOString()
            } as PropertyFeedMedia;
        });
    }, [property]);

    const handleUpload = (files: File[]) => {
        uploadDocument(
            { propertyId: property.id, files, type: 'financial' },
            {
                onSuccess: () => {
                    // Toast handled in hook
                }
            }
        );
    };

    const handleDelete = (mediaId: string) => {
        // TODO: Implement delete if backend supports it.
        // For now show generic message or try to call delete endpoint if inferred.
        console.log('Delete requested for', mediaId);
        alert('La eliminación de documentos financieros aún no está implementada en esta vista.');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">Documentos Financieros</h3>
                    <p className="text-sm text-muted-foreground">
                        Sube los estados financieros y documentos de ROI de la propiedad. Solamente formato PDF.
                    </p>
                </div>
            </div>

            <MediaGalleryManager
                media={financialMedia}
                onUpload={(files) => handleUpload(files)}
                onDelete={handleDelete}
                onReorder={() => { }} // Not supporting reorder for now
                isUploading={isUploadingDocument}
                isDeleting={false}
                mediaType="FINANCIAL"
            />
        </div>
    );
}
