import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthService } from '../services/auth.service';

export const LoginForm = () => {
    const location = useLocation();
    const sessionExpired = (location.state as { sessionExpired?: boolean })?.sessionExpired;
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);
        try {
            const data = await AuthService.login({ email, password });
            
            // axiosClient interceptor returns data directly if success
            if (data?.success || data?.data) {
                const responseData = data.data || data;
                if (rememberMe) {
                    Cookies.set('access_token', responseData.access_token, { expires: 30, path: '/' });
                    Cookies.set('user_info', JSON.stringify(responseData.user), { expires: 30, path: '/' });
                    if (responseData.refresh_token) {
                        Cookies.set('refresh_token', responseData.refresh_token, { expires: 30, path: '/' });
                    }
                } else {
                    Cookies.set('access_token', responseData.access_token, { path: '/' });
                    Cookies.set('user_info', JSON.stringify(responseData.user), { path: '/' });
                    if (responseData.refresh_token) {
                        Cookies.set('refresh_token', responseData.refresh_token, { path: '/' });
                    }
                }
                const pendingCourse = localStorage.getItem('pending_registration_course');
                if (pendingCourse) {
                    localStorage.removeItem('pending_registration_course');
                    window.location.href = `/courses/${pendingCourse}/register`;
                } else {
                    window.location.href = '/homepage';
                }
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error: unknown) {
            setShowError(true);
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            let displayMsg = err?.response?.data?.message || err?.message || 'Invalid credentials';
            if (displayMsg === 'Invalid login credentials') {
                displayMsg = 'Incorrect email address or password.';
            }
            setErrorMsg(displayMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="w-full max-w-110 mx-auto">
            {/* Session Expired Banner */}
            {sessionExpired && (
                <div className="mb-6 flex items-center gap-3 bg-[#fff4ce] border border-[#e5c200] text-[#4a3800] px-4 py-3 rounded-xl animate-fade-in-up">
                    <Clock className="w-5 h-5 shrink-0 text-[#855e00]" />
                    <p className="text-sm font-medium">Your session has expired. Please log in again to continue.</p>
                </div>
            )}
            <div className="mb-10 animate-fade-in-up">
                <h1 className="text-5xl leading-14 font-bold tracking-[-0.02em] text-[#002045] mb-2">Welcome Back</h1>
                <p className="text-lg leading-7 text-[#43474e]">Log in to the IELTS Center Management System to continue managing your institution.</p>
            </div>
            
            <form className={`space-y-6 ${showError ? 'animate-shake' : ''}`} onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="space-y-2 group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <label className="block text-sm leading-4 font-semibold tracking-wider text-[#181c1e]" htmlFor="email">Email Address</label>
                    <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${showError ? 'text-[#ba1a1a]' : 'text-[#74777f] group-focus-within:text-[#0061a5]'}`} />
                        <input value={email} onChange={(e) => { setEmail(e.target.value); setShowError(false); }} className={`w-full pl-10 pr-4 py-3 bg-[#f7fafc] border rounded-lg focus:outline-none focus:ring-4 transition-all text-base leading-6 text-[#181c1e] ${showError ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]' : 'border-[#c4c6cf] focus:ring-[#0061a5]/20 focus:border-[#0061a5] hover:border-[#74777f]'}`} id="email" name="email" placeholder="admin@icms.edu.vn" required type="email" autoComplete="username" />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between">
                        <label className="block text-sm leading-4 font-semibold tracking-wider text-[#181c1e]" htmlFor="password">Password</label>
                        <Link className="text-xs leading-4 font-medium text-[#0061a5] hover:text-[#002045] transition-colors underline-offset-2 hover:underline" to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${showError ? 'text-[#ba1a1a]' : 'text-[#74777f] group-focus-within:text-[#0061a5]'}`} />
                        <input value={password} onChange={(e) => { setPassword(e.target.value); setShowError(false); }} className={`w-full pl-10 pr-10 py-3 bg-[#f7fafc] border rounded-lg focus:outline-none focus:ring-4 transition-all text-base leading-6 text-[#181c1e] ${showError ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]' : 'border-[#c4c6cf] focus:ring-[#0061a5]/20 focus:border-[#0061a5] hover:border-[#74777f]'}`} id="password" name="password" placeholder="••••••••" required type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e] transition-colors focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                            {passwordVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>
                    {showError && (
                        <p className="text-[#ba1a1a] text-xs leading-4 flex items-center gap-1.5 mt-1.5 font-medium animate-fade-in">
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
                    <label className="ml-2 block text-sm leading-5 text-[#43474e] cursor-pointer hover:text-[#181c1e] transition-colors" htmlFor="remember-me">
                        Remember me for 30 days
                    </label>
                </div>

                {/* Submit Button */}
                <button disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm leading-4 font-semibold tracking-wider text-white bg-[#0061a5] hover:bg-[#002045] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0061a5]/20 transition-all duration-200 animate-fade-in-up disabled:opacity-50" style={{ animationDelay: '400ms' }} type="submit">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 relative animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#c4c6cf]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#f7fafc] text-[#43474e] text-xs leading-4 font-medium uppercase tracking-wider">Or continue with</span>
                </div>
            </div>

            <div className="mt-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#c4c6cf] rounded-lg shadow-sm bg-[#f7fafc] text-[#181c1e] text-sm leading-4 font-semibold tracking-wider hover:bg-[#ebeef0] active:scale-[0.98] transition-colors duration-200" type="button">
                    <svg className="h-5 w-5 transition-transform duration-200 hover:scale-110" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Sign in with Google
                </button>
            </div>
            
            <p className="mt-10 text-center text-sm leading-5 text-[#43474e] animate-fade-in" style={{ animationDelay: '700ms' }}>
                Don't have an account?{' '}
                <Link className="text-sm leading-4 font-semibold tracking-wider text-[#0061a5] hover:text-[#002045] transition-colors hover:underline" to="/register">Register an account</Link>
            </p>
        </div>
    );
};
