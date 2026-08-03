import React, { useState, useEffect, useContext } from 'react';
import { endpoints } from '../api';
import { AuthContext } from '../AuthContext';
import CrearOrdenForm from './CrearOrdenForm';
import '../index.css';

const Ordenes = () => {
    const { user } = useContext(AuthContext);
    const [ordenes, setOrdenes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Estado para la cantidad parcial por cada orden
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

    // Clase CSS según estado para la fila
    const obtenerClaseFila = (estado) => {
        if (estado === 'TERMINADA') return 'fila-orden estado-terminada';
        if (estado === 'CANCELADA') return 'fila-orden estado-cancelada';
        return 'fila-orden';
    };

    // Color del Badge de estado
    const obtenerClaseBadge = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-warning text-dark';
            case 'EN_PROCESO': return 'bg-info text-white';
            case 'TERMINADA': return 'bg-success text-white';
            case 'CANCELADA': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <div className="container-fluid mt-4 px-2 px-md-4 font-sans">
            <h2 className="mb-4 fw-bold">🛠️ Control de Órdenes de Fabricación</h2>

            <CrearOrdenForm onOrdenCreada={cargarOrdenes} />

            {/* FEEDBACK */}
            {error && <div className="alert alert-danger alert-dismissible fade show fw-bold mt-3" role="alert">{error}</div>}
            {mensajeExito && <div className="alert alert-success alert-dismissible fade show fw-bold mt-3" role="alert">{mensajeExito}</div>}

            {/* FILTRO DE ESTADO ESTILIZADO */}
            <div className="row my-4 align-items-center">
                <div className="col-12 col-sm-8 col-md-5 col-lg-4">
                    <label className="form-label fw-bold mb-1">Filtrar por Estado:</label>
                    <select 
                        className="form-select form-select-md shadow-sm border-secondary-subtle"
                        value={filtroEstado} 
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="">TODAS LAS ÓRDENES</option>
                        <option value="PENDIENTE">PENDIENTES</option>
                        <option value="EN_PROCESO">EN PROCESO</option>
                        <option value="TERMINADA">TERMINADAS</option>
                        <option value="CANCELADA">CANCELADAS</option>
                    </select>
                </div>
            </div>

            {/* TABLA DE ÓRDENES */}
            {ordenes.length === 0 ? (
                <div className="alert alert-info">No se encontraron órdenes de fabricación en este estado.</div>
            ) : (
            <div className="table-responsive shadow-sm rounded">
                <table className="table table-bordered table-hover align-middle tabla-ordenes mb-0">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>ID</th>
                            <th>Código Producto</th>
                            <th>Cantidad Solicitada</th>
                            <th>Progreso Real</th>
                            <th>Estado Actual</th>
                            <th>Acciones de Taller</th>
                            <th>Gestión</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map((orden) => {
                            const porcentaje = Math.round(((orden.cantidadProducida || 0) / orden.cantidad) * 100);

                            return (
                                <tr key={orden.id} className={obtenerClaseFila(orden.estado)}>
                                    <td className="text-center"><strong>#{orden.id}</strong></td>
                                    <td className="fw-semibold">{orden.codigoProducto}</td>
                                    <td className="text-center">{orden.cantidad} unidades</td>
                                    
                                    {/* PROGRESO REAL */}
                                    <td className="text-center">
                                        <div><strong>{orden.cantidadProducida || 0}</strong> / {orden.cantidad} unids.</div>
                                        {orden.estado === 'EN_PROCESO' && (
                                            <div className="progress mt-1" style={{ height: '10px' }}>
                                                <div 
                                                    className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                                                    role="progressbar" 
                                                    style={{ width: `${porcentaje}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </td>

                                    {/* BADGE DE ESTADO */}
                                    <td className="text-center">
                                        <span className={`badge ${obtenerClaseBadge(orden.estado)} fs-6 px-2 py-1`}>
                                            {orden.estado}
                                        </span>
                                    </td>

                                    {/* ACCIONES DE TALLER (ALINEADO Y REDISEÑADO) */}
                                    <td className="text-center">
                                        {orden.estado === 'PENDIENTE' && (
                                            <button 
                                                className="btn btn-outline-info btn-sm fw-bold btn-taller-sm"
                                                onClick={() => manejarCambioEstado(orden.id, 'EN_PROCESO')}
                                            >
                                                Iniciar Fabricación
                                            </button>
                                        )}

                                        {orden.estado === 'EN_PROCESO' && (
                                            <div className="acciones-taller-box">
                                                <div className="input-group input-group-sm">
                                                    <input 
                                                        type="number"
                                                        placeholder="Cant."
                                                        min="1"
                                                        className="form-control input-parcial"
                                                        value={cantidadesParciales[orden.id] || ''}
                                                        onChange={(e) => setCantidadesParciales({ 
                                                            ...cantidadesParciales, 
                                                            [orden.id]: e.target.value 
                                                        })}
                                                    />
                                                    <button 
                                                        className="btn btn-warning btn-taller-sm fw-bold text-dark"
                                                        onClick={() => manejarEnvioParcial(orden.id)}
                                                    >
                                                        + Lote
                                                    </button>
                                                </div>

                                                {/* BOTÓN EN_PROCESO VERDE OUTLINE MÁS PEQUEÑO Y COMPACTO */}
                                                <button 
                                                    className="btn btn-outline-success btn-sm fw-bold btn-taller-sm"
                                                    onClick={() => manejarCambioEstado(orden.id, 'TERMINADA')}
                                                >
                                                    ✅ Finalizar Orden
                                                </button>
                                            </div>
                                        )}

                                        {orden.estado === 'TERMINADA' && <span className="text-success fw-bold">OK</span>}
                                        {orden.estado === 'CANCELADA' && <span className="text-muted fw-bold">❌ Anulada</span>}
                                    </td>

                                    {/* GESTIÓN */}
                                    <td className="text-center">
                                        {orden.estado === 'TERMINADA' ? (
                                            <span className="text-success fw-bold">OK</span>
                                        ) : orden.estado === 'CANCELADA' ? (
                                            <span className="text-muted">Sin acciones</span>
                                        ) : (
                                            <span className="text-primary fw-bold">En curso</span>
                                        )}
                                    </td>

                                    {/* ACCIONES (BOTÓN CANCELAR) */}
                                    <td className="text-center">
                                        {orden.estado !== 'TERMINADA' && orden.estado !== 'CANCELADA' ? (
                                            <button 
                                                className="btn btn-outline-danger btn-sm fw-bold btn-taller-sm"
                                                onClick={() => manejarCancelar(orden.id)}
                                            >
                                                🚫 Cancelar
                                            </button>
                                        ) : (
                                            <span className="text-muted">Sin acciones</span>
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

export default Ordenes;