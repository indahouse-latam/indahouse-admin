'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { MovementChart } from "@/modules/dashboard/components/MovementChart";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { useCampaigns } from "@/modules/campaigns/hooks/useCampaigns";
import { useMovements } from "@/modules/financials/hooks/useMovements";
import { useMarkets } from "@/modules/markets/hooks/useMarkets";
import {
  Users,
  TrendingUp,
  Building2,
  AlertCircle,
  Activity
} from "lucide-react";

export default function Home() {
  const { data: users } = useUsers();
  const { data: campaigns } = useCampaigns();
  const { data: movementsResponse } = useMovements();
  const { data: marketsData } = useMarkets();

  const totalUsers = users?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const totalVolume = movementsResponse?.total || 0;
  const totalValuation = marketsData?.totalValuation || 0;
  const pendingOnboarding = users?.filter(u => !u.onboarding_finished).length || 0;
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Bienvenido de vuelta al panel de administración de Indahouse.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Usuarios Registrados"
            value={totalUsers.toString()}
            icon={<Users className="w-4 h-4" />}
            description="Total de usuarios en plataforma"
          />
          <StatCard
            title="Valuación Total"
            value={`${totalValuation.toLocaleString()} USDC`}
            icon={<TrendingUp className="w-4 h-4" />}
            description="Valor total de propiedades verificadas"
          />
          <StatCard
            title="Campañas Activas"
            value={activeCampaigns.toString()}
            icon={<Building2 className="w-4 h-4" />}
            description="Campañas en proceso de fondeo"
          />
          <StatCard
            title="Pendiente de Registro"
            value={pendingOnboarding.toString()}
            icon={<AlertCircle className="w-4 h-4" />}
            description="Usuarios sin finalizar balance"
            isAlert
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 bg-secondary/10 border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Volumen de Movimientos</h3>
              </div>
              <select className="bg-secondary/50 border border-border rounded-md px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-primary">
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
              </select>
            </div>
            <MovementChart />
          </div>
          <div className="col-span-3 bg-secondary/10 border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-6">Actividad Reciente</h3>
            <div className="space-y-4">
              <ActivityItem title="Nueva Inversión" description="Usuario #123 invirtió 500 USDC" time="Hace 2 min" />
              <ActivityItem title="Registro Completo" description="Maria Garcia completó KYC" time="Hace 15 min" />
              <ActivityItem title="Campaña Finalizada" description="Propiedad 'Palo Alto' alcanzó meta" time="Hace 1h" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-[10px] text-muted-foreground font-mono">{time}</span>
    </div>
  );
}

function StatCard({ title, value, icon, description, isAlert }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  isAlert?: boolean;
}) {
  return (
    <div className="bg-secondary/20 border border-border rounded-xl p-6 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`${isAlert ? 'text-destructive' : 'text-primary'}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
