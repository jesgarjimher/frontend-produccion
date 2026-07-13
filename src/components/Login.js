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
            // Llamamos al microservicio auth-service usando tu objeto api.js
            const response = await endpoints.login(username, password);
            
            // Asumiendo que tu auth-service devuelve un objeto con { token, username, rol }
            // Si solo devuelve el string del token, la lógica cambia levemente.
            const { token, rol } = response.data; 

            // Guardamos en el contexto global
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
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Panel de Planta - Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Autenticando en planta...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
};

export default Login;