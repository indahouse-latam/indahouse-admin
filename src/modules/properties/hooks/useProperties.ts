import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';
import { toast } from 'sonner';

export interface LocationData {
  id?: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  short_location?: string;
  shortLocation?: string;
  full_location?: string;
  fullLocation?: string;
}

export interface Property {
  id: string;
  user_id?: string;
  userId?: string;
  name_reference: string;
  nameReference?: string;
  render_url?: string;
  renderUrl?: string;
  description?: string;
  price: number | string;
  valuation: number | string;
  property_type: number;
  propertyType?: number;
  stratum: number | null;
  built_time: number;
  builtTime?: number;
  buyback_time?: number;
  buybackTime?: number;
  status: 'VERIFIED' | 'CREATED' | 'PENDING' | 'IN_PROGRESS' | 'DENIED' | 'BOUGHT' | 'BLOCKED';
  location: LocationData;
  main_characteristics: Array<{ name: string; description: string; id?: string; propertyId?: string; createdAt?: string; updatedAt?: string }>;
  extra_characteristics: Array<{ name: string; description: string; id?: string; propertyId?: string; createdAt?: string; updatedAt?: string }>;
  monthly_expenses: Array<{ name: string; price: number | string; icon?: string; id?: string; propertyId?: string; createdAt?: string; updatedAt?: string }>;
  created_at?: string;
  createdAt?: string;
  property_reference?: string;
  propertyReference?: string;
  builder_id?: string | null;
  builder?: { id: string; name: string } | null;
}

interface PropertiesResponse {
  properties: Property[];
}

interface UpdatePropertyPayload {
  id: string;
  name_reference: string;
  render_url?: string;
  description?: string;
  price: number;
  valuation: number;
  property_type: number;
  stratum: number | null;
  built_time: number;
  buyback_time?: number;
  status: string;
  builder_id?: string | null;
  location: LocationData;
  main_characteristics: Array<{ id?: string; name: string; description: string }>;
  extra_characteristics: Array<{ id?: string; name: string; description: string }>;
  monthly_expenses: Array<{ id?: string; name: string; price: number; icon?: string }>;
}

const normalizeProperty = (prop: Record<string, unknown>): Property => {
  const p = prop as any;
  return {
    ...prop,
    name_reference: p.nameReference || p.name_reference,
    render_url: p.renderUrl || p.render_url,
    user_id: p.userId || p.user_id,
    property_type: p.propertyType || p.property_type,
    built_time: p.builtTime || p.built_time,
    buyback_time: p.buybackTime || p.buyback_time,
    property_reference: p.propertyReference || p.property_reference,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price as number,
    valuation: typeof p.valuation === 'string' ? parseFloat(p.valuation) : p.valuation as number,
    location: {
      ...p.location,
      short_location: p.location?.shortLocation || p.location?.short_location,
      full_location: p.location?.fullLocation || p.location?.full_location,
      latitude: p.location?.latitude ? parseFloat(p.location.latitude.toString()) : undefined,
      longitude: p.location?.longitude ? parseFloat(p.location.longitude.toString()) : undefined,
    },
    main_characteristics: p.main_characteristics || [],
    extra_characteristics: p.extra_characteristics || [],
    monthly_expenses: (p.monthly_expenses || []).map((exp: Record<string, unknown>) => ({
      ...exp,
      price: typeof (exp as any).price === 'string' ? parseFloat((exp as any).price) : (exp as any).price,
    })),
  } as Property;
};

export const useProperties = (status?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<Property[]>({
    queryKey: ['properties', status],
    queryFn: async () => {
      const statusParam = status ? `status=${status}` : '';
      const response = await fetchApi<PropertiesResponse>(
        `/properties?${statusParam}&page=&limit=`
      );
      const properties = response.properties || [];
      return properties.map(normalizeProperty);
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePropertyPayload;
    }) => {
      const response = await fetchApi<{ property: Record<string, unknown> }>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return normalizeProperty(response.property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      toast.success('Propiedad actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la propiedad');
    },
  });

  const duplicatePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetchApi<{ property: Record<string, unknown> }>(`/properties/${id}/duplicate`, {
        method: 'POST',
      });
      return normalizeProperty(response.property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad duplicada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al duplicar la propiedad');
    },
  });

  return {
    ...query,
    updateProperty: updatePropertyMutation.mutate,
    isUpdating: updatePropertyMutation.isPending,
    duplicateProperty: duplicatePropertyMutation.mutate,
    isDuplicating: duplicatePropertyMutation.isPending,
  };
};
