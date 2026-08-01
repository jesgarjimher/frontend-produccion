import React, { useState, useEffect, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';
import CrearOrdenForm from './CrearOrdenForm';

const Ordenes = () => {
    const { user } = useContext(AuthContext);
    const [ordenes, setOrdenes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Estado para guardar la cantidad parcial que escribe el usuario para cada orden
    const [cantidadesParciales, setCantidadesParciales] = useState({});

    const cargarOrdenes = async () => {
        try {
            setError('');
            const response = await endpoints.listarOrdenes(filtroEstado);
            setOrdenes(response.data);
        } catch (err) {
            setError('Error al obtener las órdenes de la planta.');
            console.error(err);
        }
    };

    useEffect(() => {
        cargarOrdenes();
    }, [filtroEstado]);

    const manejarCambioEstado = async (id, nuevoEstado) => {
        try {
            setError('');
            setMensajeExito('');
            await endpoints.actualizarEstadoOrden(id, nuevoEstado);
            setMensajeExito(`Orden #${id} actualizada a ${nuevoEstado} con éxito.`);
            cargarOrdenes();
        } catch (err) {
            setError(err.response?.data || 'No se pudo actualizar el estado de la orden.');
        }
    };

    // NUEVA FUNCIÓN: Enviar entregas parciales de stock
    const manejarEnvioParcial = async (id) => {
        const cantidad = cantidadesParciales[id];
        if (!cantidad || cantidad <= 0) {
            setError('Por favor introduce una cantidad válida mayor a 0.');
            return;
        }

        try {
            setError('');
            setMensajeExito('');
            const response = await endpoints.avanzarStockParcial(id, cantidad);
            setMensajeExito(response.data);

            // Limpiamos el input de esa orden específica
            setCantidadesParciales(prev => ({ ...prev, [id]: '' }));
            cargarOrdenes();
        } catch (err) {
            setError(err.response?.data || 'Error al sumar el stock parcial.');
        }
    };

    const manejarCancelar = async (id) => {
        try {
            setError('');
            setMensajeExito('');
            const response = await endpoints.cancelarOrden(id);
            setMensajeExito(response.data);
            cargarOrdenes();
        } catch (err) {
            setError(err.response?.data || 'No tienes permisos para cancelar órdenes.');
        }
    };

    return (
        <div style={{ marginTop: '20px', fontFamily: 'sans-serif' }}>
            <h2>🛠️ Control de Órdenes de Fabricación</h2>

            <CrearOrdenForm onOrdenCreada={cargarOrdenes} />

            {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>{mensajeExito}</div>}

            <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filtrar por Estado:</label>
                <select 
                    value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px' }}
                >
                    <option value="">TODAS LAS ÓRDENES</option>
                    <option value="PENDIENTE">PENDIENTES</option>
                    <option value="EN_PROCESO">EN PROCESO</option>
                    <option value="TERMINADA">TERMINADAS</option>
                    <option value="CANCELADA">CANCELADAS</option>
                </select>
            </div>

            {ordenes.length === 0 ? (
                <p>No se encontraron órdenes de fabricación en este estado.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>ID</th>
                            <th>Código Producto</th>
                            <th>Cantidad Solicitada</th>
                            <th>Estado Actual</th>
                            <th>Acciones de Taller</th>
                            <th>Gestión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map((orden) => (
                            <tr key={orden.id}>
                                <td><strong>#{orden.id}</strong></td>
                                <td>{orden.codigoProducto}</td>
                                <td>{orden.cantidad} unidades</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        color: 'white',
                                        fontWeight: 'bold',
                                        backgroundColor: 
                                            orden.estado === 'PENDIENTE' ? '#ffc107' :
                                            orden.estado === 'EN_PROCESO' ? '#17a2b8' :
                                            orden.estado === 'TERMINADA' ? '#28a745' : '#dc3545'
                                    }}>
                                        {orden.estado}
                                    </span>
                                </td>
                                <td>
                                    {orden.estado === 'PENDIENTE' && (
                                        <button 
                                            onClick={() => manejarCambioEstado(orden.id, 'EN_PROCESO')}
                                            style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Iniciar Fabricación
                                        </button>
                                    )}

                                    {/* ACCIÓN PARCIAL + FINALIZAR */}
                                    {orden.estado === 'EN_PROCESO' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {/* Sección de entrega parcial */}
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input 
                                                    type="number" 
                                                    placeholder="Cant."
                                                    min="1"
                                                    value={cantidadesParciales[orden.id] || ''}
                                                    onChange={(e) => setCantidadesParciales({ ...cantidadesParciales, [orden.id]: e.target.value })}
                                                    style={{ width: '60px', padding: '4px' }}
                                                />
                                                <button 
                                                    onClick={() => manejarEnvioParcial(orden.id)}
                                                    style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    + Sumar Lote
                                                </button>
                                            </div>

                                            {/* Finalizar orden completa */}
                                            <button 
                                                onClick={() => manejarCambioEstado(orden.id, 'TERMINADA')}
                                                style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Finalizar Toda la Orden
                                            </button>
                                        </div>
                                    )}

                                    {orden.estado === 'TERMINADA' && <span>✅ Listo</span>}
                                    {orden.estado === 'CANCELADA' && <span style={{ color: 'gray' }}>❌ Anulada</span>}
                                </td>
                                <td>
                                    {orden.estado !== 'TERMINADA' && orden.estado !== 'CANCELADA' ? (
                                        <button 
                                            onClick={() => manejarCancelar(orden.id)}
                                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Cancelar Orden
                                        </button>
                                    ) : (
                                        <span style={{ color: 'gray' }}>Sin acciones</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Ordenes;