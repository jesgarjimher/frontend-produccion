import React, { useState, useEffect } from 'react';
import { endpoints } from '../api';
import '../index.css'; 

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

    // Helper para asignar clases de Badge según nivel de stock
    const obtenerBadgeStock = (stock) => {
        if (stock > 10) {
            return { class: 'bg-success text-white', text: 'Stock Ok' };
        }
        if (stock > 0) {
            return { class: 'bg-warning text-dark', text: 'Bajo Stock' };
        }
        return { class: 'bg-danger text-white', text: 'Agotado' };
    };

    // Helper para dar color tenue a la fila según estado del stock
    const obtenerClaseFila = (stock) => {
        if (stock === 0) return 'stock-agotado';
        if (stock <= 10) return 'stock-bajo';
        return '';
    };

    return (
        <div className="container-fluid mt-4 px-2 px-md-4">
            {/* CABECERA Y BOTÓN DE REFRESCAR */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">📦 Catálogo Maestro de Productos</h2>
                <button 
                    onClick={cargarProductos}
                    className="btn btn-secondary btn-sm fw-bold shadow-sm d-flex align-items-center gap-2"
                >
                    🔄 Actualizar Stock
                </button>
            </div>

            {/* ALERTAS */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show fw-bold" role="alert">
                    {error}
                </div>
            )}

            {/* ESTADOS DE CARGA / TABLA */}
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted fw-bold">Cargando inventario de la planta...</p>
                </div>
            ) : productos.length === 0 ? (
                <div className="alert alert-info">
                    No hay productos registrados en el catálogo actualmente.
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-bordered table-hover align-middle tabla-productos mb-0">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Código</th>
                                <th>Nombre Comercial</th>
                                <th>Stock Disponible</th>
                                <th>Estado de Inventario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => {
                                const badgeInfo = obtenerBadgeStock(prod.stock);
                                return (
                                    <tr key={prod.id || prod.codigo} className={obtenerClaseFila(prod.stock)}>
                                        <td className="text-center">
                                            <strong>#{prod.id}</strong>
                                        </td>
                                        <td className="text-center">
                                            <code className="fw-bold fs-6 text-primary">{prod.codigo}</code>
                                        </td>
                                        <td className="fw-semibold">
                                            {prod.nombre}
                                        </td>
                                        <td className="text-center fs-6">
                                            <strong>{prod.stock}</strong> <span className="text-muted fs-7">unidades</span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${badgeInfo.class} fs-6 px-3 py-2 shadow-sm`}>
                                                {badgeInfo.text}
                                            </span>
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

export default CatalogoProductos;