import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authClient } from '../../lib/auth-client';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isPending && !session) {
            navigate('/login', { state: { from: location }, replace: true });
        }
    }, [isPending, session, navigate, location]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin text-atlas-orange mb-4" size={32} />
                <p className="text-sm text-gray-400 font-medium animate-pulse">Carregando ambiente seguro...</p>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
