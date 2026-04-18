import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, ShieldCheck, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminDashboard() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState(null)
  const [empId, setEmpId] = useState('')
  const [password, setPassword] = useState('')

  // ── 🚀 UPDATED: Fetching from the secret admin endpoint ──
  const fetchAllFaculty = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found. Please login.");
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/faculty/admin/all', {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setFaculty(res.data);
    } catch (err) {
      console.error("Admin fetch failed:", err);
      // 🕵️ If the backend says 403, it means the TOKEN is valid but the ROLE is wrong
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Access Denied: Your account does not have Admin privileges.");
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Give the app a tiny heartbeat to ensure token is ready
    fetchAllFaculty();
  }, []);
  const handleApprove = async (mongoId) => {
    if (!empId || !password) return alert("Please provide Emp ID and Password")
    try {
      await axios.post(`http://127.0.0.1:8000/api/faculty/${mongoId}/approve`, {
        emp_id: empId,
        password: password
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      alert("Faculty Approved Successfully!")
      setApprovingId(null)
      setEmpId('')
      setPassword('')
      fetchAllFaculty()
    } catch (err) {
      alert(err.response?.data?.detail || "Approval failed")
    }
  }

  const handleDelete = async (mongoId) => {
    if (!window.confirm("Are you sure? This will delete the faculty permanently.")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/faculty/${mongoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAllFaculty();
    } catch (err) {
      alert("Delete failed. You must be logged in as admin.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-left">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={32} /> Admin Control Panel
            </h1>
            <p className="text-slate-500 mt-1">Manage pending applications and verified members.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchAllFaculty} variant="ghost" className="gap-2">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
            <Button onClick={() => window.location.href='/'} variant="outline">Back to Directory</Button>
          </div>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading faculty data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Faculty Member</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Current Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faculty.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-slate-400">No records found.</td>
                  </tr>
                ) : (
                  faculty.map((f) => (
                    <tr key={f.id || f._id}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{f.name}</div>
                        <div className="text-xs text-slate-500">{f.email} • {f.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          f.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          f.status === 'claimed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {f.status === 'pending' && approvingId !== (f.id || f._id) && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setApprovingId(f.id || f._id)}>
                              Approve
                            </Button>
                          )}
                          
                          {approvingId === (f.id || f._id) && (
                            <div className="flex gap-2 items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                              <Input 
                                size="sm" 
                                className="w-24 h-8 bg-white" 
                                placeholder="Emp ID" 
                                value={empId}
                                onChange={e => setEmpId(e.target.value)} 
                              />
                              <Input 
                                size="sm" 
                                type="password" 
                                className="w-24 h-8 bg-white" 
                                placeholder="Pass" 
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                              />
                              <Button size="sm" className="h-8" onClick={() => handleApprove(f.id || f._id)}>Go</Button>
                              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setApprovingId(null)}>Cancel</Button>
                            </div>
                          )}
                          
                          <button 
                            onClick={() => handleDelete(f.id || f._id)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Faculty"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}