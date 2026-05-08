import { Bell, ChevronDown } from 'lucide-react';
import { PatientSelectSearch } from '@/features/patients/PatientSelectSearch';

export function TopHeader() {
  return (
    <header className="h-[48px] bg-white border-b border-[#d8d8d8] flex items-center justify-between px-5 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[#ababab] font-medium">Home</span>
        <span className="text-[#d8d8d8]">/</span>
        <span className="text-[#ababab] font-medium">Khách hàng</span>
        <span className="text-[#d8d8d8]">/</span>
        <span className="text-[#080808] font-bold">Hồ sơ bệnh nhân</span>
      </div>

      {/* Center: Patient Search Select */}
      <PatientSelectSearch />

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Language flag mock */}
        <div className="w-5 h-5 rounded-full bg-[#ee1d36] flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </div>

        <button className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#f4f5f7] transition-colors">
          <Bell className="w-4 h-4 text-[#5a5a5a]" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ee1d36] text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
        </button>

        <div className="flex items-center gap-2.5 pl-4 border-l border-[#d8d8d8]">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#146ef5] text-[10px] font-bold">
            PM
          </div>
          <div className="text-left flex-1 min-w-0 pr-2">
            <p className="text-[12px] font-bold text-[#080808] leading-tight truncate">PM. CRM</p>
            <p className="text-[10px] text-[#ababab] leading-tight">Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-[#ababab]" />
        </div>
      </div>
    </header>
  );
}
