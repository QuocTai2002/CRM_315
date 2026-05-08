import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { Sidebar } from '@/shared/components/Sidebar';
import { TopHeader } from '@/shared/components/TopHeader';
import { PatientSummary } from '@/features/patients/PatientSummary';
import { LifecycleTimeline } from '@/features/lifecycle/LifecycleTimeline';
import { MedicalHistoryTable } from '@/features/medical-history/MedicalHistoryTable';
import { usePatientStore } from '@/store/patientStore';
import { useAppStore } from '@/store/appStore';
import { ApiSettings } from '@/features/settings/ApiSettings';

function App() {
  const { selectedPatient } = usePatientStore();
  const { activeMenu } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4F8]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (includes patient search select) */}
        <TopHeader />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeMenu === 'api-settings' ? (
            <ApiSettings />
          ) : (
            <AnimatePresence mode="wait">
              {selectedPatient ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full overflow-hidden"
                >
                  {/* Main Content (scrollable) */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <PatientSummary />
                    <LifecycleTimeline />
                    <MedicalHistoryTable />
                  </div>

                  {/* Right Sidebar (scrollable) */}
                  {/* <div className="w-[300px] xl:w-[320px] flex-shrink-0 border-l border-slate-200 bg-[#F6F8FB] overflow-y-auto p-4 space-y-4">
                    <OffersPanel />
                  </div> */}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center justify-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
                      <SearchIcon className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Chọn bệnh nhân</h2>
                    <p className="text-sm text-slate-400 max-w-md text-center">
                      Tìm kiếm bệnh nhân từ thanh tìm kiếm ở trên để xem Patient 360 và lộ trình chăm sóc.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
