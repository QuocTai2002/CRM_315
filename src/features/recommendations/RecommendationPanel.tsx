import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { useServiceStore } from '@/store/serviceStore';
import { recommendations } from '@/mock/data';

export function SelectedServicesTable() {
  const { activeLifecycle } = usePatientStore();
  const { selectedServices, toggleService } = useServiceStore();

  const recs = useMemo(() => {
    if (!activeLifecycle) return [];
    return recommendations.filter((r) => r.lifecycleId === activeLifecycle.id && selectedServices.includes(r.id));
  }, [activeLifecycle, selectedServices]);

  if (!activeLifecycle) return null;

  const discount = 10;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}
      className="bg-white rounded-[8px] border border-[#d8d8d8] p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-4 h-4 text-[#146ef5]" />
        <h2 className="text-[13px] font-bold text-[#080808] uppercase tracking-[0.8px]">Dịch vụ đã chọn</h2>
        <span className="px-1.5 py-0.5 bg-[#146ef5]/10 text-[#146ef5] text-[10px] font-bold rounded-[4px]">{recs.length}</span>
      </div>

      {recs.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="w-8 h-8 text-[#d8d8d8] mx-auto mb-2" />
          <p className="text-[12px] text-[#ababab]">Chưa chọn dịch vụ nào</p>
          <p className="text-[10px] text-[#d8d8d8] mt-0.5">Chọn dịch vụ từ phần gợi ý bên phải</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#d8d8d8]">
                {['STT', 'Dịch vụ', 'Nguồn', 'Đơn giá', '% giảm', 'Giảm giá', 'Thành tiền', ''].map((h) => (
                  <th key={h} className="text-left py-2.5 pr-3 text-[10px] text-[#ababab] font-semibold uppercase tracking-[0.8px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recs.map((rec, i) => {
                const discountAmt = Math.round(rec.price * discount / 100);
                const finalAmt = rec.price - discountAmt;
                const source = rec.priority === 'high' ? 'Gợi ý' : 'Tự chọn';
                return (
                  <tr key={rec.id} className="border-b border-[#f4f5f7] hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3 pr-3 text-[#5a5a5a] font-medium">{i + 1}</td>
                    <td className="py-3 pr-3 text-[#080808] font-semibold">{rec.serviceName}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-1.5 py-0.5 rounded-[3px] text-[9px] font-semibold ${
                        source === 'Gợi ý' ? 'bg-[#146ef5]/10 text-[#146ef5]' : 'bg-[#f4f5f7] text-[#5a5a5a]'
                      }`}>{source}</span>
                    </td>
                    <td className="py-3 pr-3 text-[#363636] tabular-nums font-medium">{new Intl.NumberFormat('vi-VN').format(rec.price)}</td>
                    <td className="py-3 pr-3 text-[#5a5a5a] font-medium">{discount}%</td>
                    <td className="py-3 pr-3 text-[#ee1d36] font-semibold tabular-nums">{new Intl.NumberFormat('vi-VN').format(discountAmt)}</td>
                    <td className="py-3 pr-3 font-bold text-[#080808] tabular-nums">{new Intl.NumberFormat('vi-VN').format(finalAmt)}</td>
                    <td className="py-3">
                      <button onClick={() => toggleService(rec.id)} className="text-[#ababab] hover:text-[#ee1d36] transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add more */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 border border-dashed border-[#d8d8d8] rounded-[4px] px-3 py-2 text-[10px] text-[#ababab]">
          Thêm dịch vụ khác...
        </div>
        <button className="text-[11px] text-[#146ef5] font-semibold hover:underline flex items-center gap-1 btn-hover">
          <Plus className="w-3 h-3" /> Thêm dịch vụ khác
        </button>
      </div>
    </motion.div>
  );
}
