import { useEffect, useState } from 'react';
import { Database, RefreshCw, Trash2, Edit, Plus, X } from 'lucide-react';
import type { Patient, Membership } from '@/types';


const API_BASE = 'https://69fd4a2430ad0a6fd1c0bcfa.mockapi.io/api/v1';

export function ApiSettings() {
  const [activeTab, setActiveTab] = useState<'patients' | 'memberships'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Patient & Membership>>({});
  const [saving, setSaving] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Patient`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
    setLoading(false);
  };

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/memberships`);
      const data = await res.json();
      setMemberships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch memberships:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'patients') fetchPatients();
    else fetchMemberships();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa dữ liệu này?')) return;
    try {
      const endpoint = activeTab === 'patients' ? 'Patient' : 'memberships';
      await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
      if (activeTab === 'patients') fetchPatients();
      else fetchMemberships();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleOpenModal = (record?: Partial<Patient & Membership> | null) => {
    setEditingId(record ? record.id! : null);
    if (record) {
      setFormData(record);
    } else {
      setFormData(
        activeTab === 'patients'
          ? { code: '', fullName: '', gender: 'male', dob: '', phone: '', avatar: '', isMember: false }
          : { patientId: '', branchId: '', specialty: '', cardCode: '', type: 'Thẻ thành viên', expiredAt: '', status: 'active' }
      );
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = activeTab === 'patients' ? 'Patient' : 'memberships';
      const url = editingId ? `${API_BASE}/${endpoint}/${editingId}` : `${API_BASE}/${endpoint}`;
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      if (activeTab === 'patients') fetchPatients();
      else fetchMemberships();
    } catch (error) {
      console.error('Save failed:', error);
    }
    setSaving(false);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-[#080808]">Cấu hình Mock API</h1>
          <p className="text-[13px] text-[#5a5a5a] mt-1">Quản lý dữ liệu từ endpoint: {API_BASE}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#146ef5] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#0055d4] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
          <button
            onClick={activeTab === 'patients' ? fetchPatients : fetchMemberships}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d8d8d8] rounded-[6px] text-[13px] font-medium text-[#080808] hover:bg-[#f8f9fb] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 flex-shrink-0">
        <button
          onClick={() => setActiveTab('patients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[6px] text-[13px] font-medium transition-colors ${activeTab === 'patients' ? 'bg-[#146ef5] text-white' : 'bg-white border border-[#d8d8d8] text-[#5a5a5a] hover:bg-[#f8f9fb]'
            }`}
        >
          <Database className="w-4 h-4" /> Patients
        </button>
        <button
          onClick={() => setActiveTab('memberships')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[6px] text-[13px] font-medium transition-colors ${activeTab === 'memberships' ? 'bg-[#146ef5] text-white' : 'bg-white border border-[#d8d8d8] text-[#5a5a5a] hover:bg-[#f8f9fb]'
            }`}
        >
          <Database className="w-4 h-4" /> Memberships
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[8px] border border-[#d8d8d8] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center text-[#ababab]">Đang tải dữ liệu...</div>
          ) : activeTab === 'patients' ? (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8f9fb] text-[#5a5a5a] sticky top-0 border-b border-[#d8d8d8]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Mã BN</th>
                  <th className="px-4 py-3 font-semibold">Họ tên</th>
                  <th className="px-4 py-3 font-semibold">SĐT</th>
                  <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-[#f4f5f7] hover:bg-[#f8f9fb]">
                    <td className="px-4 py-3 text-[#5a5a5a]">{p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.code}</td>
                    <td className="px-4 py-3 font-medium text-[#146ef5]">{p.fullName}</td>
                    <td className="px-4 py-3">{p.phone}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleOpenModal(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8f9fb] text-[#5a5a5a] sticky top-0 border-b border-[#d8d8d8]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Patient ID</th>
                  <th className="px-4 py-3 font-semibold">Mã Thẻ</th>
                  <th className="px-4 py-3 font-semibold">Loại thẻ</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((m) => (
                  <tr key={m.id} className="border-b border-[#f4f5f7] hover:bg-[#f8f9fb]">
                    <td className="px-4 py-3 text-[#5a5a5a]">{m.id}</td>
                    <td className="px-4 py-3 font-medium">{m.patientId}</td>
                    <td className="px-4 py-3 font-medium text-[#146ef5]">{m.cardCode}</td>
                    <td className="px-4 py-3 text-[12px] font-medium">{m.type}</td>
                    <td className="px-4 py-3">
                      {m.status === 'active' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[11px] font-bold">ACTIVE</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[11px] font-bold">INACTIVE</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleOpenModal(m)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[8px] shadow-lg w-[400px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8d8d8]">
              <h3 className="font-bold text-[15px]">
                {editingId ? 'Cập nhật' : 'Thêm mới'} {activeTab === 'patients' ? 'Bệnh nhân' : 'Thẻ thành viên'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#ababab] hover:text-[#080808]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {activeTab === 'patients' ? (
                <>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Mã BN</label>
                    <input required className="w-full border rounded px-3 py-2 text-[13px]" value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Họ tên</label>
                    <input required className="w-full border rounded px-3 py-2 text-[13px]" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Số điện thoại</label>
                    <input required className="w-full border rounded px-3 py-2 text-[13px]" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Giới tính</label>
                    <select className="w-full border rounded px-3 py-2 text-[13px]" value={formData.gender || 'male'} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                      <input type="checkbox" checked={formData.isMember || false} onChange={(e) => setFormData({ ...formData, isMember: e.target.checked })} />
                      Là Thành viên
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Patient ID</label>
                    <input required type="number" className="w-full border rounded px-3 py-2 text-[13px]" value={formData.patientId || ''} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Mã thẻ</label>
                    <input required className="w-full border rounded px-3 py-2 text-[13px]" value={formData.cardCode || ''} onChange={(e) => setFormData({ ...formData, cardCode: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1">Loại thẻ</label>
                    <select className="w-full border rounded px-3 py-2 text-[13px]" value={formData.type || 'basic'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Thẻ thành viên">Thẻ thành viên</option>
                      <option value="Thẻ toàn diện">Thẻ toàn diện</option>
                      <option value="Thẻ Thành Viên (Phụ Khoa)">Thẻ Thành Viên (Phụ Khoa)</option>
                      <option value="Thẻ Thành Viên Vàng (Phụ Khoa)">Thẻ Thành Viên Vàng (Phụ Khoa)</option>
                      <option value="Thẻ Thành Viên (Sản Khoa Đơn Thai) - 12 Tuần">Thẻ Thành Viên (Sản Khoa Đơn Thai) - 12 Tuần</option>
                      <option value="Thẻ Thành Viên (Sản Khoa Đơn Thai) - 12 - 26 Tuần">Thẻ Thành Viên (Sản Khoa Đơn Thai) - 12 - 26 Tuần</option>
                      <option value="Thẻ Thành Viên (Sản Khoa Đơn Thai) - 26 Tuần">Thẻ Thành Viên (Sản Khoa Đơn Thai) - 26 Tuần</option>
                      <option value="Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 12 Tuần">Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 12 Tuần</option>
                      <option value="Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 12 - 26 Tuần">Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 12 - 26 Tuần</option>
                      <option value="Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 26 Tuần">Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 26 Tuần</option>
                      <option value="Thẻ Thành Viên (Sản Khoa Đa Thai) - 12 tuần">Thẻ Thành Viên (Sản Khoa Đa Thai) - 12 tuần</option>
                      <option value="Thẻ Thành Viên (Sản Khoa Đa Thai) - 12 - 26 tuần">Thẻ Thành Viên (Sản Khoa Đa Thai) - 12 - 26 tuần</option>
                      <option value="Thẻ Thành Viên (Sản Khoa Đa Thai) - 26 tuần">Thẻ Thành Viên (Sản Khoa Đa Thai) - 26 tuần</option>
                      <option value="Thẻ Vàng (Sản Khoa Đa Thai) - 12 tuần">Thẻ Vàng (Sản Khoa Đa Thai) - 12 tuần</option>
                      <option value="Thẻ Vàng (Sản Khoa Đa Thai) - 12 - 26 tuần">Thẻ Vàng (Sản Khoa Đa Thai) - 12 - 26 tuần</option>
                      <option value="Thẻ Vàng (Sản Khoa Đa Thai) - 26 tuần">Thẻ Vàng (Sản Khoa Đa Thai) - 26 tuần</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                      <input type="checkbox" checked={formData.status === 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'expired' })} />
                      Đang hoạt động (Active)
                    </label>
                  </div>
                </>
              )}
            </form>
            <div className="p-4 border-t border-[#d8d8d8] flex justify-end gap-2 bg-[#f8f9fb]">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium border border-[#d8d8d8] rounded bg-white hover:bg-gray-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-[13px] font-medium bg-[#146ef5] text-white rounded hover:bg-[#0055d4] disabled:opacity-50">
                {saving ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
