import React, { useContext, useState } from 'react';
import Login from './components/Login';
import Ordenes from './components/Ordenes';
import CrearProducto from './components/CrearProducto';
import CatalogoProductos from './components/CatalogoProductos';
import { AuthContext } from './AuthContext';
import GestionUsuarios from './components/GestionUsuarios'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { user, logoutUser } = useContext(AuthContext);
  const [vistaActual, setVistaActual] = useState('ordenes'); 

  return (
    <div className="App min-vh-100 bg-light">
      {!user ? (
        <Login />
      ) : (
        <div>
          {/* CABECERA PRINCIPAL ESTILO NAVBAR NEGRO */}
          <header className="bg-dark text-white py-3 px-4 mb-4 shadow-sm">
            <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="h3 mb-1 fw-bold text-white d-flex align-items-center gap-2">
                  Sistema de Gestión
                </h1>
                <p className="mb-0 small text-light opacity-75">
                  Operario activo: <strong className="text-info">{user.username}</strong> 
                  <span className="mx-2">|</span> 
                  Permisos: <strong className="text-info">{user.rol}</strong>
                </p>
              </div>

              <div>
                <button 
                  onClick={logoutUser} 
                  className="btn btn-danger btn-sm fw-bold px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                >
                   Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          {/* CONTENEDOR PRINCIPAL */}
          <main className="container-fluid px-4" style={{ maxWidth: '1200px' }}>
            
            {/* MENÚ DE NAVEGACIÓN (PESTAÑAS) */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => setVistaActual('ordenes')}
                className={`btn fw-bold px-3 py-2 ${vistaActual === 'ordenes' ? 'btn-primary' : 'btn-outline-secondary bg-white text-dark'}`}
              >
                ⚙️ Control de Órdenes
              </button>

              <button 
                onClick={() => setVistaActual('catalogo')}
                className={`btn fw-bold px-3 py-2 ${vistaActual === 'catalogo' ? 'btn-primary' : 'btn-outline-secondary bg-white text-dark'}`}
              >
                📦 Catálogo de Productos
              </button>

              {/* Opciones exclusivas para Responsable de Calidad */}
              {user.rol === 'responsable_calidad' && (
                <>
                  <button 
                    onClick={() => setVistaActual('crearProducto')}
                    className={`btn fw-bold px-3 py-2 ${vistaActual === 'crearProducto' ? 'btn-primary' : 'btn-outline-secondary bg-white text-dark'}`}
                  >
                    ➕ Alta de Productos
                  </button>

                  <button 
                    onClick={() => setVistaActual('usuarios')}
                    className={`btn fw-bold px-3 py-2 ${vistaActual === 'usuarios' ? 'btn-primary' : 'btn-outline-secondary bg-white text-dark'}`}
                  >
                    👥 Usuarios
                  </button>
                </>
              )}
            </div>

            {/* VISTAS DINÁMICAS */}
            <div className="bg-white p-3 p-md-4 rounded shadow-sm border">
              {vistaActual === 'ordenes' && <Ordenes />}
              {vistaActual === 'catalogo' && <CatalogoProductos />}
              {vistaActual === 'crearProducto' && <CrearProducto />}
              {vistaActual === 'usuarios' && <GestionUsuarios />}
            </div>

          </main>
        </div>
      )}
    </div>
  );
}

export default App;