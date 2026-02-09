import React, { useState } from 'react';
import { useApp } from '../context/Context';
import { Search, Plus, FileText, Syringe } from 'lucide-react';
import { Button, Input, Card } from '../components/ui/Components';

const PartnerDashboard = () => {
  const { getPetById, addMedicalRecord } = useApp();
  const [searchId, setSearchId] = useState('');
  const [foundPet, setFoundPet] = useState(null);
  const [newRecord, setNewRecord] = useState({ type: 'Vacuna', description: '', date: new Date().toISOString().split('T')[0] });

  const handleSearch = (e) => {
    e.preventDefault();
    const pet = getPetById(searchId);
    if (pet) {
      setFoundPet(pet);
    } else {
      alert('Mascota no encontrada (Prueba con "p1" o "p2")');
      setFoundPet(null);
    }
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!foundPet) return;
    
    addMedicalRecord(foundPet.id, {
      id: Date.now().toString(),
      ...newRecord,
      veterinarian: "Veterinaria Rondón (Tú)"
    });

    setNewRecord({ ...newRecord, description: '' });
    alert('Registro médico agregado exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Panel Veterinario</h1>
        <div className="text-sm text-slate-500">
          Clínica: <strong className="text-slate-800">Veterinaria Rondón</strong>
        </div>
      </div>

      {/* Search Section */}
      <Card className="bg-slate-800 text-white border-none">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">Buscar Mascota</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ingresar ID de Mascota o Chip (ej: p1)" 
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border-slate-600 border text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSearch} className="md:w-auto bg-teal-500 hover:bg-teal-600 text-white border-none">
            Buscar Expediente
          </Button>
        </div>
      </Card>

      {/* Result Section */}
      {foundPet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Pet Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <div className="flex items-center gap-4 mb-4">
                <img src={foundPet.photo} alt={foundPet.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{foundPet.name}</h2>
                  <p className="text-slate-500">{foundPet.breed}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Propietario</span>
                  <span className="font-medium">Betsy Cueva</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Edad</span>
                  <span className="font-medium">{foundPet.age} años</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Peso</span>
                  <span className="font-medium">{foundPet.weight}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs mt-4" onClick={() => setFoundPet(null)}>
                ← Volver a la lista
              </Button>
            </Card>

            <Card className="bg-teal-50 border-teal-100">
              <h3 className="font-bold text-teal-800 mb-2">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left bg-white text-sm">
                   <FileText className="w-4 h-4 mr-2" />
                   Ver Historial Completo
                </Button>
                <Button variant="outline" className="w-full justify-start text-left bg-white text-sm">
                   <Syringe className="w-4 h-4 mr-2" />
                   Programar Vacuna
                </Button>
              </div>
            </Card>
          </div>

          {/* Medical Records & Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="font-bold text-lg text-slate-800 mb-4">Agregar Nuevo Registro</h3>
              <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="col-span-2 md:col-span-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Atención</label>
                   <select 
                     className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white"
                     value={newRecord.type}
                     onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                   >
                     <option value="Vacuna">Vacuna</option>
                     <option value="Consulta">Consulta General</option>
                     <option value="Cirugía">Cirugía</option>
                     <option value="Desparasitación">Desparasitación</option>
                   </select>
                 </div>
                 <div className="col-span-2 md:col-span-1">
                   <Input 
                      label="Fecha" 
                      type="date" 
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                   />
                 </div>
                 <div className="col-span-2">
                   <Input 
                      label="Descripción / Diagnóstico / Tratamiento" 
                      placeholder="Detalles del procedimiento..." 
                      value={newRecord.description}
                      onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                      required
                   />
                 </div>
                 <div className="col-span-2 flex justify-end">
                   <Button type="submit">
                     <Plus className="w-4 h-4 mr-2 inline-block" />
                     Guardar en Historial
                   </Button>
                 </div>
              </form>
            </Card>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Historial Reciente</h3>
              {foundPet.medicalHistory.map(record => (
                <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                  <div className="bg-teal-100 text-teal-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-slate-800">{record.type}</h4>
                      <span className="text-sm text-slate-400">{record.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-1">{record.description}</p>
                    <p className="text-xs text-slate-400 mt-2">Dr. {record.veterinarian || 'Veterinaria Rondón'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Recent Patients List */}
           <h2 className="text-lg font-bold text-slate-800">Pacientes Recientes</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Using mocked pets from context directly for demo */}
             {['p1', 'p2'].map(pId => {
                const p = getPetById(pId);
                if (!p) return null;
                return (
                 <Card key={p.id} className="cursor-pointer hover:shadow-md transition-all group" onClick={() => setFoundPet(p)}>
                    <div className="flex items-center gap-3">
                      <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform" />
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{p.name}</h3>
                        <p className="text-xs text-slate-500">{p.breed}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 border-t border-slate-50 pt-2 flex justify-between">
                       <span>Dueño: {p.ownerId === 'u1' ? 'Betsy Cueva' : 'Desconocido'}</span>
                       <span>ID: {p.id}</span>
                    </div>
                 </Card>
                );
             })}
           </div>
           
           <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-400 text-sm">Escanea un QR para buscar automáticamente</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
