import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import * as authApi from '../../api/auth'
import { ShieldCheckIcon, UserIcon, ZapIcon, ArrowRightIcon } from 'lucide-react'
import clsx from 'clsx'
import useAuthStore from '../../store/authStore'
import { motion } from 'framer-motion'

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const { addAccount } = useAuthStore()
  const navigate = useNavigate()
  const selectedRole = watch('role', 'USER')

  const onSubmit = async (data) => {
    try {
      await authApi.register(data)
      const loginRes = await authApi.login({ email: data.email, password: data.password })
      const { access, refresh } = loginRes.data
      useAuthStore.getState().setTokens(access, refresh) // MUST set token before getting profile
      const profileRes = await authApi.getProfile()
      addAccount(profileRes.data, access, refresh)
      toast.success(`Welcome to the movement, ${profileRes.data.full_name.split(' ')[0]}!`)
      navigate(profileRes.data.role === 'VENDOR' ? '/vendor/browse' : '/dashboard')
    } catch (err) {
      toast.error('Identity collision. Email might already exist.')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8 bg-[#030712] py-20">
      {/* Dynamic Dark Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-emerald-900/30 rounded-full blur-[130px] mix-blend-screen opacity-70 animate-pulse" />
         <div className="absolute bottom-[0%] right-[10%] w-[40vw] h-[40vw] bg-teal-900/20 rounded-full blur-[100px] mix-blend-screen opacity-50" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass-card-dark p-12 bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] hover:border-emerald-500/30 transition-all duration-700 mt-20">
           <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <ZapIcon size={14} className="animate-pulse drop-shadow-[0_0_8px_#34d399]" /> Join The Wave
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">Create Your <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-default">Node.</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure your spot in the global network</p>
           </div>

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Role System Choice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className={clsx(
                  "relative flex flex-col items-center justify-center gap-5 p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-500 group overflow-hidden h-[240px]",
                  selectedRole === 'USER' ? "border-emerald-500 bg-[#0a0a0a] shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 active:scale-95"
                )}>
                   <input type="radio" value="USER" {...register('role')} className="hidden" />
                   <div className={clsx(
                     "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-lg",
                     selectedRole === 'USER' ? "bg-emerald-500 text-[#050505]" : "bg-[#050505] text-slate-500 border border-white/10 group-hover:text-emerald-400/50 group-hover:border-emerald-500/30"
                   )}>
                      <UserIcon size={32} />
                   </div>
                   <div className="text-center relative z-10">
                      <div className={clsx("text-lg font-black leading-none mb-1 transition-colors", selectedRole === 'USER' ? "text-white" : "text-slate-400")}>Scrapper</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Cash out on old tech</div>
                   </div>
                   {selectedRole === 'USER' && <motion.div layoutId="role-indicator" className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[#050505]"><ShieldCheckIcon size={14} /></motion.div>}
                </label>

                <label className={clsx(
                  "relative flex flex-col items-center justify-center gap-5 p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-500 group overflow-hidden h-[240px]",
                  selectedRole === 'VENDOR' ? "border-emerald-500 bg-[#0a0a0a] shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 active:scale-95"
                )}>
                   <input type="radio" value="VENDOR" {...register('role')} className="hidden" />
                   <div className={clsx(
                     "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-lg",
                     selectedRole === 'VENDOR' ? "bg-emerald-500 text-[#050505]" : "bg-[#050505] text-slate-500 border border-white/10 group-hover:text-teal-400/50 group-hover:border-teal-500/30"
                   )}>
                      <ShieldCheckIcon size={32} />
                   </div>
                   <div className="text-center relative z-10">
                      <div className={clsx("text-lg font-black leading-none mb-1 transition-colors", selectedRole === 'VENDOR' ? "text-white" : "text-slate-400")}>Extractor</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-teal-500/70">Official Vendor Status</div>
                   </div>
                   {selectedRole === 'VENDOR' && <motion.div layoutId="role-indicator" className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[#050505]"><ShieldCheckIcon size={14} /></motion.div>}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Your Handle (Name)</label>
                    <input 
                      {...register('full_name', { required: 'Handle is required' })} 
                      className="input-field bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.05] focus:border-emerald-500/50" 
                      placeholder="e.g. Alex"
                    />
                    {errors.full_name && <span className="text-red-400 text-[10px] font-bold ml-4 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{errors.full_name.message}</span>}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Your Email Drop</label>
                    <input 
                      {...register('email', { required: 'Email is required' })} 
                      type="email" 
                      className="input-field bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.05] focus:border-emerald-500/50" 
                      placeholder="alex@vibes.com"
                    />
                    {errors.email && <span className="text-red-400 text-[10px] font-bold ml-4 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{errors.email.message}</span>}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Burner / Phone (Optional)</label>
                     <input 
                        {...register('phone')} 
                        className="input-field bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.05] focus:border-emerald-500/50" 
                        placeholder="+1 000 000 000"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">The Secret (Password)</label>
                     <input 
                        {...register('password', { required: 'Secret is required', minLength: { value: 8, message: 'Min 8 chars' } })} 
                        type="password" 
                        className="input-field bg-white/[0.02] border-white/10 text-white focus:bg-white/[0.05] focus:border-emerald-500/50" 
                        placeholder="••••••••"
                     />
                     {errors.password && <span className="text-red-400 text-[10px] font-bold ml-4 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{errors.password.message}</span>}
                  </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                 <button 
                   type="submit" 
                   disabled={isSubmitting} 
                   className="w-full relative inline-flex items-center justify-center gap-4 px-8 py-6 bg-emerald-500 text-[#050505] rounded-2xl font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95 border border-emerald-400 disabled:opacity-50 disabled:active:scale-100 group"
                 >
                   <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                   <span className="relative z-10 flex items-center gap-3">
                     {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                     ) : (
                        <>Mint Your Account <ArrowRightIcon className="group-hover:translate-x-2 transition-transform" size={18} /></>
                     )}
                   </span>
                 </button>
              </div>
           </form>

           <div className="mt-12 text-center text-sm font-bold text-slate-500">
              Already locked in? {' '}
              <Link to="/login" className="text-white border-b-2 border-emerald-500/50 hover:text-emerald-400 hover:border-emerald-400 transition-all ml-1">Drop in here.</Link>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
