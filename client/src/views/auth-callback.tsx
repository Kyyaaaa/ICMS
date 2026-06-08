import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const AuthCallback = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const processSession = async () => {
            try {
                // Get the session from Supabase (it parses the hash/url automatically)
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    throw error;
                }

                if (!session) {
                    // No session means they shouldn't be here, redirect back to login
                    navigate('/login');
                    return;
                }

                // Call backend google-sync endpoint
                const res = await fetch('http://localhost:5000/api/auth/google-sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: session.access_token })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to sync with system');
                }

                // Save system tokens
                Cookies.set('access_token', data.data.access_token, { path: '/' });
                Cookies.set('user_info', JSON.stringify(data.data.user), { path: '/' });
                if (data.data.refresh_token) {
                    Cookies.set('refresh_token', data.data.refresh_token, { path: '/' });
                }

                navigate('/homepage');
            } catch (err: any) {
                console.error(err);
                setErrorMsg(err.message || 'Authentication failed. Please try again.');
            }
        };

        processSession();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7fafc] p-4">
            {!errorMsg ? (
                <div className="flex flex-col items-center text-[#0061a5] animate-fade-in">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <h2 className="text-[20px] leading-[28px] font-semibold tracking-tight text-[#181c1e]">Authenticating...</h2>
                    <p className="text-[#43474e] mt-2">Please wait while we securely log you in.</p>
                </div>
            ) : (
                <div className="flex flex-col items-center max-w-[400px] w-full bg-white p-[32px] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#e0e3e5] text-center animate-fade-in-up">
                    <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8 text-[#ba1a1a]" />
                    </div>
                    <h2 className="text-[24px] leading-[32px] font-bold tracking-tight text-[#181c1e] mb-3">Login Failed</h2>
                    <p className="text-[#43474e] mb-8">{errorMsg}</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full h-12 bg-[#0061a5] hover:bg-[#002045] active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuthCallback;
