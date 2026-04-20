import { useState, useEffect, useRef } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse, ChevronLeft, CheckCircle2, AlertTriangle, ArrowDown, FileText, Ruler, Droplets, MapPin, Phone, Upload, Camera, Edit3, Bone, Flame } from 'lucide-react'
import { CardiacIllustration, TraumaIllustration, UnconsciousIllustration, RespiratoryIllustration } from '../components/EmergencyIllustrations'

const ACTION_GUIDES = {
  '심폐소생술': {
    title: '심폐소생술 및 AED 사용',
    protocol: 'SOP-CPR-01',
    hasMetronome: true,
    steps: [
      { title: '의식 및 호흡 확인', desc: '어깨를 두드리며 "괜찮으세요?"라고 묻고, 가슴이 오르내리는지 10초간 확인하십시오.', tip: '숨을 안 쉬면 즉시 시작합니다.', stepImage: '/assets/CPR1.jpeg' },
      { title: '도움 및 AED 요청', desc: '주변 사람 중 한 명을 지목해 "119 신고"와 "AED(심장충격기)"를 가져와 달라고 지시하십시오.', stepImage: '/assets/CPR2.jpeg' },
      { title: '가슴 압박 시행', desc: '가슴 중앙에 깍지 낀 손을 대고, 팔꿈치를 펴서 수직으로 5~6cm 깊이로 강하게 누르십시오.', tip: '분당 100~120회(초당 2번) 속도를 유지하세요.', stepImage: '/assets/CPR3.jpeg' },
      { title: 'AED 패드 부착', desc: '전원을 켜고 패드 하나는 오른쪽 쇄골 아래, 다른 하나는 왼쪽 옆구리에 붙인 뒤 음성 지시에 따르십시오.', tip: '분석 중에는 환자에게서 떨어지십시오.', stepImage: '/assets/CPR4.jpeg' }
    ],
    dos: ['1초당 2번 속도로 강하게 압박하세요', '압박 후 가슴이 완전히 올라오게 하세요', 'AED의 음성 지시에 따라 행동하십시오'],
    donts: ['환자가 의식이 있다면 하지 마세요', '맥박 확인을 위해 시간을 허비하지 마세요', '압박 중 팔꿈치를 굽히지 마세요'],
    warning: '환자가 스스로 숨을 쉬거나 의료진이 올 때까지 중단하지 마십시오.',
    color: '#ef4444' // Red Group
  },
  '하임리히법': {
    title: '기도 이물질 제거 (하임리히법)',
    protocol: 'SOP-HEI-07',
    steps: [
      { title: '의식 및 상태 확인', desc: '환자 뒤로 가서 말을 걸어보세요. 목을 감싸고 말을 전혀 못 하면 즉시 처치를 시작합니다.', tip: '환자가 기침을 할 수 있다면 계속하게 하세요.', stepImage: '/assets/Heimlich1.jpeg' },
      { title: '자세 잡고 지탱하기', desc: '환자 뒤에 서서 양팔로 허리를 감싸고, 내 한쪽 다리를 환자 다리 사이에 넣어 환자가 쓰러질 때를 대비해 지탱하세요.', stepImage: '/assets/Heimlich2.jpeg' },
      { title: '손 모양과 위치 잡기', desc: '한쪽 주먹의 엄지손가락 쪽 면을 배꼽과 명치 사이에 대고, 다른 손으로 그 주먹을 꽉 움켜쥐십시오.', stepImage: '/assets/Heimlich3.jpeg' },
      { title: '강하게 밀어 올리기', desc: '환자의 배를 안쪽 위 방향(J자 모양)으로 강하게 들어 올리듯 반복해서 당기십시오.', tip: '이물질이 나오거나 환자가 의식을 잃을 때까지 반복하세요.', stepImage: '/assets/Heimlich4.jpeg' }
    ],
    dos: ['이물질이 튀어나올 때까지 최대한 강하게 하세요', '환자가 의식을 잃으면 즉시 바닥에 눕히고 심폐소생술을 시작하세요'],
    donts: ['입안에 이물질이 보이지 않는데 손가락을 넣어 쑤시지 마세요', '임산부는 복부가 아닌 가슴 부위를 압박하세요'],
    warning: '환자가 의식을 잃으면 즉시 기도를 확보하고 심폐소생술(CPR)로 전환하십시오.',
    color: '#ef4444' // Red Group
  },
  '기도 확보': {
    title: '기도 유지 및 호흡 보조',
    protocol: 'SOP-AIR-03',
    steps: [
      { title: '머리 기울이기-턱 올리기', desc: '한 손을 이마에 대고 머리를 뒤로 젖히며, 다른 손가락으로 턱뼈를 들어 올려 기도를 확보하십시오.', stepImage: '/assets/Unconscious1.jpeg' },
      { title: '입안 이물질 제거', desc: '눈에 보이는 구토물이나 이물질이 있다면 머리를 옆으로 돌려 손가락으로 가볍게 제거하십시오.', stepImage: '/assets/Unconscious2.jpeg' },
      { title: '산소 마스크 공급', desc: '산소 마스크를 코와 입에 완전히 밀착시키고, 유량을 15L/min 이상으로 높게 설정하십시오.', stepImage: '/assets/Unconscious3.jpeg' }
    ],
    dos: ['환자가 자가 호흡 중이면 옆으로 눕히세요', '구토 시 즉시 몸 전체를 옆으로 돌리세요'],
    donts: ['의식이 없는 환자에게 물을 먹이지 마세요', '머리 밑에 베개를 넣어 기도를 꺾지 마세요'],
    warning: '호흡음이 거칠거나 청색증이 보이면 즉시 심폐소생술을 준비하십시오.',
    color: '#ef4444' // Red Group
  },
  '지혈/압박': {
    title: '출혈 부위 직접 압박',
    protocol: 'SOP-BLD-02',
    steps: [
      { title: '상처 노출 및 확인', desc: '옷을 가위로 잘라 상처 부위를 완전히 드러내고 정확한 출혈 지점을 확인하십시오.', stepImage: '/assets/Trauma1.jpeg' },
      { title: '직접 압박 시행', desc: '멸균 거즈나 깨끗한 천을 대고 손바닥 전체로 체중을 실어 강하게 누르십시오.', tip: '거즈가 젖어도 떼지 말고 위에 계속 덧대세요.', stepImage: '/assets/Trauma2.jpeg' },
      { title: '지혈대(T-kit) 적용', desc: '대량 출혈이 멈추지 않는 팔/다리 상처 시, 상처 5~10cm 위쪽에 지혈대를 감고 막대를 돌려 고정하십시오.', stepImage: '/assets/Trauma3.jpeg' }
    ],
    dos: ['출혈 부위를 심장보다 높게 유지하세요', '지혈대 사용 시 착용 시각을 환자의 몸에 기록하세요'],
    donts: ['상처에 박힌 칼 등을 억지로 뽑지 마세요', '가루약, 된장 등 이물질을 바르지 마세요'],
    warning: '지혈대는 최후의 수단이며, 한 번 조이면 의료진이 올 때까지 절대 풀지 마십시오.',
    color: '#ff3b5c' // Red Group
  },
  '화상': {
    title: '화상 부위 냉각 및 보호',
    protocol: 'SOP-BRN-08',
    steps: [
      { title: '즉시 흐르는 물 냉각', desc: '흐르는 찬물에 20분 이상 환부의 열을 식히십시오. 얼음물은 피하십시오.', stepImage: '/assets/Burn1.jpeg' },
      { title: '의복 및 장신구 제거', desc: '상처 부위 옷을 가위로 자르고, 부종이 생기기 전 반지나 시계를 신속히 제거하십시오.', tip: '피부에 붙은 옷은 억지로 떼지 마세요.', stepImage: '/assets/Burn2.jpeg' },
      { title: '환부 보호', desc: '연고를 바르지 말고, 깨끗한 거즈나 비닐 랩으로 환부를 느슨하게 덮어 외부 오염을 차단하십시오.', stepImage: '/assets/Burn3.jpeg' }
    ],
    dos: ['물집이 있다면 터뜨리지 말고 보호하세요', '통증이 심하면 시원한 물수건으로 계속 덮으세요'],
    donts: ['얼음을 환부에 직접 대지 마세요', '버터, 치약, 간장 등을 바르는 민간요법은 금물입니다'],
    warning: '안면 화상이나 연기 흡입 시 즉시 산소를 공급하고 호흡을 감시하십시오.',
    color: '#f59e0b' // Orange Group
  },
  '익수 / 저체온': {
    title: '익수자 구조 및 체온 관리',
    protocol: 'SOP-HYP-05',
    steps: [
      { title: '젖은 의복 제거', desc: '바람이 없는 따뜻한 곳으로 이동하고, 젖은 옷을 가위로 잘라 제거한 뒤 마른 수건으로 몸을 닦으십시오.', stepImage: '/assets/Hypothermia1.jpeg' },
      { title: '중심 체온 가온', desc: '담요로 몸을 감싸고, 온팩을 겨드랑이, 사타구니, 목 등 굵은 혈관 부위에 대십시오.', stepImage: '/assets/Hypothermia2.jpeg' },
      { title: '안정 및 수평 이동', desc: '환자를 갑자기 일으키거나 팔다리를 주무르지 마십시오. 차가운 피가 심장으로 흘러가면 위험합니다.', stepImage: '/assets/Hypothermia3.jpeg' }
    ],
    dos: ['의식이 있다면 따뜻하고 단 음료를 주십시오', '환자를 아주 조심스럽게(수평으로) 옮기십시오'],
    donts: ['팔다리를 문지르거나 주무르지 마세요', '뜨거운 물에 환자를 직접 담그지 마세요'],
    warning: '심한 저체온증 환자는 작은 충격에도 심정지가 올 수 있으니 달걀 다루듯 조심하십시오.',
    color: '#f97316' // Orange Group
  },
  '골절 / 탈구': {
    title: '골절 부위 고정 및 보호',
    protocol: 'SOP-FRC-04',
    steps: [
      { title: '골절 부위 안정화', desc: '다친 부위를 고정하고, 환자가 통증을 가장 적게 느끼는 자세를 손으로 받쳐주거나 유지하게 하십시오.', stepImage: '/assets/Fracture1.jpeg' },
      { title: '부목 적용', desc: '나무판자나 종이박스로 다친 관절의 위아래를 포함하도록 대고 끈으로 묶어 고정하십시오.', stepImage: '/assets/Fracture2.jpeg' },
      { title: '말단 순환 확인', desc: '고정 후 손가락이나 발가락 끝을 눌러 혈색이 돌아오는지 확인하고 감각을 체크하십시오.', stepImage: '/assets/Fracture3.jpeg' }
    ],
    dos: ['뼈가 튀어나왔다면 멸균 거즈로 먼저 덮으세요', '환부를 심장보다 높게 올리세요'],
    donts: ['부러진 뼈를 맞추려 하거나 밀어 넣지 마세요', '환자를 일으켜 세우거나 걷게 하지 마세요'],
    warning: '척추 손상이 의심되는 경우 절대로 환자를 움직이지 마십시오.',
    color: '#38bdf8' // Blue Group
  },
  '상처 세척': {
    title: '환부 세척 및 감염 방지',
    protocol: 'SOP-WND-06',
    steps: [
      { title: '이물질 세척', desc: '멸균 식염수나 흐르는 수돗물로 상처 부위의 흙이나 이물질을 충분히 씻어내십시오.', stepImage: '/assets/Wound1.jpeg' },
      { title: '멸균 드레싱', desc: '상처에 달라붙지 않는 멸균 거즈로 덮고, 반창고나 붕대로 고정하십시오.', stepImage: '/assets/Wound2.jpeg' }
    ],
    dos: ['처치 전 위생 장갑을 반드시 착용하세요', '거즈가 없다면 깨끗한 손수건을 사용하세요'],
    donts: ['상처에 솜(탈지면)을 직접 대지 마세요', '입으로 상처를 빨아내지 마세요'],
    warning: '깊은 자상이나 오염된 상처는 세척만 한 뒤 즉시 의료진에게 넘기십시오.',
    color: '#10b981' // Green Group
  }
}

export default function Emergency({ patient, initialAction }) {
  const [triageStep, setTriageStep] = useState('CHECK') 
  const [activeAction, setActiveAction] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [sessionLogs, setSessionLogs] = useState([])
  const [hoveredStepIndex, setHoveredStepIndex] = useState(null)

  useEffect(() => {
    if (initialAction) {
      const mapping = {
        'CARDIAC': '심폐소생술',
        'TRAUMA': '지혈/압박',
        'UNCONSCIOUS': '기도 확보',
        'RESPIRATORY': '기도 확보'
      }
      const targetAction = mapping[initialAction] || initialAction
      if (ACTION_GUIDES[targetAction]) {
        setActiveAction(targetAction)
        setTriageStep('GUIDE')
      }
    }
  }, [initialAction])

  const [showPhotoAlert, setShowPhotoAlert] = useState(false)
  const [bpm, setBpm] = useState(110)
  const [beat, setBeat] = useState(false)
  const [vitals, setVitals] = useState({ hr: 96, spo2: 94, bp: '158/95', temp: 37.6, rr: 24 })
  const [editingVital, setEditingVital] = useState(null)

  const updateVital = (key, value) => {
    if (!value) { setEditingVital(null); return; }
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    const labels = { bp: '혈압', temp: '체온' }
    const units = { bp: 'mmHg', temp: '°C' }
    setVitals({ ...vitals, [key]: value })
    setSessionLogs([{ time: now, text: `🔹 ${labels[key]} 측정값 수동 기록: ${value}${units[key]}`, type: 'INFO' }, ...sessionLogs])
    setEditingVital(null)
  }

  const checkAlert = (key, value) => {
    if (!value) return false;
    if (key === 'hr') return value < 60 || value > 100;
    if (key === 'spo2') return value < 95;
    if (key === 'rr') return value < 12 || value > 20;
    if (key === 'temp') return value < 36.0 || value > 37.8;
    if (key === 'bp') {
      const parts = String(value).split('/');
      if (parts.length !== 2) return false;
      const sys = parseInt(parts[0]);
      const dia = parseInt(parts[1]);
      return sys > 140 || sys < 90 || dia > 90 || dia < 60;
    }
    return false;
  }

  useEffect(() => {
    if (activeAction === '심폐소생술') {
      const interval = setInterval(() => setBeat(b => !b), 60000 / bpm / 2)
      return () => clearInterval(interval)
    }
  }, [activeAction, bpm])

  const handleStepToggle = (index) => {
    const isDone = completedSteps.includes(index)
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    if (activeAction && ACTION_GUIDES[activeAction] && !isDone) {
      const stepTitle = ACTION_GUIDES[activeAction].steps[index].title
      setSessionLogs([{ time: now, text: `${stepTitle} 완료`, type: 'SUCCESS' }, ...sessionLogs])
      setCompletedSteps([...completedSteps, index])
      setShowPhotoAlert(true)
    }
  }

  const handleTriageSelect = (actionKey) => {
    setActiveAction(actionKey)
    setTriageStep('GUIDE')
  }

  if (triageStep === 'CHECK') {
    const triageData = [
      { label: '눈을 뜨고 말을 하나요?', desc: '정상 의식', action: '상처 세척', color: '#2dd4bf' },
      { label: '부르면 대답을 하나요?', desc: '언어 반응', action: '골절 / 탈구', color: '#38bdf8' },
      { label: '꼬집을 때만 반응하나요?', desc: '통증 반응', action: '기도 확보', color: '#00d4aa' },
      { label: '전혀 반응이 없나요?', desc: '무반응', action: '심폐소생술', color: '#ef4444' },
    ]
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <h1 style={{ fontSize: 48, fontWeight: 950, color: '#fff', marginBottom: 40 }}>환자의 현재 의식 수준을 판별하십시오</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 1000, width: '100%' }}>
          {triageData.map((t, i) => (
            <button key={i} onClick={() => handleTriageSelect(t.action)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: 32, cursor: 'pointer' }}>
              <div style={{ fontSize: 24, fontWeight: 950, color: '#fff' }}>{t.label}</div>
              <div style={{ fontSize: 18, color: t.color, fontWeight: 800 }}>• {t.desc}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const currentActionData = activeAction ? ACTION_GUIDES[activeAction] : null
  const activeDisplayIndex = hoveredStepIndex !== null ? hoveredStepIndex : (currentActionData?.steps.findIndex((_, i) => !completedSteps.includes(i)) ?? 0)
  const stepNum = activeDisplayIndex + 1
  const stepImage = currentActionData?.steps[activeDisplayIndex]?.stepImage || currentActionData?.image

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%', background: '#020617', color: '#fff', position: 'relative', overflow: 'hidden', fontFamily: '"Pretendard", sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020617 98%)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '480px 1fr 440px', gridTemplateRows: '1fr 110px', gap: '10px', padding: '10px', height: '100%', boxSizing: 'border-box' }}>
        
        {/* LEFT: 시각 가이드 */}
        <section style={{ gridRow: '1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 18, fontWeight: 950 }}>처치 동작 시각 가이드</div>
            </div>
            <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {activeAction === '심폐소생술' && stepImage ? (
                <img src={stepImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="SOP" />
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: 22, fontWeight: 950, color: '#38bdf8' }}>{activeAction} 일러스트 준비 중</div>
                </div>
              )}
              {activeAction === '심폐소생술' && stepNum >= 3 && (
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: beat ? '#ef4444' : '#b91c1c', borderRadius: '0 0 24px 24px', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12, transition: '0.1s', zIndex: 20 }}>
                  <Heart size={18} fill="#fff" color="#fff" />
                  <div style={{ fontSize: 18, fontWeight: 950, color: '#fff' }}>박자에 맞춰 가슴을 힘껏 누르세요</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CENTER: 단계별 가이드 */}
        <section style={{ gridRow: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {activeAction ? (
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 52, fontWeight: 950, letterSpacing: '-2px', margin: 0 }}>{currentActionData.title}</h2>
                <button onClick={() => {setActiveAction(null); setCompletedSteps([])}} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', cursor: 'pointer', padding: 12, borderRadius: '50%' }}><X size={32}/></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: 18 }}>
                  <div style={{ color: '#22c55e', fontSize: 20, fontWeight: 900, marginBottom: 10 }}>권고 사항</div>
                  {currentActionData.dos.map((d, i) => <div key={i} style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#e2e8f0' }}>• {d}</div>)}
                </div>
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 20, padding: 18 }}>
                  <div style={{ color: '#ef4444', fontSize: 20, fontWeight: 900, marginBottom: 10 }}>절대 금기</div>
                  {currentActionData.donts.map((d, i) => <div key={i} style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>• {d}</div>)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentActionData.steps.map((step, i) => (
                  <div key={i} onClick={() => handleStepToggle(i)} onMouseEnter={() => setHoveredStepIndex(i)} onMouseLeave={() => setHoveredStepIndex(null)} style={{ display: 'flex', gap: 20, padding: '20px 24px', borderRadius: 24, cursor: 'pointer', background: completedSteps.includes(i) ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)', border: `2px solid ${completedSteps.includes(i) ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`, transition: '0.2s' }}>
                    <div style={{ width: 44, height: 40, borderRadius: '50%', background: completedSteps.includes(i) ? '#38bdf8' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: 24, flexShrink: 0, color: completedSteps.includes(i) ? '#000' : '#fff' }}>{i+1}</div>
                    <div>
                      <div style={{ fontSize: 30, fontWeight: 950, marginBottom: 4, color: completedSteps.includes(i) ? '#fff' : '#e2e8f0', letterSpacing: '-1px' }}>{step.title}</div>
                      <div style={{ fontSize: 22, color: completedSteps.includes(i) ? '#fff' : '#94a3b8', fontWeight: 600, lineHeight: 1.4 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><AlertTriangle size={70} color="#ef4444"/></div>
              <h2 style={{ fontSize: 48, fontWeight: 950, marginBottom: 12 }}>비의료인 자율 대응 모드</h2>
              <p style={{ fontSize: 26, color: '#94a3b8', fontWeight: 700, maxWidth: 650, lineHeight: 1.5 }}>환자의 의식 수준 판별을 통해<br/>적절한 응급처치 가이드를 활성화하십시오.</p>
            </div>
          )}
        </section>

        {/* RIGHT: 바이탈 및 로그 */}
        <aside style={{ gridRow: '1', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, flexShrink: 0 }}>
             <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
              <div style={{ width: 70, height: 70, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}><img src={patient?.avatar || '/CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <div style={{ fontSize: 26, fontWeight: 950 }}>{patient?.name}</div>
                  <div style={{ fontSize: 16, color: '#38bdf8', fontWeight: 800 }}>{patient?.role}</div>
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>ID : {patient?.id}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* 상단 3칸: 심박수, 산소포화도, 호흡수 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <VitalMini label="심박수" value={vitals.hr} unit="bpm" color="#ff3b5c" icon={<HeartPulse size={14}/>} isAlert={checkAlert('hr', vitals.hr)} />
                <VitalMini label="산소포화도" value={vitals.spo2} unit="%" color="#00aaff" icon={<Wind size={14}/>} isAlert={checkAlert('spo2', vitals.spo2)} />
                <VitalMini label="호흡수" value={vitals.rr || 24} unit="/min" color="#00d4aa" icon={<Activity size={14}/>} isAlert={checkAlert('rr', vitals.rr || 24)} />
              </div>
              
              {/* 하단 2칸: 혈압, 체온 (직접 입력) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <VitalMini label="혈압" value={vitals.bp} unit="mmHg" color="#c084fc" icon={<Activity size={16}/>} onClick={() => setEditingVital('bp')} isManual isAlert={checkAlert('bp', vitals.bp)} />
                <VitalMini label="체온" value={vitals.temp} unit="°C" color="#ff6a00" icon={<Thermometer size={16}/>} onClick={() => setEditingVital('temp')} isManual isAlert={checkAlert('temp', vitals.temp)} />
              </div>
            </div>
              
            {(editingVital === 'bp' || editingVital === 'temp') && (
              <div style={{ marginTop: 10, background: '#1e293b', borderRadius: 16, padding: '12px 16px', border: '1px solid #38bdf8', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8', whiteSpace: 'nowrap' }}>{editingVital === 'bp' ? '혈압' : '체온'} 입력</div>
                <input autoFocus placeholder={editingVital === 'bp' ? "120/80" : "36.5"} onBlur={e => updateVital(editingVital, e.target.value)} onKeyDown={e => e.key === 'Enter' && updateVital(editingVital, e.target.value)} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', outline: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 18, fontWeight: 800 }} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', minHeight: 0 }}>
            <div style={{ fontWeight: 900, marginBottom: 16, color: '#00d4aa', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <History size={18} />
              <span>대응 타임라인</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: 4, position: 'relative' }} className="timeline-scroll">
              <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
              {sessionLogs.length > 0 ? sessionLogs.map((log, i) => {
                const typeColor = log.type === 'SUCCESS' ? '#22c55e' : log.type === 'ALERT' ? '#ef4444' : '#38bdf8';
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#020617', border: `3px solid ${typeColor}`, flexShrink: 0, marginTop: '4px' }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ fontSize: '18px', color: '#e2e8f0', fontWeight: 750, lineHeight: 1.3, wordBreak: 'keep-all', flex: 1 }}>{log.text}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 800, marginTop: 4, whiteSpace: 'nowrap' }}>{log.time}</div>
                    </div>
                  </div>
                )
              }) : <div style={{ color: '#475569', textAlign: 'center', marginTop: 40, fontSize: 14, width: '100%' }}>처치 시 자동 기록됩니다</div>}
            </div>
          </div>
        </aside>

        {/* BOTTOM: 버튼 바 */}
        <section style={{ gridColumn: '1 / 4', gridRow: '2', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', marginTop: '4px' }}>
          {Object.keys(ACTION_GUIDES).map(key => {
            const isActive = activeAction === key;
            const groupColor = ACTION_GUIDES[key].color;
            return (
              <button key={key} onClick={() => {setActiveAction(key); setCompletedSteps([])}} style={{ background: isActive ? `linear-gradient(135deg, ${groupColor}, ${groupColor}dd)` : `${groupColor}15`, border: '2px solid', borderColor: isActive ? 'transparent' : `${groupColor}30`, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isActive ? `0 10px 25px ${groupColor}50` : 'none' }}>
                <div style={{ color: isActive ? '#fff' : groupColor }}><ActionButtonIcon label={key} size={26} /></div>
                <div style={{ fontSize: 28, fontWeight: 950, color: '#fff', letterSpacing: '-1.5px' }}>{key}</div>
              </button>
            )
          })}
        </section>
      </div>

      <style>{`
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes pulse-alert {
          0% { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.4); }
          50% { background: rgba(239, 68, 68, 0.3); border-color: rgba(239, 68, 68, 1); }
          100% { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.4); }
        }
        .action-btn:hover { transform: translateY(-5px); filter: brightness(1.1); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </div>
  )
}

function VitalMini({ label, value, unit, color, icon, onClick, isManual, isAlert }) {
  return (
    <div onClick={onClick} style={{ 
      background: isAlert ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)', 
      padding: '16px 14px', 
      borderRadius: 16, 
      border: isAlert ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.04)', 
      cursor: isManual ? 'pointer' : 'default', 
      position: 'relative', 
      minWidth: 0, 
      overflow: 'hidden',
      transition: '0.3s',
      animation: isAlert ? 'pulse-alert 0.8s infinite' : 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ color: isAlert ? '#ef4444' : color, opacity: 0.9, flexShrink: 0 }}>{icon}</span>
        <div style={{ fontSize: 18, color: isAlert ? '#ef4444' : '#94a3b8', fontWeight: 900, letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {isManual && <Edit3 size={12} color={isAlert ? '#ef4444' : color} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexWrap: 'nowrap' }}>
        <span style={{ fontSize: 24, fontWeight: 950, color: isAlert ? '#ef4444' : color, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 11, color: isAlert ? '#ef4444' : '#475569', fontWeight: 800, whiteSpace: 'nowrap' }}>{unit}</span>
      </div>
    </div>
  )
}

function ActionButtonIcon({ label, size = 24 }) {
  if (label === '심폐소생술') return <Heart size={size} />
  if (label === '하임리히법') return <Zap size={size} />
  if (label === '지혈/압박') return <Activity size={size} />
  if (label === '기도 확보') return <Wind size={size} />
  if (label === '골절 / 탈구') return <Bone size={size} />
  if (label === '익수 / 저체온') return <Droplets size={size} />
  if (label === '상처 세척') return <Scissors size={size} />
  if (label === '화상') return <Flame size={size} />
  return <Info size={size} />
}

