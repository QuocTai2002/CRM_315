import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { patients, encounters, lifecycles } from '@/mock/data';
import { usePatientStore } from '@/store/patientStore';
import { calculateAge, getInitials } from '@/shared/utils';

export function PatientSelectSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    selectedPatient,
    setSelectedPatient,
    setActiveEncounter,
    setActiveLifecycle,
  } = usePatientStore();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return patients.slice(0, 6); // show recent when empty
    const q = query.toLowerCase();
    return patients
      .filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.code.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query]);

  const handleSelect = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    const enc = encounters
      .filter((e) => e.patientId === patient.id)
      .sort((a, b) => b.visitDate.localeCompare(a.visitDate))[0];
    setActiveEncounter(enc || null);
    if (enc) {
      const map: Record<string, string> = {
        kham_thai: 'maternity',
        tiem_chung: 'vaccination',
        kham_nhi: 'pediatric',
        kham_phu_khoa: 'gynecology',
      };
      const program = map[enc.visitType];
      const lc = lifecycles.find(
        (l) => l.patientId === patient.id && l.program === program && l.status === 'active',
      );
      setActiveLifecycle(
        lc ||
          lifecycles.find((l) => l.patientId === patient.id && l.status === 'active') ||
          null,
      );
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedPatient(null as any);
    setActiveEncounter(null);
    setActiveLifecycle(null);
    setQuery('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-[360px]">
      {/* Input / Selected Display */}
      <div
        className={`flex items-center gap-2 h-[36px] px-3 rounded-[4px] border bg-[#f8f9fb] cursor-text transition-colors ${
          isOpen ? 'border-[#146ef5] shadow-sm' : 'border-[#d8d8d8]'
        }`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="w-3.5 h-3.5 text-[#ababab] flex-shrink-0" />

        {selectedPatient && !isOpen ? (
          /* Show selected patient chip */
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-5 h-5 rounded-full bg-[#146ef5] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
              {getInitials(selectedPatient.fullName)}
            </div>
            <span className="text-[12px] font-semibold text-[#080808] truncate">
              {selectedPatient.fullName}
            </span>
            <span className="text-[10px] text-[#ababab] flex-shrink-0">{selectedPatient.code}</span>
          </div>
        ) : (
          /* Search input */
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={handleInputFocus}
            placeholder="Tìm bệnh nhân: tên, SĐT, mã..."
            className="flex-1 bg-transparent outline-none text-[12px] text-[#080808] placeholder:text-[#ababab] font-medium"
          />
        )}

        {/* Right icons */}
        {selectedPatient && !isOpen ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="flex-shrink-0 hover:text-[#ee1d36] transition-colors"
          >
            <X className="w-3.5 h-3.5 text-[#ababab]" />
          </button>
        ) : query ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
            }}
            className="flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-[#ababab]" />
          </button>
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#ababab] flex-shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-[40px] left-0 right-0 bg-white rounded-[8px] border border-[#d8d8d8] shadow-wf-sm z-50 max-h-[360px] overflow-y-auto">
          {/* Header */}
          <div className="px-3 pt-2.5 pb-1.5 border-b border-[#f4f5f7]">
            <span className="text-[10px] font-bold text-[#ababab] uppercase tracking-[1px]">
              {query ? `Kết quả (${results.length})` : 'Bệnh nhân gần đây'}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="py-1">
              {results.map((p) => {
                const isActive = selectedPatient?.id === p.id;
                const age = calculateAge(p.dob);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      isActive
                        ? 'bg-[#146ef5]/5'
                        : 'hover:bg-[#f4f5f7]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${
                        isActive ? 'bg-[#146ef5]' : 'bg-[#7a3dff]'
                      }`}
                    >
                      {getInitials(p.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#080808] truncate">
                        {p.fullName}
                      </p>
                      <p className="text-[10px] text-[#ababab]">
                        {p.phone} · {p.code}
                      </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-[10px] text-[#5a5a5a] font-medium">{age} tuổi</span>
                      <span className="text-[9px] text-[#ababab]">
                        {p.gender === 'female' ? 'Nữ' : 'Nam'}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#146ef5] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-[11px] text-[#ababab]">Không tìm thấy bệnh nhân</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
