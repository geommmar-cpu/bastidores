import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin, coordinators = [] }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // ESTILOS PARA MOBILE (Glassmorphism no fundo da imagem)
  if (isMobile) {
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
        {/* Dark gradient overlay to ensure the poster looks good and the card pops */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 100%)',
        }}></div>

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(20, 20, 25, 0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(153, 27, 27, 0.9) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}>
              <Lock size={30} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0', color: '#F9FAFB', letterSpacing: '0.025em' }}>
              Acesso Restrito
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#D1D5DB', margin: '0.5rem 0 0 0', fontWeight: '400' }}>
              Equipe Bastidores
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#E5E7EB', fontSize: '0.9rem' }}>
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
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(220, 38, 38, 0.6)'; e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#E5E7EB', fontSize: '0.9rem' }}>
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
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(220, 38, 38, 0.6)'; e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; }}
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
                padding: '0.875rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#FCA5A5',
                borderRadius: '0.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
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
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '0.75rem',
                marginTop: '0.5rem',
                color: 'white',
                background: 'linear-gradient(to right, #DC2626, #991B1B)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.39)',
                transition: 'all 0.2s',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ESTILOS PARA PC/TABLET (Split Screen 50/50 Clean)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#FFFFFF' }}>
      
      {/* Esquerda: Formulário de Login */}
      <div style={{
        width: '50%',
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
              Equipe Bastidores
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
                backgroundColor: '#111827',
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

      {/* Direita: Imagem de Fundo */}
      <div style={{
        width: '50%',
        backgroundImage: 'url("/login-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      </div>

    </div>
  );
};

export default Login;
