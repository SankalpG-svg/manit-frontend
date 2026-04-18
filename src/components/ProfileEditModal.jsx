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

// ... (Sub-components: FieldGroup, SectionHeading, PhotoUploader, PaperRow, ExperienceRow, Toast remain the same)

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

  // ── ✨ FIXED EFFECT: Run only when the Modal opens ──
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
      // Use fallback to empty array to ensure state is always controlled
      setPapers(initialData.publications || [])
      setExperiences(initialData.experience || [])
    }
  }, [open]); // 👈 Only depend on 'open' to stop the infinite loop

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
        qualification: qualification || undefined,
        research_area: researchArea || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        dob: dob || undefined,
        profile_photo_url: finalPhotoUrl || undefined,
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

  // ... (Rest of the JSX remains the same)
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose?.() }}>
      {/* ... Content ... */}
    </Dialog>
  )
}