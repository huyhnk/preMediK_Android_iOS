import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
  Switch
} from 'react-native';

// ============================================================================
// preMediK — ỨNG DỤNG DI ĐỘNG NATIVE (REACT NATIVE / EXPO CHO ANDROID & iOS)
// 24 Màn hình (UI01 - UI24) • Mô hình ResNet50V2-LRMH • Phân mức L = min(LLS, LCLS)
// ============================================================================

const INITIAL_CASES = [
  {
    id: 'LT-DEMO-001',
    patientId: 'NB-DEMO-045',
    age: '45',
    gender: 'Nam',
    dept: 'Khám hô hấp',
    intakeTime: '04/11/2026 • 09:30',
    waitMinutes: 8,
    hasImage: true,
    imageView: 'PA',
    imageRotation: 0,
    spo2: '96',
    rr: '18',
    hr: '82',
    temp: '37,2',
    sbp: '120',
    dbp: '80',
    consciousness: 'Tỉnh táo',
    cardioResp: 'Không ngừng thở/tuần hoàn',
    cough: 'Có',
    coughDays: '21',
    weightLoss: true,
    dyspnea: false,
    chestPain: false,
    afternoonFever: false,
    nightSweats: false,
    hemoptysis: 'Không',
    priorityGroup: 'Không thuộc nhóm đã chọn',
    lls: 4,
    lcls: 3,
    proposedLevel: 3,
    confirmedLevel: 3,
    probs: { normal: 30, pneumonia: 5, tb: 65 },
    aiLabel: 'Nghi lao phổi',
    uncertain: false,
    infectionFlag: true,
    doctorEval: 'Nghi lao phổi',
    doctorReason: 'Giữ đề xuất; hẹn xét nghiệm khẳng định',
    doctorConfirmed: true,
    queueStatus: 'Đang chờ',
    syncStatus: 'Đã đồng bộ',
    version: 2
  },
  {
    id: 'LT-DEMO-002',
    patientId: 'NB-DEMO-009',
    age: '58',
    gender: 'Nam',
    dept: 'Khám hô hấp',
    intakeTime: '04/11/2026 • 09:32',
    waitMinutes: 9,
    hasImage: true,
    imageView: 'PA',
    imageRotation: 0,
    spo2: '91',
    rr: '24',
    hr: '96',
    temp: '38,1',
    sbp: '128',
    dbp: '82',
    consciousness: 'Tỉnh táo',
    cardioResp: 'Không ngừng thở/tuần hoàn',
    cough: 'Có',
    coughDays: '14',
    weightLoss: false,
    dyspnea: true,
    chestPain: false,
    afternoonFever: true,
    nightSweats: false,
    hemoptysis: 'Không',
    priorityGroup: 'Không thuộc nhóm đã chọn',
    lls: 2,
    lcls: 3,
    proposedLevel: 2,
    confirmedLevel: null,
    probs: { normal: 40, pneumonia: 25, tb: 35 },
    aiLabel: 'Chưa chắc chắn',
    uncertain: true,
    infectionFlag: true,
    doctorEval: 'Chưa kết luận',
    doctorReason: '',
    doctorConfirmed: false,
    queueStatus: 'Chờ bác sĩ',
    syncStatus: 'Đã đồng bộ',
    version: 1
  },
  {
    id: 'LT-DEMO-003',
    patientId: 'NB-DEMO-082',
    age: '82',
    gender: 'Nữ',
    dept: 'Khám hô hấp',
    intakeTime: '03/11/2026 • 09:29',
    waitMinutes: 11,
    hasImage: true,
    imageView: 'AP',
    imageRotation: 0,
    spo2: '89',
    rr: '32',
    hr: '108',
    temp: '38,8',
    sbp: '115',
    dbp: '75',
    consciousness: 'Tỉnh táo',
    cardioResp: 'Không ngừng thở/tuần hoàn',
    cough: 'Có',
    coughDays: '5',
    weightLoss: false,
    dyspnea: true,
    chestPain: true,
    afternoonFever: false,
    nightSweats: false,
    hemoptysis: 'Không',
    priorityGroup: 'Người từ 80 tuổi trở lên',
    lls: 2,
    lcls: 3,
    proposedLevel: 2,
    confirmedLevel: 2,
    probs: { normal: 10, pneumonia: 85, tb: 5 },
    aiLabel: 'Viêm phổi',
    uncertain: false,
    infectionFlag: false,
    doctorEval: 'Viêm phổi',
    doctorReason: 'Ưu tiên người bệnh 82 tuổi',
    doctorConfirmed: true,
    queueStatus: 'Đang chờ',
    syncStatus: 'Đã đồng bộ',
    version: 2
  }
];

export default function App() {
  const [currentUI, setCurrentUI] = useState('UI01');
  const [historyStack, setHistoryStack] = useState([]);
  const [facilityCode, setFacilityCode] = useState('CS_DEMO');
  const [username, setUsername] = useState('dieuduong01');
  const [password, setPassword] = useState('preMediK2026');
  const [rememberFacility, setRememberFacility] = useState(true);
  const [role, setRole] = useState('Điều dưỡng tiếp nhận');
  const [online, setOnline] = useState(true);
  const [cases, setCases] = useState(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState('LT-DEMO-001');
  const [heatmapOpacity, setHeatmapOpacity] = useState(65);
  const [tauTB, setTauTB] = useState('0,35');
  const [theta, setTheta] = useState('0,60');
  const [pinEnabled, setPinEnabled] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  const navigate = (ui) => {
    setHistoryStack(prev => [...prev, currentUI]);
    setCurrentUI(ui);
  };

  const goBack = (fallback = 'UI02') => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack(s => s.slice(0, -1));
      setCurrentUI(prev);
    } else {
      setCurrentUI(fallback);
    }
  };

  const updateActiveCase = (patch) => {
    setCases(prev => prev.map(item => item.id === activeCase.id ? { ...item, ...patch } : item));
  };

  const computeLLS = (c) => {
    const spo2 = parseFloat(c.spo2);
    const rr = parseFloat(c.rr);
    const hr = parseFloat(c.hr);
    if (c.cardioResp.includes('Ngừng') || c.consciousness === 'Hôn mê' || spo2 < 85) return 1;
    if ((spo2 >= 85 && spo2 < 92) || rr > 30 || rr < 10 || hr > 130 || hr < 50) return 2;
    if (c.dyspnea || c.chestPain || c.hemoptysis === 'Lượng ít') return 3;
    if ((c.cough === 'Có' && parseInt(c.coughDays, 10) >= 14) || c.weightLoss || c.afternoonFever || c.nightSweats) return 4;
    return 5;
  };

  const renderScreen = () => {
    switch (currentUI) {
      case 'UI01':
        return (
          <View style={styles.section}>
            <Text style={styles.brandTitle}>preMediK</Text>
            <Text style={styles.subText}>Dành cho nhân viên y tế</Text>
            <Text style={styles.h1}>Đăng nhập cơ sở y tế</Text>
            <Text style={styles.label}>Mã cơ sở</Text>
            <TextInput style={styles.input} value={facilityCode} onChangeText={setFacilityCode} />
            <Text style={styles.label}>Tài khoản</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} />
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <View style={styles.rowBetween}>
              <Text style={styles.bodyText}>Ghi nhớ cơ sở y tế</Text>
              <Switch value={rememberFacility} onValueChange={setRememberFacility} trackColor={{ true: '#0d746e' }} />
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigate('UI02')}>
              <Text style={styles.btnPrimaryText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI02':
        return (
          <View style={styles.section}>
            <Text style={styles.brandTitle}>preMediK</Text>
            <Text style={styles.subText}>Cơ sở {facilityCode} • {role}</Text>
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>{online ? 'Trực tuyến • Đã đồng bộ 09:40' : 'Mất mạng • Lưu cục bộ'}</Text>
            </View>
            <Text style={styles.h2}>Tiếp nhận hôm nay</Text>
            <View style={styles.grid2}>
              <TouchableOpacity style={styles.statCard} onPress={() => navigate('UI15')}>
                <Text style={styles.statNumber}>18</Text>
                <Text style={styles.subText}>Đang chờ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statCard} onPress={() => navigate('UI15')}>
                <Text style={styles.statNumber}>06</Text>
                <Text style={styles.subText}>Chờ bác sĩ</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.h2}>Cần chú ý</Text>
            <TouchableOpacity style={styles.badgeOrange} onPress={() => navigate('UI15')}>
              <Text style={styles.badgeOrangeText}>02 ca mức 2 đang chờ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.badgeBlue} onPress={() => navigate('UI19')}>
              <Text style={styles.badgeBlueText}>03 hồ sơ chờ đồng bộ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigate('UI03')}>
              <Text style={styles.btnPrimaryText}>+ Tạo lượt sàng lọc mới</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => navigate('UI07')}>
              <Text style={styles.btnOutlineText}>Đánh giá lâm sàng ngay</Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI03':
        return (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => goBack('UI02')}>
              <Text style={styles.h1}>‹ Lượt sàng lọc mới</Text>
            </TouchableOpacity>
            <Text style={styles.subText}>Bước 1 trong 4 • Người bệnh</Text>
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>Mã lượt tự tạo • {activeCase.id}</Text>
            </View>
            <Text style={styles.label}>Mã người bệnh tại cơ sở</Text>
            <TextInput style={styles.input} value={activeCase.patientId} onChangeText={v => updateActiveCase({ patientId: v })} />
            <Text style={styles.label}>Tuổi</Text>
            <TextInput style={styles.input} value={activeCase.age} keyboardType="numeric" onChangeText={v => updateActiveCase({ age: v })} />
            <Text style={styles.label}>Khoa tiếp nhận</Text>
            <TextInput style={styles.input} value={activeCase.dept} onChangeText={v => updateActiveCase({ dept: v })} />
            <TouchableOpacity style={styles.btnOutline} onPress={() => navigate('UI07')}>
              <Text style={styles.btnOutlineText}>Nhập lâm sàng trước</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigate('UI04')}>
              <Text style={styles.btnPrimaryText}>Tiếp tục • Ảnh X-quang</Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI04':
      case 'UI05':
      case 'UI06':
        return (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => goBack('UI03')}>
              <Text style={styles.h1}>
                ‹ {currentUI === 'UI04' ? 'Thu nhận ảnh X-quang' : currentUI === 'UI05' ? 'Kiểm tra ảnh' : 'Cần thu nhận lại ảnh'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.subText}>{activeCase.id} • Tư thế {activeCase.imageView}</Text>
            <View style={styles.xrayPlaceholder}>
              <Text style={styles.xrayPlaceholderText}>
                {currentUI === 'UI06' ? 'Ảnh bị lóa / Tương phản thấp' : `Khung X-quang Ngực (${activeCase.imageView} • Xoay ${activeCase.imageRotation}°)`}
              </Text>
            </View>
            {currentUI === 'UI05' && (
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => updateActiveCase({ imageRotation: (activeCase.imageRotation + 90) % 360 })}
              >
                <Text style={styles.btnOutlineText}>Xoay ảnh 90° ↻</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => navigate(currentUI === 'UI04' ? 'UI05' : currentUI === 'UI05' ? 'UI07' : 'UI04')}
            >
              <Text style={styles.btnPrimaryText}>
                {currentUI === 'UI04' ? 'Chụp ảnh' : currentUI === 'UI05' ? 'Dùng ảnh này' : 'Chụp lại ảnh'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => navigate(currentUI === 'UI06' ? 'UI04' : 'UI06')}>
              <Text style={styles.btnOutlineText}>{currentUI === 'UI06' ? 'Chọn ảnh khác' : 'Kiểm thử ảnh bị từ chối (UI06)'}</Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI07':
        return (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => goBack('UI05')}>
              <Text style={styles.h1}>‹ Dấu hiệu sinh tồn</Text>
            </TouchableOpacity>
            <Text style={styles.subText}>Bước 3 trong 4 • {activeCase.id}</Text>
            <Text style={styles.label}>SpO2 • %</Text>
            <TextInput style={styles.input} value={activeCase.spo2} keyboardType="numeric" onChangeText={v => updateActiveCase({ spo2: v })} />
            <Text style={styles.label}>Nhịp thở • lần/phút</Text>
            <TextInput style={styles.input} value={activeCase.rr} keyboardType="numeric" onChangeText={v => updateActiveCase({ rr: v })} />
            <Text style={styles.label}>Mạch • lần/phút</Text>
            <TextInput style={styles.input} value={activeCase.hr} keyboardType="numeric" onChangeText={v => updateActiveCase({ hr: v })} />
            <Text style={styles.label}>Nhiệt độ • °C</Text>
            <TextInput style={styles.input} value={activeCase.temp} onChangeText={v => updateActiveCase({ temp: v })} />
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>Mức lâm sàng tạm tính LLS = {computeLLS(activeCase)}</Text>
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => { updateActiveCase({ lls: computeLLS(activeCase) }); navigate('UI08'); }}>
              <Text style={styles.btnPrimaryText}>Tiếp tục • Triệu chứng</Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI08':
        return (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => goBack('UI07')}>
              <Text style={styles.h1}>‹ Triệu chứng và ưu tiên</Text>
            </TouchableOpacity>
            <Text style={styles.subText}>Bước 3 trong 4 • {activeCase.id}</Text>
            <Text style={styles.label}>Số ngày ho</Text>
            <TextInput style={styles.input} value={activeCase.coughDays} keyboardType="numeric" onChangeText={v => updateActiveCase({ coughDays: v })} />
            <View style={styles.rowBetween}>
              <Text style={styles.bodyText}>Sụt cân</Text>
              <Switch value={activeCase.weightLoss} onValueChange={v => updateActiveCase({ weightLoss: v })} trackColor={{ true: '#0d746e' }} />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.bodyText}>Khó thở</Text>
              <Switch value={activeCase.dyspnea} onValueChange={v => updateActiveCase({ dyspnea: v })} trackColor={{ true: '#0d746e' }} />
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => { updateActiveCase({ lls: computeLLS(activeCase) }); navigate('UI09'); }}>
              <Text style={styles.btnPrimaryText}>Tiếp tục • Kiểm tra hồ sơ</Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI09':
      case 'UI10':
        return (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => goBack('UI08')}>
              <Text style={styles.h1}>‹ {currentUI === 'UI09' ? 'Kiểm tra trước khi gửi' : 'Đang phân tích (ResNet50V2-LRMH)'}</Text>
            </TouchableOpacity>
            <Text style={styles.h2}>{activeCase.patientId} • {activeCase.gender} • {activeCase.age} tuổi</Text>
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>Mức lâm sàng LLS = {activeCase.lls}</Text>
            </View>
            <Text style={styles.bodyText}>SpO2 {activeCase.spo2}% • Thở {activeCase.rr} lần/phút • Ho {activeCase.coughDays} ngày</Text>
            {currentUI === 'UI10' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>1. Kiểm tra ảnh 224×224 ✓</Text>
                <Text style={styles.cardTitle}>2. Suy luận ResNet50V2 và khối chú ý trái – phải LRMH ✓</Text>
                <Text style={styles.cardTitle}>3. Tạo bản đồ nhiệt Grad-CAM ✓</Text>
                <Text style={styles.cardTitle}>4. Tích hợp mức ưu tiên L = min(LLS, LCLS) ✓</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => navigate(currentUI === 'UI09' ? (online ? 'UI10' : 'UI19') : (activeCase.uncertain ? 'UI13' : 'UI11'))}
            >
              <Text style={styles.btnPrimaryText}>
                {currentUI === 'UI09' ? 'Gửi phân tích và lưu lượt' : 'Xem kết quả phân tích'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'UI11':
      case 'UI12':
      case 'UI13':
      case 'UI14':
        return (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => goBack('UI02')}>
              <Text style={styles.h1}>
                ‹ {currentUI === 'UI11' ? 'Kết quả sàng lọc' : currentUI === 'UI12' ? 'Ảnh và bản đồ nhiệt Grad-CAM' : currentUI === 'UI13' ? 'Cần bác sĩ đọc phim' : 'Xác nhận của bác sĩ'}
              </Text>
            </TouchableOpacity>
            <View style={styles.badgeOrange}>
              <Text style={styles.badgeOrangeText}>MỨC {activeCase.proposedLevel} • Đề xuất hệ thống (LLS {activeCase.lls} • LCLS {activeCase.lcls})</Text>
            </View>
            <Text style={styles.h1}>{activeCase.aiLabel}</Text>
            <Text style={styles.bodyText}>
              Bình thường: {activeCase.probs.normal}% | Viêm phổi: {activeCase.probs.pneumonia}% | Lao phổi: {activeCase.probs.tb}%
            </Text>
            {currentUI === 'UI14' ? (
              <>
                <Text style={styles.label}>Lý do xác nhận / điều chỉnh của Bác sĩ</Text>
                <TextInput
                  style={styles.input}
                  value={activeCase.doctorReason}
                  onChangeText={v => updateActiveCase({ doctorReason: v })}
                />
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => { updateActiveCase({ doctorConfirmed: true }); navigate('UI15'); }}
                >
                  <Text style={styles.btnPrimaryText}>Xác nhận và cập nhật hàng đợi</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.btnOutline} onPress={() => navigate('UI12')}>
                  <Text style={styles.btnOutlineText}>Xem ảnh và bản đồ nhiệt (UI12)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => navigate('UI14')}>
                  <Text style={styles.btnPrimaryText}>Mở xác nhận bác sĩ (UI14)</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );

      case 'UI15':
      case 'UI16':
        return (
          <View style={styles.section}>
            <Text style={styles.h1}>{currentUI === 'UI15' ? 'Hàng đợi tiếp nhận (L, -u, t)' : `Chi tiết hàng đợi • ${activeCase.id}`}</Text>
            {cases.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => { setActiveCaseId(item.id); navigate(currentUI === 'UI15' ? 'UI16' : 'UI18'); }}
              >
                <Text style={styles.cardTitle}>{item.patientId} • Mức {item.confirmedLevel || item.proposedLevel}</Text>
                <Text style={styles.subText}>{item.age} tuổi • Chờ {item.waitMinutes} phút • {item.aiLabel}</Text>
              </TouchableOpacity>
            ))}
            {currentUI === 'UI16' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => navigate('UI07')}>
                <Text style={styles.btnPrimaryText}>Gọi người bệnh / Tái đánh giá (UI07)</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'UI17':
      case 'UI18':
        return (
          <View style={styles.section}>
            <Text style={styles.h1}>{currentUI === 'UI17' ? 'Lịch sử sàng lọc' : `Hồ sơ sàng lọc • ${activeCase.id}`}</Text>
            {cases.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => { setActiveCaseId(item.id); setCurrentUI('UI18'); }}
              >
                <Text style={styles.cardTitle}>{item.id} ({item.patientId})</Text>
                <Text style={styles.subText}>{item.aiLabel} • Mức {item.confirmedLevel || item.proposedLevel} • Phiên bản v{item.version}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return (
          <View style={styles.section}>
            <Text style={styles.h1}>{currentUI} • Vận hành & Quản trị</Text>
            <Text style={styles.subText}>{username} • Cơ sở {facilityCode}</Text>
            <TouchableOpacity style={styles.card} onPress={() => navigate('UI19')}>
              <Text style={styles.cardTitle}>UI19 • Đồng bộ dữ liệu ngoại tuyến</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigate('UI20')}>
              <Text style={styles.cardTitle}>UI20 • Xử lý xung đột phiên bản (v2 vs v3)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigate('UI22')}>
              <Text style={styles.cardTitle}>UI22 • Cấu hình sàng lọc (τTB = {tauTB}, θ = {theta})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigate('UI23')}>
              <Text style={styles.cardTitle}>UI23 • Quản lý người dùng của cơ sở</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigate('UI24')}>
              <Text style={styles.cardTitle}>UI24 • Nhật ký và kiểm soát chất lượng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => setCurrentUI('UI01')}>
              <Text style={styles.btnOutlineText}>Đăng xuất và khóa dữ liệu</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.topUtilityRow}>
        <Text style={styles.uiPill}>{currentUI}</Text>
        <TouchableOpacity style={styles.quickBtn} onPress={() => setDrawerVisible(true)}>
          <Text style={styles.quickBtnText}>⚙️ Chọn nhanh 24 màn hình (UI01–UI24)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderScreen()}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { id: 'UI02', label: 'Tổng quan' },
          { id: 'UI15', label: 'Hàng đợi' },
          { id: 'UI17', label: 'Hồ sơ' },
          { id: 'UI21', label: 'Tài khoản' }
        ].map(tab => (
          <TouchableOpacity key={tab.id} style={styles.navItem} onPress={() => setCurrentUI(tab.id)}>
            <Text style={[styles.navText, currentUI === tab.id && styles.navTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={drawerVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.h2}>Chuyển nhanh 24 màn hình (UI01 – UI24)</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {Array.from({ length: 24 }, (_, i) => `UI${String(i + 1).padStart(2, '0')}`).map(code => (
                <TouchableOpacity
                  key={code}
                  style={styles.drawerRow}
                  onPress={() => { setCurrentUI(code); setDrawerVisible(false); }}
                >
                  <Text style={styles.cardTitle}>{code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setDrawerVisible(false)}>
              <Text style={styles.btnPrimaryText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  topUtilityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  uiPill: { backgroundColor: '#ccfbf1', color: '#115e59', fontWeight: '700', fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  quickBtn: { backgroundColor: '#f0fdfa', borderColor: '#99f6e4', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
  quickBtnText: { color: '#0f766e', fontSize: 11, fontWeight: '700' },
  scrollContent: { padding: 18, paddingBottom: 96 },
  section: { gap: 12 },
  brandTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  h1: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  h2: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 6 },
  subText: { fontSize: 12, color: '#64748b' },
  bodyText: { fontSize: 14, color: '#1e293b', fontWeight: '500' },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginTop: 4 },
  input: { backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, fontWeight: '600', color: '#0f172a' },
  btnPrimary: { backgroundColor: '#0d746e', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  btnPrimaryText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  btnOutline: { backgroundColor: '#ffffff', borderColor: '#0d746e', borderWidth: 1.5, borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  btnOutlineText: { color: '#0d746e', fontWeight: '700', fontSize: 15 },
  badgeGreen: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderWidth: 1, padding: 11, borderRadius: 12 },
  badgeGreenText: { color: '#065f46', fontWeight: '700', fontSize: 12 },
  badgeOrange: { backgroundColor: '#fff7ed', borderColor: '#fed7aa', borderWidth: 1, padding: 12, borderRadius: 12 },
  badgeOrangeText: { color: '#9a3412', fontWeight: '700', fontSize: 12 },
  badgeBlue: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1, padding: 12, borderRadius: 12 },
  badgeBlueText: { color: '#1e40af', fontWeight: '700', fontSize: 12 },
  grid2: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderColor: '#dbe3ec', borderWidth: 1.5, borderRadius: 16, padding: 14 },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#0d746e' },
  card: { backgroundColor: '#ffffff', borderColor: '#dbe3ec', borderWidth: 1.5, borderRadius: 16, padding: 14, gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  xrayPlaceholder: { height: 220, backgroundColor: '#0f172a', borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 16 },
  xrayPlaceholderText: { color: '#5eead4', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTopColor: '#e2e8f0', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  navItem: { paddingHorizontal: 12, paddingVertical: 4 },
  navText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  navTextActive: { color: '#0d746e', fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 },
  drawerRow: { paddingVertical: 10, borderBottomColor: '#f1f5f9', borderBottomWidth: 1 }
});
