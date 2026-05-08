import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Lightbulb } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { recommendations } from '@/mock/data';
import { useServiceStore } from '@/store/serviceStore';
import { cn } from '@/shared/utils';

export function ServiceSuggestions() {
  const { activeLifecycle } = usePatientStore();
  const { selectedServices, toggleService } = useServiceStore();

  const recs = useMemo(() => {
    if (!activeLifecycle) return [];
    return recommendations.filter((r) => r.lifecycleId === activeLifecycle.id);
  }, [activeLifecycle]);

  if (!activeLifecycle || recs.length === 0) return null;

  const stageLabel = activeLifecycle.stage?.replace(/_/g, ' ').toUpperCase() || '';

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
      className="bg-white rounded-[8px] border border-[#d8d8d8] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-[#ff9f43]" />
        <h3 className="text-[10px] font-bold text-[#080808] uppercase tracking-[1px]">
          GỢI Ý DỊCH VỤ CHO TUẦN 28
        </h3>
      </div>

      <div className="space-y-1">
        {recs.map((rec) => {
          const isSelected = selectedServices.includes(rec.id);
          return (
            <button key={rec.id} onClick={() => toggleService(rec.id)}
              className="w-full flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-[#f4f5f7] transition-all text-left">
              {/* Checkbox */}
              <div className={cn(
                'w-[16px] h-[16px] rounded-[3px] flex-shrink-0 flex items-center justify-center border-2 transition-all',
                isSelected ? 'bg-[#146ef5] border-[#146ef5]' : 'border-[#d8d8d8] bg-white'
              )}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn('text-[12px] truncate font-medium text-[#363636]')}>
                  {rec.serviceName}
                </p>
              </div>
              {/* Price + Add */}
              <span className="text-[12px] font-semibold text-[#080808] flex-shrink-0 tabular-nums">
                {new Intl.NumberFormat('vi-VN').format(rec.price)}
              </span>
              <div className="w-5 h-5 rounded-[3px] bg-[#f4f5f7] text-[#ababab] flex items-center justify-center flex-shrink-0 hover:bg-[#146ef5]/10 hover:text-[#146ef5] transition-colors border border-[#d8d8d8]">
                <Plus className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      <button className="w-full mt-3 py-2 text-[12px] font-bold text-white bg-[#146ef5] rounded-[4px] hover:bg-[#0055d4] transition-colors flex items-center justify-center gap-1.5 btn-hover shadow-sm">
        <Plus className="w-3.5 h-3.5" /> Thêm vào dịch vụ đã chọn
      </button>
    </motion.div>
  );
}
