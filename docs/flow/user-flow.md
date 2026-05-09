# Luồng người dùng (User Flow)

Tài liệu này mô tả cách người dùng (nhân viên y tế/CSKH) tương tác với hệ thống CRM.

## 1. Tìm kiếm và Chọn bệnh nhân
Đây là bước đầu tiên và quan trọng nhất để bắt đầu quy trình làm việc.

- **Vị trí**: Thanh tìm kiếm (`TopHeader`) sử dụng component `PatientSelectSearch`.
- **Hành động**:
    1. Nhập tên, số điện thoại hoặc mã bệnh nhân (BNxxxx).
    2. Hệ thống gợi ý kết quả từ danh sách bệnh nhân.
    3. Người dùng chọn một bệnh nhân.
- **Kết quả**:
    - `patientStore` cập nhật `selectedPatient`.
    - Dashboard chuyển từ trạng thái "Trống" sang hiển thị chi tiết "Patient 360".
    - Hệ thống tự động xác định `activeEncounter` (lượt khám gần nhất) và `activeLifecycle` (lộ trình đang tham gia) của bệnh nhân đó.

## 2. Theo dõi lộ trình (Patient Lifecycle)
Sau khi chọn bệnh nhân, người dùng xem lộ trình chăm sóc tại `LifecycleTimeline`.

- **Mục tiêu**: Biết bệnh nhân đang ở giai đoạn nào trong chương trình (Thai sản, Tiêm chủng, v.v.).
- **Thông tin hiển thị**:
    - Các giai đoạn đã hoàn thành (Done).
    - Giai đoạn hiện tại (Active).
    - Các giai đoạn sắp tới (Upcoming).
    - Các giai đoạn bị lỡ (Missed).
- **Tương tác**: Người dùng có thể click vào từng giai đoạn để xem các dịch vụ được khuyến nghị (`recommendedServices`).

## 3. Xem lịch sử y tế
Bảng `MedicalHistoryTable` hiển thị toàn bộ quá trình thăm khám của bệnh nhân.

- **Thông tin**: Ngày khám, Bác sĩ, Chẩn đoán, Dịch vụ đã sử dụng, Kết quả và Ngày hẹn tái khám.
- **Phân loại**: Có thể lọc lịch sử theo chương trình (Ví dụ: chỉ xem lịch sử Sản khoa).

## 4. Tư vấn và Gợi ý dịch vụ
Component `OffersAndPayment` (thường ở thanh bên phải hoặc dưới cùng) hiển thị các dịch vụ gợi ý dựa trên giai đoạn hiện tại của bệnh nhân.

- **Luồng logic**: Nếu bệnh nhân đang ở "Tuần 28" của lộ trình Sản khoa -> Gợi ý "Siêu âm 4D" và "Xét nghiệm tiểu đường".
- **Hành động**: Giúp nhân viên CSKH tư vấn đúng nhu cầu của bệnh nhân tại thời điểm hiện tại.
