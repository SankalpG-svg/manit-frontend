import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Search, GraduationCap, Users, RefreshCw, LayoutDashboard } from 'lucide-react'

// UI Components
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

// Custom Components
import FacultyCard from '../components/FacultyCard'
import ProfileEditModal from '../components/ProfileEditModal'
import FacultyDetailModal from '../components/FacultyDetailModal'
import { ModeToggle } from '../components/mode-toggle' // 👈 Import added here

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm transition-colors">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <Icon size={16} className="text-slate-600 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState(null)

  // ── 2. ROLE CHECK LOGIC ──
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role; 
    } catch (e) {
      userRole = null;
    }
  }

  const fetchFaculty = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/faculty/')
      setFaculty(response.data)
    } catch (err) {
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFaculty() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faculty.filter(f => 
      f.name?.toLowerCase().includes(q) || 
      f.department?.toLowerCase().includes(q)
    )
  }, [faculty, query])

  const departmentsCount = useMemo(
    () => new Set(faculty.map(f => f.department).filter(Boolean)).size,
    [faculty]
  )

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-left transition-colors duration-300">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">FacultyPortal</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            
            {/* 👈 The Theme Toggle is placed right here */}
            <ModeToggle />

            {token ? (
              <>
                {/* 🔒 ADMIN ONLY BUTTON */}
                {userRole === 'admin' && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href='/admin'}
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 gap-2 font-medium"
                  >
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Button>
                )}

                <Button 
                  onClick={() => setIsEditModalOpen(true)} 
                  className="bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700"
                >
                  Edit My Profile
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} 
                  className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href='/login'} 
                className="bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 dark:shadow-none"
              >
                Faculty Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Academic profiles and research repository for the institution.</p>
        </div>

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <StatPill icon={Users} label="Total Members" value={faculty.length} />
            <StatPill icon={GraduationCap} label="Departments" value={departmentsCount} />
            <StatPill icon={RefreshCw} label="Server Status" value="Online" />
          </div>
        )}

        <div className="relative mb-10 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by name or department..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            className="pl-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl h-14 text-base shadow-sm focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl dark:bg-slate-800" />
            ))
          ) : (
            filtered.map(f => (
              <FacultyCard 
                key={f.id || f._id} 
                faculty={f} 
                onClick={() => setSelectedFaculty(f)} 
              />
            ))
          )}
        </div>

        {/* ── MODALS ── */}
        <ProfileEditModal 
          open={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); fetchFaculty(); }} 
        />

        {selectedFaculty && (
          <FacultyDetailModal 
            faculty={selectedFaculty}
            open={!!selectedFaculty}
            onClose={() => setSelectedFaculty(null)}
          />
        )}
      </main>
    </div>
  )
}