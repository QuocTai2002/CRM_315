# CRM Project Documentation

Chào mừng bạn đến với tài liệu kỹ thuật của dự án CRM 315. Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc, luồng dữ liệu và các tính năng chính của hệ thống.

## Danh sách tài liệu

1. [Tổng quan dự án & Kiến trúc](./architecture.md) - Giới thiệu về dự án, công nghệ sử dụng và cấu trúc thư mục.
2. [Luồng người dùng (User Flow)](./flow/user-flow.md) - Cách người dùng tương tác với ứng dụng.
3. [Quản lý dữ liệu (Data Management)](./flow/data-flow.md) - Luồng dữ liệu, State management (Zustand) và Mock data.
4. [Tính năng chi tiết](./features/index.md) - Mô tả chi tiết các module tính năng.
    - [Quản lý Bệnh nhân](./features/patients.md)
    - [Vòng đời chăm sóc (Lifecycle)](./features/lifecycle.md)
    - [Lịch sử khám bệnh](./features/medical-history.md)

## Quy trình làm việc
- Phát triển giao diện dựa trên React + Vite + Tailwind CSS.
- Quản lý trạng thái bằng Zustand.
- Animation sử dụng Framer Motion.
- Icons sử dụng Lucide React.
