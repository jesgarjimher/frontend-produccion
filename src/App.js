import React, { useContext, useState } from 'react';
import Login from './components/Login';
import Ordenes from './components/Ordenes';
import CrearProducto from './components/CrearProducto';
import CatalogoProductos from './components/CatalogoProductos';
import { AuthContext } from './AuthContext';
import GestionUsuarios from './components/GestionUsuarios'; 

function App() {
  const { user, logoutUser } = useContext(AuthContext);
  const [vistaActual, setVistaActual] = useState('ordenes'); 

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

          {/* Menú de Navegación */}
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
               Control de Órdenes
            </button>

            <button 
              onClick={() => setVistaActual('catalogo')}
              style={{ 
                padding: '10px 20px', 
                marginRight: '10px', 
                cursor: 'pointer',
                backgroundColor: vistaActual === 'catalogo' ? '#007bff' : '#e2e6ea',
                color: vistaActual === 'catalogo' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              Catálogo de Productos
            </button>

            {/* Opciones exclusivas para Responsable de Calidad */}
            {user.rol === 'responsable_calidad' && (
              <>
                <button 
                  onClick={() => setVistaActual('crearProducto')}
                  style={{ 
                    padding: '10px 20px', 
                    marginRight: '10px', 
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

                {/*Pestaña de Gestión de Usuarios */}
                <button 
                  onClick={() => setVistaActual('usuarios')}
                  style={{ 
                    padding: '10px 20px', 
                    cursor: 'pointer',
                    backgroundColor: vistaActual === 'usuarios' ? '#007bff' : '#e2e6ea',
                    color: vistaActual === 'usuarios' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  👥 Usuarios
                </button>
              </>
            )}
          </div>

          {/* Vistas Dinámicas */}
          {vistaActual === 'ordenes' && <Ordenes />}
          {vistaActual === 'catalogo' && <CatalogoProductos />}
          {vistaActual === 'crearProducto' && <CrearProducto />}
          {vistaActual === 'usuarios' && <GestionUsuarios />}
        </div>
      )}
    </div>
  );
}

export default App;