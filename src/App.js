import { useContext } from 'react';
import Login from './components/Login';
import { AuthContext } from './AuthContext';


function App() {

  const {user, logoutUser } = useContext(AuthContext);
  return (
    <div className="App">
        {!user ? (
          <Login />
          
        ): (
          <div style={{ padding: '20px' }}>
          <h1>¡Bienvenido al Taller, {user.username}!</h1>
          <p>Tu rol asignado es: <strong>{user.rol}</strong></p>
          <button onClick={logoutUser} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
          
        </div>
      
        )}
    </div>
  );
}

export default App;
