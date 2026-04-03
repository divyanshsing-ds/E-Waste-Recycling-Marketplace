import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LogInIcon, ZapIcon, ShieldCheckIcon, GlobeIcon } from 'lucide-react'
import * as authApi from '../../api/auth'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'
import { motion } from 'framer-motion'

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { addAccount } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const loginRes = await authApi.login(data)
      const { access, refresh } = loginRes.data
      useAuthStore.getState().setTokens(access, refresh) // MUST set token before getting profile
      const profile = await authApi.getProfile()
      addAccount(profile.data, access, refresh)
      toast.success(`Welcome back, ${profile.data.full_name.split(' ')[0]}!`)
      navigate(profile.data.role === 'VENDOR' ? '/vendor/browse' : '/dashboard')
    } catch (err) {
      toast.error('Invalid credentials. Access denied.')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8 bg-[#030712]">
      {/* Dynamic Dark Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] bg-emerald-900/30 rounded-full blur-[120px] mix-blend-screen opacity-70 animate-pulse" />
         <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] bg-teal-900/20 rounded-full blur-[100px] mix-blend-screen opacity-50" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card-dark p-12 bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-700">
           <div className="text-center mb-12">
              <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                 <div className="w-16 h-16 bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-500">
                    <ZapIcon size={32} fill="currentColor" />
                 </div>
              </Link>
              <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Lock In.</h2>
              <p className="text-emerald-500/70 font-black uppercase tracking-[0.2em] text-[10px]">Secure the bag. Save the planet.</p>
           </div>

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Your Email Drop</label>
                 <input 
                   {...register('email', { required: 'Email is required to lock in' })} 
                   type="email" 
                   className="input-field bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.05] focus:border-emerald-500/50" 
                   placeholder="you@vibes.com"
                 />
                 {errors.email && <span className="text-red-400 text-[10px] font-bold ml-4 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                 <div className="flex items-center justify-between ml-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The Secret</label>
                    <Link to="#" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">Forgot?</Link>
                 </div>
                 <input 
                   {...register('password', { required: 'Password is required' })} 
                   type="password" 
                   className="input-field bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.05] focus:border-emerald-500/50" 
                   placeholder="••••••••"
                 />
                 {errors.password && <span className="text-red-400 text-[10px] font-bold ml-4 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{errors.password.message}</span>}
              </div>

              <div className="pt-6 border-t border-white/5 mt-8">
                 <button 
                   type="submit" 
                   disabled={isSubmitting} 
                   className="w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 text-[#050505] rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 border border-emerald-400 disabled:opacity-50 disabled:active:scale-100 group"
                 >
                   <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                   <span className="relative z-10 flex items-center gap-3">
                     {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                     ) : (
                        <LogInIcon size={18} />
                     )}
                     Tap In
                   </span>
                 </button>
              </div>
           </form>

           <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-6 text-slate-500">
                 <div className="flex items-center gap-1.5"><ShieldIcon size={14} className="text-emerald-500" /> <span className="text-[9px] font-black uppercase tracking-widest">100% Safe</span></div>
                 <div className="flex items-center gap-1.5"><GlobeIcon size={14} className="text-blue-500" /> <span className="text-[9px] font-black uppercase tracking-widest">Global Wave</span></div>
              </div>
              <p className="text-sm font-bold text-slate-500">
                 No account? {' '}
                 <Link to="/register" className="text-white border-b-2 border-emerald-500/50 hover:border-emerald-400 hover:text-emerald-400 transition-all ml-1">Join the wave</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

const ShieldIcon = ({ size, className }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
   </svg>
)

export default Login
