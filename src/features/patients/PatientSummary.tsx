import { motion } from 'framer-motion';
import { Phone, CreditCard, Crown, AlertTriangle } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { memberships, lifecycleStages, encounters, appointments } from '@/mock/data';
import { calculateAge, formatDate, getInitials, getProgramLabel } from '@/shared/utils';

export function PatientSummary() {
  const { selectedPatient, activeLifecycle } = usePatientStore();
  if (!selectedPatient) return null;

  const age = calculateAge(selectedPatient.dob);
  const membership = memberships.find((m) => m.patientId === selectedPatient.id && m.status === 'active');
  const currentStage = activeLifecycle
    ? lifecycleStages.find((s) => s.lifecycleId === activeLifecycle.id && s.status === 'active')
    : null;

  const patientEncounters = encounters.filter(e => e.patientId === selectedPatient.id);
  const patientAppointments = appointments.filter(a => a.patientId === selectedPatient.id);
  
  let visitTag = 'Bệnh mới';
  let tagColor = 'bg-[#e3f2fd] text-[#146ef5] border-[#146ef5]/30';

  if (patientEncounters.length <= 1) {
    visitTag = 'Lần đầu';
    tagColor = 'bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]/30';
  } else if (
    patientAppointments.some(a => a.status === 'upcoming') || 
    (activeLifecycle && activeLifecycle.status === 'active')
  ) {
    visitTag = 'Tái khám';
    tagColor = 'bg-[#fff3e0] text-[#f57c00] border-[#f57c00]/30';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-[8px] border border-[#d8d8d8] overflow-hidden"
    >
      <div className="p-5 flex gap-6">
        {/* ===== LEFT: Patient Info ===== */}
        <div className="flex gap-4 min-w-[340px]">
          {/* Avatar */}
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 border-2 border-orange-100">
            {getInitials(selectedPatient.fullName)}
          </div>
          <div>
            {/* Name + badge */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[18px] font-bold text-[#080808] leading-tight">{selectedPatient.fullName}</h2>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-[4px] border uppercase tracking-[0.5px] ${tagColor}`}>
                {visitTag}
              </span>
              {membership && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fff3e0] text-[#ff9f43] text-[10px] font-bold rounded-[4px] border border-[#ff9f43]/30 uppercase tracking-[0.5px]">
                  <Crown className="w-3 h-3" /> Thành viên
                </span>
              )}
            </div>
            {/* Age/Gender/DOB */}
            <div className="flex items-center gap-2 text-[13px] text-[#5a5a5a] mb-1.5">
              <span>{age} tuổi</span>
              <span className="text-[#d8d8d8]">|</span>
              <span>{selectedPatient.gender === 'female' ? 'Nữ' : 'Nam'}</span>
              <span className="text-[#d8d8d8]">|</span>
              <span>{formatDate(selectedPatient.dob)}</span>
            </div>
            {/* Phone */}
            <div className="flex items-center gap-1.5 text-[13px] text-[#5a5a5a] mb-3">
              <Phone className="w-3.5 h-3.5 text-[#ababab]" />
              <span className="font-semibold text-[#080808]">{selectedPatient.phone}</span>
            </div>
            {/* Meta row */}
            <div className="flex gap-8 text-[11px]">
              <div>
                <p className="text-[#ababab] font-medium">Mã bệnh nhân</p>
                <p className="font-bold text-[#080808] text-[14px]">{selectedPatient.code}</p>
              </div>
              <div>
                <p className="text-[#ababab] font-medium">Ngày đăng ký</p>
                <p className="font-bold text-[#080808] text-[14px]">12/12/2017</p>
              </div>
              <div>
                <p className="text-[#ababab] font-medium">Nguồn</p>
                <p className="font-bold text-[#080808] text-[14px]">Khám từ thiện</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CENTER: Current Status ===== */}
        <div className="flex-1 border-l border-[#d8d8d8] pl-6 min-w-[200px]">
          <p className="label-upper mb-1">Trạng thái hiện tại</p>
          <h3 className="text-[22px] font-bold text-[#080808] leading-tight mb-1">
            {currentStage?.title || 'N/A'} {activeLifecycle ? getProgramLabel(activeLifecycle.program).toLowerCase() : ''}
          </h3>
          <p className="text-[12px] text-[#5a5a5a] mb-3">
            Cần {currentStage?.recommendedServices?.[0]?.toLowerCase() || 'theo dõi'}
          </p>
          {/* Status tags */}
          <div className="flex gap-2 flex-wrap">
            {currentStage?.recommendedServices?.slice(0, 2).map((svc, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fff9eb] text-[11px] font-semibold text-[#ff9f43] rounded-[4px] border border-dashed border-[#ff9f43]">
                <AlertTriangle className="w-3.5 h-3.5" /> Chưa {svc.toLowerCase().includes('tiêm') ? 'tiêm' : 'làm'} {svc.length > 20 ? svc.slice(0, 20) + '...' : svc.split(' ').slice(-2).join(' ')}
              </span>
            ))}
          </div>
        </div>

        {/* ===== RIGHT: Membership Card Info ===== */}
        <div className="border-l border-[#d8d8d8] pl-6 w-[340px] flex-shrink-0 flex flex-col">
          <div>
            <p className="label-upper mb-2">Thông tin thẻ</p>
            {membership ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#146ef5]" />
                  <h3 className="text-[14px] font-bold text-[#080808] leading-tight">
                    {membership.type}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00d722]/10 text-[#00d722] text-[9px] font-bold rounded-[4px] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d722]" /> Hiệu lực
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#ababab]">Mã thẻ</span>
                    <span className="font-semibold text-[#080808]">{membership.cardCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ababab]">Ngày tạo</span>
                    <span className="font-semibold text-[#080808]">12/12/2017</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ababab]">Hiệu lực từ</span>
                    <span className="font-semibold text-[#080808]">01/01/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ababab]">Hết hạn</span>
                    <span className="font-semibold text-[#ee1d36]">{formatDate(membership.expiredAt)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#FFF8E1] border border-[#F59E0B] rounded-[6px] p-3 text-left w-full mt-1">
                <span className="inline-block px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-[3px] mb-1.5 uppercase tracking-wide">
                  Ưu đãi hội viên
                </span>
                <h4 className="text-[13px] font-bold text-[#080808] mb-1.5 leading-tight">
                  Tham Gia Chương Trình Hội Viên
                </h4>
                <p className="text-[11px] text-[#5a5a5a] mb-2.5 leading-relaxed">
                  Bệnh nhân này CHƯA LÀ hội viên. Hội viên được giảm 15% tất cả tiêm chủng, ưu tiên đặt lịch, và miễn phí kiểm tra phát triển. Phí thường niên: 1.200.000 VNĐ.
                </p>
                <button className="px-3 py-1.5 bg-[#F59E0B] text-white text-[11px] font-bold rounded hover:bg-[#D97706] transition-colors shadow-sm">
                  Đăng Ký Hội Viên
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
