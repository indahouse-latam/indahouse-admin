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
  latitude: number | string;
  longitude: number | string;
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
}

interface PropertiesResponse {
  properties: Property[];
}

interface UpdatePropertyPayload {
  id: string;
  name_reference: string;
  description?: string;
  price: number;
  valuation: number;
  property_type: number;
  stratum: number | null;
  built_time: number;
  buyback_time?: number;
  status: string;
  location: LocationData;
  main_characteristics: Array<{ name: string; description: string }>;
  extra_characteristics: Array<{ name: string; description: string }>;
  monthly_expenses: Array<{ name: string; price: number; icon?: string }>;
}

const normalizeProperty = (prop: any): Property => {
  return {
    ...prop,
    name_reference: prop.nameReference || prop.name_reference,
    user_id: prop.userId || prop.user_id,
    property_type: prop.propertyType || prop.property_type,
    built_time: prop.builtTime || prop.built_time,
    buyback_time: prop.buybackTime || prop.buyback_time,
    property_reference: prop.propertyReference || prop.property_reference,
    price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price,
    valuation: typeof prop.valuation === 'string' ? parseFloat(prop.valuation) : prop.valuation,
    location: {
      ...prop.location,
      short_location: prop.location?.shortLocation || prop.location?.short_location,
      full_location: prop.location?.fullLocation || prop.location?.full_location,
    },
    main_characteristics: prop.main_characteristics || [],
    extra_characteristics: prop.extra_characteristics || [],
    monthly_expenses: (prop.monthly_expenses || []).map((exp: any) => ({
      ...exp,
      price: typeof exp.price === 'string' ? parseFloat(exp.price) : exp.price,
    })),
  };
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
      return await fetchApi<Property>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      toast.success('Propiedad actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la propiedad');
    },
  });

  return {
    ...query,
    updateProperty: updatePropertyMutation.mutate,
    isUpdating: updatePropertyMutation.isPending,
  };
};
