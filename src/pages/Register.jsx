import { useState } from 'react'
// ── 1. Import your custom api instance instead of raw axios ──
import api from '../lib/api' 
import { GraduationCap, Mail, User, Building2, Briefcase, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      designation: formData.designation.trim()
    }

    try {
      // ── 2. Use 'api.post' with a relative path ──
      // The 'api' instance handles the http://... part automatically
      await api.post('/api/faculty/register', payload)
      
      alert("Registration submitted! Please wait for Admin approval.")
      window.location.href = '/'
    } catch (err) {
      console.error("Registration Details:", err.response?.data)
      
      const errorData = err.response?.data?.detail
      let finalMsg = "Registration failed"

      if (Array.isArray(errorData)) {
        finalMsg = `${errorData[0].loc[1]}: ${errorData[0].msg}`
      } else if (typeof errorData === 'string') {
        finalMsg = errorData
      }

      alert(`Error: ${finalMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Faculty Registration</h2>
          <p className="text-slate-400 text-sm mt-1">Join the institutional portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1 text-left block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Dr. Anand ..." 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1 text-left block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                type="email" 
                className="pl-10" 
                placeholder="anand@manit.ac.in" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  className="pl-9" 
                  placeholder="CSE" 
                  required
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Designation</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  className="pl-9" 
                  placeholder="Professor" 
                  required
                  value={formData.designation}
                  onChange={e => setFormData({...formData, designation: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base gap-2 mt-4" disabled={loading}>
            {loading ? "Submitting..." : <><Send size={18} /> Submit Application</>}
          </Button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  )
}