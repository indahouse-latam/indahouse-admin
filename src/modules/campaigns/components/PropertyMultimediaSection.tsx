'use client';

import { Building2, Plus, Loader2 } from 'lucide-react';
import { usePropertyFeed, usePropertyFeedSections } from '../hooks/usePropertyFeed';
import { usePropertyFeedEditor } from '../hooks/usePropertyFeedEditor';
import { SectionEditor } from './SectionEditor';
import { usePropertyRisk, InvestmentStrategyEnum } from '@/modules/properties/hooks/usePropertyRisk';
import type { PropertyFeedSection } from '../types/property-feed.types';

interface PropertyMultimediaSectionProps {
  propertyId: string | null;
  onComplete?: () => void;
}

const BEFORE_AFTER_SECTION_KEY = 'before_after_comparisons';
const FINANCIAL_DOCUMENTS_SECTION_KEY = 'financial_documents';

const BEFORE_AFTER_SECTION: PropertyFeedSection = {
  id: BEFORE_AFTER_SECTION_KEY,
  sectionKey: BEFORE_AFTER_SECTION_KEY,
  sectionName: 'Before & After Comparisons',
  sectionDescription: 'Interactive comparisons showing the difference between two images.',
  displayOrder: 999,
  isActive: 1,
  createdAt: '',
  updatedAt: ''
};

const FINANCIAL_DOCUMENTS_SECTION: PropertyFeedSection = {
  id: FINANCIAL_DOCUMENTS_SECTION_KEY,
  sectionKey: FINANCIAL_DOCUMENTS_SECTION_KEY,
  sectionName: 'Financial Documents',
  sectionDescription: 'Section for financial documents of the property.',
  displayOrder: 998,
  isActive: 1,
  createdAt: '',
  updatedAt: ''
};

const VIRTUAL_SECTIONS: PropertyFeedSection[] = [
  FINANCIAL_DOCUMENTS_SECTION,
  BEFORE_AFTER_SECTION
];

export function PropertyMultimediaSection({
  propertyId
}: PropertyMultimediaSectionProps) {
  const { data: propertyFeed, isLoading: isFeedLoading, refetch } = usePropertyFeed(propertyId);
  const { data: allSections, isLoading: isSectionsLoading } = usePropertyFeedSections();
  const { risk } = usePropertyRisk(propertyId);
  const requireEvenFiles = risk?.strategy === InvestmentStrategyEnum.VALUE_ADD_HOLD;
  const {
    createSection,
    isCreatingSection,
    createGlobalSection,
    isCreatingGlobalSection
  } = usePropertyFeedEditor(propertyId);

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
  const baseAvailableSections = sectionsWithoutContent.map(item => item.section);
  const existingSectionKeys = new Set(existingSections.map((item) => item.section.sectionKey));
  const availableSectionKeys = new Set(baseAvailableSections.map((section) => section.sectionKey));
  const missingVirtualSections = VIRTUAL_SECTIONS.filter(
    (section) => !existingSectionKeys.has(section.sectionKey) && !availableSectionKeys.has(section.sectionKey)
  );
  const availableSections = [...baseAvailableSections, ...missingVirtualSections];
  const sortedExistingSections = existingSections.toSorted(
    (a, b) => a.section.displayOrder - b.section.displayOrder
  );
  const sortedAvailableSections = availableSections.toSorted(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const ensureGlobalSectionExists = (section: PropertyFeedSection, onSuccess: () => void) => {
    const alreadyExistsInDatabase = (allSections ?? []).some(
      (availableSection) => availableSection.sectionKey === section.sectionKey
    );

    if (alreadyExistsInDatabase) {
      onSuccess();
      return;
    }

    createGlobalSection(
      {
        section_key: section.sectionKey,
        section_name: section.sectionName,
        section_description: section.sectionDescription,
        is_active: true
      },
      {
        onSuccess
      }
    );
  };

  const handleCreateSection = (sectionKey: string) => {
    const createPropertySection = () => {
      createSection(
        { sectionKey, payload: { isPublished: 1 } },
        {
          onSuccess: () => {
            refetch();
          }
        }
      );
    };

    const virtualSection = VIRTUAL_SECTIONS.find((section) => section.sectionKey === sectionKey);

    if (!virtualSection) {
      createPropertySection();
      return;
    }

    ensureGlobalSectionExists(virtualSection, createPropertySection);
  };

  return (
    <div className="space-y-6">
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
          {sortedExistingSections.map((item) => (
              <SectionEditor
                key={item.content!.id}
                section={item.section}
                content={item.content!}
                propertyId={propertyId}
                onUpdate={refetch}
                requireEvenFiles={requireEvenFiles}
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
            {sortedAvailableSections.map((section) => (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => handleCreateSection(section.sectionKey)}
                  disabled={isCreatingSection || isCreatingGlobalSection}
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
