import { useState, useRef, useEffect } from 'react'
import api from '../lib/api' 

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button }   from '@/components/ui/button'
import { Label }    from '@/components/ui/label'

import {
  User, Briefcase, BookOpen,
  Plus, Trash2, Upload, Loader2, CheckCircle2, AlertCircle, FileText
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
function arrToStr(arr) { return (arr ?? []).join(', ') }
function strToArr(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

// ── Sub-components ─────────────────────────────────────────────
function FieldGroup({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-700 tracking-wide uppercase">
        {label}
      </Label>
      {hint && <p className="text-xs text-slate-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-2 pb-1 border-b border-dashed border-slate-200">
      {children}
    </h4>
  )
}

function PhotoUploader({ previewUrl, onFileChange }) {
  const ref = useRef()
  return (
    <div className="flex items-center gap-5">
      <div
        className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 cursor-pointer hover:border-slate-400 transition-colors"
        onClick={() => ref.current?.click()}
      >
        {previewUrl
          ? <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          : <User size={28} className="text-slate-300" />
        }
      </div>
      <div className="flex-1">
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => onFileChange(e.target.files[0] ?? null)} />
        <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()} className="gap-2 text-xs h-8">
          <Upload size={13} /> Choose photo
        </Button>
        <p className="text-xs text-slate-400 mt-1.5">JPEG / PNG / WEBP · max 5 MB</p>
      </div>
    </div>
  )
}

function PaperRow({ paper, idx, onChange, onRemove }) {
  function set(field, val) { onChange(idx, { ...paper, [field]: val }) }
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 text-left">
      <button type="button" onClick={() => onRemove(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition-colors">
        <Trash2 size={14} />
      </button>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Title"><Input placeholder="Paper title" value={paper.title} onChange={e => set('title', e.target.value)} className="h-8 text-sm" /></FieldGroup>
        <FieldGroup label="Venue type"><Input placeholder="e.g. Conference / Journal" value={paper.venue_type} onChange={e => set('venue_type', e.target.value)} className="h-8 text-sm" /></FieldGroup>
        <FieldGroup label="Publisher"><Input placeholder="Publisher" value={paper.publisher} onChange={e => set('publisher', e.target.value)} className="h-8 text-sm" /></FieldGroup>
        <FieldGroup label="Year"><Input type="number" placeholder="2024" value={paper.year} onChange={e => set('year', parseInt(e.target.value) || '')} className="h-8 text-sm" /></FieldGroup>
        <div className="col-span-2">
          <FieldGroup label="Upload PDF (Optional)">
            <div className="flex items-center gap-3">
              <Input type="file" accept="application/pdf" onChange={e => set('pdf_file', e.target.files[0])} className="h-8 text-sm flex-1 bg-white" />
              {paper.pdf_url && !paper.pdf_file && (
                <a href={paper.pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <FileText size={14} /> Current PDF
                </a>
              )}
            </div>
          </FieldGroup>
        </div>
      </div>
    </div>
  )
}

function ExperienceRow({ exp, idx, onChange, onRemove }) {
  function set(field, val) { onChange(idx, { ...exp, [field]: val }) }
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 text-left">
      <button type="button" onClick={() => onRemove(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition-colors">
        <Trash2 size={14} />
      </button>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Institution"><Input placeholder="University" value={exp.institution} onChange={e => set('institution', e.target.value)} className="h-8 text-sm" /></FieldGroup>
        <FieldGroup label="Role"><Input placeholder="Role" value={exp.role} onChange={e => set('role', e.target.value)} className="h-8 text-sm" /></FieldGroup>
        <FieldGroup label="Start year"><Input type="number" placeholder="2018" value={exp.start_year} onChange={e => set('start_year', parseInt(e.target.value) || '')} className="h-8 text-sm" /></FieldGroup>
        <FieldGroup label="End year"><Input type="number" placeholder="Present" value={exp.end_year ?? ''} onChange={e => set('end_year', e.target.value ? parseInt(e.target.value) : null)} className="h-8 text-sm" /></FieldGroup>
      </div>
    </div>
  )
}

function Toast({ type, message }) {
  if (!message) return null
  const isOk = type === 'success'
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm border ${isOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      {isOk ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> : <AlertCircle size={15} className="text-red-500 shrink-0" />}
      {message}
    </div>
  )
}

const blankPaper = () => ({ title: '', venue_type: '', publisher: '', year: new Date().getFullYear(), pdf_url: null, pdf_file: null })
const blankExp = () => ({ institution: '', role: '', start_year: '', end_year: null })

export default function ProfileEditModal({ open, onClose, initialData = {} }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [qualification, setQualification] = useState('')
  const [researchArea, setResearchArea] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [dob, setDob] = useState('')
  const [subjectsStr, setSubjectsStr] = useState('')
  const [eventsStr, setEventsStr] = useState('')
  const [visitsStr, setVisitsStr] = useState('')
  const [papers, setPapers] = useState([])
  const [experiences, setExperiences] = useState([])

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ type: '', message: '' })

  // ── Sync internal state with initialData when modal opens ──
  useEffect(() => {
    if (open && initialData) {
      setPreviewUrl(initialData.profile_photo_url || null)
      setQualification(initialData.qualification || '')
      setResearchArea(initialData.research_area || '')
      setPhone(initialData.phone || '')
      setBio(initialData.bio || '')
      setDob(initialData.dob || '')
      setSubjectsStr(arrToStr(initialData.subjects_current_sem))
      setEventsStr(arrToStr(initialData.events_organized))
      setVisitsStr(arrToStr(initialData.foreign_visits))
      setPapers(initialData.publications || [])
      setExperiences(initialData.experience || [])
    }
  }, [open]);

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast({ type: '', message: '' }), 4000)
  }

  function handleFileChange(f) {
    setFile(f)
    if (f) setPreviewUrl(URL.createObjectURL(f))
  }

  function addPaper() { setPapers(p => [...p, blankPaper()]) }
  function removePaper(i) { setPapers(p => p.filter((_, idx) => idx !== i)) }
  function updatePaper(i, updated) { setPapers(p => p.map((x, idx) => idx === i ? updated : x)) }

  function addExp() { setExperiences(e => [...e, blankExp()]) }
  function removeExp(i) { setExperiences(e => e.filter((_, idx) => idx !== i)) }
  function updateExp(i, updated) { setExperiences(e => e.map((x, idx) => idx === i ? updated : x)) }

  async function handleSave() {
    setSaving(true)
    setToast({ type: '', message: '' })

    try {
      let finalPhotoUrl = previewUrl
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await api.post('/api/upload/upload-profile-image?upload_type=profile_photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        finalPhotoUrl = uploadRes.data.file_url
      }

      const processedPapers = []
      for (const p of papers) {
        if (!p.title?.trim()) continue
        let finalPdfUrl = p.pdf_url
        if (p.pdf_file) {
          const pdfData = new FormData()
          pdfData.append('file', p.pdf_file)
          const pdfRes = await api.post('/api/upload/upload-profile-image?upload_type=research_paper', pdfData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          finalPdfUrl = pdfRes.data.file_url
        }
        processedPapers.push({
          title: p.title,
          venue_type: p.venue_type || "",
          publisher: p.publisher || "",
          year: p.year || new Date().getFullYear(),
          pdf_url: finalPdfUrl || undefined
        })
      }

      const payload = {
        qualification,
        research_area: researchArea,
        phone,
        bio,
        dob,
        profile_photo_url: finalPhotoUrl,
        subjects_current_sem: strToArr(subjectsStr),
        events_organized: strToArr(eventsStr),
        foreign_visits: strToArr(visitsStr),
        publications: processedPapers,
        experience: experiences.filter(e => e.institution?.trim()),
      }

      await api.patch('/api/faculty/me', payload)

      showToast('success', 'Profile updated successfully!')
      setTimeout(() => {
        onClose?.()
        window.location.reload()
      }, 1200)

    } catch (err) {
      console.error("Update error:", err)
      showToast('error', "Update failed. Check fields or network.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose?.() }}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden rounded-2xl border-slate-200 shadow-xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 text-left">
          <DialogTitle className="text-base font-semibold text-slate-900 tracking-tight">Edit profile</DialogTitle>
          <p className="text-xs text-slate-400 mt-0.5">Changes are saved to your faculty record immediately.</p>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <div className="px-6 pt-4 border-b border-slate-100">
            <TabsList className="bg-slate-100/80 p-0.5 h-9 gap-0.5">
              <TabsTrigger value="basic" className="h-8 text-xs gap-1.5 data-[state=active]:bg-white"><User size={12} /> Basic info</TabsTrigger>
              <TabsTrigger value="professional" className="h-8 text-xs gap-1.5 data-[state=active]:bg-white"><Briefcase size={12} /> Professional</TabsTrigger>
              <TabsTrigger value="papers" className="h-8 text-xs gap-1.5 data-[state=active]:bg-white"><BookOpen size={12} /> Experience & papers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto text-left">
            <FieldGroup label="Profile photo"><PhotoUploader previewUrl={previewUrl} onFileChange={handleFileChange} /></FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Qualification"><Input placeholder="e.g. Ph.D." value={qualification} onChange={e => setQualification(e.target.value)} className="h-9 text-sm" /></FieldGroup>
              <FieldGroup label="Research area"><Input placeholder="e.g. AI/ML" value={researchArea} onChange={e => setResearchArea(e.target.value)} className="h-9 text-sm" /></FieldGroup>
              <FieldGroup label="Phone"><Input placeholder="+91..." value={phone} onChange={e => setPhone(e.target.value)} className="h-9 text-sm" /></FieldGroup>
              <FieldGroup label="Date of birth"><Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="h-9 text-sm" /></FieldGroup>
            </div>
            <FieldGroup label="Bio"><Textarea placeholder="Professional bio..." value={bio} onChange={e => setBio(e.target.value)} rows={4} className="text-sm" /></FieldGroup>
          </TabsContent>

          <TabsContent value="professional" className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto text-left">
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">Separate multiple values with commas.</div>
            <FieldGroup label="Current semester subjects"><Textarea value={subjectsStr} onChange={e => setSubjectsStr(e.target.value)} rows={3} className="text-sm" /></FieldGroup>
            <FieldGroup label="Events organised"><Textarea value={eventsStr} onChange={e => setEventsStr(e.target.value)} rows={3} className="text-sm" /></FieldGroup>
            <FieldGroup label="Foreign visits"><Textarea value={visitsStr} onChange={e => setVisitsStr(e.target.value)} rows={3} className="text-sm" /></FieldGroup>
          </TabsContent>

          <TabsContent value="papers" className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between"><SectionHeading>Research papers</SectionHeading><Button type="button" variant="outline" size="sm" onClick={addPaper} className="h-7 text-xs border-dashed"><Plus size={12} /> Add paper</Button></div>
              {papers.map((p, i) => <PaperRow key={i} paper={p} idx={i} onChange={updatePaper} onRemove={removePaper} />)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><SectionHeading>Previous experience</SectionHeading><Button type="button" variant="outline" size="sm" onClick={addExp} className="h-7 text-xs border-dashed"><Plus size={12} /> Add experience</Button></div>
              {experiences.map((exp, i) => <ExperienceRow key={i} exp={exp} idx={i} onChange={updateExp} onRemove={removeExp} />)}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-col sm:flex-row gap-3">
          <div className="flex-1"><Toast type={toast.type} message={toast.message} /></div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="bg-slate-900 text-white">
              {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}