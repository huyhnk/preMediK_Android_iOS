# HƯỚNG DẪN CÀI ĐẶT ỨNG DỤNG DI ĐỘNG preMediK TRÊN ANDROID VÀ iOS

Gói dự án này bao gồm đầy đủ ứng dụng di động **preMediK** (24 màn hình từ `UI01` đến `UI24`, mô hình học sâu chú ý đa đầu trái – phải `ResNet50V2 – LRMH`, bản đồ nhiệt `Grad-CAM`, và bộ luật phân mức ưu tiên `L = min(LLS, LCLS)`).

Bạn có thể cài đặt ứng dụng lên điện thoại **Android** và **iOS (iPhone/iPad)** theo **3 cách** dưới đây (từ nhanh nhất không cần máy tính đến biên dịch tệp `.apk` / `.ipa` gốc):

---

## CÁCH 1: Cài đặt trực tiếp qua trình duyệt di động (PWA — Nhanh nhất, không cần cáp hay Store)

File `www/index.html` (hoặc file `preMediK.html`) đã được tích hợp chuẩn **Progressive Web App (PWA)**, Web App Manifest và lưu trữ cục bộ ngoại tuyến:

1. **Trên iPhone / iPad (iOS):**
   - Mở tệp `preMediK.html` (hoặc đường dẫn lưu trữ nội bộ của cơ sở y tế) bằng trình duyệt **Safari**.
   - Nhấn nút **Chia sẻ (Share)** ở thanh dưới cùng (biểu tượng hình vuông có mũi tên hướng lên).
   - Chọn **Thêm vào Màn hình chính (Add to Home Screen)** → Nhấn **Thêm (Add)**.
   - Biểu tượng **preMediK** sẽ xuất hiện trên màn hình chính iOS và chạy ở chế độ **Toàn màn hình (Standalone App)** không có thanh địa chỉ trình duyệt, hỗ trợ cả khi mất mạng.

2. **Trên điện thoại / máy tính bảng Android:**
   - Mở trên trình duyệt **Chrome** hoặc **Edge**.
   - Nhấn nút menu **⋮** (góc trên bên phải) → Chọn **Cài đặt ứng dụng (Install App)** hoặc **Thêm vào Màn hình chính**.

---

## CÁCH 2: Xuất tệp cài đặt `.APK` (Android) và `.IPA` (iOS) bằng Capacitor

Thư mục gốc của gói `.zip` đã cấu sẵn `package.json` và `capacitor.config.json` (`appId: vn.med.premedik`):

```bash
# 1. Cài đặt phụ thuộc
npm install

# 2. Tạo dự án Android (.apk / .aab)
npx cap add android
npx cap sync android
npx cap open android
# Trong Android Studio: Chọn Build -> Build Bundle(s) / APK(s) -> Build APK(s) để lấy file cài đặt .apk

# 3. Tạo dự án iOS (.ipa trên macOS có Xcode)
npx cap add ios
npx cap sync ios
npx cap open ios
# Trong Xcode: Chọn thiết bị iPhone hoặc Archive để xuất file .ipa
```

---

## CÁCH 3: Chạy trên Android & iOS qua React Native / Expo (`expo-mobile-app/`)

Nếu bạn sử dụng **Expo Go** hoặc **EAS Build**:

```bash
cd expo-mobile-app
npm install
npx expo start
```
Quét mã QR bằng ứng dụng **Expo Go** trên Android hoặc Camera trên iOS để mở ngay trên thiết bị thật.

---

## TÀI KHOẢN DEMO ĐỂ KIỂM THỬ ĐẦY ĐỦ 24 MÀN HÌNH (`UI01` – `UI24`)

- **Mã cơ sở:** `CS_DEMO`
- **Điều dưỡng tiếp nhận:** `dieuduong01` (Tạo lượt, thu ảnh, nhập sinh tồn & triệu chứng, gọi hàng đợi, đồng bộ ngoại tuyến).
- **Bác sĩ:** `bacsi01` (Đọc phim, xem Grad-CAM `UI12`, xác nhận và điều chỉnh mức tiếp nhận tại `UI14`).
- **Quản trị hệ thống:** `quantri01` (Cấu hình ngưỡng `τTB`, `θ` tại `UI22`, Quản lý người dùng tại `UI23`).
- **Kiểm soát chất lượng:** `kiemsoat01` (Tra cứu nhật ký và đánh dấu ca đã xác nhận vào bộ đánh giá tại `UI24`).
