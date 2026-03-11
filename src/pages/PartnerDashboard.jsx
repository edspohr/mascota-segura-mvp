import React, { useState } from 'react';
import { useApp } from '../context';
import { usePartnerCampaigns } from '../hooks/useCampaigns';
import { createCampaign } from '../services/campaigns.service';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { BarChart3, Eye, Ticket, MousePointerClick, Rocket, Search, ChevronRight } from 'lucide-react';

const PartnerDashboard = () => {
  const { firebaseUser, profile, addToast } = useApp();
  const { campaigns, loading } = usePartnerCampaigns(firebaseUser?.uid);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
      title: '',
      description: '',
      imageURL: 'https://images.unsplash.com/photo-1583089892943-e6118d6a8501?auto=format&fit=crop&w=500&q=80'
  });

  const handleCreateCampaign = async (e) => {
      e.preventDefault();
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
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalReach = campaigns.reduce((acc, c) => acc + (c.stats?.reach || 0), 0);
  const totalRedeemed = campaigns.reduce((acc, c) => acc + (c.stats?.redeemed || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-black text-[#00457C] tracking-tight">Marketing Hub</h1>
            <p className="text-slate-500 font-medium">{profile?.name || 'Partner Estratégico'} | Targeting de Alta Precisión</p>
          </div>
        </div>
        <div className="flex items-center">
            <Button onClick={() => setShowCampaignModal(true)} className="bg-[#00457C] hover:bg-slate-800 text-white font-black flex items-center gap-2 px-8 py-4 h-auto rounded-[1.25rem] shadow-xl shadow-blue-900/10 active:scale-95 transition-all text-sm uppercase tracking-widest">
               <Rocket className="w-5 h-5 shadow-sm" /> Lanzar Campaña
            </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Campañas" 
          value={campaigns.filter(c => c.active).length} 
          icon={<BarChart3 className="w-6 h-6 text-blue-900" />}
        />
        <MetricCard 
          title="Visibilidad" 
          value={totalReach.toLocaleString()} 
          icon={<Eye className="w-6 h-6 text-teal-600" />}
        />
        <MetricCard 
          title="Canjes" 
          value={totalRedeemed.toLocaleString()} 
          icon={<Ticket className="w-6 h-6 text-amber-500" />}
        />
        <MetricCard 
          title="Conversión" 
          value={totalReach > 0 ? `${((totalRedeemed/totalReach) * 100).toFixed(1)}%` : "0%"} 
          icon={<MousePointerClick className="w-6 h-6 text-blue-900 opacity-60" />}
        />
      </div>

      {/* Campaigns Grid */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-slate-100 rounded-xl">
                <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-blue-900">Rendimiento en Vivo</h2>
        </div>
        
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {campaigns.map(campaign => (
              <CampaignStatsCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 shadow-inner">
             <div className="p-6 bg-slate-50 rounded-full w-max mx-auto mb-8">
                <Rocket className="w-12 h-12 text-slate-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Sin actividad comercial</h3>
             <p className="text-slate-500 mb-8 font-medium max-w-xs mx-auto">Impacta a miles de dueños responsables con beneficios exclusivos.</p>
             <Button onClick={() => setShowCampaignModal(true)} variant="outline" className="px-10 font-bold border-2">
               Crear mi primera campaña
             </Button>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="Lanzar Campaña Pakuna">
        <form onSubmit={handleCreateCampaign} className="space-y-8">
             <div className="bg-[#00457C] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                <h4 className="text-lg font-black mb-2 relative z-10">Targeting Inteligente</h4>
                <p className="text-blue-100 text-sm font-medium relative z-10 leading-relaxed">
                    Tu beneficio aparecerá exclusivamente en los Dashboards de dueños que mantienen sus mascotas protegidas por Pakuna con el 100% de cumplimiento.
                </p>
             </div>

             <div className="space-y-6">
                 <Input 
                    label="Título de la Promoción" 
                    placeholder="Ej: 30% DSCTO en Alimento Premium" 
                    value={newCampaign.title} 
                    onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} 
                    required
                 />
                 
                 <Input 
                    label="Descripción Corta" 
                    placeholder="Influencia la decisión de compra..." 
                    value={newCampaign.description} 
                    onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} 
                    required
                 />

                 <Input 
                    label="URL de Imagen de Portada" 
                    placeholder="https://..." 
                    value={newCampaign.imageURL} 
                    onChange={e => setNewCampaign({...newCampaign, imageURL: e.target.value})} 
                 />
             </div>

             <Button type="submit" disabled={submitting} className="w-full py-5 text-xl font-black bg-teal-600 hover:bg-teal-700 text-white border-none shadow-2xl shadow-teal-100 mt-4 h-auto">
                 {submitting ? 'Lanzando...' : 'Lanzar Campaña Ahora'}
             </Button>
        </form>
      </Modal>

    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <Card className="bg-white border-slate-50 p-8 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 shadow-xl shadow-slate-100/50 rounded-[2.5rem] relative overflow-hidden group cursor-default">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-900/5 transition-colors" />
    <div className="flex items-center gap-5 mb-8 relative z-10">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all duration-500">
        {icon}
      </div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 leading-tight">{title}</p>
    </div>
    <div className="relative z-10">
      <h3 className="text-5xl font-black text-blue-900 tracking-tight">{value}</h3>
    </div>
  </Card>
);

const CampaignStatsCard = ({ campaign }) => {
  const reach = campaign.stats?.reach || 0;
  const redeemed = campaign.stats?.redeemed || 0;
  const conversionRate = reach > 0 ? Math.round((redeemed / reach) * 100) : 0;

  return (
    <Card className="bg-white border-slate-100 overflow-hidden relative shadow-xl shadow-slate-200/50 p-0 rounded-[2.5rem] hover:shadow-2xl hover:border-blue-900/10 transition-all duration-500">
      <div className="flex flex-col md:flex-row h-full">
         <div className="w-full md:w-2/5 h-48 md:h-64">
            <img src={campaign.imageURL || "https://images.unsplash.com/photo-1583089892943-e6118d6a8501?auto=format&fit=crop&w=500&q=80"} alt={campaign.title} className="w-full h-full object-cover" />
         </div>
         <div className="p-8 w-full md:w-3/5 flex flex-col justify-center">
            <h3 className="text-xl font-black text-blue-900 mb-2 leading-tight">{campaign.title}</h3>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed line-clamp-2">{campaign.description}</p>
            
            <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-[0.2em]">
                      <span className="text-slate-400">Eficiencia de Conversión</span>
                      <span className="text-teal-600">{conversionRate}%</span>
                   </div>
                   <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden shadow-inner border border-slate-100">
                     <div className="bg-teal-500 h-full rounded-full transition-all duration-1000" style={{ width: `${conversionRate}%` }}></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-50">
                   <div className="flex flex-col">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Reach</p>
                      <p className="text-2xl font-black text-blue-900">{reach.toLocaleString()}</p>
                   </div>
                   <div className="flex flex-col">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Ventas</p>
                      <p className="text-2xl font-black text-teal-600">{redeemed.toLocaleString()}</p>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </Card>
  );
};

export default PartnerDashboard;
