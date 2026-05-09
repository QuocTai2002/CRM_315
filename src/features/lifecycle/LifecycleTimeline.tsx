import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Check, CreditCard, X } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { medicalHistories, memberships } from '@/mock/data';
import { getProgramLabel, cn, formatDate } from '@/shared/utils';
import type { StageStatus } from '@/types';

const statusStyle: Record<StageStatus, { circle: string; text: string; label: string; labelCls: string; line: string }> = {
  done: {
    circle: 'bg-white border-[#00d722] text-[#00d722]',
    text: 'text-[#00d722]',
    label: 'Đã hoàn thành',
    labelCls: 'bg-[#00d722]/10 text-[#00d722]',
    line: 'bg-[#00d722]',
  },
  active: {
    circle: 'bg-white border-dashed border-[#ff9f43] text-[#ff9f43]',
    text: 'text-[#ff9f43]',
    label: 'Cần thực hiện',
    labelCls: 'bg-[#ff9f43]/10 text-[#ff9f43]',
    line: 'bg-[#d8d8d8]',
  },
  upcoming: {
    circle: 'bg-white border-dashed border-[#d8d8d8] text-[#ababab]',
    text: 'text-[#ababab]',
    label: 'Sắp tới',
    labelCls: 'bg-[#f4f5f7] text-[#ababab]',
    line: 'bg-[#d8d8d8]',
  },
  missed: {
    circle: 'bg-white border-[#d8d8d8] text-[#ababab]',
    text: 'text-[#ababab]',
    label: 'Bỏ lỡ',
    labelCls: 'bg-[#ee1d36]/10 text-[#ee1d36]',
    line: 'bg-[#d8d8d8]',
  },
};

export function LifecycleTimeline() {
  const { selectedPatient, activeLifecycle } = usePatientStore();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const membership = selectedPatient ? memberships.find((m) => m.patientId === selectedPatient.id && m.status === 'active') : null;

  useEffect(() => {
    // Logic for cleanup
  }, [activeLifecycle]);

  const stages = useMemo(() => {
    if (!selectedPatient) return [];

    // 1. Collect all history for this patient
    const history = medicalHistories
      .filter((h) => h.patientId === selectedPatient.id)
      .sort((a, b) => a.visitDate.localeCompare(b.visitDate));

    // 3. Identify all re-exams from history
    const allReExams: any[] = [];
    history.forEach(h => {
      if (h.reExamDate) {
        // Check if this re-exam was fulfilled by a visit ON THIS EXACT DATE
        const isFulfilled = history.some(h2 => h2.visitDate === h.reExamDate);
        if (!isFulfilled) {
          const lifecycle = h.lifecycle || 'other';
          allReExams.push({
            date: h.reExamDate,
            lifecycle: lifecycle,
            title: `Tái khám ${lifecycle === 'vaccination' ? 'tiêm chủng' : getProgramLabel(lifecycle || 'other').toLowerCase()}`
          });
        }
      }
    });

    // 4. Combine History and Re-exams into a single timeline
    const today = '2026-05-08';
    let foundActive = false;

    // Create a combined list of events
    const allEvents = [
      ...history.map(h => ({ ...h, eventType: 'history' })),
      ...allReExams.map(re => ({ ...re, eventType: 'reexam' }))
    ].sort((a, b) => {
      const dateA = a.visitDate || a.date;
      const dateB = b.visitDate || b.date;
      return dateA.localeCompare(dateB);
    });

    const finalStages = allEvents.map((ev, i) => {
      const date = ev.visitDate || ev.date;
      const isPast = date < today;
      
      let status: StageStatus = 'done';
      if (ev.eventType === 'reexam') {
        if (isPast) {
          status = 'missed';
        } else if (!foundActive) {
          status = 'active';
          foundActive = true;
        } else {
          status = 'upcoming';
        }
      }

      return {
        id: ev.id || `reexam-${date}-${i}`,
        title: ev.eventType === 'history' 
          ? (ev.lifecycle === 'vaccination' ? 'Tiêm chủng' : `Khám ${getProgramLabel(ev.lifecycle || 'other').toLowerCase()}`)
          : ev.title,
        sequence: i + 1,
        status,
        date,
        actualServices: ev.services,
        lifecycle: ev.lifecycle || 'other',
        isAppointment: false
      };
    });

    return finalStages;
  }, [selectedPatient]);

  const selectedStage = stages.find(s => s.id === selectedStageId);

  if (!selectedPatient) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }} className="bg-white rounded-[8px] border border-[#d8d8d8] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-[#080808] uppercase tracking-[0.8px]">
            Lộ trình chăm sóc & Lịch sử tổng hợp
          </h2>
          <Info className="w-3.5 h-3.5 text-[#ababab] cursor-pointer hover:text-[#146ef5] transition-colors" />
        </div>
        {/* Switcher removed for unified view */}
      </div>

      {/* Timeline */}
      <div className="relative overflow-x-auto pb-2 mb-4 pt-4">
        <div className="flex items-start min-w-max justify-center pt-2">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex items-start">
              <StageNode 
                stage={stage} 
                isSelected={selectedStageId === stage.id}
                onClick={() => {
                  if (stage.status === 'done' || stage.status === 'missed' || (stage.status === 'active' && !membership)) {
                    setSelectedStageId(selectedStageId === stage.id ? null : stage.id);
                  }
                }}
              />
              {i < stages.length - 1 && (
                <div className="flex items-center" style={{ marginTop: 43 }}>
                  <div className={cn('h-[3px]', stage.status === 'done' || stage.status === 'active' ? statusStyle[stage.status as StageStatus].line : 'bg-[#d8d8d8]')} style={{ width: 60 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details Box (Shows on click) */}
      {selectedStage && (selectedStage.status === 'done' || selectedStage.status === 'missed' || (selectedStage.status === 'active' && !membership)) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className={cn(
            "border border-dashed rounded-[8px] p-5 mt-4",
            selectedStage.status === 'done' ? "border-[#00d722] bg-[#f0fff4]" : 
            selectedStage.status === 'missed' ? "border-[#ee1d36] bg-[#fff5f5]" : 
            "border-[#146ef5] bg-[#f0f6ff]"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold text-[#080808] uppercase tracking-[1px]">
              {selectedStage.status === 'done' 
                ? `LỊCH SỬ DỊCH VỤ ĐÃ SỬ DỤNG Ở ${selectedStage.title.toUpperCase()}`
                : selectedStage.status === 'missed'
                  ? `QUÁ HẠN TÁI KHÁM ${selectedStage.title.toUpperCase()}`
                  : `ƯU ĐÃI THÀNH VIÊN TẠI ${selectedStage.title.toUpperCase()}`
              }
            </p>
            <button onClick={() => setSelectedStageId(null)} className={cn("text-[10px] font-bold hover:underline", selectedStage.status === 'done' ? "text-[#00d722]" : "text-[#146ef5]")}>Đóng</button>
          </div>

          {selectedStage.status === 'done' ? (
            <div className="grid gap-2 mb-2 grid-cols-1 max-w-2xl mx-auto">
              {(selectedStage.actualServices || []).map((svc: string, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 px-4 py-3 rounded-[6px] text-[13px] font-medium bg-white border border-[#e0e0e0] text-[#363636] hover:border-[#00d722]/50 shadow-sm transition-all group"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#00d722] bg-[#00d722]/10 text-[#00d722] transition-all shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="flex-1">{svc}</span>
                  <span className="text-[11px] font-semibold text-[#00d722] bg-[#00d722]/10 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Hoàn thành
                  </span>
                </div>
              ))}
            </div>
          ) : selectedStage.status === 'missed' ? (
            <div className="flex flex-col items-center text-center py-4">
              <p className="text-[14px] text-[#ee1d36] font-bold">
                Bệnh nhân đã bỏ lỡ ngày tái khám này ({formatDate(selectedStage.date)})
              </p>
              <p className="text-[12px] text-[#5a5a5a] mt-1">
                Vui lòng liên hệ hỗ trợ khách hàng để cập nhật lộ trình hoặc đặt lại lịch hẹn.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-2">
              <p className="text-[13px] text-[#363636] mb-4 max-w-md">
                Bạn chưa có thẻ thành viên. Hãy đăng ký ngay để nhận ưu đãi 5% cho tất cả dịch vụ tại <strong>{selectedStage.title}</strong> và các giai đoạn tiếp theo.
              </p>
              <button className="flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold text-white bg-[#146ef5] rounded-[4px] hover:bg-[#0055d4] transition-all btn-hover shadow-wf-sm">
                <CreditCard className="w-4 h-4" /> TẠO THẺ THÀNH VIÊN NGAY
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function StageNode({ stage, isSelected, onClick }: { stage: any, isSelected: boolean, onClick: () => void }) {
  const style = statusStyle[stage.status as StageStatus];
  const num = stage.title.match(/\d+/)?.[0] || stage.sequence;

  return (
    <div 
      className={cn(
        "flex flex-col items-center transition-all cursor-pointer group",
        isSelected ? "scale-110" : "hover:scale-105"
      )} 
      style={{ width: 110 }}
      onClick={onClick}
    >
      {/* Label above */}
      <p className="text-[10px] font-bold text-[#ababab] uppercase tracking-[1px] mb-2 h-3">
        {getProgramLabel(stage.lifecycle)}
      </p>

      {/* Circle */}
      <div className={cn(
        'w-12 h-12 rounded-full border-[3px] flex items-center justify-center font-bold text-[16px] transition-all relative',
        style.circle,
        isSelected && "shadow-[0_0_12px_rgba(0,0,0,0.1)]",
        stage.status === 'active' && 'animate-glow'
      )}>
        {num}
        {stage.status === 'done' && (
          <div className="absolute -bottom-1 -right-1 bg-[#00d722] rounded-full p-0.5 shadow-sm">
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
          </div>
        )}
        {stage.status === 'missed' && (
          <div className="absolute -bottom-1 -right-1 bg-[#ee1d36] rounded-full p-0.5 shadow-sm">
            <X className="w-2.5 h-2.5 text-white" strokeWidth={4} />
          </div>
        )}
      </div>

      {/* Title */}
      <p className={cn('text-[11px] font-semibold mt-2 text-center leading-tight h-8 flex items-center justify-center px-1', style.text)}>
        {stage.status === 'done'
          ? (stage.title.length > 25 ? stage.title.slice(0, 25) + '...' : stage.title)
          : (stage.title.length > 30 ? stage.title.slice(0, 30) + '...' : stage.title)
        }
      </p>

      {/* Status label */}
      <div className="mt-1 flex flex-col items-center">
        {(stage.status !== 'done' && stage.status !== 'missed') && (
          <span className={cn('px-2 py-0.5 rounded-[4px] text-[9px] font-semibold', style.labelCls)}>
            {stage.status === 'active' ? 'Cần thực hiện' : style.label}
          </span>
        )}
        
        {stage.isAppointment && (
          <p className="text-[10px] mt-1 font-medium text-[#146ef5] whitespace-nowrap">
            Ngày đặt hẹn
          </p>
        )}
        {stage.date && (
          <p className="text-[11px] font-bold text-[#080808] mt-0.5">
            {formatDate(stage.date)}
          </p>
        )}
      </div>
    </div>
  );
}
