function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: '1rem'
      }}>
        Ask Me Frontend 🚀
      </h1>
      <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
        Servidor funcionando perfeitamente! By Nuon
      </p>
      <div style={{
        marginTop: '1.5rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ color: '#059669', fontWeight: '600' }}>
          ✅ Frontend configurado com sucesso!
        </p>
      </div>
    </div>
  )
}

export default App