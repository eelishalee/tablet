import { useState, useEffect, useRef } from 'react'
import { 
  Send, Mic, Upload, Activity, Anchor, Radio, Clipboard, Shield, Pill, 
  History, Camera, AlertTriangle, CheckCircle, Info, ChevronRight, 
  User, Settings, LogOut, Plus, Trash2, Edit3, Heart, Thermometer, 
  Droplets, Wind, Timer, Navigation, Ship, Database, Wifi, WifiOff, Search
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// --- Mock Data & Constants ---
const SHIP_INFO = {
  name: '해신-호 (HAESIN-07)',
  type: '컨테이너선 (14,000 TEU)',
  id: 'IMO 9876543',
  status: '항해 중 (북태평양)'
}

const INITIAL_CREW = Array.from({ length: 26 }, (_, i) => ({
  id: `CREW-${100 + i}`,
  name: [`김선장`, `이갑판`, `박기관`, `정통신`, `최조리`, `강항해`, `윤보급`, `임안전`, `한앵커`, `오레이더`, `조소나`, `배엔진`, `고갑판`, `문해역`, `송나침`, `양프로`, `백키`, `권로그`, `황비콘`, `서구명`, `어그물`, `남항구`, `유파도`, `심해안`, `노부표`, `장윈치`][i] || `선원-${i+1}`,
  role: ['선장', '일등항해사', '기관장', '통신장', '조리장', '조타수', '갑판원'][i % 7],
  age: 30 + (i % 25),
  blood: ['A+', 'B+', 'O+', 'AB+'][i % 4],
  history: i === 0 ? '고혈압 (2022~), 알레르기 없음' : '특이사항 없음',
  status: '건강'
}))

// --- MEWS Scoring Logic ---
function calculateMEWS(hr, rr, sbp, bt) {
  let score = 0;
  if (hr <= 40 || hr >= 130) score += 3;
  else if (hr >= 111 || hr <= 50) score += 2;
  else if (hr >= 101 || hr <= 41) score += 1;
  if (rr >= 30 || rr < 9) score += 3;
  else if (rr >= 21 || rr <= 14) score += 2;
  const bpValue = parseInt(sbp);
  if (bpValue <= 70) score += 3;
  else if (bpValue <= 80 || bpValue >= 200) score += 2;
  else if (bpValue <= 100) score += 1;
  const temp = parseFloat(bt);
  if (temp < 35 || temp >= 38.5) score += 2;
  return score;
}

export default function Main() {
  const [view, setView] = useState('login') // login, dashboard, crew, settings
  const [isOnline, setIsOnline] = useState(true)
  const [crewList, setCrewList] = useState(INITIAL_CREW)
  const [activePatient, setActivePatient] = useState(INITIAL_CREW[0])
  const [activeTab, setActiveTab] = useState('DASHBOARD')
  const [mews, setMews] = useState(0)
  
  // Login States
  const [loginData, setLoginData] = useState({ serial: '', device: '', ship: '' })

  // Dashboard States
  const [hr, setHr] = useState(82)
  const [spo2, setSpo2] = useState(98)
  const [rr, setRr] = useState(16)
  const [bp, setBp] = useState('128/84')
  const [bt, setBt] = useState('36.7')
  const [history, setHistory] = useState(Array.from({ length: 30 }, (_, i) => ({ t: i, v: 80 + Math.random()*10 })))
  
  const [activeEmergencyGuide, setActiveEmergencyGuide] = useState(null) // null, 'CARDIAC', 'TRAUMA', 'RESP'
  const [expandedSection, setExpandedSection] = useState(null) // null, 'HISTORY', 'LOG', 'TRANSFER'
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useState([{ role: 'ai', text: 'MDTS 엣지 AI가 활성화되었습니다. 환자의 상태를 실시간 분석 중입니다.' }])
  const [crewSearch, setCrewSearch] = useState('')
  const [crewRoleTab, setCrewRoleTab] = useState('전체')
  
  // Modal States
  const [showModal, setShowModal] = useState(null) // 'create', 'edit', 'delete'
  const [selectedCrew, setSelectedCrew] = useState(null)

  const roles = ['전체', '선장/항해사', '기관부', '통신/보급', '조리/기타']
  const filteredCrew = crewList.filter(c => {
    const matchesSearch = c.name.includes(crewSearch) || c.id.includes(crewSearch)
    if (crewRoleTab === '전체') return matchesSearch
    if (crewRoleTab === '선장/항해사') return matchesSearch && (c.role.includes('선장') || c.role.includes('항해사'))
    if (crewRoleTab === '기관부') return matchesSearch && (c.role.includes('기관'))
    if (crewRoleTab === '통신/보급') return matchesSearch && (c.role.includes('통신') || c.role.includes('보급'))
    return matchesSearch && (c.role.includes('조리') || c.role.includes('갑판') || c.role.includes('안전'))
  })


  // Realtime Simulation
  useEffect(() => {
    if (view === 'dashboard') {
      const interval = setInterval(() => {
        setHr(h => h + Math.round((Math.random()-0.5)*4))
        setSpo2(s => Math.min(100, Math.max(90, s + Math.round((Math.random()-0.5)*1))))
        setRr(r => Math.min(30, Math.max(12, r + Math.round((Math.random()-0.5)*2))))
        setHistory(prev => [...prev.slice(1), { t: Date.now(), v: hr }])
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [view, hr])

  useEffect(() => {
    setMews(calculateMEWS(hr, rr, bp.split('/')[0], bt))
  }, [hr, rr, bp, bt])

  const handleLogin = (e) => {
    e.preventDefault()
    setView('dashboard')
  }

  const switchPatient = (crew) => {
    setActivePatient(crew)
    setView('dashboard')
    setActiveTab('DASHBOARD')
    setChat([{ role: 'ai', text: `${crew.name} ${crew.role} 환자로 전환되었습니다. 과거 이력을 로드합니다.` }])
  }

  const startEmergencyAction = (type) => {
    setActiveEmergencyGuide(type)
    setActiveTab('GUIDE')
  }

  const handlePromptAnalysis = () => {
    if (!prompt.trim()) return;
    const newChat = [...chat, { role: 'user', text: prompt }];
    setChat(newChat);
    const userInput = prompt.toLowerCase();
    setPrompt('');

    setTimeout(() => {
      let aiResponse = '입력하신 내용을 분석 중입니다. 증상을 좀 더 구체적으로 말씀해 주시면 정확한 분석이 가능합니다.';
      if (userInput.includes('아프') || userInput.includes('통증') || userInput.includes('결려')) {
        aiResponse = '흉부 및 복부 통증은 심혈관 질환의 전조 증상일 수 있습니다. 현재 바이탈은 안정적이나, 통증이 지속될 경우 즉시 안정을 취하고 산소 공급을 준비하십시오.';
      } else if (userInput.includes('피') || userInput.includes('다치') || userInput.includes('베였')) {
        aiResponse = '출혈이 감지되었습니다. 상처 부위를 압박하여 지혈하고, AI 외상 분석을 위해 환부를 촬영해 주십시오. 필요 시 즉시 원격 의료진을 호출합니다.';
      } else if (userInput.includes('어지럽') || userInput.includes('쓰러')) {
        aiResponse = '의식 저하 가능성이 있습니다. 기도를 확보하고 환자를 눕힌 후 발을 높게 유지하십시오. MEWS 위험도를 모니터링합니다.';
      }
      setChat([...newChat, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  // --- Views ---
  
  if (view === 'login') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#fff', fontFamily: 'Pretendard', fontSize: '112%' }}>
        <div style={{ width: 450, padding: 45, background: '#0f172a', borderRadius: 27, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg, #38bdf8, #2dd4bf)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Anchor size={36} color="#000" />
            </div>
          </div>
          <h1 style={{ fontSize: 27, fontWeight: 900, marginBottom: 9 }}>MEDITISING <span style={{ color: '#38bdf8' }}>MDTS</span></h1>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36 }}>선박 탑재형 엣지 AI 의료 지원 시스템</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <LoginInput icon={<Database size={18}/>} placeholder="시리얼 넘버 (Serial Number)" value={loginData.serial} onChange={v => setLoginData({...loginData, serial: v})} />
            <LoginInput icon={<Settings size={18}/>} placeholder="기기 번호 (Device Number)" value={loginData.device} onChange={v => setLoginData({...loginData, device: v})} />
            <LoginInput icon={<Ship size={18}/>} placeholder="선박 번호 (Ship Number)" value={loginData.ship} onChange={v => setLoginData({...loginData, ship: v})} />
            <button type="submit" style={{ marginTop: 14, padding: '18px', borderRadius: 14, background: '#38bdf8', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', transition: '0.2s', fontSize: 16 }}>
              시스템 접속
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', background: '#020408', color: '#e2e8f0', fontFamily: 'Pretendard', fontSize: '125.44%' }}>
      
      {/* --- Top Status Bar & Navigation --- */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 27px', height: 80, display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Anchor size={26} color="#38bdf8" />
          <span style={{ fontWeight: 900, fontSize: 22 }}>MDTS <span style={{ color: '#38bdf8', fontWeight: 400 }}>엣지 AI</span></span>
        </div>

        <nav style={{ display: 'flex', gap: 8, height: '100%' }}>
          <NavTab label="종합 대시보드" active={activeTab === 'DASHBOARD'} onClick={() => { setActiveTab('DASHBOARD'); setView('dashboard') }} />
          <NavTab label="선원 정보 관리" active={activeTab === 'CREW'} onClick={() => { setActiveTab('CREW'); setView('crew') }} />
          <NavTab label="처치 가이드" active={activeTab === 'GUIDE'} onClick={() => { setActiveTab('GUIDE'); setView('dashboard') }} />
          <NavTab label="시스템 설정" active={activeTab === 'SETTINGS'} onClick={() => { setActiveTab('SETTINGS'); setView('settings') }} />
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 18px', borderRadius: 22, background: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
            {isOnline ? <Wifi size={18} color="#2dd4bf" /> : <WifiOff size={18} color="#fb7185" />}
            <span style={{ fontWeight: 700, color: isOnline ? '#2dd4bf' : '#fb7185' }}>{isOnline ? 'ON LINE' : 'OFF LINE'}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{SHIP_INFO.name}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{SHIP_INFO.status}</div>
          </div>
          <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><LogOut size={24} /></button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {view === 'dashboard' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 440px', overflow: 'hidden' }}>
            
            {/* [Left] Patient Permanent Info */}
            <aside style={{ 
              borderRight: '1px solid rgba(255,255,255,0.05)', 
              background: '#05070a',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Scrollable Content Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '36px 28px' }}>
                {/* Patient Profile Box */}
                <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 24, padding: 30, marginBottom: 40 }}>
                  <div style={{ display: 'flex', gap: 27, marginBottom: 36 }}>
                    <div style={{ width: 110, height: 110, borderRadius: 27, background: '#1e293b', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 24px rgba(56,189,248,0.2)' }}>
                      <User size={68} color="#38bdf8" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: 37, fontWeight: 950, marginBottom: 6, letterSpacing: '-0.6px' }}>{activePatient.name}</div>
                      <div style={{ fontSize: 23, color: '#38bdf8', fontWeight: 800, marginBottom: 6 }}>{activePatient.role}</div>
                      <div style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>(ID: {activePatient.id})</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                    <InfoItem label="나이/성별" value={`${activePatient.age}세 / 남`} size="xl_max" />
                    <InfoItem label="혈액형" value={activePatient.blood} size="xl_max" />
                    <div style={{ gridColumn: 'span 2', marginTop: 16 }}>
                      <div style={{ fontSize: 15, color: '#64748b', marginBottom: 10, fontWeight: 700 }}>과거력 (Past History)</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.5 }}>{activePatient.history || '고혈압 (2022~), 알레르기 없음'}</div>
                    </div>
                  </div>
                </div>

                {/* Emergency History & Data - Always Expanded */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 21, fontWeight: 800 }}>
                      <History size={26}/> 최근 진료 이력
                    </div>
                    <div style={{ padding: '22px', background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)', fontSize: 20, color: '#94a3b8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontWeight: 800, color: '#38bdf8' }}>2026-03-15</span>
                        <span>단순 감기</span>
                      </div>
                      <div style={{ lineHeight: 1.6 }}>- 처방: 타이레놀 500mg <br/>- 특이사항: 알레르기 반응 없음</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 21, fontWeight: 800 }}>
                      <Droplets size={26}/> 투약/처치 로그
                    </div>
                    <div style={{ padding: '22px', background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)', fontSize: 20, color: '#94a3b8' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ padding: '4px 12px', borderRadius: 6, background: '#38bdf830', color: '#38bdf8', fontSize: 16, fontWeight: 900 }}>14:10</span>
                        <span style={{ fontWeight: 800, color: '#e2e8f0' }}>아스피린 300mg 투여</span>
                      </div>
                      <div style={{ lineHeight: 1.6 }}>처치자: 이갑판 (일등항해사)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2dd4bf', fontSize: 21, fontWeight: 800 }}>
                      <Upload size={26}/> 데이터 전송 상태
                    </div>
                    <div style={{ padding: '22px', background: 'rgba(45, 212, 191, 0.05)', borderRadius: 18, border: '1px solid rgba(45, 212, 191, 0.1)', fontSize: 20, color: '#2dd4bf' }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>육상 의료 센터 동기화</div>
                      <div style={{ lineHeight: 1.6 }}>- 바이탈 데이터 전송 완료 <br/>- 처치 로그 전송 완료 (14:12)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Button Area */}
              <div style={{ padding: '20px 28px 40px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#05070a', zIndex: 10 }}>
                <button 
                  onClick={() => startEmergencyAction('CARDIAC')}
                  className="emergency-action-btn"
                  style={{ 
                    width: '100%', padding: '27px', borderRadius: 22, 
                    background: '#f43f5e', color: '#fff', border: 'none', 
                    fontWeight: 900, cursor: 'pointer', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', gap: 16, 
                    fontSize: 23, transition: '0.2s'
                  }}
                >
                  <AlertTriangle size={32} /> 응급 처치 액션 시작
                </button>
              </div>
            </aside>

            {/* [Center] Vitals, Timeline, Chat */}
            <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Center Vitals Row */}
              <div style={{ padding: '32px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
                <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Activity size={24} color="#38bdf8" />
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#38bdf8', letterSpacing: '1px' }}>VITAL SENSOR REAL-TIME MONITORING</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
                  <DashboardVital label="심박수 (실시간)" value={hr} unit="bpm" color="#fb7185" />
                  <DashboardVital label="산소포화도 (실시간)" value={spo2} unit="%" color="#38bdf8" />
                  <DashboardVital label="호흡수 (실시간)" value={rr} unit="/min" color="#2dd4bf" />
                  <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#e2e8f0" editable onEdit={() => {}} />
                  <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#fbbf24" editable onEdit={() => {}} />
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 45 }}>
                {activeTab === 'DASHBOARD' && (
                  <div style={{ display: 'grid', gap: 45 }}>
                    <div>
                      <SectionTitle label="처치 및 상태 변화 타임라인" />
                      <div style={{ position: 'relative', paddingLeft: 45 }}>
                        <div style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 3, background: 'rgba(255,255,255,0.05)' }} />
                        <TimelineItem time="14:02" label="현장 도착 및 바이탈 측정 시작" detail="환자 의식 명료, 흉부 통증 호소" />
                        <TimelineItem time="14:05" label="AI 분석: 심근경색(STEMI) 의심" detail="엣지 AI가 ECG 데이터 기반 고위험도 판정" highlight />
                        <TimelineItem time="14:10" label="아스피린 300mg 설하 투여" detail="처치자: 이갑판" />
                      </div>
                    </div>
                    
                    <div style={{ height: 250, background: 'rgba(56,189,248,0.02)', borderRadius: 27, padding: 32, border: '1px solid rgba(56,189,248,0.1)' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                          <Area type="monotone" dataKey="v" stroke="#38bdf8" fill="rgba(56,189,248,0.1)" isAnimationActive={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'GUIDE' && (
                  <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                      <h2 style={{ fontSize: 32, fontWeight: 900 }}>증상별 응급 처치 가이드</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: 'rgba(251,113,133,0.1)', borderRadius: 18, border: '1px solid rgba(251,113,133,0.2)' }}>
                        <Timer size={24} color="#fb7185" />
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#fb7185' }}>골든타임: 42:15</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 18, marginBottom: 45 }}>
                      <SymptomTab label="흉통/심정지" active onClick={() => setActiveEmergencyGuide('CARDIAC')} />
                      <SymptomTab label="중증 외상/출혈" onClick={() => setActiveEmergencyGuide('TRAUMA')} />
                      <SymptomTab label="의식 저하" onClick={() => setActiveEmergencyGuide('UNCONSCIOUS')} />
                      <SymptomTab label="호흡 곤란" onClick={() => setActiveEmergencyGuide('RESPIRATORY')} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 45 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <StepItem num="1" title="의식 확인 및 도움 요청" desc="환자의 어깨를 가볍게 두드리며 의식을 확인하고 주변에 도움을 요청하십시오." />
                        <StepItem num="2" title="흉부 압박 시행" desc="분당 100~120회의 속도로 5cm 깊이로 강하고 빠르게 압박하십시오." active />
                        <StepItem num="3" title="AED 사용" desc="자동심장충격기가 도착하면 안내 음성에 따라 패드를 부착하십시오." />
                      </div>
                      <div style={{ background: 'rgba(56,189,248,0.05)', borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56,189,248,0.1)', minHeight: 300 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ width: 180, height: 180, borderRadius: '50%', border: '6px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, animation: 'pulse 1.5s infinite' }}>
                            <Heart size={80} color="#38bdf8" />
                          </div>
                          <div style={{ fontSize: 18, color: '#38bdf8', fontWeight: 700 }}>CPR 애니메이션 가이드</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Center Bottom Chat Bar */}
              <div style={{ padding: '0 45px 60px 45px', background: 'transparent', position: 'relative', marginTop: -40, zIndex: 10 }}>
                <div style={{ 
                  display: 'flex', gap: 18, background: 'rgba(15, 23, 42, 0.95)', 
                  borderRadius: 27, padding: '18px 22px', border: '1px solid rgba(56,189,248,0.4)',
                  boxShadow: '0 0 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(15px)'
                }}>
                  <button style={{ width: 64, height: 64, borderRadius: 20, background: '#1e293b', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Mic size={32} color="#38bdf8" /></button>
                  <input 
                    placeholder="환자 증상 입력 또는 AI 의료 어시스턴트에게 질문하기..." 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                    style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 20, outline: 'none' }}
                  />
                  <button 
                    onClick={handlePromptAnalysis}
                    style={{ padding: '0 40px', borderRadius: 20, background: '#38bdf8', color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: 20 }}
                  >
                    분석 실행
                  </button>
                </div>
              </div>
            </section>

            {/* [Right] AI Assistant Panel */}
            <aside style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#080b12' }}>
              <div style={{ padding: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Activity size={22} color="#38bdf8" /> MDTS AI 의료 어시스턴트
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Edge-AI Diagnostic Center</div>
                </div>
                <div style={{ padding: '6px 14px', borderRadius: 9, background: mews >= 3 ? '#fb718520' : '#2dd4bf20', color: mews >= 3 ? '#fb7185' : '#2dd4bf', fontSize: 13, fontWeight: 800 }}>
                  위험도(MEWS): {mews}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 27, display: 'flex', flexDirection: 'column', gap: 22 }}>
                {chat.map((m, i) => (
                  <div key={i} style={{ 
                    padding: 22, borderRadius: 22, 
                    background: m.role === 'ai' ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${m.role === 'ai' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                    maxWidth: '100%'
                  }}>
                    {m.role === 'ai' && <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', marginBottom: 9 }}>AI 어시스턴트</div>}
                    <div style={{ fontSize: 16, lineHeight: 1.6 }}>{m.text}</div>
                  </div>
                ))}
                <div style={{ fontSize: 14, color: '#475569', textAlign: 'center', marginTop: 10, fontStyle: 'italic', lineHeight: 1.6 }}>
                  "환자가 흉통을 호소합니다. 어떻게 해야 하나요?" <br/>
                  "현재 혈압 140/90, 심박수 110입니다. 위험한가요?"
                </div>
              </div>
              <div style={{ padding: 27, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 18, background: '#0a0f1d' }}>
                <button 
                  onClick={() => {
                    setView('dashboard')
                    setActiveTab('DASHBOARD')
                    setChat(prev => [...prev, { role: 'ai', text: '외상 이미지 분석을 시작합니다... [MobileNet V3 활성]' }])
                    setTimeout(() => {
                      setChat(prev => [...prev, { role: 'ai', text: '분석 완료: 중증 열상(Laceration)이 감지되었습니다. 즉시 지혈 처치 가이드를 확인하십시오.' }])
                      setActiveEmergencyGuide('TRAUMA')
                      setActiveTab('GUIDE')
                    }, 2000)
                  }}
                  style={{ 
                    padding: '28px', borderRadius: 24, 
                    background: '#38bdf8', color: '#000',
                    border: 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  <Camera size={48} strokeWidth={1.5} />
                  <span style={{ fontSize: 22, fontWeight: 900 }}>외상 촬영 & AI 분석</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {view === 'crew' && (
          <div style={{ flex: 1, padding: 45, overflowY: 'auto', background: '#05070a' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ marginBottom: 45 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 27 }}>선원 정보 관리 <span style={{ color: '#64748b', fontSize: 20, marginLeft: 14 }}>전체 {crewList.length}명</span></h1>
                
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: '0 27px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 25px rgba(0,0,0,0.2)' }}>
                    <Search size={28} color="#38bdf8" />
                    <input 
                      placeholder="이름 또는 사번으로 선원 검색..." 
                      value={crewSearch}
                      onChange={e => setCrewSearch(e.target.value)}
                      style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 20, height: 80, outline: 'none' }} 
                    />
                  </div>
                  <button 
                    onClick={() => { setShowModal('create'); setSelectedCrew({ id: `CREW-${100 + crewList.length}`, name: '', role: '선원', age: '', blood: 'A+', history: '', status: '건강' }) }}
                    style={{ height: 80, background: '#38bdf8', color: '#000', border: 'none', borderRadius: 20, padding: '0 40px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontSize: 20 }}
                  >
                    <Plus size={28} /> 신규 등록
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 14 }}>
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => setCrewRoleTab(role)}
                    style={{
                      flex: 1,
                      padding: '12px 10px', borderRadius: 14, border: 'none',
                      background: crewRoleTab === role ? '#38bdf8' : 'transparent',
                      color: crewRoleTab === role ? '#000' : '#64748b',
                      fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: '0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              
              <div style={{ background: '#0f172a', borderRadius: 27, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 12px 50px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', color: '#64748b', fontSize: 16, fontWeight: 800 }}>
                      <th style={{ padding: '27px' }}>사번 (ID)</th>
                      <th style={{ padding: '27px' }}>선원명</th>
                      <th style={{ padding: '27px' }}>직책</th>
                      <th style={{ padding: '27px' }}>나이</th>
                      <th style={{ padding: '27px' }}>혈액형</th>
                      <th style={{ padding: '27px' }}>상태</th>
                      <th style={{ padding: '27px', textAlign: 'right' }}>환자 전환 및 상세 관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrew.map((crew, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: '0.2s', background: activePatient.id === crew.id ? 'rgba(56,189,248,0.05)' : 'transparent' }}>
                        <td style={{ padding: '27px', color: '#38bdf8', fontWeight: 800 }}>{crew.id}</td>
                        <td style={{ padding: '27px', fontWeight: 700, fontSize: 18 }}>{crew.name}</td>
                        <td style={{ padding: '27px', color: '#94a3b8' }}>{crew.role}</td>
                        <td style={{ padding: '27px' }}>{crew.age}세</td>
                        <td style={{ padding: '27px' }}>{crew.blood}</td>
                        <td style={{ padding: '27px' }}>
                          <span style={{ padding: '8px 14px', borderRadius: 9, background: '#2dd4bf20', color: '#2dd4bf', fontSize: 14, fontWeight: 800 }}>{crew.status}</span>
                        </td>
                        <td style={{ padding: '27px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 32, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button 
                              onClick={() => switchPatient(crew)}
                              style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}
                            >
                              환자 전환
                            </button>
                            <div style={{ display: 'flex', gap: 14 }}>
                              <button 
                                onClick={() => { setShowModal('edit'); setSelectedCrew(crew) }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                              >
                                <Edit3 size={24}/>
                              </button>
                              <button 
                                onClick={() => { setShowModal('delete'); setSelectedCrew(crew) }}
                                style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}
                              >
                                <Trash2 size={24}/>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- Global Modal UI --- */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: '#0f172a', width: '100%', maxWidth: (showModal === 'delete' ? 450 : 600), borderRadius: 27, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              
              <div style={{ padding: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ fontSize: 22, fontWeight: 900 }}>
                  {showModal === 'create' && '신규 선원 등록'}
                  {showModal === 'edit' && '선원 정보 수정'}
                  {showModal === 'delete' && '선원 삭제 확인'}
                </h2>
                <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                </button>
              </div>

              <div style={{ padding: 32 }}>
                {showModal === 'delete' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(251,113,133,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <AlertTriangle size={36} color="#fb7185" />
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>선원 정보를 삭제하시겠습니까?</p>
                    <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>삭제된 데이터는 복구할 수 없습니다. <br/>(<span style={{ color: '#fff' }}>{selectedCrew?.name} / {selectedCrew?.role}</span>)</p>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <button onClick={() => setShowModal(null)} style={{ flex: 1, padding: 18, borderRadius: 14, background: '#1e293b', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>취소</button>
                      <button onClick={() => { setCrewList(prev => prev.filter(c => c.id !== selectedCrew.id)); setShowModal(null) }} style={{ flex: 1, padding: 18, borderRadius: 14, background: '#fb7185', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>삭제 실행</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ModalField label="선원 이름" value={selectedCrew?.name} onChange={v => setSelectedCrew({...selectedCrew, name: v})} placeholder="성함 입력" />
                      <ModalField label="사번 (ID)" value={selectedCrew?.id} readOnly />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ModalField label="직책" value={selectedCrew?.role} onChange={v => setSelectedCrew({...selectedCrew, role: v})} placeholder="직책 입력 (예: 선장)" />
                      <ModalField label="나이" value={selectedCrew?.age} onChange={v => setSelectedCrew({...selectedCrew, age: v})} placeholder="숫자만 입력" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ModalField label="혈액형" value={selectedCrew?.blood} onChange={v => setSelectedCrew({...selectedCrew, blood: v})} placeholder="예: A+" />
                      <ModalField label="현재 상태" value={selectedCrew?.status} onChange={v => setSelectedCrew({...selectedCrew, status: v})} placeholder="예: 건강" />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8, fontWeight: 700 }}>과거력 (Past History)</label>
                      <textarea 
                        value={selectedCrew?.history}
                        onChange={e => setSelectedCrew({...selectedCrew, history: e.target.value})}
                        placeholder="특이사항 및 지병 입력"
                        style={{ width: '100%', height: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#fff', outline: 'none', fontSize: 15 }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (showModal === 'create') setCrewList([selectedCrew, ...crewList])
                        else setCrewList(crewList.map(c => c.id === selectedCrew.id ? selectedCrew : c))
                        setShowModal(null)
                      }}
                      style={{ marginTop: 12, padding: 20, borderRadius: 14, background: '#38bdf8', color: '#000', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: 18 }}
                    >
                      {showModal === 'create' ? '신규 등록 완료' : '정보 수정 저장'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div style={{ flex: 1, padding: 45, background: '#05070a', overflowY: 'auto' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>시스템 설정 및 관리</h1>
              <div style={{ display: 'grid', gap: 32 }}>
                <SettingCard icon={<Ship size={28}/>} title="선박 정보 관리" desc="시스템이 설치된 선박의 정보를 관리하고 수정합니다.">
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <input placeholder="선박명" defaultValue={SHIP_INFO.name} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                      <input placeholder="선박 종류" defaultValue={SHIP_INFO.type} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
                      <button style={{ padding: '10px 20px', borderRadius: 10, background: '#38bdf8', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>정보 수정</button>
                      <button style={{ padding: '10px 20px', borderRadius: 10, background: '#fb7185', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>선박 삭제</button>
                    </div>
                  </div>
                </SettingCard>
                
                <SettingCard icon={<Database size={28}/>} title="데이터 동기화 설정" desc="클라우드 센터와의 실시간 데이터 동기화 상태를 관리합니다.">
                  <div style={{ marginTop: 20, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ color: '#94a3b8' }}>마지막 동기화 시각</span>
                      <span style={{ fontWeight: 800 }}>2026-04-09 14:30:15</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>동기화 대기 항목</span>
                      <span style={{ color: '#38bdf8', fontWeight: 800 }}>0건 (완료)</span>
                    </div>
                    <button style={{ width: '100%', marginTop: 20, padding: 14, borderRadius: 12, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)', fontWeight: 800, cursor: 'pointer' }}>지금 즉시 동기화</button>
                  </div>
                </SettingCard>

                <SettingCard icon={<Shield size={28}/>} title="AI 모델 업데이트" desc="최신 Edge AI 모델 엔진 상태를 점검합니다.">
                  <div style={{ marginTop: 20, padding: 20, background: 'rgba(45, 212, 191, 0.05)', borderRadius: 18, border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <CheckCircle size={24} color="#2dd4bf" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#2dd4bf' }}>최신 버전 사용 중</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Engine: MobileNet V3.5-Turbo (Updated: 2026-04-01)</div>
                      </div>
                    </div>
                  </div>
                </SettingCard>
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .emergency-action-btn:hover { background: #e11d48 !important; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}

// --- Helper Components ---

function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      background: 'none', border: 'none', padding: '0 24px', height: '100%',
      color: active ? '#38bdf8' : '#64748b', fontSize: 16, fontWeight: 800,
      borderBottom: `4px solid ${active ? '#38bdf8' : 'transparent'}`,
      cursor: 'pointer', transition: '0.2s'
    }}>{label}</button>
  )
}

function DashboardVital({ label, value, unit, color, editable, onEdit }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: '24px 14px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative' }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: '#64748b', marginBottom: 12 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 950, color }}>{value}</span>
        <span style={{ fontSize: 20, color: '#64748b', fontWeight: 700 }}>{unit}</span>
      </div>
      {editable && (
        <button onClick={onEdit} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          <Edit3 size={18} />
        </button>
      )}
    </div>
  )
}

function TimelineItem({ time, label, detail, highlight }) {
  return (
    <div style={{ marginBottom: 48, position: 'relative' }}>
      <div style={{ position: 'absolute', left: -46, top: 14, width: 22, height: 22, borderRadius: '50%', background: highlight ? '#f43f5e' : '#38bdf8', boxShadow: highlight ? '0 0 25px #f43f5e' : '0 0 15px rgba(56,189,248,0.4)' }} />
      <div style={{ fontSize: 18.5, color: '#64748b', marginBottom: 10, fontWeight: 700 }}>{time}</div>
      <div style={{ fontSize: 29, fontWeight: 950, color: highlight ? '#fb7185' : '#e2e8f0', letterSpacing: '-0.8px', lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 24, color: '#94a3b8', marginTop: 14, lineHeight: 1.6 }}>{detail}</div>
    </div>
  )
}

function StepItem({ num, title, desc, active }) {
  return (
    <div style={{ display: 'flex', gap: 20, padding: 20, borderRadius: 20, background: active ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${active ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: active ? '#38bdf8' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: active ? '#000' : '#64748b' }}>{num}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: active ? '#38bdf8' : '#fff' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}

function SymptomTab({ label, active }) {
  return (
    <button style={{ 
      padding: '12px 24px', borderRadius: 12, border: 'none',
      background: active ? '#38bdf8' : 'rgba(255,255,255,0.03)',
      color: active ? '#000' : '#64748b', fontWeight: 800, fontSize: 13, cursor: 'pointer'
    }}>{label}</button>
  )
}

function SectionTitle({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
}

function InfoItem({ label, value, span = 1, size }) {
  const valueSize = size === 'xl_max' ? 28 : (size === 'xl_plus' ? 25 : (size === 'xl' ? 22 : (size === 'large' ? 18 : 13)))
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div style={{ fontSize: 15, color: '#64748b', marginBottom: 6, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: valueSize, fontWeight: 800 }}>{value}</div>
    </div>
  )
}

function ActionBtn({ icon, label, highlight, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', padding: '16px 20px', borderRadius: 14, 
        background: active ? 'rgba(56,189,248,0.15)' : (highlight ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)'), 
        border: `1px solid ${active || highlight ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'}`,
        color: active || highlight ? '#38bdf8' : '#94a3b8', 
        fontSize: 14, fontWeight: 800,
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
        transition: '0.2s',
        boxShadow: active ? '0 4px 12px rgba(56,189,248,0.1)' : 'none'
      }}
    >
      <div style={{ color: active || highlight ? '#38bdf8' : '#64748b' }}>{icon}</div>
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={16} style={{ transform: active ? 'rotate(90deg)' : 'none', transition: '0.2s', opacity: 0.5 }} />
    </button>
  )
}

function LoginInput({ icon, placeholder, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0 16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ color: '#64748b' }}>{icon}</div>
      <input 
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, height: 50, outline: 'none' }} 
      />
    </div>
  )
}

function SettingCard({ icon, title, desc, children }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ color: '#38bdf8' }}>{icon}</div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>{desc}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

function ModalField({ label, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8, fontWeight: 700 }}>{label}</label>
      <input 
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ 
          width: '100%', background: readOnly ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', 
          color: readOnly ? '#475569' : '#fff', outline: 'none', fontSize: 16
        }} 
      />
    </div>
  )
}

function ShipSelect({ label, value, active }) {
  return (
    <div style={{ padding: '12px 20px', borderRadius: 12, background: active ? '#38bdf820' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer' }}>
      <div style={{ fontSize: 10, color: active ? '#38bdf8' : '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: active ? '#38bdf8' : '#fff' }}>{value}</div>
    </div>
  )
}
