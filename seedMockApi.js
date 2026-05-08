const API_BASE = 'https://69fd4a2430ad0a6fd1c0bcfa.mockapi.io/api/v1';

const memberships = [
  {
    patientId: 'P001',
    branchId: 'CN001',
    specialty: 'san',
    cardCode: 'PREM-0001',
    type: 'Thẻ Thành Viên Vàng (Sản Khoa Đơn Thai) - 12 - 26 Tuần',
    expiredAt: '2027-06-01T00:00:00.000Z',
    status: true,
  },
  {
    patientId: 'P002',
    branchId: 'CN002',
    specialty: 'tong_quat',
    cardCode: 'COMP-0002',
    type: 'Thẻ toàn diện',
    expiredAt: '2027-08-22T00:00:00.000Z',
    status: true,
  },
  {
    patientId: 'P003',
    branchId: 'CN001',
    specialty: 'nhi',
    cardCode: 'GOLD-0003',
    type: 'Thẻ thành viên',
    expiredAt: '2027-03-15T00:00:00.000Z',
    status: true,
  },
  {
    patientId: 'P004',
    branchId: 'CN002',
    specialty: 'nhi',
    cardCode: 'SILV-0004',
    type: 'Thẻ thành viên',
    expiredAt: '2026-12-31T00:00:00.000Z',
    status: true,
  },
  {
    patientId: 'P005',
    branchId: 'CN003',
    specialty: 'phu_khoa',
    cardCode: 'GYN-0005',
    type: 'Thẻ Thành Viên Vàng (Phụ Khoa)',
    expiredAt: '2026-01-05T00:00:00.000Z',
    status: true,
  },
];

async function seedMemberships() {
  console.log('Bắt đầu đẩy dữ liệu thẻ thành viên lên MockAPI...');
  for (const item of memberships) {
    try {
      const response = await fetch(`${API_BASE}/memberships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Đã thêm thẻ: ${item.cardCode} (ID: ${data.id})`);
      } else {
        console.error(`❌ Lỗi thêm thẻ ${item.cardCode}:`, response.statusText);
      }
    } catch (error) {
      console.error(`❌ Lỗi mạng khi thêm thẻ ${item.cardCode}:`, error.message);
    }
  }
  console.log('Hoàn thành quá trình nạp dữ liệu!');
}

seedMemberships();
