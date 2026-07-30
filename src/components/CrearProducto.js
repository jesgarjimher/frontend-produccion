import React, { useState, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';

const CrearProducto = ({ onProductoCreado }) => {
    const { user } = useContext(AuthContext);

    // Estados del formulario
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [stock, setStock] = useState(0);

    // Estados de feedback
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [loading, setLoading] = useState(false);

    //  CONTROL DE SEGURIDAD EN FRONTEND: Validar si es responsable_calidad
    if (user?.rol !== 'responsable_calidad') {
        return (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginTop: '20px', border: '1px solid #ffeeba' }}>
                ⚠️ <strong>Acceso Restringido:</strong> Solo el personal con rol <u>responsable_calidad</u> puede dar de alta nuevos productos en el catálogo maestro.
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');
        setLoading(true);

        // Estructura del JSON que espera tu production-service
        const nuevoProducto = {
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            stock: parseInt(stock, 10)
        };

        try {
            // Llamamos al endpoint configurado en api.js
            await endpoints.crearProducto(nuevoProducto);
            setMensajeExito(`¡Producto "${nombre}" registrado con éxito en la planta!`);
            
            // Limpiamos los campos
            setCodigo('');
            setNombre('');
            setStock(0);

            // Notificamos si se quiere recargar una lista global
            if (onProductoCreado) onProductoCreado();

        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'No se pudo registrar el producto. Verifica si el código ya existe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', maxWidth: '500px' }}>
            <h3>✨ Alta de Nuevo Producto en Catálogo</h3>

            {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>{error}</div>}
            {mensajeExito && <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>{mensajeExito}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Código del Producto:</label>
                    <input 
                        type="text" 
                        value={codigo} 
                        onChange={(e) => setCodigo(e.target.value)} 
                        placeholder="Ej: PROD-200" 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre Comercial:</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Ej: Válvula de Presión 15mm" 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stock Inicial:</label>
                    <input 
                        type="number" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        min="0" 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold' 
                    }}
                >
                    {loading ? 'Guardando en Catálogo...' : 'Guardar Producto'}
                </button>
            </form>
        </div>
    );
};

export default CrearProducto;