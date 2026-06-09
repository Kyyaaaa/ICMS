import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName, phone_number: phone })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Registration failed');
                return;
            }
            alert('Registration successful! Please login.');
            window.location.href = '/login';
        } catch {
            setError('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const isLength = password.length >= 8 && password.length <= 15;
    const isCases = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const isNumber = /[0-9]/.test(password);
    const isSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [isLength, isCases, isNumber, isSpecial].filter(Boolean).length;
    const isValid = score === 4 && agreedToTerms;

    return (
        <main className="flex w-full min-h-screen bg-[#f7fafc] text-[#181c1e] font-sans">
            {/* Left Column: Branding / Image (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#002045] overflow-hidden flex-col justify-between group">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        alt="Educational environment"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-[10s] group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT7RTPsFy4yxkErIOZkfDd7-jd72W_B6IL5KgkoglL0GkmtUgnCDuhZ_rIPsx8Jxn95hj6zYfXPxA7ogtiXEfEOkwj5JCRUwDWhIDBFRAgDJ4QRXYM3P5SB2fE_HR49oaZf06LFXuzlI8yRZIdlMQFoquhALSukp7fU2Z_CNTsD4WsNaay9tmzQMcmgGGwCSnutuI0rkTVQ13m8e3ahEC5N3QbNC4_G-Obvly8hEMLbO0IbRmZMtglrVCsOt8zPrpkJDmgeCdeQXI"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002045] via-[#002045]/80 to-[#002045]/40 z-10"></div>
                </div>
                {/* Brand Top */}
                <div className="relative z-20 p-[32px] animate-fade-in">
                    <div className="flex items-center gap-[8px]">
                        <BookOpen className="text-white w-8 h-8" />
                        <span className="text-[24px] leading-[32px] font-semibold text-white">ICMS</span>
                    </div>
                </div>
                {/* Hero Message Bottom */}
                <div className="relative z-20 p-[32px] mb-[40px] animate-fade-in-up">
                    <h1 className="text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-white mb-[16px]">
                        Elevate Your<br />Center's Standard.
                    </h1>
                    <p className="text-[18px] leading-[28px] font-normal text-[#adc7f7] max-w-md">
                        Join the premier management system designed for IELTS test centers. Streamline scheduling, manage tutors, and deliver excellence globally.
                    </p>
                </div>
            </div>
            {/* Right Column: Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-[16px] md:p-[32px] bg-[#f7fafc] relative">
                {/* Back to Home Button */}
                <div className="absolute top-[16px] right-[16px] lg:top-[32px] lg:right-[32px] animate-fade-in-down z-50">
                    <Link to="/homepage" className="flex items-center gap-2 text-[14px] font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-[#e0e3e5] hover:shadow-md">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
                {/* Mobile Brand Header (Visible only on mobile) */}
                <div className="absolute top-[16px] left-[16px] flex items-center gap-[8px] lg:hidden animate-fade-in-down">
                    <BookOpen className="text-[#002045] w-7 h-7" />
                    <span className="text-[20px] leading-[28px] font-semibold text-[#002045]">ICMS</span>
                </div>
                <div className="w-full max-w-[440px] mt-[64px] lg:mt-0 animate-fade-in">
                    <div className="mb-[40px] text-center lg:text-left">
                        <h2 className="text-[24px] md:text-[32px] md:leading-[40px] font-bold tracking-[-0.01em] text-[#181c1e] mb-[8px]">
                            Create an account
                        </h2>
                        <p className="text-[16px] leading-[24px] text-[#43474e]">
                            Enter your details to register your center.
                        </p>
                    </div>
                    {/* Registration Form */}
                    <form className="space-y-[16px]" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-[#ffdad6] text-[#93000a] p-[12px] rounded-[8px] flex items-start gap-2 border border-[#ba1a1a]/20 animate-fade-in-down">
                                <p className="text-[14px] leading-[20px]">{error}</p>
                            </div>
                        )}
                        {/* Full Name */}
                        <div className="space-y-[8px] group">
                            <label className="block text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="fullName">
                                Full Name
                            </label>
                            <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5 group-focus-within:text-[#0061a5] transition-colors" />
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-white border border-[#c4c6cf] rounded-[8px] text-[#181c1e] text-[16px] leading-[24px] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 focus:border-[#0061a5] transition-all duration-200 shadow-sm hover:border-[#74777f]"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Jane Doe"
                                    required
                                    type="text"
                                />
                            </div>
                        </div>
                        {/* Email */}
                        <div className="space-y-[8px] group">
                            <label className="block text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5 group-focus-within:text-[#0061a5] transition-colors" />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-white border border-[#c4c6cf] rounded-[8px] text-[#181c1e] text-[16px] leading-[24px] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 focus:border-[#0061a5] transition-all duration-200 shadow-sm hover:border-[#74777f]"
                                    id="email"
                                    name="email"
                                    placeholder="jane@center.edu"
                                    required
                                    type="email"
                                />
                            </div>
                        </div>
                        {/* Phone */}
                        <div className="space-y-[8px] group">
                            <label className="block text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="phone">
                                Phone Number
                            </label>
                            <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5 group-focus-within:text-[#0061a5] transition-colors" />
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-white border border-[#c4c6cf] rounded-[8px] text-[#181c1e] text-[16px] leading-[24px] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 focus:border-[#0061a5] transition-all duration-200 shadow-sm hover:border-[#74777f]"
                                    id="phone"
                                    name="phone"
                                    placeholder="+1 (555) 000-0000"
                                    type="tel"
                                />
                            </div>
                        </div>
                        {/* Password */}
                        <div className="space-y-[8px] group">
                            <label className="block text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="password">
                                Password
                            </label>
                            <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5 group-focus-within:text-[#0061a5] transition-colors" />
                                <input
                                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#c4c6cf] rounded-[8px] text-[#181c1e] text-[16px] leading-[24px] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 focus:border-[#0061a5] transition-all duration-200 shadow-sm hover:border-[#74777f]"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e] transition-colors"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                            {/* Password Strength Visual Indicator */}
                            <div className="mt-[8px]">
                                <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden flex gap-1">
                                    <div className={`h-full w-1/4 transition-colors duration-300 ${password.length > 0 && score >= 1 ? (score <= 2 ? 'bg-[#ba1a1a]' : (score === 3 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]')) : 'bg-transparent'}`}></div>
                                    <div className={`h-full w-1/4 transition-colors duration-300 ${password.length > 0 && score >= 2 ? (score <= 2 ? 'bg-[#ba1a1a]' : (score === 3 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]')) : 'bg-transparent'}`}></div>
                                    <div className={`h-full w-1/4 transition-colors duration-300 ${password.length > 0 && score >= 3 ? (score === 3 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]') : 'bg-transparent'}`}></div>
                                    <div className={`h-full w-1/4 transition-colors duration-300 ${password.length > 0 && score === 4 ? 'bg-[#0061a5]' : 'bg-transparent'}`}></div>
                                </div>
                            </div>
                            
                            {/* Validation Rules Checklist */}
                            <ul className="mt-[8px] space-y-[4px]">
                                <li className={`flex items-center gap-[8px] text-[13px] leading-[20px] transition-colors ${isLength ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                    {isLength ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                    Length from 8 to 15 characters
                                </li>
                                <li className={`flex items-center gap-[8px] text-[13px] leading-[20px] transition-colors ${isCases ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                    {isCases ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                    Contains uppercase and lowercase letters
                                </li>
                                <li className={`flex items-center gap-[8px] text-[13px] leading-[20px] transition-colors ${isNumber ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                    {isNumber ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                    Contains a number
                                </li>
                                <li className={`flex items-center gap-[8px] text-[13px] leading-[20px] transition-colors ${isSpecial ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                    {isSpecial ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                    Contains a special symbol
                                </li>
                            </ul>
                        </div>
                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2 pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    className="w-4 h-4 rounded border-[#c4c6cf] text-[#0061a5] focus:ring-[#0061a5]/20 focus:ring-2 bg-white cursor-pointer transition-colors"
                                    id="terms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                            </div>
                            <label className="text-[14px] leading-[20px] font-normal text-[#43474e] cursor-pointer hover:text-[#181c1e] transition-colors" htmlFor="terms">
                                I agree to the <a className="text-[#0061a5] hover:text-[#002045] transition-colors font-medium underline-offset-2 hover:underline" href="#">Terms of Service</a> and <a className="text-[#0061a5] hover:text-[#002045] transition-colors font-medium underline-offset-2 hover:underline" href="#">Privacy Policy</a>.
                            </label>
                        </div>
                        {/* Submit Button */}
                        <div className="pt-[16px]">
                            <button
                                disabled={loading || !isValid}
                                className="w-full py-3 px-4 bg-[#0061a5] hover:bg-[#002045] active:scale-[0.98] text-white text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
                            </button>
                        </div>
                    </form>
                    {/* Divider */}
                    <div className="flex items-center gap-4 my-[24px]">
                        <div className="h-px bg-[#c4c6cf] flex-1"></div>
                        <span className="text-[12px] leading-[16px] font-medium text-[#74777f] uppercase tracking-wider">or</span>
                        <div className="h-px bg-[#c4c6cf] flex-1"></div>
                    </div>
                    {/* Google Auth */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 px-4 bg-white border border-[#c4c6cf] hover:bg-[#f1f4f6] active:scale-[0.98] text-[#181c1e] text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] shadow-sm transition-all duration-200 flex justify-center items-center gap-3"
                        type="button"
                    >
                        <svg className="w-5 h-5 transition-transform duration-200 hover:scale-110" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Sign up with Google
                    </button>
                    {/* Login Link */}
                    <div className="mt-[24px] text-center">
                        <p className="text-[14px] leading-[20px] font-normal text-[#43474e]">
                            Already have an account?{' '}
                            <Link className="text-[#0061a5] hover:text-[#002045] text-[14px] leading-[16px] font-semibold tracking-[0.05em] transition-colors hover:underline underline-offset-4" to="/login">
                                Log in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Register;
