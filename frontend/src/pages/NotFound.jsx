import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { HomeIcon } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="text-9xl font-black text-slate-100 mb-8 select-none">404</div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Page Not Found</h1>
      <p className="text-slate-500 max-w-sm font-medium mb-10 leading-relaxed text-lg">
        The page you are looking for might have been moved or doesn't exist.
      </p>
      <Link to="/">
        <Button className="gap-2 px-10 shadow-primary-500/25">
          <HomeIcon size={20} /> Back Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
