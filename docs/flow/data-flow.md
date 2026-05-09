# Quản lý dữ liệu (Data Management)

Dự án sử dụng cơ chế quản lý trạng thái tập trung để đảm bảo tính nhất quán của dữ liệu trên toàn bộ ứng dụng.

## 1. Trạng thái toàn cục (Zustand)
Chúng ta sử dụng `Zustand` thay vì Redux vì tính đơn giản và hiệu năng cao.

### Patient Store (`src/store/patientStore.ts`)
Lưu trữ thông tin về bệnh nhân đang được xử lý:
- `selectedPatient`: Object chứa thông tin cơ bản của bệnh nhân.
- `activeLifecycle`: Lộ trình chăm sóc hiện tại đang được focus.
- `activeEncounter`: Lượt khám gần nhất.
- `searchQuery`: Từ khóa tìm kiếm hiện tại.

### App Store (`src/store/appStore.ts`)
Lưu trữ trạng thái giao diện:
- `activeMenu`: Menu đang được chọn ở Sidebar.
- `isSidebarCollapsed`: Trạng thái thu gọn/mở rộng của thanh menu.

## 2. Luồng cập nhật dữ liệu (Data Flow)

1. **Trigger**: Người dùng chọn bệnh nhân trong `PatientSelectSearch`.
2. **Action**: Gọi `setSelectedPatient(patient)`.
3. **Side Effect**:
    - Tìm kiếm lượt khám mới nhất của bệnh nhân đó trong danh sách `encounters`.
    - Tự động tìm lộ trình (`lifecycle`) tương ứng với loại lượt khám đó.
    - Cập nhật `activeEncounter` và `activeLifecycle` vào store.
4. **Reactive Update**:
    - `PatientSummary` tự động cập nhật thông tin cá nhân.
    - `LifecycleTimeline` render lại dựa trên `activeLifecycle`.
    - `MedicalHistoryTable` lọc lại danh sách theo `selectedPatient.id`.

## 3. Mock Data System
Trong giai đoạn phát triển, dữ liệu được lấy từ `src/mock/data.ts`.

- **Cấu trúc**: Dữ liệu được liên kết qua ID (ví dụ: `Lifecycle.patientId` liên kết với `Patient.id`).
- **Mở rộng**: Có các file script (`generateMock.js`, `seedMockApi.js`) hỗ trợ việc tạo dữ liệu mẫu số lượng lớn để kiểm tra hiệu năng (Performance Testing).
