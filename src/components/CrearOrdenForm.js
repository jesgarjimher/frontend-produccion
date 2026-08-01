import React, { useState, useEffect } from 'react';
import { endpoints } from '../api';

const CrearOrdenForm = ({ onOrdenCreada }) => {
    const [productos, setProductos] = useState([]);
    const [codigoProducto, setCodigoProducto] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const [loadingProductos, setLoadingProductos] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Cargar la lista de productos del catálogo al cargar el formulario
    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await endpoints.listarProductos();
                setProductos(response.data);
                // Si hay productos, seleccionamos el primero por defecto
                if (response.data.length > 0) {
                    setCodigoProducto(response.data[0].codigo);
                }
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar la lista de productos del catálogo.');
            } finally {
                setLoadingProductos(false);
            }
        };

        obtenerProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!codigoProducto) {
            setError('Debes seleccionar un producto válido.');
            return;
        }

        setEnviando(true);

        const nuevaOrden = {
            codigoProducto: codigoProducto,
            cantidad: parseInt(cantidad, 10)
        };

        try {
            await endpoints.crearOrden(nuevaOrden);
            setMensajeExito('¡Orden de fabricación emitida con éxito!');
            setCantidad(1);

            // Avisamos al componente padre (Ordenes.js) para que recargue la lista de la tabla
            if (onOrdenCreada) onOrdenCreada();
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Error al emitir la orden de fabricación.');
        } finally {
            setEnviando(false);
        }
    };

    if (loadingProductos) {
        return <p style={{ color: '#6c757d' }}>Cargando catálogo de productos...</p>;
    }

    return (
        <div style={{ 
            marginBottom: '25px', 
            padding: '15px 20px', 
            border: '1px solid #b8daff', 
            borderRadius: '8px', 
            backgroundColor: '#e8f4f8' 
        }}>
            <h3 style={{ marginTop: '0', color: '#004085' }}>➕ Emitir Nueva Orden de Fabricación</h3>

            {error && <div style={{ padding: '8px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '10px' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '8px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '10px' }}>{mensajeExito}</div>}

            {productos.length === 0 ? (
                <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
                    ⚠️ No hay productos registrados en el catálogo. Un <i>responsable de calidad</i> debe dar de alta productos primero.
                </p>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    {/* Select con Productos del Catálogo */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Producto:</label>
                        <select 
                            value={codigoProducto} 
                            onChange={(e) => setCodigoProducto(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {productos.map((prod) => (
                                <option key={prod.id || prod.codigo} value={prod.codigo}>
                                    {prod.codigo} - {prod.nombre} (Stock actual: {prod.stock})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input de Cantidad */}
                    <div style={{ width: '120px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cantidad:</label>
                        <input 
                            type="number" 
                            value={cantidad} 
                            onChange={(e) => setCantidad(e.target.value)} 
                            min="1" 
                            required 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Botón Guardar */}
                    <button 
                        type="submit" 
                        disabled={enviando}
                        style={{ 
                            padding: '9px 20px', 
                            backgroundColor: '#0056b3', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer' 
                        }}
                    >
                        {enviando ? 'Creando...' : 'Emitir Orden'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CrearOrdenForm;