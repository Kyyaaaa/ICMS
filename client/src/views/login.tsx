import { useState } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff, Star, AlertCircle, LineChart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { supabase } from '../lib/supabase';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            setShowError(true);
            setErrorMsg(error.message || 'Failed to login with Google.');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                let displayMsg = data.message || 'Invalid credentials';
                if (displayMsg === 'Invalid login credentials') {
                    displayMsg = 'Incorrect email address or password.';
                }
                setShowError(true);
                setErrorMsg(displayMsg);
                return;
            }
            // Success
            if (rememberMe) {
                Cookies.set('access_token', data.data.access_token, { expires: 30, path: '/' });
                Cookies.set('user_info', JSON.stringify(data.data.user), { expires: 30, path: '/' });
                if (data.data.refresh_token) {
                    Cookies.set('refresh_token', data.data.refresh_token, { expires: 30, path: '/' });
                }
            } else {
                Cookies.set('access_token', data.data.access_token, { path: '/' });
                Cookies.set('user_info', JSON.stringify(data.data.user), { path: '/' });
                if (data.data.refresh_token) {
                    Cookies.set('refresh_token', data.data.refresh_token, { path: '/' });
                }
            }
            window.location.href = '/homepage';
        } catch {
            setShowError(true);
            setErrorMsg('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] min-h-screen flex font-sans">
            {/* Split Screen Container */}
            <div className="flex w-full min-h-screen">
                {/* Left Side - Form (Canvas) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-[16px] lg:px-[120px] py-[40px] bg-[#f7fafc] relative z-10 animate-fade-in">
                    {/* Branding Header */}
                    <div className="absolute top-0 left-0 w-full p-[16px] lg:p-[32px] flex items-center justify-between animate-fade-in-down">
                        <Link to="/homepage" className="flex items-center gap-2">
                            <BookOpen className="text-[#002045] w-8 h-8" />
                            <span className="text-[24px] leading-[32px] font-bold text-[#002045] tracking-tight">ICMS</span>
                        </Link>
                        <Link to="/homepage" className="flex items-center gap-2 text-[14px] font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-[#e0e3e5] hover:shadow-md">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                    {/* Login Form Container */}
                    <div className="w-full max-w-[440px] mx-auto">
                        <div className="mb-[40px] animate-fade-in-up">
                            <h1 className="text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-[#002045] mb-[8px]">Welcome Back</h1>
                            <p className="text-[18px] leading-[28px] text-[#43474e]">Log in to the IELTS Center Management System to continue managing your institution.</p>
                        </div>
                        <form className={`space-y-[24px] ${showError ? 'animate-shake' : ''}`} onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div className="space-y-[8px] group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <label className="block text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="email">Email Address</label>
                                <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${showError ? 'text-[#ba1a1a]' : 'text-[#74777f] group-focus-within:text-[#0061a5]'}`} />
                                    <input value={email} onChange={(e) => { setEmail(e.target.value); setShowError(false); }} className={`w-full pl-10 pr-4 py-3 bg-[#f7fafc] border rounded-[8px] focus:outline-none focus:ring-4 transition-all text-[16px] leading-[24px] text-[#181c1e] ${showError ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]' : 'border-[#c4c6cf] focus:ring-[#0061a5]/20 focus:border-[#0061a5] hover:border-[#74777f]'}`} id="email" name="email" placeholder="admin@icms.edu.vn" required type="email" autoComplete="username" />
                                </div>
                            </div>
                            {/* Password Field */}
                            <div className="space-y-[8px] group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center justify-between">
                                    <label className="block text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="password">Password</label>
                                    <Link className="text-[12px] leading-[16px] font-medium text-[#0061a5] hover:text-[#002045] transition-colors underline-offset-2 hover:underline" to="/forgot-password">Forgot Password?</Link>
                                </div>
                                <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${showError ? 'text-[#ba1a1a]' : 'text-[#74777f] group-focus-within:text-[#0061a5]'}`} />
                                    <input value={password} onChange={(e) => { setPassword(e.target.value); setShowError(false); }} className={`w-full pl-10 pr-10 py-3 bg-[#f7fafc] border rounded-[8px] focus:outline-none focus:ring-4 transition-all text-[16px] leading-[24px] text-[#181c1e] ${showError ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]' : 'border-[#c4c6cf] focus:ring-[#0061a5]/20 focus:border-[#0061a5] hover:border-[#74777f]'}`} id="password" name="password" placeholder="••••••••" required type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e] transition-colors focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                                        {passwordVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                                {showError && (
                                    <p className="text-[#ba1a1a] text-[13px] leading-[16px] flex items-center gap-1.5 mt-1.5 font-medium animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errorMsg}
                                    </p>
                                )}
                            </div>
                            {/* Remember Me */}
                            <div className="flex items-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                <input 
                                    className="h-4 w-4 rounded border-[#c4c6cf] text-[#0061a5] focus:ring-[#0061a5] bg-[#f7fafc] cursor-pointer" 
                                    id="remember-me" 
                                    name="remember-me" 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="ml-2 block text-[14px] leading-[20px] text-[#43474e] cursor-pointer hover:text-[#181c1e] transition-colors" htmlFor="remember-me">
                                    Remember me for 30 days
                                </label>
                            </div>
                            {/* Submit Button */}
                            <button disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[8px] shadow-sm text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-white bg-[#0061a5] hover:bg-[#002045] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0061a5]/20 transition-all duration-200 animate-fade-in-up disabled:opacity-50" style={{ animationDelay: '400ms' }} type="submit">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                        <div className="mt-[24px] relative animate-fade-in" style={{ animationDelay: '500ms' }}>
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#c4c6cf]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#f7fafc] text-[#43474e] text-[12px] leading-[16px] font-medium uppercase tracking-wider">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-[24px] animate-fade-in" style={{ animationDelay: '600ms' }}>
                            <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#c4c6cf] rounded-[8px] shadow-sm bg-[#f7fafc] text-[#181c1e] text-[14px] leading-[16px] font-semibold tracking-[0.05em] hover:bg-[#ebeef0] active:scale-[0.98] transition-colors duration-200" type="button">
                                <svg className="h-5 w-5 transition-transform duration-200 hover:scale-110" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                        <p className="mt-[40px] text-center text-[14px] leading-[20px] text-[#43474e] animate-fade-in" style={{ animationDelay: '700ms' }}>
                            Don't have an account?{' '}
                            <Link className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#0061a5] hover:text-[#002045] transition-colors hover:underline" to="/register">Register an account</Link>
                        </p>
                    </div>
                </div>
                {/* Right Side - Hero Image & Value Prop */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#002045] items-center justify-center p-[64px] group">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img alt="University Campus" className="w-full h-full object-cover opacity-30 mix-blend-overlay transition-transform duration-[10s] group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8MDHrR9urwQ7O37N-BpzAQXac_nesELLzttpXtVOtFwAH7fEFXOD-x3ET0kg3SV50IUwEHvwV_vk3I-oors6XsyhaKHSQZXOVdajlGYHH3gmIy9-scYPnG13SVNVer5yjQ0twJ8Yxw4XvCt_y-78LlUjZJTgNrgQVP4ccYnytW_q9PuBEzJ1dKXAmsm2dfw_RRG-76cSA6dp5qISIPL4iLPj_-ybMX26sD2EtFO7HUO-eXDKHdURXursXfiGRfrtCrRhkvzOvdnA" />
                    </div>
                    {/* Content Overlay */}
                    <div className="relative z-10 max-w-lg text-white animate-fade-in-up">
                        <div className="mb-[16px]">
                            <span className="inline-flex items-center justify-center p-3 bg-[#0061a5] rounded-[8px] shadow-lg mb-[24px] hover:scale-110 transition-transform duration-300">
                                <LineChart className="text-white w-6 h-6" />
                            </span>
                        </div>
                        <h2 className="text-[40px] leading-[48px] font-bold mb-[24px] tracking-[-0.02em]">Elevate Your Testing Administration</h2>
                        <p className="text-[18px] leading-[28px] text-[#adc7f7] mb-[64px] opacity-90">
                            Join over 500 institutions globally using ICMS to manage schedules, tutors, and student payments with unparalleled precision and security.
                        </p>
                        {/* Testimonial/Stat Card */}
                        <div className="bg-[#f7fafc]/10 backdrop-blur-md border border-[#c4c6cf]/20 rounded-xl p-[24px] hover:bg-[#f7fafc]/20 transition-colors duration-300">
                            <div className="flex items-center gap-[8px] mb-[8px]">
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                            </div>
                            <p className="text-[16px] leading-[24px] text-white italic mb-[16px]">"ICMS has reduced our administrative overhead by 40%. The robust scheduling and tutor management tools are the gold standard for testing centers."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ebeef0] overflow-hidden border-2 border-transparent hover:border-white transition-colors duration-300 cursor-pointer">
                                    <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmzOtaHSaoNbhFqaNpYsMMBZKJUnrUU0KvXQJEX-SEsrIHDuF_gDjz-iF7-i6GyNYjaWmaTE0_I4mXi0hoGRmsbZjIBbzTBWQB9WCTQWJ0PrRevOaq7otWr_BKiWZmqKM1_mgcvJAxTK5JtV5FhmYqyyqNkoE4YrD3aV7851ar-R2C0lY4dNRNeH__IrZoxN7EY0AWusYOipOAFSY60G_5yhSQQhGs2MdgxUASmz63VEthF0XpwpS9ZanxnEbeW5vUD-O9-_JxxXw" />
                                </div>
                                <div>
                                    <p className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-white">Dr. Sarah Jenkins</p>
                                    <p className="text-[14px] leading-[20px] text-[#adc7f7]">Director of Testing, Global Standard University</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
