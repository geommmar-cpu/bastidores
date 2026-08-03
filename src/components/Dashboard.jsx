import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, Shirt, DollarSign, AlertCircle } from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const Dashboard = () => {
  const { members, settings } = useContext(AppContext);

  const activeMembers = members.filter(m => !m.isDropout);
  const dropoutsCount = members.filter(m => m.isDropout).length;

  const totalPeople = activeMembers.reduce((acc, m) => acc + (m.type === 'Casal' ? 2 : 1), 0);
  
  let totalShirtsCount = 0;
  let peopleWithShirtCount = 0;
  let expectedValue = 0;
  let collectedValue = 0;
  let pendenciesCount = 0;

  activeMembers.forEach(m => {
    if (m.registrationType === 'Com Camisa') {
      peopleWithShirtCount++;
    }
    
    if (m.shirts && m.shirts.length > 0) {
      m.shirts.forEach(s => {
        totalShirtsCount += parseInt(s.quantity || 0, 10);
      });
    }

    expectedValue += parseFloat(m.totalValue || 0);
    collectedValue += parseFloat(m.paidValue || 0);

    if (m.paymentStatus !== 'Pago') {
      pendenciesCount++;
    }
  });

  return (
    <>
      {/* Coordenadores Section */}
      <div className="card mb-6" style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '0.75rem' }}>
        <h3 className="text-xl mb-4" style={{ fontWeight: '700', color: '#1F2937', borderBottom: '2px solid #F3F4F6', paddingBottom: '0.75rem' }}>Equipe Coordenadora</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          {settings.coordinators && settings.coordinators.filter(c => c.trim()).length > 0 ? (
            settings.coordinators.filter(c => c.trim()).map((coord, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#F9FAFB',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
                }}>
                  {coord.charAt(0).toUpperCase()}
                </div>
                <div style={{
                  fontWeight: '700',
                  color: '#374151',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  lineHeight: '1.2',
                  wordBreak: 'break-word'
                }}>
                  {coord}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              padding: '1rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '0.75rem',
              border: '1px dashed #D1D5DB',
              color: '#6B7280',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Nenhum coordenador definido nas configurações.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-center gap-4">
          <div style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '1rem', borderRadius: '0.5rem' }}>
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-muted">Total de Pessoas</p>
            <p className="text-2xl font-bold">{totalPeople}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '1rem', borderRadius: '0.5rem' }}>
            <Shirt size={28} />
          </div>
          <div>
            <p className="text-sm text-muted">Total de Camisas</p>
            <p className="text-2xl font-bold">{totalShirtsCount} <span className="text-sm font-normal">({peopleWithShirtCount} fichas)</span></p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ backgroundColor: '#D1FAE5', color: '#047857', padding: '1rem', borderRadius: '0.5rem' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm text-muted">Arrecadado</p>
            <p className="text-2xl font-bold">{formatCurrency(collectedValue)}</p>
            <p className="text-sm text-muted">Esperado: {formatCurrency(expectedValue)}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '0.5rem' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm text-muted">Pendências</p>
            <p className="text-2xl font-bold">{pendenciesCount}</p>
          </div>
        </div>
        
        {dropoutsCount > 0 && (
          <div className="card flex items-center gap-4 border border-red-200">
            <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '1rem', borderRadius: '0.5rem' }}>
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm text-red-500 font-bold">Desistências</p>
              <p className="text-2xl font-bold text-red-700">{dropoutsCount}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
