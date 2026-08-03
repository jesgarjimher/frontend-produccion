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

    // CONTROL DE SEGURIDAD EN FRONTEND: Validar si es responsable_calidad
    if (user?.rol !== 'responsable_calidad') {
        return (
            <div className="alert alert-warning border-warning shadow-sm my-4 d-flex align-items-center gap-2" role="alert">
                <span className="fs-4">⚠️</span>
                <div>
                    <strong>Acceso Restringido:</strong> Solo el personal con rol <u>responsable_calidad</u> puede dar de alta nuevos productos en el catálogo maestro.
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');
        setLoading(true);

        const nuevoProducto = {
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            stock: parseInt(stock, 10)
        };

        try {
            await endpoints.crearProducto(nuevoProducto);
            setMensajeExito(`¡Producto "${nombre}" registrado con éxito en la planta!`);
            
            // Limpiamos los campos
            setCodigo('');
            setNombre('');
            setStock(0);

            if (onProductoCreado) onProductoCreado();

        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'No se pudo registrar el producto. Verifica si el código ya existe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 my-4" style={{ maxWidth: '600px' }}>
            {/* CABECERA CON ESTILO AZUL SUAVE (TIPO EMITIR ORDEN) */}
            <div className="card-header bg-primary-subtle text-primary-emphasis border-0 py-3">
                <h3 className="h5 card-title mb-0 fw-bold d-flex align-items-center justify-content-center gap-2 text-center w-100">
                       Alta de Nuevo Producto
                </h3>
            </div>

            <div className="card-body p-4">
                {/* ALERTAS */}
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

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* CÓDIGO DEL PRODUCTO */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-secondary">
                                Código del Producto:
                            </label>
                            <input 
                                type="text" 
                                className="form-control"
                                value={codigo} 
                                onChange={(e) => setCodigo(e.target.value)} 
                                placeholder="Ej: PROD-200" 
                                required 
                            />
                        </div>

                        {/* STOCK INICIAL */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-secondary">
                                Stock Inicial:
                            </label>
                            <input 
                                type="number" 
                                className="form-control"
                                value={stock} 
                                onChange={(e) => setStock(e.target.value)} 
                                min="0" 
                                required 
                            />
                        </div>

                        {/* NOMBRE COMERCIAL */}
                        <div className="col-12">
                            <label className="form-label fw-bold small text-secondary">
                                Nombre Comercial:
                            </label>
                            <input 
                                type="text" 
                                className="form-control"
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                placeholder="Ej: Válvula de Presión 15mm" 
                                required 
                            />
                        </div>

                        {/* BOTÓN DE SUBMIT */}
                        <div className="col-12 mt-4">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="btn btn-success w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Guardando en Catálogo...
                                    </>
                                ) : (
                                    'Guardar Producto'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearProducto;