import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Check, X, Plus, Trash2, Download } from 'lucide-react';
import { exportAttendancePDF } from '../utils/exportUtils';

const Attendance = () => {
  const { members, settings, updateSettings, updateMember } = useContext(AppContext);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const columns = settings.attendanceColumns || [];

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    
    // Prevent duplicates
    if (columns.includes(newColumnName.trim())) {
      alert('Já existe uma coluna com este nome.');
      return;
    }

    const newColumns = [...columns, newColumnName.trim()];
    updateSettings({ attendanceColumns: newColumns });
    setNewColumnName('');
    setIsAddingColumn(false);
  };

  const handleRemoveColumn = (colName) => {
    if (window.confirm(`Tem certeza que deseja remover a coluna "${colName}"? Isso não apagará os registros individuais, mas esconderá a coluna.`)) {
      const newColumns = columns.filter(c => c !== colName);
      updateSettings({ attendanceColumns: newColumns });
    }
  };

  const toggleAttendance = (member, colName) => {
    const currentAttendance = member.attendance || {};
    const isPresent = !!currentAttendance[colName];
    
    updateMember(member.id, {
      attendance: {
        ...currentAttendance,
        [colName]: !isPresent
      }
    });
  };

  // Filter out dropouts
  const activeMembers = members.filter(m => !m.isDropout);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Controle de Presença</h2>
        
        {!isAddingColumn ? (
          <button className="btn btn-primary text-sm flex items-center gap-1" onClick={() => setIsAddingColumn(true)}>
            <Plus size={16} /> Adicionar Dia/Reunião
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              className="input text-sm" 
              placeholder="Ex: Reunião 01/08" 
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              style={{ margin: 0, padding: '0.4rem 0.75rem' }}
              autoFocus
            />
            <button className="btn btn-primary text-sm" onClick={handleAddColumn}>Salvar</button>
            <button className="btn btn-secondary text-sm" onClick={() => setIsAddingColumn(false)}>Cancelar</button>
          </div>
        )}
      </div>

      {columns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma coluna de chamada configurada. Clique em "Adicionar Dia/Reunião" para começar.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 font-semibold text-sm text-gray-600">Nome</th>
                <th className="p-3 font-semibold text-sm text-gray-600">Função</th>
                {columns.map(col => (
                  <th key={col} className="p-3 font-semibold text-sm text-gray-600 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>{col}</span>
                      <button 
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleRemoveColumn(col)}
                        title="Remover coluna"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeMembers.map(member => {
                const displayName = member.type === 'Casal' && member.spouseName 
                  ? `${member.name} e ${member.spouseName}` 
                  : member.name;
                  
                return (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium">{String(displayName || '').toUpperCase()}</td>
                  <td className="p-3 text-sm text-gray-600">{String(member.role || '').toUpperCase()}</td>
                  {columns.map(col => {
                    const isPresent = member.attendance && member.attendance[col];
                    return (
                      <td key={col} className="p-3 text-center">
                        <button
                          onClick={() => toggleAttendance(member, col)}
                          className={`btn-attendance ${isPresent ? 'present' : 'absent'}`}
                          title={isPresent ? 'Presente (clique para faltar)' : 'Falta (clique para presença)'}
                        >
                          {isPresent ? <Check size={16} /> : <X size={16} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              )})}
              
              {activeMembers.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className="p-4 text-center text-gray-500">
                    Nenhum membro ativo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {columns.length > 0 && activeMembers.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button 
                className="btn btn-primary" 
                onClick={() => exportAttendancePDF(members, settings)}
              >
                <Download size={18} />
                Gerar Relatório de Chamada
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
