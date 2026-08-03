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
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#FFFFFF' }}>
      
      {/* Esquerda: Formulário de Login */}
      <div style={{
        width: '100%',
        flex: '1 1 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
              Acesso Restrito
            </h1>
            <p style={{ fontSize: '1rem', color: '#6B7280', margin: 0 }}>
              Equipe de Coordenação Bastidores
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.9rem' }}>
                Seu Nome
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
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
                    borderRadius: '0.5rem',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#DC2626'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.backgroundColor = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.9rem' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
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
                    borderRadius: '0.5rem',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#DC2626'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.backgroundColor = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
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
                    color: '#9CA3AF',
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
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '0.5rem',
                marginTop: '1rem',
                color: 'white',
                backgroundColor: '#111827', // dark almost black, matching reference
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#111827'}
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>

      {/* Direita: Imagem de Fundo (Só no PC) */}
      <div className="hidden md:block" style={{
        flex: '1 1 50%',
        backgroundImage: 'url("/login-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Adicionei um pequeno overlay escuro na imagem se quiser colocar texto como no exemplo, mas deixei transparente pra focar só na imagem */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)'
        }}></div>
      </div>

    </div>
  );
};

export default Login;
