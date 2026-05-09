# Tính năng: Vòng đời chăm sóc (Patient Lifecycle)

Đây là tính năng cốt lõi giúp CRM 315 khác biệt so với các hệ thống quản lý bệnh viện thông thường.

## 1. Khái niệm
Một bệnh nhân có thể tham gia vào nhiều chương trình chăm sóc (Lifecycle Program):
- **maternity**: Chăm sóc thai sản (từ tuần 1 đến khi sinh).
- **vaccination**: Lịch tiêm chủng (cho trẻ em hoặc người lớn).
- **pediatric**: Theo dõi sự phát triển của trẻ nhỏ.
- **gynecology**: Điều trị và theo dõi phụ khoa.

## 2. Giai đoạn (Lifecycle Stage)
Mỗi lộ trình bao gồm nhiều giai đoạn (Stages) nối tiếp nhau.

### Các trạng thái của giai đoạn:
- `done`: Đã thực hiện khám/dịch vụ.
- `active`: Giai đoạn hiện tại bệnh nhân đang ở.
- `upcoming`: Các giai đoạn trong tương lai.
- `missed`: Giai đoạn đã quá hạn nhưng bệnh nhân chưa thực hiện.

## 3. Logic hiển thị Timeline
Component `LifecycleTimeline` chịu trách nhiệm render các giai đoạn này:
- Sử dụng **Framer Motion** để tạo hiệu ứng chuyển động khi đổi bệnh nhân.
- Mỗi giai đoạn hiển thị: Tiêu đề (ví dụ: "Tuần 12"), Ngày thực hiện (nếu có), và danh sách dịch vụ khuyến nghị.

## 4. Gợi ý dịch vụ (Recommendations)
Dựa trên `activeLifecycle` và giai đoạn hiện tại (`stage`), hệ thống sẽ tra cứu trong danh sách `recommendations` để hiển thị các gói dịch vụ phù hợp.
- **Priority**: Phân loại mức độ quan trọng (High, Medium, Low).
- **Reason**: Giải thích tại sao cần thực hiện dịch vụ này ở giai đoạn này.
