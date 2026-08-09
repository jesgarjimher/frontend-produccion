import React, { useState, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await endpoints.login(username, password);
            const { token, rol } = response.data; 

            loginUser(token, username, rol);
            
            if (onLoginSuccess) onLoginSuccess();
            
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Credenciales incorrectas o error en el servidor de planta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg border-0 w-100" style={{ maxWidth: '420px' }}>
                
                {/* CABECERA ESTILO NAVBAR OSCURO */}
                <div className="card-header bg-dark text-white text-center py-3 border-0">
                    <h2 className="h4 mb-0 fw-bold d-flex align-items-center justify-content-center gap-2">
                        Producción ERP
                    </h2>
                    <small className="text-info opacity-75 fw-semibold">Sistema de Control e Inventario</small>
                </div>

                {/* CUERPO DEL FORMULARIO */}
                <div className="card-body p-4">
                    <h3 className="h5 text-center text-secondary mb-4 fw-bold">Iniciar Sesión</h3>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show fw-bold small mb-3" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* CAMPO USUARIO */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-secondary">
                                Usuario:
                            </label>
                            <input 
                                type="text" 
                                className="form-control"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                                placeholder="Ej: jefe_calidad"
                            />
                        </div>

                        {/* CAMPO CONTRASEÑA */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-secondary">
                                Contraseña:
                            </label>
                            <input 
                                type="password" 
                                className="form-control"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                            />
                        </div>

                        {/* BOTÓN DE ACCESO */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn btn-primary w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Autenticando en planta...
                                </>
                            ) : (
                                '🔑 Ingresar'
                            )}
                        </button>
                    </form>
                </div>

                {/* PIE DE TARJETA CON IDENTIDAD DE MARCA */}
                <div className="card-footer bg-light text-center text-muted py-2 small border-0">
                    Acceso Restringido • Personal Autorizado
                </div>
            </div>
        </div>
    );
};

export default Login;