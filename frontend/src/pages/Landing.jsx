import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, MapPinIcon, TrendingUpIcon, ZapIcon, GlobeIcon, LeafIcon, CpuIcon, RecycleIcon, ActivityIcon, ArrowRightIcon, CheckCircle2Icon } from 'lucide-react'
import Button from '../components/ui/Button'
import { useRef } from 'react'

const Landing = () => {
  const containerRef = useRef(null)
  
  return (
    <div ref={containerRef} className="flex flex-col min-h-screen font-outfit relative bg-transparent">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-emerald-900/30 rounded-full blur-[150px] mix-blend-screen opacity-80 animate-pulse transition-all duration-1000" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-teal-900/20 rounded-full blur-[150px] mix-blend-screen opacity-70" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        
        {/* Subtle Futuristic Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-32 px-6 flex items-center justify-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.1] shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-xl">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
               </span>
               <span className="text-xs font-black tracking-[0.2em] uppercase text-slate-300">Net-Zero Protocol Initialized</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-[4.5rem] sm:text-[6rem] lg:text-[8rem] font-black leading-[0.85] tracking-tighter mb-8 text-white"
          >
            Terminal <br className="md:hidden" /> Value. <br className="hidden md:block" />
            <span className="relative inline-block mt-4 md:mt-0">
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-300 to-indigo-500 cursor-default drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">Unlocked.</span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl text-center font-medium leading-relaxed mb-12"
          >
            Bypass the landfill. Route your obsolete hardware directly to certified global extractors through an immutable, high-speed exchange.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg mx-auto"
          >
            <Link to="/register" className="w-full">
               <button className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 text-[#050505] rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95 border border-emerald-400">
                 <span className="relative z-10 flex items-center gap-2">Ignite Setup <ZapIcon size={16} className="text-[#050505] group-hover:rotate-12 transition-transform" /></span>
                 <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
               </button>
            </Link>
            <Link to="/vendor/browse" className="w-full">
               <button className="w-full group inline-flex items-center justify-center gap-2 px-8 py-5 bg-white/[0.03] border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all shadow-lg active:scale-95">
                 Market Data <ArrowRightIcon size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
               </button>
            </Link>
          </motion.div>

        </div>
        
        {/* Abstract 3D Neon Glass elements */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 2, delay: 1 }}
           className="absolute top-[40%] left-[5%] -translate-y-1/2 hidden xl:block pointer-events-none float-animation"
        >
          <div className="w-48 h-48 rounded-[3rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(16,185,129,0.1)] transform -rotate-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent z-0"></div>
            <RecycleIcon size={64} className="text-emerald-400/50 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
          </div>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 2, delay: 1.2 }}
           className="absolute top-[65%] right-[8%] hidden xl:block pointer-events-none float-animation"  style={{ animationDelay: '1.5s' }}
        >
          <div className="w-40 h-40 rounded-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(45,212,191,0.1)] transform rotate-12 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent z-0"></div>
             <CpuIcon size={48} className="text-teal-400/50 relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
          </div>
        </motion.div>
      </section>

      {/* Stats Marquee (Neon) */}
      <section className="relative z-10 border-y border-white/[0.05] bg-[#050505]/50 backdrop-blur-xl py-8 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex w-fit animate-marquee items-center gap-20 px-10">
           {[
             { label: 'Tonnage Recovered', value: '1.2M kg', icon: <RecycleIcon className="text-emerald-400" /> },
             { label: 'Active Facilities', value: '8,400+', icon: <GlobeIcon className="text-blue-400" /> },
             { label: 'Carbon Offset', value: '450k Tons', icon: <LeafIcon className="text-teal-400" /> },
             { label: 'System Uptime', value: '99.99%', icon: <ActivityIcon className="text-purple-400" /> },
             // Duplicate for continuous scroll
             { label: 'Tonnage Recovered', value: '1.2M kg', icon: <RecycleIcon className="text-emerald-400" /> },
             { label: 'Active Facilities', value: '8,400+', icon: <GlobeIcon className="text-blue-400" /> },
             { label: 'Carbon Offset', value: '450k Tons', icon: <LeafIcon className="text-teal-400" /> },
             { label: 'System Uptime', value: '99.99%', icon: <ActivityIcon className="text-purple-400" /> },
           ].map((stat, i) => (
             <div key={i} className="flex items-center gap-5 shrink-0">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[inner_0_0_20px_rgba(255,255,255,0.02)] backdrop-blur-md">{stat.icon}</div>
                <div>
                   <div className="text-3xl font-black text-white leading-none tracking-tighter">{stat.value}</div>
                   <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-black mt-2">{stat.label}</div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Grid Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-40 w-full">
        <div className="mb-24 text-center flex flex-col items-center">
           <h2 className="inline-flex text-xs font-black text-emerald-400 bg-emerald-500/10 px-5 py-2.5 rounded-full uppercase tracking-[0.3em] mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">Core Infrastructure</h2>
           <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] max-w-4xl">
              Engineered for absolute extraction.
           </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
              {
                 title: "Quantum Algorithm",
                 desc: "Our real-time engine binds your assets instantly to specialized micro-facilities for maximum yield.",
                 icon: <CpuIcon size={28} />,
                 glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] border-blue-500/20 text-blue-400"
              },
              {
                 title: "Zero-Trust Chains",
                 desc: "Every fraction, from transport to particle separation, is cryptographically logged and certified.",
                 icon: <ShieldCheckIcon size={28} />,
                 glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-500/20 text-emerald-400"
              },
              {
                 title: "Hyper-Local Grid",
                 desc: "Sub-meter node tracking deployed directly to fleet logistics ensuring flawless asset transfer.",
                 icon: <MapPinIcon size={28} />,
                 glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] border-purple-500/20 text-purple-400"
              }
           ].map((feature, i) => (
              <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.15, duration: 0.6 }}
                 className="group relative p-10 glass-panel rounded-[2.5rem] overflow-hidden"
              >
                 <div className={`w-16 h-16 rounded-[1.25rem] bg-[#050505] border shadow-lg flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 relative z-10 ${feature.glow}`}>
                    {feature.icon}
                 </div>
                 
                 <h4 className="text-2xl font-black text-white mb-4 relative z-10">{feature.title}</h4>
                 <p className="text-slate-400 font-medium leading-relaxed relative z-10">{feature.desc}</p>
                 
              </motion.div>
           ))}
        </div>
      </section>

      {/* Radical CTA */}
      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto w-full">
         <div className="relative rounded-[3rem] overflow-hidden bg-[#050505] border border-white/10 p-12 md:p-24 flex flex-col items-center text-center group transition-all duration-700 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:border-emerald-500/30">
            {/* Inner glowing effects */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-0" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-600/20 blur-[100px] z-0 rounded-full group-hover:h-96 group-hover:bg-emerald-500/30 transition-all duration-1000" />
            
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 relative z-10 leading-none">
               Execute the paradigm <span className="text-emerald-400">shift.</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto mb-10 relative z-10 text-lg leading-relaxed">
               Assimilate into the fastest scaling network of sustainable hardware lifecycle management. Digitize your impact today.
            </p>
            
            <Link to="/register" className="relative z-10">
               <button className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-white text-[#050505] rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                 <span className="relative z-10 flex items-center gap-3">Commence <ArrowRightIcon size={18} className="group-hover:translate-x-1.5 transition-transform" /></span>
                 <div className="absolute inset-0 h-full w-full bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
               </button>
            </Link>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm font-black tracking-widest uppercase text-slate-500 relative z-10">
               <div className="flex items-center gap-2"><CheckCircle2Icon size={18} className="text-emerald-500" /> Open Source Protocol</div>
               <div className="flex items-center gap-2"><CheckCircle2Icon size={18} className="text-emerald-500" /> Instant Node Approval</div>
            </div>
         </div>
      </section>
      
    </div>
  )
}

export default Landing

