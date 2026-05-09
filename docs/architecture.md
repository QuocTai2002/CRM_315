# Tổng quan & Kiến trúc dự án

## 1. Giới thiệu
Dự án CRM 315 là hệ thống quản lý quan hệ khách hàng dành cho hệ thống y tế 315 (Sản khoa, Nhi khoa, Tiêm chủng). Hệ thống tập trung vào việc quản lý lộ trình chăm sóc bệnh nhân (Patient 360) theo các chương trình sức khỏe cụ thể.

## 2. Công nghệ sử dụng
- **Core**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utils**: date-fns (xử lý ngày tháng)

## 3. Cấu trúc thư mục
```text
src/
├── assets/             # Hình ảnh, font, icon tĩnh
├── features/           # Các module chức năng chính
│   ├── lifecycle/      # Quản lý lộ trình chăm sóc (Timeline)
│   ├── medical-history/# Bảng lịch sử khám bệnh
│   ├── patients/       # Thông tin tóm tắt & tìm kiếm bệnh nhân
│   ├── recommendations/# Các gợi ý dịch vụ & thanh toán
│   └── settings/       # Cấu hình API/Hệ thống
├── shared/             # Components, hooks, utils dùng chung
│   ├── components/     # Sidebar, Header, UI Components
│   └── utils/          # Các hàm helper (tính tuổi, định dạng...)
├── store/              # Quản lý state toàn cục (Zustand)
│   ├── appStore.ts     # Trạng thái UI (menu, theme...)
│   └── patientStore.ts # Trạng thái bệnh nhân đang được chọn
├── types/              # Định nghĩa TypeScript interfaces
└── mock/               # Dữ liệu giả lập cho phát triển
```

## 4. Nguyên tắc thiết kế
- **Component-driven**: Chia nhỏ UI thành các component có thể tái sử dụng.
- **Feature-based structure**: Nhóm các file liên quan đến một tính năng vào cùng một thư mục.
- **Single Source of Truth**: Sử dụng Zustand để quản lý trạng thái đồng bộ giữa các component khác nhau (ví dụ: tìm kiếm bệnh nhân ở Header sẽ cập nhật nội dung ở Dashboard).
