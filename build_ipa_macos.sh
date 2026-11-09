#!/usr/bin/env bash
set -e
echo "=== Đang đóng gói ứng dụng preMediK ra file preMediK-iOS.ipa ==="
npm install
npx cap add ios || true
npx cap sync ios

cd ios/App
xcodebuild -project App.xcodeproj \
  -scheme App \
  -sdk iphoneos \
  -configuration Release \
  -archivePath ./build/preMediK.xcarchive \
  archive \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO

mkdir -p ./build/Payload
cp -r ./build/preMediK.xcarchive/Products/Applications/App.app ./build/Payload/
cd ./build
zip -r ../../../preMediK-iOS.ipa Payload
echo "=== HOÀN TẤT: File preMediK-iOS.ipa đã được tạo tại thư mục gốc! ==="
