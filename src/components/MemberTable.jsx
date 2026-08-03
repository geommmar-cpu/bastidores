import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Edit2, Trash2, Search, Paperclip, MessageCircle } from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const getWhatsAppLink = (phone) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/55${cleanPhone}`;
};

const MemberTable = ({ onEdit }) => {
  const { members, deleteMember } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir ${name}?`)) {
      deleteMember(id);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.phone.includes(searchTerm);
    const matchesType = typeFilter === 'Todos' || m.type === typeFilter;
    const matchesStatus = statusFilter === 'Todos' || m.paymentStatus === statusFilter;
    
    // Always hide dropouts unless explicitly requested, or maybe not. 
    // Wait, let's keep dropouts in "Todos" but if statusFilter is 'Desistente', show only them.
    // Since paymentStatus is 'Desistente', it will work automatically because calculateStatus sets it to 'Desistente'.
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pago': return 'badge badge-success';
      case 'Parcial': return 'badge badge-warning';
      case 'Pendente': return 'badge badge-danger';
      case 'Desistente': return 'badge text-red-700 bg-red-100 font-bold';
      default: return 'badge badge-neutral';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="input-group" style={{ margin: 0, flex: '1 1 100%' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Buscar por nome ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 100%' }}>
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
            <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="Todos">Todos os Tipos</option>
              <option value="Jovem">Jovem</option>
              <option value="Casal">Casal</option>
            </select>
          </div>
          
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos os Status</option>
              <option value="Pago">Pago</option>
              <option value="Parcial">Parcial</option>
              <option value="Pendente">Pendente</option>
              <option value="Desistente">Desistentes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome / Telefone</th>
              <th>Tipo</th>
              <th>Ficha / Camisas</th>
              <th>Financeiro</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted" style={{ padding: '2rem' }}>
                  Nenhum membro encontrado.
                </td>
              </tr>
            ) : (
              filteredMembers.map(m => (
                <tr key={m.id} style={m.isDropout ? { backgroundColor: '#FEF2F2', opacity: 0.8 } : {}}>
                  <td>
                    <div 
                      className={m.isDropout ? "font-bold text-red-700 line-through" : "font-bold text-gray-800"} 
                      style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                      {m.name?.toUpperCase()}
                    </div>
                    {!m.isDropout && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted">{m.phone}</span>
                        {m.phone && (
                          <a href={getWhatsAppLink(m.phone)} target="_blank" rel="noopener noreferrer" 
                             className="text-green-500 hover:text-green-600 inline-flex items-center justify-center bg-green-50 rounded-full p-1" title="Chamar no WhatsApp">
                            <MessageCircle size={14} />
                          </a>
                        )}
                      </div>
                    )}
                    {m.type === 'Casal' && m.spouseName && !m.isDropout && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="font-bold text-gray-700" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          Cônjuge: {m.spouseName?.toUpperCase()}
                        </div>
                        {m.spousePhone && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted">{m.spousePhone}</span>
                            <a href={getWhatsAppLink(m.spousePhone)} target="_blank" rel="noopener noreferrer" 
                               className="text-green-500 hover:text-green-600 inline-flex items-center justify-center bg-green-50 rounded-full p-1" title="Chamar no WhatsApp">
                              <MessageCircle size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  
                  {m.isDropout ? (
                    <td colSpan="4" className="text-red-700">
                      <div className="font-bold uppercase text-sm mb-1">Motivo da Desistência:</div>
                      <div className="italic">{m.dropoutReason || 'Não informado'}</div>
                    </td>
                  ) : (
                    <>
                      <td>{m.type}</td>
                      <td>
                        <div>{m.registrationType}</div>
                        {m.shirts && m.shirts.length > 0 && (
                          <div className="text-sm text-muted">
                            {m.shirts.map(s => `${s.quantity}x ${s.size}`).join(', ')}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="text-sm">Total: {formatCurrency(m.totalValue)}</div>
                        <div className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>
                          Pago: {formatCurrency(m.paidValue)}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={getStatusBadgeClass(m.paymentStatus)}>
                            {m.paymentStatus}
                          </span>
                          {m.receipts && m.receipts.length > 0 && (
                            <span title={`${m.receipts.length} Anexo(s)`} style={{ color: 'var(--secondary)' }} className="flex items-center gap-1">
                              <Paperclip size={16} /> <span className="text-xs">{m.receipts.length}</span>
                            </span>
                          )}
                          {m.receipt && (!m.receipts || m.receipts.length === 0) && (
                            <span title="Comprovante Anexado" style={{ color: 'var(--secondary)' }}>
                              <Paperclip size={18} />
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem', marginRight: '0.5rem' }} onClick={() => onEdit(m)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.25rem' }} onClick={() => handleDelete(m.id, m.name)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
