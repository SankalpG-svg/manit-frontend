import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail, Phone, BookOpen, Briefcase, GraduationCap, Calendar } from 'lucide-react'

export default function FacultyDetailModal({ faculty, open, onClose }) {
  // Move the log here so it has access to the 'faculty' variable!
  if (faculty) {
    console.log("Full Faculty Data for Modal:", faculty);
  }

  if (!faculty) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl">
        {/* Banner Section */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900" />
        
        <div className="px-8 pb-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 -mt-12 items-start">
            <img 
              src={faculty.profile_photo_url || `https://ui-avatars.com/api/?name=${faculty.name}&size=200`} 
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
              alt={faculty.name}
            />
            <div className="mt-14 flex-1 text-left">
              <h2 className="text-3xl font-bold text-slate-900">{faculty.name}</h2>
              <p className="text-blue-600 font-semibold text-lg">{faculty.designation}</p>
              <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                <GraduationCap size={16} /> {faculty.department} Department
              </p>
            </div>
          </div>

          {/* Bio Section */}
          {faculty.bio && (
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 text-left">
              "{faculty.bio}"
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
            {/* Left Column: Contact & Quick Info */}
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Information</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {faculty.email}</div>
                  {faculty.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {faculty.phone}</div>}
                  {faculty.dob && <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400"/> Born: {faculty.dob}</div>}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {faculty.research_area?.split(',').map(area => (
                    <span key={area} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                      {area.trim()}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Experience & Research */}
            <div className="md:col-span-2 space-y-8">
              {/* Research Papers */}
              <section>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <BookOpen className="text-blue-600" size={20} /> Research Publications
                </h4>
                <div className="space-y-4">
                  {faculty.research_papers?.length > 0 ? faculty.research_papers.map((paper, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <h5 className="font-semibold text-slate-800 leading-tight">{paper.title}</h5>
                      <div className="text-xs text-slate-500 mt-2 flex justify-between items-center">
                        <span>{paper.venue_type} • {paper.publisher} • {paper.year}</span>
                        {paper.pdf_url && (
                          <a href={paper.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">View PDF</a>
                        )}
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400 italic">No publications listed.</p>}
                </div>
              </section>

              {/* Work Experience */}
              <section>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Briefcase className="text-blue-600" size={20} /> Academic Experience
                </h4>
                <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
                  {faculty.previous_experience?.length > 0 ? faculty.previous_experience.map((exp, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600" />
                      <h5 className="font-semibold text-slate-800">{exp.role}</h5>
                      <p className="text-sm text-slate-600">{exp.institution}</p>
                      <p className="text-xs text-slate-400">{exp.start_year} — {exp.end_year || 'Present'}</p>
                    </div>
                  )) : <p className="text-sm text-slate-400 italic ml-[-24px]">No experience history listed.</p>}
                </div>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}