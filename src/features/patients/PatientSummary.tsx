import { motion } from 'framer-motion';
import { Phone, CreditCard, Crown, AlertTriangle } from 'lucide-react';
import { usePatientStore } from '@/store/patientStore';
import { memberships, medicalHistories, encounters, appointments } from '@/mock/data';
import { calculateAge, formatDate, getInitials, getProgramLabel } from '@/shared/utils';

export function PatientSummary() {
  const { selectedPatient, activeLifecycle } = usePatientStore();
  if (!selectedPatient) return null;

  const age = calculateAge(selectedPatient.dob);
  const membership = memberships.find((m) => m.patientId === selectedPatient.id && m.status === 'active');
  
  // Find the soonest re-exam date from history (matching LifecycleTimeline logic)
  const history = medicalHistories
    .filter((h) => h.patientId === selectedPatient.id)
    .sort((a, b) => a.visitDate.localeCompare(b.visitDate));

  const pendingReExams: any[] = [];
  history.forEach(h => {
    if (h.reExamDate) {
      const hasSubsequent = history.some(h2 => h2.lifecycle === h.lifecycle && h2.visitDate > h.visitDate);
      if (!hasSubsequent) {
        pendingReExams.push({
          date: h.reExamDate,
          lifecycle: h.lifecycle,
          title: h.lifecycle === 'vaccination' ? 'Tiêm chủng' : `Khám ${getProgramLabel(h.lifecycle || 'other').toLowerCase()}`
        });
      }
    }
  });

  pendingReExams.sort((a, b) => a.date.localeCompare(b.date));
  const nextStep = pendingReExams[0];

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
          <p className="label-upper mb-1">Trạng thái tiếp theo</p>
          <h3 className="text-[22px] font-bold text-[#080808] leading-tight mb-1">
            {nextStep ? (nextStep.lifecycle === 'vaccination' ? 'Tiêm chủng' : getProgramLabel(nextStep.lifecycle)) : 'Chưa có lịch hẹn'}
          </h3>
          <p className="text-[13px] text-[#146ef5] font-bold mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Tái khám ngày {nextStep ? formatDate(nextStep.date) : '--/--/----'}
          </p>
          {/* Action indicator */}
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f6ff] text-[11px] font-semibold text-[#146ef5] rounded-[4px] border border-dashed border-[#146ef5]">
              Cần thực hiện: {nextStep ? nextStep.title : 'Theo dõi thêm'}
            </span>
          </div>
        </div>

        {/* ===== RIGHT: Membership Card Info ===== */}
        <div className="border-l border-[#d8d8d8] pl-6 w-[340px] flex-shrink-0 flex flex-col">
          <div>
            <p className="label-upper mb-2">Thông tin thẻ</p>
            {membership ? (
              <>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex gap-2">
                    <CreditCard className="w-4 h-4 text-[#146ef5] mt-0.5 shrink-0" />
                    <h3 className="text-[14px] font-bold text-[#080808] leading-tight max-w-[180px]">
                      {membership.type}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00d722]/10 text-[#00d722] text-[9px] font-bold rounded-[4px] uppercase shrink-0">
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
              <div className="bg-[#f8f9fb] border border-[#d8d8d8] rounded-[6px] p-4 text-center w-full mt-1">
                <p className="text-[12px] text-[#ababab] italic mb-3">Chưa có thông tin thẻ thành viên</p>
                <button className="w-full py-2.5 bg-[#146ef5] hover:bg-[#0055d4] text-white text-[12px] font-bold rounded-[4px] transition-all flex items-center justify-center gap-2 btn-hover shadow-sm">
                  <CreditCard className="w-4 h-4" />
                  TẠO THẺ THÀNH VIÊN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
