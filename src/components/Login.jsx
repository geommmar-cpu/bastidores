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
    
    // Check if the entered name matches exactly, or if it's part of the coordinator's name
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
      backgroundImage: 'url("/login-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '1rem',
      position: 'relative'
    }}>
      {/* Overlay Escuro para destacar o card */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}></div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
          }}>
            <Lock size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0', color: '#1F2937' }}>
            Acesso Restrito
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#4B5563', margin: '0.5rem 0 0 0', fontWeight: '500' }}>
            Equipe de Coordenação Bastidores
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.9rem' }}>
              Seu Nome
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#6B7280' }}>
                <User size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Ex: Geomar" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem', 
                  borderRadius: '0.75rem',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'; }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.9rem' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#6B7280' }}>
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 2.75rem', 
                  borderRadius: '0.75rem',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '1rem',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.875rem',
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              borderRadius: '0.5rem',
              border: '1px solid #F87171',
              fontSize: '0.875rem',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '0.75rem',
              marginTop: '0.5rem',
              color: 'white',
              background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -1px rgba(79, 70, 229, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
