import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { medicalHistories } from '@/mock/data';
import { formatDate } from '@/shared/utils';

export function MedicalHistoryTable() {
  const { selectedPatient } = usePatientStore();

  const records = useMemo(() => {
    if (!selectedPatient) return [];
    return medicalHistories
      .filter((h) => h.patientId === selectedPatient.id)
      .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  }, [selectedPatient]);

  if (!selectedPatient) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}
      className="bg-white rounded-[8px] border border-[#d8d8d8] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8d8d8]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#146ef5]" />
          <h2 className="text-[13px] font-bold text-[#080808] uppercase tracking-[0.8px]">Lịch sử</h2>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-[#080808] bg-white rounded-[4px] border border-[#d8d8d8] hover:border-[#898989] transition-all btn-hover">
          Xem tất cả
        </button>
      </div>

      {/* Table */}
      <div className="px-5 py-3">
        {records.length === 0 ? (
          <p className="text-[12px] text-[#ababab] text-center py-6">Không có lịch sử  khám</p>
        ) : (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#d8d8d8]">
                <th className="text-left py-2.5 pr-4 text-[10px] text-[#ababab] font-semibold uppercase tracking-[0.8px]">Ngày khám</th>
                <th className="text-left py-2.5 pr-4 text-[10px] text-[#ababab] font-semibold uppercase tracking-[0.8px]">Chẩn đoán</th>
                <th className="text-left py-2.5 pr-4 text-[10px] text-[#ababab] font-semibold uppercase tracking-[0.8px]">Bác sĩ</th>
                <th className="text-left py-2.5 pr-4 text-[10px] text-[#ababab] font-semibold uppercase tracking-[0.8px]">Ngày tái khám</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-[#f4f5f7] history-row cursor-pointer group transition-colors hover:bg-[#f8f9fb]">
                  <td className="py-3 pr-4 text-[#080808] font-medium whitespace-nowrap">{formatDate(record.visitDate)}</td>
                  <td className="py-3 pr-4 text-[#080808] font-semibold">{record.diagnosis}</td>
                  <td className="py-3 pr-4 text-[#363636] font-medium">{record.doctor}</td>
                  <td className="py-3 pr-4 text-[#146ef5] font-semibold whitespace-nowrap">{formatDate(record.reExamDate)}</td>
                  <td className="py-3">
                    <ChevronRight className="w-3.5 h-3.5 text-[#d8d8d8] group-hover:text-[#146ef5] transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
