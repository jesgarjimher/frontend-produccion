import axios from 'axios';

const AUTH_URL = 'http://localhost:8081/auth';
const PRODUCTION_URL = 'http://localhost:8082/productos';
const FABRICACION_URL = 'http://localhost:8083/ordenes';

// Instancia centralizada de Axios
const api = axios.create();

// Interceptor para adjuntar el JWT automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const endpoints = {
    //Auth-Service
    login: (nombre, password) => axios.post(`${AUTH_URL}/login`, { nombre, password }),
    register: (userData) => api.post(`${AUTH_URL}/register`, userData),
    borrarUsuario: (id) => api.delete(`${AUTH_URL}/usuarios/${id}`),

    // Production-Service
    listarProductos: () => api.get(PRODUCTION_URL),
    crearProducto: (producto) => api.post(PRODUCTION_URL, producto),

    // Fabricacion-Service
    listarOrdenes: (estado = '') => {
        const url = estado ? `${FABRICACION_URL}?estado=${estado}` : FABRICACION_URL;
        return api.get(url);
    },
    crearOrden: (orden) => api.post(FABRICACION_URL, orden),
    actualizarEstadoOrden: (id, nuevoEstado) => api.put(`${FABRICACION_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`),
    cancelarOrden: (id) => api.put(`${FABRICACION_URL}/${id}/cancelar`)
};