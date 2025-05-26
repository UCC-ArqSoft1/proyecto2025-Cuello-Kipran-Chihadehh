import { AuthProvider } from './context/AuthContext';
import Login from './components/Login/Login';

function App() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}

export default App;