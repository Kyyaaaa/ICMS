import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { apiUrl } from '@/config/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(apiUrl('/auth/forgot-password'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to send reset code. Please try again.');
                return;
            }

            // Success: navigate to verify-otp and pass the email
            navigate('/verify-otp', { state: { email } });
        } catch {
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans antialiased bg-[#002045] relative overflow-hidden">
            {/* Immersive Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#0061a5]/30 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4d8]/20 blur-[120px]"></div>
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-120">
                {/* Branding Header */}
                <div className="flex justify-center mb-8 animate-fade-in-down">
                    <Link to="/login" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors">
                            <BookOpen className="text-white w-7 h-7" />
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">ICMS</span>
                    </Link>
                </div>

                {/* Main Card */}
                <main className="bg-white w-full rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-8 md:p-12 border border-white/20 flex flex-col gap-6 animate-fade-in-up relative overflow-hidden">
                    <div className="flex flex-col gap-2">
                        <div className="text-center mb-2">
                            <div className="w-16 h-16 bg-[#f7fafc] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#e0e3e5]">
                                <Mail className="text-[#0061a5] w-8 h-8" />
                            </div>
                            <h2 className="text-2xl leading-8 font-bold text-[#181c1e] mb-3 tracking-tight">Forgot password?</h2>
                            <p className="text-sm leading-6 text-[#43474e] max-w-80 mx-auto">
                                No worries, we'll send you reset instructions. Please enter your institutional email.
                            </p>
                        </div>
                        
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1 group">
                                <label className="text-sm leading-4 font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="email">
                                    Your Email
                                </label>
                                <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${error ? 'text-[#ba1a1a]' : 'text-[#74777f] group-focus-within:text-[#0061a5]'}`} />
                                    <input 
                                        className={`w-full h-13 pl-11 pr-4 bg-[#f7fafc] border rounded-xl text-base leading-6 text-[#181c1e] focus:outline-none focus:ring-4 transition-all shadow-sm ${error ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/10 focus:border-[#ba1a1a]' : 'border-[#c4c6cf] focus:border-[#0061a5] focus:ring-[#0061a5]/10 hover:border-[#74777f]'}`} 
                                        id="email" 
                                        placeholder="admin@icms.edu.vn" 
                                        required 
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        disabled={loading}
                                    />
                                </div>
                                {error && (
                                    <p className="text-[#ba1a1a] text-xs leading-4 flex items-center gap-1.5 mt-1.5 font-medium animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </p>
                                )}
                            </div>
                            
                            <button 
                                className="w-full h-13 bg-linear-to-r from-[#003c71] to-[#0061a5] text-white text-sm font-semibold rounded-xl shadow-[0_8px_16px_rgba(0,97,165,0.2)] hover:shadow-[0_12px_24px_rgba(0,97,165,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Reset password</span>
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="text-center mt-6">
                            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#43474e] hover:text-[#002045] transition-colors group/link" to="/login">
                                <ArrowLeft className="w-4.5 h-4.5 group-hover/link:-translate-x-1 transition-transform" />
                                Back to log in
                            </Link>
                        </div>
                    </div>
                </main>
                
                {/* Footer Links */}
                <div className="mt-8 text-center flex gap-6 justify-center text-xs leading-4 font-medium text-[#adc7f7] animate-fade-in">
                    <a className="hover:text-white transition-colors" href="#">Support</a>
                    <span className="text-[#0061a5]">•</span>
                    <a className="hover:text-white transition-colors" href="#">Security Policy</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
