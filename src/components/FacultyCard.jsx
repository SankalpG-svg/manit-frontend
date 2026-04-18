import { Building2, BookOpen } from 'lucide-react'

export default function FacultyCard({ faculty, onClick }) {
  // Use research_papers from your Pydantic model
  const papersCount = faculty.research_papers?.length || 0;
  const photoUrl = faculty.profile_photo_url || `https://ui-avatars.com/api/?name=${faculty.name}&background=eff6ff&color=1d4ed8&size=200`;

  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="h-1.5 w-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <img src={photoUrl} className="w-20 h-20 rounded-2xl object-cover mb-4 border border-slate-100 shadow-sm" alt={faculty.name} />
        
        <h3 className="font-bold text-slate-900 leading-tight mb-1">{faculty.name}</h3>
        <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">{faculty.designation}</p>
        
        <div className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <Building2 size={12} />
          {faculty.department}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-slate-400">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <BookOpen size={14} />
          {papersCount} Papers
        </div>
        <div className="text-[10px] font-bold uppercase text-blue-600">View Profile</div>
      </div>
    </article>
  )
}