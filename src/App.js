import React, { useContext, useState } from 'react';
import Login from './components/Login';
import Ordenes from './components/Ordenes';
import CrearProducto from './components/CrearProducto'; // Importamos el nuevo componente
import { AuthContext } from './AuthContext';

function App() {
  const { user, logoutUser } = useContext(AuthContext);
  const [vistaActual, setVistaActual] = useState('ordenes'); // 'ordenes' o 'crearProducto'

  return (
    <div className="App" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {!user ? (
        <Login />
      ) : (
        <div>
          {/* Cabecera del Usuario */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
            <div>
              <h1>🏭 Panel del Taller de Producción</h1>
              <p>Operario activo: <strong>{user.username}</strong> | Permisos: <strong style={{ color: '#007bff' }}>{user.rol}</strong></p>
            </div>
            <button 
              onClick={logoutUser} 
              style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Menú de Navegación del Taller */}
          <div style={{ marginTop: '15px', marginBottom: '20px' }}>
            <button 
              onClick={() => setVistaActual('ordenes')}
              style={{ 
                padding: '10px 20px', 
                marginRight: '10px', 
                cursor: 'pointer',
                backgroundColor: vistaActual === 'ordenes' ? '#007bff' : '#e2e6ea',
                color: vistaActual === 'ordenes' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              📋 Control de Órdenes
            </button>

            {/* Mostramos la pestaña de Crear Producto solo a Calidad para mayor nitidez */}
            {user.rol === 'responsable_calidad' && (
              <button 
                onClick={() => setVistaActual('crearProducto')}
                style={{ 
                  padding: '10px 20px', 
                  cursor: 'pointer',
                  backgroundColor: vistaActual === 'crearProducto' ? '#007bff' : '#e2e6ea',
                  color: vistaActual === 'crearProducto' ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                ➕ Alta de Productos
              </button>
            )}
          </div>

          {/* Vistas Dinámicas */}
          {vistaActual === 'ordenes' && <Ordenes />}
          {vistaActual === 'crearProducto' && <CrearProducto />}
        </div>
      )}
    </div>
  );
}

export default App;