import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building, Users, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button, Card, Input, Modal } from '../components/ui/Components';

const SuperAdminDashboard = () => {
  const { organizations, usersList, addOrganization, deleteOrganization, addUser, deleteUser } = useApp();
  const [activeTab, setActiveTab] = useState('organizations');
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // New Org State
  const [newOrg, setNewOrg] = useState({ name: '', type: 'Veterinaria' });
  // New User State
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Owner' });

  const handleAddOrg = (e) => {
    e.preventDefault();
    addOrganization(newOrg);
    setIsOrgModalOpen(false);
    setNewOrg({ name: '', type: 'Veterinaria' });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    addUser(newUser);
    setIsUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Owner' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Super Admin Global</h1>
          <p className="text-slate-500">Gestión de Organizaciones y Usuarios</p>
        </div>
        <div className="flex gap-2">
           <Button 
             variant={activeTab === 'organizations' ? 'primary' : 'outline'} 
             onClick={() => setActiveTab('organizations')}
           >
             <Building className="w-4 h-4 mr-2 inline-block" />
             Organizaciones
           </Button>
           <Button 
             variant={activeTab === 'users' ? 'primary' : 'outline'}
             onClick={() => setActiveTab('users')}
           >
             <Users className="w-4 h-4 mr-2 inline-block" />
             Usuarios
           </Button>
        </div>
      </div>

      {activeTab === 'organizations' ? (
        <div className="space-y-4">
           <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">Lista de Organizaciones</h2>
              <Button onClick={() => setIsOrgModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2 inline-block" />
                Nueva Organización
              </Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {organizations.map(org => (
               <Card key={org.id} className="relative group">
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteOrganization(org.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                     <Building className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800">{org.name}</h3>
                     <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{org.type}</span>
                   </div>
                 </div>
                 <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-3">
                   <span className="text-slate-500">{org.users} Usuarios</span>
                   <span className={`flex items-center gap-1 ${org.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                     {org.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                     {org.status}
                   </span>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      ) : (
        <div className="space-y-4">
           <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">Lista de Usuarios Global</h2>
              <Button onClick={() => setIsUserModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2 inline-block" />
                Nuevo Usuario
              </Button>
           </div>

           <Card className="overflow-hidden">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-500">
                 <tr>
                   <th className="px-6 py-3 font-medium">Nombre</th>
                   <th className="px-6 py-3 font-medium">Email</th>
                   <th className="px-6 py-3 font-medium">Rol</th>
                   <th className="px-6 py-3 font-medium">Estado</th>
                   <th className="px-6 py-3 font-medium text-right">Acciones</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {usersList.map(user => (
                   <tr key={user.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                     <td className="px-6 py-4 text-slate-500">{user.email}</td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                         {user.role}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                        <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <button onClick={() => deleteUser(user.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </Card>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} title="Nueva Organización">
        <form onSubmit={handleAddOrg} className="space-y-4">
          <Input 
            label="Nombre" 
            placeholder="Ej: Veterinaria Central" 
            value={newOrg.name} 
            onChange={e => setNewOrg({...newOrg, name: e.target.value})} 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
              value={newOrg.type}
              onChange={e => setNewOrg({...newOrg, type: e.target.value})}
            >
              <option value="Veterinaria">Veterinaria</option>
              <option value="PetShop">PetShop</option>
              <option value="NGO">ONG / Refugio</option>
            </select>
          </div>
          <Button type="submit" className="w-full mt-2">Crear Organización</Button>
        </form>
      </Modal>

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Nuevo Usuario">
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input 
            label="Nombre" 
            placeholder="Ej: Juan Perez" 
            value={newUser.name} 
            onChange={e => setNewUser({...newUser, name: e.target.value})} 
            required 
          />
          <Input 
            label="Email" 
            type="email"
            placeholder="juan@example.com" 
            value={newUser.email} 
            onChange={e => setNewUser({...newUser, email: e.target.value})} 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
              value={newUser.role}
              onChange={e => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="Owner">Owner (Dueño)</option>
              <option value="Partner">Partner (Veterinaria)</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full mt-2">Crear Usuario</Button>
        </form>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
