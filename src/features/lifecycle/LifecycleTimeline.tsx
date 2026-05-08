import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Plus, Check } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { lifecycleStages, lifecycles } from '@/mock/data';
import { getProgramLabel, formatDate, cn } from '@/shared/utils';
import type { LifecycleStage, StageStatus } from '@/types';

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
    circle: 'bg-white border-[#ee1d36] text-[#ee1d36]',
    text: 'text-[#ee1d36]',
    label: 'Bỏ lỡ',
    labelCls: 'bg-[#ee1d36]/10 text-[#ee1d36]',
    line: 'bg-[#ee1d36]',
  },
};

export function LifecycleTimeline() {
  const { selectedPatient, activeLifecycle, setActiveLifecycle } = usePatientStore();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  useEffect(() => {
    setSelectedServices([]);
  }, [activeLifecycle]);

  const patientLifecycles = useMemo(() => {
    if (!selectedPatient) return [];
    return lifecycles.filter((l) => l.patientId === selectedPatient.id && l.status === 'active');
  }, [selectedPatient]);

  const stages = useMemo(() => {
    if (!activeLifecycle) return [];
    return lifecycleStages.filter((s) => s.lifecycleId === activeLifecycle.id).sort((a, b) => a.sequence - b.sequence);
  }, [activeLifecycle]);

  const activeStage = stages.find((s) => s.status === 'active');

  if (!selectedPatient || !activeLifecycle) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }} className="bg-white rounded-[8px] border border-[#d8d8d8] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-[#080808] uppercase tracking-[0.8px]">
            Lộ trình chăm sóc {getProgramLabel(activeLifecycle.program)}
          </h2>
          <Info className="w-3.5 h-3.5 text-[#ababab] cursor-pointer hover:text-[#146ef5] transition-colors" />
        </div>
        {patientLifecycles.length > 1 && (
          <div className="flex gap-1.5">
            {patientLifecycles.map((lc) => (
              <button key={lc.id} onClick={() => setActiveLifecycle(lc)} className={cn(
                'px-3 py-1 rounded-[4px] text-[11px] font-semibold transition-all',
                activeLifecycle?.id === lc.id ? 'bg-[#1a3a5c] text-white' : 'bg-[#f4f5f7] text-[#5a5a5a] hover:bg-[#e8e9eb]'
              )}>
                {getProgramLabel(lc.program)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative overflow-x-auto pb-2 mb-4">
        <div className="flex items-start min-w-max justify-center">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex items-start">
              <StageNode stage={stage} />
              {i < stages.length - 1 && (
                <div className="flex items-center" style={{ marginTop: 22 }}>
                  <div className={cn('h-[3px]', stage.status === 'done' || stage.status === 'active' ? statusStyle[stage.status].line : 'bg-[#d8d8d8]')} style={{ width: 60 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Services Box */}
      {activeStage && (
        <div className="border border-dashed border-[#ff9f43] rounded-[8px] bg-[#fff9eb] p-5">
          <p className="text-[11px] font-bold text-[#080808] uppercase tracking-[1px] mb-3 text-center">
            CÁC DỊCH VỤ CẦN THỰC HIỆN Ở {activeStage.title.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {activeStage.recommendedServices.map((svc, i) => {
              const isSelected = selectedServices.includes(i);
              return (
                <div 
                  key={i} 
                  onClick={() => {
                    if (isSelected) {
                      setSelectedServices(prev => prev.filter(idx => idx !== i));
                    } else {
                      setSelectedServices(prev => [...prev, i]);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-[4px] text-[12px] font-medium shadow-sm cursor-pointer transition-all border",
                    isSelected ? "bg-[#f0f6ff] border-[#146ef5] text-[#146ef5]" : "bg-white border-[#d8d8d8] text-[#363636] hover:border-[#146ef5]/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                    isSelected ? "bg-[#146ef5] border-[#146ef5] text-white" : "bg-[#f4f5f7] border-[#d8d8d8] text-[#5a5a5a]"
                  )}>
                    {isSelected ? <Check className="w-3 h-3" /> : <span className="text-[10px]">⚕</span>}
                  </div>
                  {svc}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 justify-center">
            {activeStage.recommendedServices.length > 0 && selectedServices.length !== activeStage.recommendedServices.length && (
              <button 
                onClick={() => setSelectedServices(activeStage.recommendedServices.map((_, i) => i))}
                className="flex items-center gap-1.5 px-6 py-2 text-[12px] font-bold text-[#146ef5] bg-white rounded-[4px] border border-[#146ef5] hover:bg-[#f4f5f7] transition-all btn-hover"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm tất cả
              </button>
            )}
            <button className="flex items-center gap-1.5 px-6 py-2 text-[12px] font-bold text-white bg-[#146ef5] rounded-[4px] hover:bg-[#0055d4] transition-all btn-hover shadow-wf-sm">
              <Check className="w-3.5 h-3.5" /> Chọn {selectedServices.length > 0 ? selectedServices.length : ''} dịch vụ
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StageNode({ stage }: { stage: LifecycleStage }) {
  const style = statusStyle[stage.status];
  const num = stage.title.match(/\d+/)?.[0] || stage.sequence;

  return (
    <div className="flex flex-col items-center" style={{ width: 110 }}>
      {/* Label above */}
      <p className="text-[10px] font-semibold text-[#ababab] uppercase tracking-[0.5px] mb-1.5">
        {stage.title.includes('Tuần') || stage.title.includes('Week') ? 'Tuần' : stage.title.includes('Mũi') ? '' : ''}
      </p>

      {/* Circle */}
      <div className={cn(
        'w-12 h-12 rounded-full border-[3px] flex items-center justify-center font-bold text-[16px] transition-all',
        style.circle,
        stage.status === 'active' && 'animate-glow'
      )}>
        {num}
      </div>

      {/* Title */}
      <p className={cn('text-[11px] font-semibold mt-2 text-center leading-tight', style.text)}>
        {stage.recommendedServices[0]
          ? (stage.recommendedServices[0].length > 22 ? stage.recommendedServices[0].slice(0, 22) + '...' : stage.recommendedServices[0])
          : stage.title
        }
      </p>

      {/* Status label */}
      <span className={cn('mt-1.5 px-2 py-0.5 rounded-[4px] text-[9px] font-semibold', style.labelCls)}>
        {style.label}
      </span>
    </div>
  );
}
