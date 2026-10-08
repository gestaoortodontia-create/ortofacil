export default function Home() {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #2563eb, #312e81)',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '3rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '28rem',
    width: '100%'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2.5rem'
  };

  const iconStyle = {
    display: 'inline-block',
    padding: '1rem',
    background: 'linear-gradient(to bottom right, #60a5fa, #06b6d4)',
    borderRadius: '1rem',
    marginBottom: '1.5rem',
    fontSize: '2rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#dbeafe'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '0.75rem',
    marginBottom: '2.5rem'
  };

  const featureStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const buttonsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '2rem'
  };

  const buttonPrimaryStyle = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '0.75rem',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s'
  };

  const buttonSecondaryStyle = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '0.75rem',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s'
  };

  const footerStyle = {
    textAlign: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.875rem',
    color: '#dbeafe'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconStyle}>🦷</div>
          <h1 style={titleStyle}>OrthoFácil</h1>
          <p style={subtitleStyle}>Gestão Ortodôntica Profissional</p>
        </div>

        <div style={gridStyle}>
          <div style={featureStyle}>
            <p style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>📊</p>
            <p style={{ fontSize: '0.75rem', color: '#dbeafe', margin: 0 }}>Dashboard</p>
          </div>
          <div style={featureStyle}>
            <p style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>👥</p>
            <p style={{ fontSize: '0.75rem', color: '#dbeafe', margin: 0 }}>Pacientes</p>
          </div>
          <div style={featureStyle}>
            <p style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>📅</p>
            <p style={{ fontSize: '0.75rem', color: '#dbeafe', margin: 0 }}>Agenda</p>
          </div>
        </div>

        <div style={buttonsStyle}>
          <a href="/auth/login" style={buttonPrimaryStyle} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
            → Entrar
          </a>
          <a href="/auth/signup" style={buttonSecondaryStyle} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
            + Criar Conta
          </a>
        </div>

        <div style={footerStyle}>
          <p style={{ margin: 0 }}>Sistema profissional para sua clínica</p>
        </div>
      </div>
    </div>
  );
}
