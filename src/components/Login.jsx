import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin, coordinators = [] }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredName = username.trim().toLowerCase();
    
    if (!enteredName) return;

    const validCoordinators = coordinators.map(c => c.trim().toLowerCase()).filter(c => c);
    
    // Check if the entered name matches exactly, or if it's part of the coordinator's name (like just the first name)
    const isCoordinator = validCoordinators.some(c => 
      c === enteredName || 
      c.includes(enteredName) && enteredName.length > 3
    );

    if (!isCoordinator) {
      setError('Acesso negado. Apenas coordenadores podem acessar.');
      return;
    }

    if (password.toLowerCase() === 'bastidores') {
      onLogin(username);
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '0',
        overflow: 'hidden',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: 'none',
        backgroundColor: '#fff'
      }}>
        
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Lock size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>Acesso Restrito</h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0.5rem 0 0 0' }}>Equipe de Coordenação</p>
        </div>

        {/* Form Section */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1.25rem', display: 'flex' }}>
            
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Seu Nome</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Ex: Geomar" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem', height: '2.75rem', borderRadius: '0.5rem' }}
                />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '3rem', height: '2.75rem', borderRadius: '0.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0.75rem',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                borderRadius: '0.5rem',
                border: '1px solid #F87171',
                fontSize: '0.875rem',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                marginTop: '0.5rem',
                background: 'linear-gradient(to right, var(--primary), var(--primary-hover))'
              }}
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
