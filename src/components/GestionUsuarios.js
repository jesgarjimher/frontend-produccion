import React, { useState, useEffect, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';
import '../index.css'; // Estilos para bordes delimitados

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
            <div className="alert alert-warning border-warning shadow-sm my-4 d-flex align-items-center gap-2" role="alert">
                <span className="fs-4">⚠️</span>
                <div>
                    <strong>Acceso Restringido:</strong> Solo el personal con rol <u>responsable_calidad</u> puede gestionar los usuarios del sistema.
                </div>
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
            await endpoints.borrarUsuario(nombreUsuario);
            setMensajeExito(`Usuario "${nombreUsuario}" eliminado con éxito.`);
            cargarUsuarios();
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'No se pudo eliminar al usuario.');
        }
    };

    return (
        <div className="container-fluid mt-4 px-2 px-md-4">
            <h2 className="fw-bold mb-4">Control de Usuarios y Permisos de Planta</h2>

            {/* ALERTAS DE FEEDBACK */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show fw-bold mb-3" role="alert">
                    {error}
                </div>
            )}
            {mensajeExito && (
                <div className="alert alert-success alert-dismissible fade show fw-bold mb-3" role="alert">
                    {mensajeExito}
                </div>
            )}

            {/* FORMULARIO DE ALTA (TARJETA VERDE SUAVE) */}
            <div className="card border-success-subtle shadow-sm mb-5">
                <div className="card-header bg-success-subtle text-success-emphasis border-0 py-3">
                    <h3 className="h5 card-title mb-0 fw-bold d-flex align-items-center justify-content-center gap-2 text-center w-100">
                         Registrar Nuevo Usuario
                    </h3>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleRegister}>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-secondary">Usuario:</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    required 
                                    placeholder="Ej: operario_5"
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-secondary">Contraseña:</label>
                                <input 
                                    type="password" 
                                    className="form-control"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label fw-bold small text-secondary">Rol en Sistema:</label>
                                <select 
                                    className="form-select"
                                    value={rol} 
                                    onChange={(e) => setRol(e.target.value)}
                                >
                                    <option value="trabajador">trabajador</option>
                                    <option value="responsable_calidad">responsable_calidad</option>
                                </select>
                            </div>

                            <div className="col-md-2">
                                <button 
                                    type="submit" 
                                    disabled={registrando}
                                    className="btn btn-success w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1"
                                >
                                    {registrando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Crear Usuario'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* TABLA DE USUARIOS */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h4 fw-bold m-0">Usuarios Registrados</h3>
                <button 
                    onClick={cargarUsuarios} 
                    className="btn btn-secondary btn-sm fw-bold shadow-sm d-flex align-items-center gap-1"
                >
                    🔄 Recargar Tabla
                </button>
            </div>

            {loadingTabla ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted fw-bold">Cargando lista de usuarios...</p>
                </div>
            ) : usuarios.length === 0 ? (
                <div className="alert alert-info">
                    No hay usuarios registrados actualmente.
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-bordered table-hover align-middle tabla-usuarios mb-0">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Nombre de Usuario</th>
                                <th>Rol Asignado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => {
                                const userName = u.nombre || u.username;
                                const nombreRol = typeof u.rol === 'object' ? u.rol?.nombre : u.rol;

                                return (
                                    <tr key={u.id}>
                                        <td className="text-center"><strong>#{u.id}</strong></td>
                                        <td className="fw-semibold">{userName}</td>
                                        
                                        {/* ROL SIN ESTILO DE BOTÓN (TEXTO PLANO / SUAVE) */}
                                        <td className="text-center">
                                            <span className={`fw-bold ${nombreRol === 'responsable_calidad' ? 'text-primary' : 'text-secondary'}`}>
                                                {nombreRol}
                                            </span>
                                        </td>

                                        {/* ACCIONES (BOTÓN CON X) */}
                                        <td className="text-center">
                                            {userName !== usuarioLogueado.username ? (
                                                <button 
                                                    onClick={() => handleBorrarUsuario(userName)}
                                                    className="btn btn-outline-danger btn-sm fw-bold px-3"
                                                >
                                                    ❌ Eliminar
                                                </button>
                                            ) : (
                                                <span className="badge bg-light text-muted border px-2 py-1">
                                                    (Usuario Activo)
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;