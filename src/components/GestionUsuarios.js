import React, { useState, useEffect, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';

const GestionUsuarios = () => {
    const { user: usuarioLogueado } = useContext(AuthContext);

    // Estados para la tabla
    const [usuarios, setUsuarios] = useState([]);
    const [loadingTabla, setLoadingTabla] = useState(true);

    // Estados para el formulario de nuevo usuario
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('trabajador');

    // Feedback
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [registrando, setRegistrando] = useState(false);

    // Cargar la lista de usuarios desde el backend
    const cargarUsuarios = async () => {
        try {
            setLoadingTabla(true);
            setError('');
            const response = await endpoints.listarUsuarios();
            setUsuarios(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener la lista de usuarios del auth-service.');
        } finally {
            setLoadingTabla(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // CONTROL DE SEGURIDAD EN FRONTEND: Solo responsable_calidad
    if (usuarioLogueado?.rol !== 'responsable_calidad') {
        return (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginTop: '20px', border: '1px solid #ffeeba' }}>
                ⚠️ <strong>Acceso Restringido:</strong> Solo el <u>responsable_calidad</u> puede gestionar los usuarios del sistema.
            </div>
        );
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');
        setRegistrando(true);

        try {
            await endpoints.register({ nombre, password, rol });
            setMensajeExito(`¡Usuario "${nombre}" creado con éxito!`);
            
            // Limpiar formulario y recargar la tabla
            setNombre('');
            setPassword('');
            setRol('trabajador');
            cargarUsuarios();
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Error al registrar el usuario. Comprueba si el nombre ya existe.');
        } finally {
            setRegistrando(false);
        }
    };

    const handleBorrarUsuario = async (nombreUsuario) => {
        if (!window.confirm(`¿Seguro que deseas eliminar al usuario "${nombreUsuario}"?`)) {
            return;
        }

        setError('');
        setMensajeExito('');

        try {
            // Se envía el nombre como parámetro para coincidir con /auth/delete/{nombre}
            await endpoints.borrarUsuario(nombreUsuario);
            setMensajeExito(`Usuario "${nombreUsuario}" eliminado con éxito.`);
            cargarUsuarios(); // Recargamos la tabla para reflejar la baja
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'No se pudo eliminar al usuario.');
        }
    };

    return (
        <div style={{ marginTop: '20px', fontFamily: 'sans-serif' }}>
            <h2>👥 Control de Usuarios y Permisos de Planta</h2>

            {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>{mensajeExito}</div>}

            {/* FORMULARIO DE ALTA */}
            <div style={{ marginBottom: '30px', padding: '15px 20px', border: '1px solid #c3e6cb', borderRadius: '8px', backgroundColor: '#e2f0d9' }}>
                <h3 style={{ marginTop: 0, color: '#155724' }}>➕ Registrar Nuevo Usuario</h3>
                <form onSubmit={handleRegister} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuario:</label>
                        <input 
                            type="text" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            required 
                            placeholder="Ej: operario_5"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ flex: '1', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ width: '220px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rol en Sistema:</label>
                        <select 
                            value={rol} 
                            onChange={(e) => setRol(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="trabajador">trabajador</option>
                            <option value="responsable_calidad">responsable_calidad</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={registrando}
                        style={{ padding: '9px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {registrando ? 'Guardando...' : 'Crear Usuario'}
                    </button>
                </form>
            </div>

            {/* TABLA DE USUARIOS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>📋 Usuarios Registrados en la Base de Datos</h3>
                <button 
                    onClick={cargarUsuarios} 
                    style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    🔄 Recargar Tabla
                </button>
            </div>

            {loadingTabla ? (
                <p>Cargando lista de usuarios...</p>
            ) : usuarios.length === 0 ? (
                <p>No hay usuarios registrados actualmente.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>ID</th>
                            <th>Nombre de Usuario</th>
                            <th>Rol Asignado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => {
                            // Extraemos el nombre de usuario de forma segura
                            const userName = u.nombre || u.username;
                            // Extraemos el rol soportando objeto { id, nombre } o String
                            const nombreRol = typeof u.rol === 'object' ? u.rol?.nombre : u.rol;

                            return (
                                <tr key={u.id}>
                                    <td><strong>#{u.id}</strong></td>
                                    <td>{userName}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            color: 'white',
                                            fontWeight: 'bold',
                                            backgroundColor: nombreRol === 'responsable_calidad' ? '#007bff' : '#6c757d'
                                        }}>
                                            {nombreRol}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Evitamos eliminar al propio usuario en sesión */}
                                        {userName !== usuarioLogueado.username ? (
                                            <button 
                                                onClick={() => handleBorrarUsuario(userName)}
                                                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        ) : (
                                            <span style={{ color: 'gray', fontSize: '12px' }}> (Usuario Activo)</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionUsuarios;