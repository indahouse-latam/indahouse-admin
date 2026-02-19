'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2 } from 'lucide-react';
import { fetchApi } from '@/utils/api';
import { DragDropUpload } from '@/components/DragDropUpload';
import { PropertyFeedService } from '../services/property-feed.service';
import { toast } from 'sonner';

interface PropertyFileItem {
  id: string;
  property_id?: string;
  resource_link: string;
  resource_type?: number;
  createdAt?: string;
}

interface PropertyWithFiles {
  id: string;
  files?: {
    financial_documents?: PropertyFileItem[];
    documents?: PropertyFileItem[];
    images?: unknown[];
  };
}

interface FinancialDocumentsSectionProps {
  propertyId: string;
}

export function FinancialDocumentsSection({ propertyId }: FinancialDocumentsSectionProps) {
  const queryClient = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property-files', propertyId],
    queryFn: async () => {
      const res = await fetchApi(`/properties/${propertyId}`);
      return res as PropertyWithFiles;
    },
    enabled: !!propertyId
  });

  const financialDocuments = property?.files?.financial_documents ?? [];
  const isUploading = false;

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    try {
      const result = await PropertyFeedService.uploadPropertyDocuments(
        propertyId,
        Array.from(files),
        'financial'
      );
      if (result.uploaded?.length) {
        toast.success(`${result.uploaded.length} documento(s) financiero(s) subido(s)`);
        queryClient.invalidateQueries({ queryKey: ['property-files', propertyId] });
      }
      if (result.corrupted?.length) {
        toast.warning(`Algunos archivos no se pudieron subir: ${result.corrupted.length}`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al subir documentos financieros');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-secondary/5 rounded-xl border border-border">
      <div>
        <h4 className="text-lg font-bold">Documentos Financieros</h4>
        <p className="text-xs text-muted-foreground">
          {financialDocuments.length} documento{financialDocuments.length !== 1 ? 's' : ''} financiero
          {financialDocuments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <DragDropUpload
        title="Arrastra archivos PDF aquí"
        description="Arrastra y suelta tus archivos (.pdf - máx 10MB) o navega en tu ordenador para cargarlos."
        fileTypeDescription="(.pdf - máx 10MB)"
        accept={{ 'application/pdf': ['.pdf'] }}
        maxFiles={10}
        maxSize={10 * 1024 * 1024}
        onFilesDrop={(files) => {
          if (isUploading) return;
          handleUpload(files);
        }}
      />

      {financialDocuments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {financialDocuments.map((doc: PropertyFileItem, index: number) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border"
            >
              <div className="p-2 rounded-lg bg-red-500/10">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {doc.resource_link?.split('/').pop() ?? `Documento financiero ${index + 1}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">{doc.resource_link}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
