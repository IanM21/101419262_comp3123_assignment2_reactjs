import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import NavigationBar from './components/Navbar';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
import EmployeeList from './components/EmployeeList';
import EmployeeView from './components/singleEmployee';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    alert('Successfully logged out!');
  };

  return (
    <div>
      <NavigationBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/" /> : <LoginForm setIsLoggedIn={setIsLoggedIn} />
        } />
        <Route path="/signup" element={
          isLoggedIn ? <Navigate to="/" /> : <SignupForm setIsLoggedIn={setIsLoggedIn} />
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        } />
        <Route path="/employee/:id" element={
          <ProtectedRoute>
            <EmployeeView />
          </ProtectedRoute>
        } />
        <Route path="/add-employee" element={
          <ProtectedRoute>
            <AddEmployee />
          </ProtectedRoute>
        } />
        <Route path="/edit-employee/:id" element={
          <ProtectedRoute>
            <EditEmployee />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

// Main App component remains the same
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;