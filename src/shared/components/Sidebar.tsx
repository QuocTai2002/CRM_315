import {
  Users,
  Settings,
  ChevronDown,
  type LucideIcon
} from 'lucide-react';
import logoMedical from '@/assets/Medical.png';
import { useAppStore } from '@/store/appStore';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  hasChildren?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'khach-hang', label: 'Khách hàng', icon: Users, active: true },
  { id: 'api-settings', label: 'Cấu hình API', icon: Settings },
];

export function Sidebar() {
  const { activeMenu, setActiveMenu } = useAppStore();

  return (
    <aside className="w-[200px] h-screen flex flex-col bg-[#1a3a5c] text-white flex-shrink-0">
      {/* Logo */}

      <div className="flex   items-center justify-center  border-b border-white/10">
        <img src={logoMedical} alt="Medical 315" className="h-20  object-contain" />
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/90">
          HỆ THỐNG Y TẾ 315
        </div>

      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <div key={item.id} className="px-3">
              <button
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all rounded-[8px] ${isActive
                  ? 'bg-[#00AEEF] text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.hasChildren && (
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                )}
              </button>
            </div>
          );
        })}
      </nav>

    </aside>
  );
}
