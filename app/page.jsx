export default function Home() {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f1f5 100%)',
    padding: '1rem',
    fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif"
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '3rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    border: 'none',
    maxWidth: '32rem',
    width: '100%'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2.5rem'
  };

  const logoStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    display: 'inline-block'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1A533C',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px'
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: '#4ECDC4',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const dividerStyle = {
    height: '4px',
    background: 'linear-gradient(to right, #1A533C, #4ECDC4)',
    borderRadius: '2px',
    width: '60px',
    margin: '1.5rem auto',
  };

  const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2.5rem'
  };

  const featureItemStyle = {
    textAlign: 'center',
    padding: '1.25rem',
    background: '#f5f7fa',
    borderRadius: '1rem',
    transition: 'all 0.3s',
    cursor: 'pointer'
  };

  const featureIconStyle = {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  };

  const featureNameStyle = {
    fontSize: '0.85rem',
    color: '#1A533C',
    fontWeight: '600'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const buttonPrimaryStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #1A533C 0%, #2C6E7F 100%)',
    color: 'white',
    fontWeight: '700',
    borderRadius: '1rem',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    boxShadow: '0 10px 30px rgba(26, 83, 60, 0.15)'
  };

  const buttonSecondaryStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    background: 'white',
    color: '#1A533C',
    fontWeight: '700',
    borderRadius: '1rem',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    border: '2px solid #4ECDC4',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    boxShadow: '0 10px 30px rgba(78, 205, 196, 0.1)'
  };

  const footerStyle = {
    textAlign: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e8f1f5',
    fontSize: '0.85rem',
    color: '#6b7280'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>🦷</div>
          <h1 style={titleStyle}>ORTOFÁCIL</h1>
          <p style={subtitleStyle}>Sistema Odontológico Inteligente</p>
          <div style={dividerStyle}></div>
        </div>

        <div style={featureGridStyle}>
          <div style={featureItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = '#e8f1f5'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f7fa'}>
            <div style={featureIconStyle}>📊</div>
            <p style={featureNameStyle}>Dashboard</p>
          </div>
          <div style={featureItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = '#e8f1f5'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f7fa'}>
            <div style={featureIconStyle}>👥</div>
            <p style={featureNameStyle}>Pacientes</p>
          </div>
          <div style={featureItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = '#e8f1f5'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f7fa'}>
            <div style={featureIconStyle}>📅</div>
            <p style={featureNameStyle}>Agenda</p>
          </div>
        </div>

        <div style={buttonsContainerStyle}>
          <a
            href="/auth/login"
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(26, 83, 60, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(26, 83, 60, 0.15)';
            }}
          >
            → Entrar
          </a>
          <a
            href="/auth/signup"
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.background = '#4ECDC4';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = 'white';
              e.target.style.color = '#1A533C';
            }}
          >
            + Criar Conta
          </a>
        </div>

        <div style={footerStyle}>
          <p style={{ margin: 0 }}>Gestão completa para sua clínica ortodôntica</p>
        </div>
      </div>
    </div>
  );
}
