import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Onboarding from './components/auth/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import HistoryView from './components/history/HistoryView';
import Settings from './components/settings/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen bg-surface-900 flex items-center justify-center">Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Protected Routes */}
                    <Route path="/onboarding" element={
                        <PrivateRoute><Onboarding /></PrivateRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />

                    <Route path="/history" element={
                        <PrivateRoute><HistoryView /></PrivateRoute>
                    } />

                    <Route path="/settings" element={
                        <PrivateRoute><Settings /></PrivateRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
