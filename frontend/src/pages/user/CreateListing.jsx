import { useState, useRef } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateListing } from '../../hooks/useListings'
import { uploadListingImage } from '../../api/listings'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { CameraIcon, MapPinIcon, MonitorIcon, SmartphoneIcon, TvIcon, ZapIcon, InfoIcon } from 'lucide-react'
import clsx from 'clsx'

const categories = [
  { id: 'phone', label: 'Smartphone', icon: <SmartphoneIcon size={20} /> },
  { id: 'laptop', label: 'Computer', icon: <MonitorIcon size={20} /> },
  { id: 'tv', label: 'Television', icon: <TvIcon size={20} /> },
  { id: 'appliance', label: 'Appliance', icon: <ZapIcon size={20} /> },
  { id: 'other', label: 'Other E-Waste', icon: <InfoIcon size={20} /> },
]

const CreateListing = () => {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { register, handleSubmit, trigger, formState: { errors } } = useForm()
  const { mutate: create, isLoading } = useCreateListing()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  const queryClient = useQueryClient()

  const onSubmit = (data) => {
    // Attempt to get user's location, default to 0,0 if failed and handle gracefully
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          createListingWithLocation(data, latitude, longitude)
        },
        (error) => {
          console.error("Geolocation failed", error)
          // Fallback to New York or last known if geolocation fails
          createListingWithLocation(data, 40.7128, -74.0060)
        }
      )
    } else {
      createListingWithLocation(data, 40.7128, -74.0060)
    }
  }

  const createListingWithLocation = (data, lat, lng) => {
    const payload = {
      ...data,
      category: selectedCategory,
      pickup_lat: lat,
      pickup_lng: lng,
    }
    create(payload, {
      onSuccess: async (res) => {
        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile)
          try {
            await uploadListingImage(res.data.id, formData)
          } catch (err) {
            console.error("Image upload failed", err)
          }
        }
        queryClient.invalidateQueries(['listings'])
        navigate('/dashboard')
      }
    })
  }


  return (
    <div className="max-w-4xl mx-auto px-8 py-20">
      <div className="glass-card p-10 md:p-16">
        <header className="mb-12 text-center">
           <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Sell Your Old Tech</h2>
           <p className="text-slate-400 font-medium max-w-lg mx-auto">Follow these 3 easy steps to start receiving bids from certified recyclers.</p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-16">
           {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                 <div className={clsx(
                   "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
                   step === i ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : 
                   step > i ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-slate-500 border border-white/10"
                 )}>
                   {step > i ? '✓' : i}
                 </div>
                 {i < 3 && <div className={clsx("w-12 h-0.5 rounded", step > i ? "bg-emerald-500/50" : "bg-white/10")} />}
              </div>
           ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-xl font-bold text-slate-200 text-center">What are you recycling?</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={clsx(
                        "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 group backdrop-blur-md",
                        selectedCategory === cat.id 
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02]" 
                          : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-emerald-500/40 hover:bg-white/5 hover:text-white hover:-translate-y-1"
                      )}
                    >
                      <div className={clsx(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg", 
                        selectedCategory === cat.id 
                          ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30" 
                          : "bg-white/5 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:scale-110"
                      )}>
                        {cat.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{cat.label}</span>
                    </button>
                  ))}
               </div>
               <div className="flex justify-center pt-8">
                  <Button type="button" disabled={!selectedCategory} onClick={() => setStep(2)} className="px-12 py-4 text-lg">Next: Item Details</Button>
               </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Input label="Listing Title" {...register('title', { required: 'Title is required' })} placeholder="e.g. Broken iPhone 12 Pro" />
                   <div className="flex flex-col gap-1.5">
                     <label className="text-sm font-semibold text-slate-300 pl-1">Device Condition</label>
                     <select {...register('condition')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-300">
                       <option value="good" className="bg-slate-900 text-white">Good (Working)</option>
                       <option value="fair" className="bg-slate-900 text-white">Fair (Cracked but working)</option>
                       <option value="poor" className="bg-slate-900 text-white">Poor (Non-functional/Dead)</option>
                     </select>
                   </div>
                </div>
                <Input label="Description" {...register('description', { required: 'Required' })} placeholder="Provide details about the damage or parts missing..." />
                <div className="flex justify-between pt-8 border-t border-white/5">
                   <Button variant="secondary" type="button" onClick={() => setStep(1)}>Back</Button>
                   <Button 
                     type="button" 
                     onClick={async () => {
                       const isStep2Valid = await trigger(['title', 'description', 'condition'])
                       if (isStep2Valid) setStep(3)
                     }}
                   >
                     Next: Pickup Location
                   </Button>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <Input label="Pickup Address" {...register('pickup_address', { required: 'Required' })} placeholder="Your full home or office address" />
                <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-6 backdrop-blur-md">
                   {imagePreview ? (
                     <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                        >
                           <ZapIcon size={18} />
                        </button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-4 text-center py-4">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
                          <CameraIcon size={36} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg mb-1">Upload Photo (Recommended)</h4>
                          <p className="text-slate-400 text-sm">Listings with photos get up to 3x higher bids.</p>
                        </div>
                     </div>
                   )}
                   <input 
                     type="file" 
                     ref={fileInputRef}
                     onChange={handleFileChange}
                     accept="image/*"
                     className="hidden" 
                   />
                   <Button 
                     variant="secondary" 
                     type="button" 
                     onClick={triggerFileInput}
                     className="w-full md:w-auto text-xs py-2 px-8 uppercase tracking-widest font-black"
                   >
                      {imageFile ? 'Change Photo' : 'Browse Files'}
                   </Button>
                </div>
               <div className="flex justify-between pt-8 border-t border-white/5">
                  <Button variant="secondary" type="button" onClick={() => setStep(2)}>Back</Button>
                  <Button loading={isLoading} type="submit" className="px-14">Submit Listing</Button>
               </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreateListing
