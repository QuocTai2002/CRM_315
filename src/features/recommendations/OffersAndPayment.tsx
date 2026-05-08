import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gift, CreditCard } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { useServiceStore } from '@/store/serviceStore';
import { recommendations, memberships } from '@/mock/data';
import { cn } from '@/shared/utils';

export function OffersPanel() {
  const { selectedPatient } = usePatientStore();
  const membership = selectedPatient ? memberships.find((m) => m.patientId === selectedPatient.id && m.status === 'active') : null;

  if (!selectedPatient) return null;

  const offers = [
    { label: 'Combo tuần 28 (3 dịch vụ trở lên)', discount: '-15%', active: true },
    { label: 'Thành viên', discount: '-5%', active: !!membership },
  ];

  const totalDiscount = offers.filter((o) => o.active).reduce((sum, o) => sum + parseInt(o.discount), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
      className="bg-white rounded-[8px] border border-[#ee1d36]/20 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-4 h-4 text-[#ee1d36]" />
        <h3 className="text-[10px] font-bold text-[#ee1d36] uppercase tracking-[1px]">Ưu đãi dành cho bệnh nhân</h3>
      </div>

      <div className="space-y-2 mb-3">
        {offers.map((offer, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[11px] text-[#363636] font-medium">{offer.label}</span>
            <span className={cn('text-[12px] font-bold', offer.active ? 'text-[#ee1d36]' : 'text-[#ababab]')}>{offer.discount}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#f4f5f7]">
        <span className="text-[12px] font-semibold text-[#080808]">Tổng ưu đãi</span>
        <span className="text-[20px] font-bold text-[#ee1d36]">{totalDiscount}%</span>
      </div>

      {/* Membership CTA if not member */}
      {!membership && (
        <div className="mt-4 p-3 bg-[#f8f9fb] rounded-[4px] border border-[#146ef5]/20 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-semibold text-[#146ef5]">Chưa phải thành viên</span>
            </div>
            <p className="text-[10px] text-[#5a5a5a]">Tạo thẻ thành viên để nhận thêm ưu đãi 5%</p>
          </div>
          <button className="px-3 py-1.5 text-[10px] font-semibold text-[#146ef5] bg-white border border-[#146ef5]/30 rounded-[4px] hover:bg-[#146ef5]/5 transition-colors whitespace-nowrap btn-hover">
            Tạo thẻ ngay
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function PaymentSummary() {
  const { activeLifecycle } = usePatientStore();
  const { selectedServices } = useServiceStore();

  const recs = useMemo(() => {
    if (!activeLifecycle) return [];
    return recommendations.filter((r) => r.lifecycleId === activeLifecycle.id && selectedServices.includes(r.id));
  }, [activeLifecycle, selectedServices]);

  const totalPrice = recs.reduce((sum, r) => sum + r.price, 0);
  const discountPercent = 20;
  const discountAmount = Math.round(totalPrice * discountPercent / 100);
  const finalPrice = totalPrice - discountAmount;

  if (!activeLifecycle) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
      className="bg-white rounded-[8px] border border-[#d8d8d8] p-4">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-4 h-4 text-[#146ef5]" />
        <h3 className="text-[10px] font-bold text-[#080808] uppercase tracking-[1px]">Tổng thanh toán</h3>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-[12px]">
          <span className="text-[#5a5a5a]">Tổng tiền dịch vụ</span>
          <span className="font-semibold text-[#080808] tabular-nums">{new Intl.NumberFormat('vi-VN').format(totalPrice)}</span>
        </div>
        {selectedServices.length > 0 && (
          <div className="flex justify-between text-[12px]">
            <span className="text-[#5a5a5a]">Giảm giá ({discountPercent}%)</span>
            <span className="font-semibold text-[#ee1d36] tabular-nums">-{new Intl.NumberFormat('vi-VN').format(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#d8d8d8] mb-4">
        <span className="text-[13px] font-semibold text-[#080808]">Tổng thanh toán</span>
        <span className="text-[24px] font-bold text-[#146ef5] tabular-nums">{new Intl.NumberFormat('vi-VN').format(finalPrice)}</span>
      </div>

      <button className="w-full py-3 bg-[#146ef5] hover:bg-[#0055d4] text-white text-[13px] font-bold rounded-[4px] transition-all flex items-center justify-center gap-2 btn-hover shadow-wf-sm">
        <CreditCard className="w-4 h-4" />
        THANH TOÁN (F9)
      </button>
    </motion.div>
  );
}
