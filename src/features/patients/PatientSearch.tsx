import { useState, useMemo } from 'react';
import { Search, X, Clock, ChevronRight } from 'lucide-react';
import { patients, encounters, lifecycles } from '@/mock/data';
import { usePatientStore } from '@/store/patientStore';
import { calculateAge, getInitials } from '@/shared/utils';

export function QuickPatientSearch() {
  const [query, setQuery] = useState('');
  const { setSelectedPatient, setActiveEncounter, setActiveLifecycle, selectedPatient } = usePatientStore();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return patients.filter(
      (p) => p.fullName.toLowerCase().includes(q) || p.phone.includes(q) || p.code.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const recentPatients = patients.slice(0, 3);

  const handleSelect = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    const enc = encounters.filter((e) => e.patientId === patient.id).sort((a, b) => b.visitDate.localeCompare(a.visitDate))[0];
    setActiveEncounter(enc || null);
    if (enc) {
      const map: Record<string, string> = { kham_thai: 'maternity', tiem_chung: 'vaccination', kham_nhi: 'pediatric', kham_phu_khoa: 'gynecology' };
      const program = map[enc.visitType];
      const lc = lifecycles.find((l) => l.patientId === patient.id && l.program === program && l.status === 'active');
      setActiveLifecycle(lc || lifecycles.find((l) => l.patientId === patient.id && l.status === 'active') || null);
    }
    setQuery('');
  };

  return (
    <div className="bg-white rounded-[8px] border border-[#d8d8d8] p-4">
      <h3 className="text-[10px] font-bold text-[#080808] uppercase tracking-[1px] mb-3">Tìm kiếm nhanh bệnh nhân</h3>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#ababab]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên, SĐT, mã bệnh nhân..."
          className="w-full pl-8 pr-8 py-2 text-[12px] rounded-[4px] border border-[#d8d8d8] outline-none focus:border-[#146ef5] bg-[#f8f9fb] text-[#080808] placeholder:text-[#ababab] font-medium"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-[#ababab]" />
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-0.5">
          {results.map((p) => (
            <button key={p.id} onClick={() => handleSelect(p)}
              className={`w-full flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-[#f4f5f7] transition-colors text-left ${selectedPatient?.id === p.id ? 'bg-[#146ef5]/5 border border-[#146ef5]/20' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-[#146ef5] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                {getInitials(p.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-[#080808] truncate">{p.fullName}</p>
                <p className="text-[10px] text-[#ababab]">{p.code}</p>
              </div>
              <span className="text-[10px] text-[#ababab]">{calculateAge(p.dob)} tuổi</span>
            </button>
          ))}
        </div>
      ) : query ? (
        <p className="text-[10px] text-[#ababab] text-center py-3">Không tìm thấy</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#ababab] flex items-center gap-1"><Clock className="w-3 h-3" /> Gợi ý tìm kiếm gần đây</span>
            <button className="text-[10px] text-[#146ef5] hover:underline font-medium">Xóa lịch sử</button>
          </div>
          <div className="space-y-0.5">
            {recentPatients.map((p) => (
              <button key={p.id} onClick={() => handleSelect(p)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-[#f4f5f7] transition-colors text-left ${selectedPatient?.id === p.id ? 'bg-[#146ef5]/5' : ''}`}>
                <div className="w-7 h-7 rounded-full bg-[#7a3dff] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                  {getInitials(p.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#080808] truncate">{p.fullName}</p>
                  <p className="text-[10px] text-[#ababab]">{p.phone}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-[#d8d8d8]" />
              </button>
            ))}
          </div>
          <button className="w-full mt-2 text-[10px] text-[#146ef5] hover:underline text-center font-semibold">
            Xem tất cả bệnh nhân →
          </button>
        </>
      )}
    </div>
  );
}
