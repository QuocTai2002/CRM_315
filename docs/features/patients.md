# Tính năng: Quản lý Bệnh nhân & Lịch sử Y tế

## 1. Thông tin Bệnh nhân (Patient Summary)
Component `PatientSummary` hiển thị cái nhìn nhanh về bệnh nhân đang được chọn.

### Các thông tin chính:
- **Hành chính**: Tên, Mã BN, Ngày sinh, SĐT, Giới tính.
- **Thẻ thành viên (Membership)**: Loại thẻ (Vàng, Bạc...), thời hạn và trạng thái thẻ.
- **Trạng thái lượt khám**: Hiển thị nhãn "Lần đầu", "Tái khám" hoặc "Bệnh mới" dựa trên lịch sử của bệnh nhân.
- **Thống kê nhanh**: Số lần khám, tổng chi tiêu (nếu có tích hợp thanh toán).

## 2. Lịch sử khám bệnh (Medical History Table)
Hiển thị danh sách các lần khám dưới dạng bảng.

### Các trường dữ liệu:
- **Ngày khám**: Sắp xếp theo thứ tự thời gian mới nhất lên đầu.
- **Chuyên khoa & Bác sĩ**: Thông tin nơi khám và người điều trị.
- **Chẩn đoán**: Kết luận y khoa của lượt khám đó.
- **Dịch vụ & Kết quả**: Các xét nghiệm/siêu âm đã làm và kết quả tương ứng.
- **Hẹn tái khám**: Ngày hẹn tiếp theo để hệ thống nhắc lịch.

### Tính năng bổ trợ:
- **Lọc theo chuyên khoa**: Cho phép xem lịch sử tách biệt (ví dụ: chỉ xem lịch sử Nhi khoa).
- **Trạng thái**: Tự động đánh dấu các lượt khám "Quá hạn tái khám" để nhân viên CSKH có thể gọi điện nhắc nhở.
