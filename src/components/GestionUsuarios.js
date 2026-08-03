import React, { useState, useEffect, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';

const GestionUsuarios = () => {
    const { user: usuarioLogueado } = useContext(AuthContext);

    // Estados para la lista
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el formulario de registro
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('trabajador');

    // Feedback
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [registrando, setRegistrando] = useState(false);

    // 🔥 CONTROL DE SEGURIDAD EN FRONTEND: Solo responsable_calidad
    if (usuarioLogueado?.rol !== 'responsable_calidad') {
        return (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginTop: '20px', border: '1px solid #ffeeba' }}>
                ⚠️ <strong>Acceso Restringido:</strong> Solo el <u>responsable_calidad</u> puede gestionar los usuarios del sistema.
            </div>
        );
    }

    // Nota: Como no teníamos un endpoint explícito de listar todos los usuarios en auth-service,
    // gestionamos la creación y borrado directamente por ID o mantenemos el control visual.
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');
        setRegistrando(true);

        try {
            await endpoints.register({ nombre, password, rol });
            setMensajeExito(`¡Usuario "${nombre}" registrado correctamente con el rol [${rol}]!`);
            
            // Limpiar formulario
            setNombre('');
            setPassword('');
            setRol('trabajador');
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Error al registrar el usuario. Es posible que el nombre ya esté en uso.');
        } finally {
            setRegistrando(false);
        }
    };

    const handleBorrarUsuario = async (id, nombreUsuario) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombreUsuario}" (ID: ${id})?`)) {
            return;
        }

        setError('');
        setMensajeExito('');

        try {
            await endpoints.borrarUsuario(id);
            setMensajeExito(`Usuario "${nombreUsuario}" eliminado con éxito.`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'No se pudo eliminar el usuario.');
        }
    };

    return (
        <div style={{ marginTop: '20px', fontFamily: 'sans-serif' }}>
            <h2>👥 Gestión de Personal del Taller</h2>

            {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{mensajeExito}</div>}

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* 1. Formulario para DAR DE ALTA un nuevo usuario */}
                <div style={{ flex: '1', minWidth: '300px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ marginTop: 0, color: '#0056b3' }}>➕ Dar de Alta Nuevo Operario</h3>
                    
                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de Usuario:</label>
                            <input 
                                type="text" 
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                required 
                                placeholder="Ej: operario_5"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rol en Planta:</label>
                            <select 
                                value={rol} 
                                onChange={(e) => setRol(e.target.value)}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            >
                                <option value="trabajador">trabajador (Operario de Taller)</option>
                                <option value="responsable_calidad">responsable_calidad (Gestor / Supervisor)</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={registrando}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                fontWeight: 'bold', 
                                cursor: 'pointer' 
                            }}
                        >
                            {registrando ? 'Registrando...' : 'Guardar Usuario'}
                        </button>
                    </form>
                </div>

                {/* 2. Sección para BORRAR usuario por ID */}
                <div style={{ flex: '1', minWidth: '300px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ marginTop: 0, color: '#dc3545' }}>🗑️ Dar de Baja Usuario por ID</h3>
                    <p style={{ fontSize: '14px', color: '#6c757d' }}>
                        Introduce el identificador (ID) único del usuario registrado en la base de datos para revocar su acceso.
                    </p>

                    <FormularioBorrarUsuario onBorrar={handleBorrarUsuario} />
                </div>

            </div>
        </div>
    );
};

// Subcomponente simple para capturar el ID a borrar
const FormularioBorrarUsuario = ({ onBorrar }) => {
    const [idBorrar, setIdBorrar] = useState('');
    const [nombreConfirmacion, setNombreConfirmacion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (idBorrar) {
            onBorrar(idBorrar, nombreConfirmacion || `ID #${idBorrar}`);
            setIdBorrar('');
            setNombreConfirmacion('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ID del Usuario:</label>
                <input 
                    type="number" 
                    value={idBorrar} 
                    onChange={(e) => setIdBorrar(e.target.value)} 
                    required 
                    placeholder="Ej: 3"
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre (Opcional, para confirmación):</label>
                <input 
                    type="text" 
                    value={nombreConfirmacion} 
                    onChange={(e) => setNombreConfirmacion(e.target.value)} 
                    placeholder="Ej: operario_2"
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            <button 
                type="submit" 
                style={{ 
                    width: '100%', 
                    padding: '10px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                }}
            >
                Eliminar Usuario
            </button>
        </form>
    );
};

export default GestionUsuarios;