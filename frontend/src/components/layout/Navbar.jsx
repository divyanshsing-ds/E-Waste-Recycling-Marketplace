import { Link, useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon, LogOutIcon, LayoutDashboardIcon, PlusCircleIcon, SearchIcon, TruckIcon, ChevronDownIcon, ZapIcon } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import clsx from 'clsx'
import Button from '../ui/Button'

const Navbar = () => {
  const { user, accounts, activeAccountId, isAuthenticated, logout, switchAccount } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSwitch = (id) => {
    switchAccount(id)
    const acc = accounts.find(a => a.id === id)
    navigate(acc.user.role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard')
  }

  return (
    <nav className="sticky top-4 z-50 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-5 bg-[#0a0a0a]/80 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] backdrop-blur-2xl transition-all hover:border-emerald-500/20">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#050505] border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-500">
             <ZapIcon size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Volt<span className="text-emerald-400">Swap</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-12">
          <Link to="/" className="nav-link text-xs font-black uppercase tracking-[0.2em]">Home</Link>
          <Link to="/vendor/browse" className="nav-link text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
             Marketplace <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
          </Link>
          <Link to="/#impact" className="nav-link text-xs font-black uppercase tracking-[0.2em]">Impact</Link>
          {isAuthenticated && user?.role === 'USER' && (
            <Link to="/listings/my" className="nav-link text-xs font-black uppercase tracking-[0.2em]">Inventory</Link>
          )}
          {isAuthenticated && user?.role === 'VENDOR' && (
            <Link to="/vendor/dashboard" className="nav-link text-xs font-black uppercase tracking-[0.2em]">Dashboard</Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Sign In</Link>
              <Link to="/register">
                 <button className="px-6 py-3 bg-emerald-500 text-[#050505] rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95">
                    Join Network
                 </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {user?.role === 'USER' && (
                <Link to="/listings/create" className="hidden sm:block">
                  <Button variant="outline" className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 hover:border-emerald-500 hover:text-emerald-400 transition-all">
                    <PlusCircleIcon size={16} className="mr-2" /> Dump Tech
                  </Button>
                </Link>
              )}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-[1rem] bg-[#050505] flex items-center justify-center text-emerald-400 border border-emerald-500/30 overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">{user?.full_name ? user.full_name[0] : 'U'}</span>
                    )}
                  </div>
                  <div className="text-left leading-none lg:block hidden">
                    <div className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1">{user?.role}</div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      {user?.full_name?.split(' ')[0]} <ChevronDownIcon size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95 translate-y-2"
                  enterTo="transform opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100 translate-y-0"
                  leaveTo="transform opacity-0 scale-95 translate-y-2"
                >
                  <Menu.Items className="absolute right-0 mt-4 w-64 origin-top-right bg-[#0a0a0a] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-2xl focus:outline-none overflow-hidden p-2 backdrop-blur-3xl z-50">
                    <div className="px-4 py-4 border-b border-white/5 mb-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Signed in as</div>
                      <div className="text-sm font-bold text-white truncate">{user?.email}</div>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/profile" className={clsx(
                          active ? 'bg-white/10 text-white' : 'text-slate-400',
                          'flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all'
                        )}>
                          <UserCircleIcon size={18} /> Profile Settings
                        </Link>
                      )}
                    </Menu.Item>

                    {accounts?.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Switch Identity</div>
                        {accounts.filter(a => a.id !== activeAccountId).map(acc => (
                          <Menu.Item key={acc.id}>
                            {({ active }) => (
                              <button 
                                onClick={() => handleSwitch(acc.id)}
                                className={clsx(
                                  active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400',
                                  'flex w-full items-center gap-4 px-4 py-3 rounded-xl transition-all group/acc'
                                )}
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#050505] flex items-center justify-center text-[10px] font-bold overflow-hidden border border-white/10 group-hover/acc:border-indigo-500/50 transition-colors shadow-inner">
                                  {acc.user.avatar_url ? <img src={acc.user.avatar_url} /> : acc.user.full_name[0]}
                                </div>
                                <div className="text-left flex-grow">
                                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/acc:text-indigo-400/70">{acc.user.role}</div>
                                  <div className="text-xs font-black truncate text-slate-200 group-hover/acc:text-indigo-300">{acc.user.full_name}</div>
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/login" className={clsx(
                            active ? 'bg-white/10 text-white' : 'text-slate-400',
                            'flex w-full items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all'
                          )}>
                            <PlusCircleIcon size={18} /> Add New Account
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={handleLogout} className={clsx(
                            active ? 'bg-red-500/10 text-red-400' : 'text-red-500/70',
                            'flex w-full items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all mt-1'
                          )}>
                            <LogOutIcon size={18} /> Sign Out Securely
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
