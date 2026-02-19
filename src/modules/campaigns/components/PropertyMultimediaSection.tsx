'use client';

import { Building2, Plus, Loader2 } from 'lucide-react';
import { usePropertyFeed, usePropertyFeedSections } from '../hooks/usePropertyFeed';
import { usePropertyFeedEditor } from '../hooks/usePropertyFeedEditor';
import { SectionEditor } from './SectionEditor';
import { FinancialDocumentsSection } from './FinancialDocumentsSection';

interface PropertyMultimediaSectionProps {
  propertyId: string | null;
  onComplete?: () => void;
}

export function PropertyMultimediaSection({
  propertyId,
  onComplete
}: PropertyMultimediaSectionProps) {
  const { data: propertyFeed, isLoading: isFeedLoading, refetch } = usePropertyFeed(propertyId);
  const { data: allSections, isLoading: isSectionsLoading } = usePropertyFeedSections();
  const { createSection, isCreatingSection } = usePropertyFeedEditor(propertyId);

  if (!propertyId) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Crea la propiedad primero</p>
        <p className="text-sm mt-2">
          Una vez creada la propiedad, podrás gestionar el multimedia aquí
        </p>
      </div>
    );
  }

  if (isFeedLoading || isSectionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const feedData = propertyFeed || [];

  const sectionsWithContent = feedData.filter(item => item.content !== null);
  const sectionsWithoutContent = feedData.filter(item => item.content === null && item.section.isActive === 1);

  const existingSections = sectionsWithContent;
  const availableSections = sectionsWithoutContent.map(item => item.section);

  const handleCreateSection = (sectionKey: string) => {
    createSection(
      { sectionKey, payload: { isPublished: 1 } },
      {
        onSuccess: () => {
          refetch();
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Documentos financieros (property_file, resource_type=2) */}
      <FinancialDocumentsSection propertyId={propertyId} />

      {existingSections.length === 0 && availableSections.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay secciones disponibles</p>
          <p className="text-sm mt-2">
            Contacta al administrador para configurar las secciones de multimedia
          </p>
        </div>
      )}

      {existingSections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
            Secciones Existentes
          </h3>
          {existingSections
            .sort((a, b) => a.section.displayOrder - b.section.displayOrder)
            .map((item) => (
              <SectionEditor
                key={item.content!.id}
                section={item.section}
                content={item.content!}
                propertyId={propertyId}
                onUpdate={refetch}
              />
            ))}
        </div>
      )}

      {availableSections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Crear Nueva Sección
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availableSections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((section) => (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => handleCreateSection(section.sectionKey)}
                  disabled={isCreatingSection}
                  className="p-4 bg-secondary/30 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{section.sectionName}</h4>
                      {section.sectionDescription && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {section.sectionDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
