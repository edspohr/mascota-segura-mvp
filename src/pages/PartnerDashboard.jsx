import React, { useState } from 'react';
import { useApp } from '../context';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import { BarChart3, Eye, Ticket, MousePointerClick, Plus, Rocket } from 'lucide-react';

const PartnerDashboard = () => {
  const { user, partnerData, campaigns, addCampaign } = useApp();
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
      title: '',
      description: '',
      discount: '',
      image: 'https://images.unsplash.com/photo-1583089892943-e6118d6a8501?auto=format&fit=crop&w=500&q=80' // default abstract pet food photo
  });

  const handleCreateCampaign = (e) => {
      e.preventDefault();
      addCampaign({
          title: newCampaign.title,
          description: newCampaign.description,
          image: newCampaign.image
      });
      setShowCampaignModal(false);
      setNewCampaign({title: '', description: '', discount: '', image: newCampaign.image});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">
            Marketing Hub
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">{user?.name} | Targeting & Conversión</p>
        </div>
        <div className="flex items-center">
            <Button onClick={() => setShowCampaignModal(true)} className="bg-teal-600 hover:bg-teal-500 text-white font-bold border-none shadow-lg shadow-teal-900/30 flex items-center gap-2 px-6">
               <Rocket className="w-5 h-5" /> Nueva Campaña
            </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Campañas Activas" 
          value={partnerData.activeCampaigns} 
          icon={<BarChart3 className="w-6 h-6 text-teal-400" />}
        />
        <MetricCard 
          title="Visibilidad (Reach)" 
          value={partnerData.totalVisibility} 
          icon={<Eye className="w-6 h-6 text-cyan-400" />}
        />
        <MetricCard 
          title="Cupones Canjeados" 
          value={partnerData.totalRedeemed} 
          icon={<Ticket className="w-6 h-6 text-emerald-400" />}
        />
        <MetricCard 
          title="CTR Promedio" 
          value="27.8%" 
          icon={<MousePointerClick className="w-6 h-6 text-purple-400" />}
        />
      </div>

      {/* Campaigns Grid */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-50 mb-6">Rendimiento en Tiempo Real</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {campaigns.map(campaign => (
            <CampaignStatsCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="Lanzar Nueva Campaña">
        <form onSubmit={handleCreateCampaign} className="space-y-5">
             <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-sm text-cyan-200/90 leading-relaxed mb-4 font-medium">
                Al crear esta campaña, impactará directamente en los Dashboards de los dueños que cumplan con el 100% de Cumplimiento Médico, generando altísima conversión.
             </div>

             <Input 
                label="Título de la Promoción" 
                placeholder="Ej: 30% DSCTO en Alimento Premium" 
                value={newCampaign.title} 
                onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} 
                required
                className="bg-zinc-900 border-zinc-700 text-white font-bold" 
             />
             
             <Input 
                label="Descripción Breve" 
                placeholder="Por mantener las vacunas de sus mascotas al día." 
                value={newCampaign.description} 
                onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} 
                required
                className="bg-zinc-900 border-zinc-700 text-white" 
             />

             <div className="grid grid-cols-2 gap-4">
                 <Input 
                    label="% de Descuento" 
                    placeholder="Ej: 30" 
                    type="number"
                    value={newCampaign.discount} 
                    onChange={e => setNewCampaign({...newCampaign, discount: e.target.value})} 
                    className="bg-zinc-900 border-zinc-700 text-white" 
                 />
                 <div className="flex flex-col gap-1 w-full opacity-50 cursor-not-allowed">
                     <label className="text-sm font-bold text-zinc-300">Audiencia (Locked)</label>
                     <input disabled value="Cumplimiento 100%" className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900 text-white cursor-not-allowed" />
                 </div>
             </div>

             <div className="pt-4">
                 <Button type="submit" className="w-full py-4 text-lg font-bold bg-teal-600 hover:bg-teal-500 text-white border-none shadow-lg shadow-teal-900/40 rounded-xl">
                     <Rocket className="w-5 h-5 inline mr-2 -mt-1" /> Publicar Campaña
                 </Button>
             </div>
        </form>
      </Modal>

    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <Card className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 flex flex-col hover:border-teal-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />
    <div className="flex items-center gap-4 mb-6 relative z-10">
      <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800/80 shadow-inner group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 leading-tight">{title}</p>
    </div>
    <div className="relative z-10">
      <h3 className="text-4xl font-extrabold text-white tracking-tight">{value}</h3>
    </div>
  </Card>
);

const CampaignStatsCard = ({ campaign }) => {
  // If simulated reach is 0 (new campaign), show 0. Otherwise calculate compliance.
  const compliance = campaign.reach === 0 ? 0 : Math.round((campaign.redeemed / campaign.reach) * 100);

  return (
    <Card className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 overflow-hidden relative shadow-lg p-0">
      <div className="flex flex-col md:flex-row h-full">
         <div className="w-full md:w-2/5 h-48 md:h-full min-h-[200px]">
            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
         </div>
         <div className="p-8 w-full md:w-3/5 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{campaign.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed line-clamp-2">{campaign.description}</p>
            
            <div className="space-y-5">
                <div>
                   <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                      <span className="text-zinc-500">Conversión</span>
                      <span className="text-teal-400">{compliance}%</span>
                   </div>
                   <div className="w-full bg-zinc-950 rounded-full h-2 shadow-inner border border-zinc-800">
                     <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${compliance}%` }}></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                   <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Impactos</p>
                      <p className="text-2xl font-extrabold text-zinc-200">{campaign.reach}</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Canjes</p>
                      <p className="text-2xl font-extrabold text-teal-400">{campaign.redeemed}</p>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </Card>
  );
};

export default PartnerDashboard;
