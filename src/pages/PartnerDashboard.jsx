import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { usePartnerCampaigns } from '../hooks/useCampaigns';
import { createCampaign } from '../services/campaigns.service';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { BarChart3, Eye, Ticket, MousePointerClick, Rocket, Search, ChevronRight } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '../data/mockData';

const PartnerDashboard = () => {
  const { firebaseUser, profile, addToast, isDemo } = useApp();
  const { campaigns: realCampaigns, loading: realLoading } = usePartnerCampaigns(firebaseUser?.uid);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isDemo) {
        setCampaigns(MOCK_CAMPAIGNS);
        setLoading(false);
    } else {
        setCampaigns(realCampaigns);
        setLoading(realLoading);
    }
  }, [isDemo, realCampaigns, realLoading]);

  const [newCampaign, setNewCampaign] = useState({
      title: '',
      description: '',
      imageURL: 'https://images.unsplash.com/photo-1583089892943-e6118d6a8501?auto=format&fit=crop&w=500&q=80'
  });

  const handleCreateCampaign = async (e) => {
      e.preventDefault();
      
      if (isDemo) {
        addToast('[DEMO] ¡Campaña lanzada con éxito! (simulado)', 'success');
        setShowCampaignModal(false);
        setNewCampaign({ title: '', description: '', imageURL: newCampaign.imageURL });
        return;
      }

      if (!firebaseUser) return;
      setSubmitting(true);
      try {
          await createCampaign(newCampaign, { uid: firebaseUser.uid, name: profile.name });
          addToast('¡Campaña lanzada con éxito!', 'success');
          setShowCampaignModal(false);
          setNewCampaign({ title: '', description: '', imageURL: newCampaign.imageURL });
      } catch (err) {
          addToast('Error al crear campaña: ' + err.message, 'error');
      } finally {
          setSubmitting(false);
      }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-[#008894] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalReach = campaigns.reduce((acc, c) => acc + (c.stats?.reach || 0), 0);
  const totalRedeemed = campaigns.reduce((acc, c) => acc + (c.stats?.redeemed || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Logo className="w-14 h-14" />
          <div className="space-y-1 text-left">
            <h1 className="text-3xl lg:text-4xl font-black text-[#00457C] tracking-tight leading-none">Marketing Hub</h1>
            <p className="text-slate-500 font-medium text-lg leading-none">{profile?.name || (isDemo ? 'PetMarket Premium' : 'Partner Estratégico')} | Analytics</p>
          </div>
        </div>
        <div className="flex items-center">
            <Button onClick={() => setShowCampaignModal(true)} className="bg-[#00457C] hover:bg-slate-800 text-white font-black flex items-center gap-3 px-8 py-5 h-auto rounded-[1.5rem] shadow-2xl shadow-blue-900/20 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]">
               <Rocket className="w-5 h-5" /> Lanzar Campaña
            </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Campañas Activas" 
          value={campaigns.filter(c => c.active || isDemo).length} 
          icon={<BarChart3 className="w-6 h-6 text-[#00457C]" />}
          trend="En ejecución"
        />
        <MetricCard 
          title="Alcance Total" 
          value={totalReach.toLocaleString()} 
          icon={<Eye className="w-6 h-6 text-[#008894]" />}
          trend="Visualizaciones"
        />
        <MetricCard 
          title="Beneficios" 
          value={totalRedeemed.toLocaleString()} 
          icon={<Ticket className="w-6 h-6 text-amber-500" />}
          trend="Canjes realizados"
        />
        <MetricCard 
          title="Rendimiento" 
          value={totalReach > 0 ? `${((totalRedeemed/totalReach) * 100).toFixed(1)}%` : "0%"} 
          icon={<MousePointerClick className="w-6 h-6 text-slate-400 group-hover:text-[#008894] transition-colors" />}
          trend="Tasa de Conversión"
        />
      </div>

      {/* Campaigns Grid */}
      <div className="mt-16">
        <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <BarChart3 className="w-6 h-6 text-slate-400" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-[#00457C] tracking-tight leading-none">Rendimiento en Tiempo Real</h2>
               <p className="text-slate-400 font-bold text-[10px] mt-1.5 uppercase tracking-widest leading-none">Control de impacto comercial</p>
            </div>
        </div>
        
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {campaigns.map(campaign => (
              <CampaignStatsCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="p-10 bg-slate-50 rounded-full w-max mx-auto mb-8 border border-slate-100">
                <Rocket className="w-16 h-16 text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-[#00457C] mb-4">Sin actividad comercial</h3>
             <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto leading-relaxed">Impacta a miles de dueños responsables con beneficios exclusivos y ofertas personalizadas.</p>
             <Button onClick={() => setShowCampaignModal(true)} className="bg-[#008894] hover:bg-teal-700 px-12 py-5 rounded-[2rem] text-xl">
               Crear mi primera campaña
             </Button>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="Lanzar Estrategia Pakuna">
        <form onSubmit={handleCreateCampaign} className="space-y-10">
             <div className="bg-[#00457C] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />
                <h4 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Segmentación por Cumplimiento</h4>
                <p className="text-blue-100 text-base font-medium relative z-10 leading-relaxed max-w-sm">
                    Tu beneficio aparecerá exclusivamente ante los dueños que mantienen la salud de sus mascotas al día. Calidad sobre cantidad.
                </p>
             </div>

             <div className="space-y-8">
                 <Input 
                    label="Nombre de la Oferta" 
                    placeholder="Ej: 30% Descuento en Consulta Médica" 
                    value={newCampaign.title} 
                    onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} 
                    required
                 />
                 
                 <Input 
                    label="Mensaje de Impacto" 
                    placeholder="Describe el beneficio para los dueños..." 
                    value={newCampaign.description} 
                    onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} 
                    required
                 />

                 <Input 
                    label="Imagen Promocional (URL)" 
                    placeholder="https://..." 
                    value={newCampaign.imageURL} 
                    onChange={e => setNewCampaign({...newCampaign, imageURL: e.target.value})} 
                 />
             </div>

             <Button type="submit" disabled={submitting} className="w-full py-7 text-xl font-black bg-[#008894] hover:bg-teal-700 text-white border-none shadow-2xl shadow-teal-900/30 rounded-[2rem] flex justify-center active:scale-95 transition-all">
                 {submitting ? 'Lanzando...' : 'Activar Campaña Ahora'}
             </Button>
        </form>
      </Modal>

    </div>
  );
};

const MetricCard = ({ title, value, icon, trend }) => (
  <Card className="bg-white border-slate-100 p-10 flex flex-col hover:shadow-2xl hover:shadow-slate-950/[0.04] transition-all duration-700 shadow-xl shadow-slate-950/[0.02] rounded-[3rem] relative overflow-hidden group cursor-default">
    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl group-hover:bg-[#008894]/5 transition-colors duration-700" />
    <div className="flex justify-between items-start mb-10 relative z-10">
      <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all duration-700">
        {icon}
      </div>
      <div className="px-4 py-2 bg-teal-50 border border-teal-50 rounded-full shadow-sm">
         <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#008894]">{trend}</span>
      </div>
    </div>
    <div className="mt-auto relative z-10 text-left">
      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] leading-none">{title}</p>
      <h3 className="text-5xl lg:text-6xl font-black text-[#00457C] tracking-tight leading-none">{value}</h3>
    </div>
  </Card>
);

const CampaignStatsCard = ({ campaign }) => {
  const reach = campaign.stats?.reach || 0;
  const redeemed = campaign.stats?.redeemed || 0;
  const conversionRate = reach > 0 ? Math.round((redeemed / reach) * 100) : 0;

  return (
    <Card className="bg-white border-slate-100 overflow-hidden relative shadow-xl shadow-slate-950/[0.03] p-0 rounded-[3rem] hover:shadow-2xl hover:border-[#00457C]/10 transition-all duration-700">
      <div className="flex flex-col h-full">
         <div className="w-full h-56 relative overflow-hidden">
            <img src={campaign.imageURL || "https://images.unsplash.com/photo-1583089892943-e6118d6a8501?auto=format&fit=crop&w=500&q=80"} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
         </div>
         <div className="p-10 flex flex-col justify-center flex-grow text-left">
            <h3 className="text-2xl font-black text-[#00457C] mb-3 leading-tight tracking-tight">{campaign.title}</h3>
            <p className="text-base text-slate-500 font-medium mb-10 leading-relaxed line-clamp-2">{campaign.description}</p>
            
            <div className="space-y-8">
                <div>
                   <div className="flex justify-between text-[11px] font-black mb-3 uppercase tracking-[0.2em]">
                      <span className="text-slate-400">Tasa de Efectividad</span>
                      <span className="text-[#008894]">{conversionRate}%</span>
                   </div>
                   <div className="w-full bg-slate-50 rounded-full h-4 overflow-hidden shadow-inner border border-slate-100">
                     <div className="bg-[#008894] h-full rounded-full transition-all duration-1000" style={{ width: `${conversionRate}%` }}></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-slate-50">
                   <div className="flex flex-col">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 leading-none">Alcance</p>
                      <p className="text-3xl font-black text-[#00457C] tracking-tight">{reach.toLocaleString()}</p>
                   </div>
                   <div className="flex flex-col">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 leading-none">Conversión</p>
                      <p className="text-3xl font-black text-[#008894] tracking-tight">{redeemed.toLocaleString()}</p>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </Card>
  );
};

export default PartnerDashboard;
