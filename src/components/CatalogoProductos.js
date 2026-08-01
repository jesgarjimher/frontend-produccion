import React, { useState, useEffect } from 'react';
import { endpoints } from '../api';

const CatalogoProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarProductos = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await endpoints.listarProductos();
            setProductos(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al conectar con el servicio de producción.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    return (
        <div style={{ marginTop: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>📦 Catálogo Maestro de Productos</h2>
                <button 
                    onClick={cargarProductos}
                    style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🔄 Actualizar Stock
                </button>
            </div>

            {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

            {loading ? (
                <p>Cargando inventario de la planta...</p>
            ) : productos.length === 0 ? (
                <p>No hay productos registrados en el catálogo actualmente.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Nombre Comercial</th>
                            <th>Stock Disponible</th>
                            <th>Estado de Inventario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((prod) => (
                            <tr key={prod.id || prod.codigo}>
                                <td><strong>#{prod.id}</strong></td>
                                <td><code>{prod.codigo}</code></td>
                                <td>{prod.nombre}</td>
                                <td><strong>{prod.stock}</strong> unidades</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        color: 'white',
                                        fontWeight: 'bold',
                                        backgroundColor: prod.stock > 10 ? '#28a745' : prod.stock > 0 ? '#ffc107' : '#dc3545'
                                    }}>
                                        {prod.stock > 10 ? 'Stock Ok' : prod.stock > 0 ? 'Bajo Stock' : 'Agotado'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CatalogoProductos;