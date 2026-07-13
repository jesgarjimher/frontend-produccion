import React, { useContext } from 'react';
import Login from './components/Login';
import Ordenes from './components/Ordenes';
import { AuthContext } from './AuthContext';

function App() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="App" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {!user ? (
        <Login />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
            <div>
              <h1>🏭 Panel del Taller</h1>
              <p>Operario activo: <strong>{user.username}</strong> | Permisos de: <strong style={{ color: '#007bff' }}>{user.rol}</strong></p>
            </div>
            <button 
              onClick={logoutUser} 
              style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Cerrar Sesión
            </button>
          </div>
          
          <Ordenes />
        </div>
      )}
    </div>
  );
}

export default App;