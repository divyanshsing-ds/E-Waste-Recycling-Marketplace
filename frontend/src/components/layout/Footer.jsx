const Footer = () => {
  return (
    <footer className="relative z-10 bg-[#050505]/80 backdrop-blur-xl border-t border-white/10 text-slate-400 py-16 px-8 mt-auto shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-white text-2xl font-black mb-4 tracking-tighter">
            Volt<span className="text-emerald-400">Swap</span>
          </h3>
          <p className="max-w-sm mb-6 font-medium leading-relaxed">
            Connecting nodes with certified extractors to ensure a greener planet. 
            Recycle responsibly, realize terminal value.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 text-lg tracking-wide uppercase text-xs">Product</h4>
          <ul className="space-y-3">
            <li><a href="#" className="font-medium hover:text-emerald-400 transition-colors">How it works</a></li>
            <li><a href="#" className="font-medium hover:text-emerald-400 transition-colors">Market Data</a></li>
            <li><a href="#" className="font-medium hover:text-emerald-400 transition-colors">Extraction Nodes</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 text-lg tracking-wide uppercase text-xs">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="font-medium hover:text-emerald-400 transition-colors">About Protocol</a></li>
            <li><a href="#" className="font-medium hover:text-emerald-400 transition-colors">Contact Terminals</a></li>
            <li><a href="#" className="font-medium hover:text-emerald-400 transition-colors">Privacy Encryption</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs font-bold tracking-widest uppercase text-slate-600">
        <p>&copy; {new Date().getFullYear()} VoltSwap Protocol. All systems nominal.</p>
      </div>
    </footer>
  )
}

export default Footer
