# Chi tiết các tính năng

Hệ thống CRM 315 được chia thành các module chức năng chính sau:

- [Quản lý Bệnh nhân & Lịch sử Y tế](./patients.md): Quản lý hồ sơ, thẻ thành viên và toàn bộ quá trình thăm khám.
- [Vòng đời chăm sóc (Lifecycle)](./lifecycle.md): Quản lý lộ trình sức khỏe dài hạn của bệnh nhân (Thai sản, Tiêm chủng...).
- **Gợi ý dịch vụ (Recommendations)**: Tự động đề xuất các dịch vụ y tế phù hợp với từng giai đoạn của bệnh nhân.
- **Cấu hình hệ thống (Settings)**: Quản lý các tham số API và thiết lập ứng dụng.

Mỗi module được thiết kế để hoạt động độc lập nhưng vẫn chia sẻ dữ liệu thông qua bộ lưu trữ trạng thái tập trung (Zustand Store).
