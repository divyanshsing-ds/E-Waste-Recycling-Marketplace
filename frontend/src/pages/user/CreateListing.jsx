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
  const { register, handleSubmit, formState: { errors } } = useForm()
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
           <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Sell Your Old Tech</h2>
           <p className="text-slate-500 font-medium max-w-lg mx-auto">Follow these 3 easy steps to start receiving bids from certified recyclers.</p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-16">
           {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                 <div className={clsx(
                   "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                   step === i ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : 
                   step > i ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                 )}>
                   {step > i ? '✓' : i}
                 </div>
                 {i < 3 && <div className={clsx("w-12 h-0.5 rounded", step > i ? "bg-emerald-500" : "bg-slate-100")} />}
              </div>
           ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-xl font-bold text-slate-800 text-center">What are you recycling?</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={clsx(
                        "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group",
                        selectedCategory === cat.id ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md" : "border-slate-50 hover:bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm", selectedCategory === cat.id ? "bg-primary-500 text-white shadow-primary-500/20" : "bg-white text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500")}>
                        {cat.icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
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
                    <label className="text-sm font-semibold text-slate-700 pl-1">Device Condition</label>
                    <select {...register('condition')} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="good">Good (Working)</option>
                      <option value="fair">Fair (Cracked but working)</option>
                      <option value="poor">Poor (Non-functional/Dead)</option>
                    </select>
                  </div>
               </div>
               <Input label="Description" {...register('description', { required: 'Required' })} placeholder="Provide details about the damage or parts missing..." />
               <div className="flex justify-between pt-8 border-t border-slate-100">
                  <Button variant="secondary" type="button" onClick={() => setStep(1)}>Back</Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      const title = document.querySelector('input[name="title"]')?.value
                      const desc = document.querySelector('textarea[name="description"]')?.value
                      if (!title || !desc) return
                      setStep(3)
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
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-6">
                   {imagePreview ? (
                     <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                           <ZapIcon size={16} />
                        </button>
                     </div>
                   ) : (
                     <div className="flex items-center gap-6 w-full">
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                          <CameraIcon size={32} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 mb-1">Upload Photo (Recommended)</h4>
                          <p className="text-slate-500 text-sm">Listings with photos get up to 3x higher bids.</p>
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
                     className="w-full md:w-auto text-xs py-2 px-6 shadow-none"
                   >
                      {imageFile ? 'Change Photo' : 'Browse Files'}
                   </Button>
                </div>
               <div className="flex justify-between pt-8 border-t border-slate-100">
                  <Button variant="secondary" type="button" onClick={() => setStep(2)}>Back</Button>
                  <Button loading={isLoading} type="submit" className="px-12">Submit Listing</Button>
               </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreateListing
