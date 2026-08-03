import React, { useState, useContext } from 'react';
import { AppContext } from './context/AppContext';
import { Users, Settings, UserPlus, Download } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MemberTable from './components/MemberTable';
import MemberModal from './components/MemberModal';
import SettingsModal from './components/SettingsModal';
import Login from './components/Login';
import Attendance from './components/Attendance';
import { exportToExcel, exportToPDF } from './utils/exportUtils';

function App() {
  const { settings, members, loading } = useContext(AppContext);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [currentTab, setCurrentTab] = useState('membros');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('bastidores_auth') === 'true');
  const [loggedUser, setLoggedUser] = useState(localStorage.getItem('bastidores_user') || '');

  const handleLogin = (username) => {
    localStorage.setItem('bastidores_auth', 'true');
    localStorage.setItem('bastidores_user', username);
    setLoggedUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bastidores_auth');
    localStorage.removeItem('bastidores_user');
    setIsLoggedIn(false);
  };

  const handleAddClick = () => {
    setEditingMember(null);
    setMemberModalOpen(true);
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setMemberModalOpen(true);
  };

  const handleExportExcel = () => {
    exportToExcel(members, settings);
  };

  const handleExportPDF = () => {
    exportToPDF(members, settings);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
          <p className="text-muted">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} coordinators={settings.coordinators || []} />;
  }

  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <div className="flex items-center gap-2">
          <Users size={24} />
          <h1 style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Equipe Bastidores</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{settings.eventName}</span>
          </h1>
        </div>
        <div className="nav-actions">
          <div className="hide-on-mobile items-center gap-2 mr-2 border-r pr-4 border-gray-300 text-sm" style={{ display: 'flex' }}>
            <span>Olá, <strong>{loggedUser}</strong></span>
          </div>
          <button className="btn px-3 py-1 text-white text-sm flex-shrink-0" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={handleLogout} title="Sair">
            Sair
          </button>
          <button className="btn flex-shrink-0 flex items-center justify-center gap-1 text-sm" style={{ backgroundColor: '#10B981', color: 'white' }} onClick={handleExportExcel} title="Exportar Planilha Excel">
            <Download size={16} /> <span>Excel</span>
          </button>
          <button className="btn flex-shrink-0 flex items-center justify-center gap-1 text-sm" style={{ backgroundColor: '#F59E0B', color: 'white' }} onClick={handleExportPDF} title="Exportar PDF">
            <Download size={16} /> <span>PDF</span>
          </button>
          <button className="btn btn-nav" onClick={() => setSettingsModalOpen(true)} title="Configurações">
            <Settings size={18} /> <span className="nav-text">Config</span>
          </button>
        </div>
      </nav>

      <main className="container flex-col gap-6" style={{ display: 'flex' }}>
        <div className="tabs-container">
          <button 
            className={`tab-btn ${currentTab === 'membros' ? 'active' : ''}`}
            onClick={() => setCurrentTab('membros')}
          >
            Membros
          </button>
          <button 
            className={`tab-btn ${currentTab === 'chamada' ? 'active' : ''}`}
            onClick={() => setCurrentTab('chamada')}
          >
            Chamada
          </button>
        </div>

        {currentTab === 'membros' ? (
          <>
            <div className="flex justify-between items-center">
              <h2>Painel de Controle</h2>
              <button className="btn btn-primary" onClick={handleAddClick}>
                <UserPlus size={18} /> Novo Membro
              </button>
            </div>
            <Dashboard />
            <MemberTable onEdit={handleEditClick} />
          </>
        ) : (
          <Attendance />
        )}
      </main>

      {isMemberModalOpen && (
        <MemberModal 
          onClose={() => setMemberModalOpen(false)} 
          editingMember={editingMember}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal 
          onClose={() => setSettingsModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
