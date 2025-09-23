import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'patient' | 'doctor';
}

const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  const { user, userType: currentUserType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (currentUserType !== userType) {
        if (currentUserType === 'patient') {
          navigate('/patient/dashboard');
        } else if (currentUserType === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/auth');
        }
      }
    }
  }, [user, currentUserType, userType, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  if (!user || currentUserType !== userType) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;