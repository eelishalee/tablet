import { useState, useEffect } from 'react'
import { Brain, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, Heart, Droplets, Thermometer, Activity, Zap, Shield, ChevronRight, RotateCcw } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts'

const RISK_SCORE = 72

const DIAGNOSES = [
  { confidence: 94, title: '급성 심근경색 의심', icd: 'I21.9', severity: 'critical', color: '#ff4d6d', desc: '흉통, 호흡곤란, 혈압 상승(158/95) 및 고혈압·고지혈증 병력을 종합적으로 분석한 결과 급성 심근경색 가능성이 매우 높습니다.', actions: ['즉시 원격 진료 연결', '12유도 심전도 측정', 'CPR 장비 대기', '아스피린 알레르기 — 클로피도그렐 대체 검토'] },
  { confidence: 61, title: '고혈압성 위기', icd: 'I10', severity: 'high', color: '#ff9f43', desc: '수축기 혈압 158mmHg 이상으로 고혈압성 긴급증 범위에 해당합니다. 기존 고혈압 병력 및 미복약 가능성을 고려해야 합니다.', actions: ['혈압 15분 간격 재측정', '안정 취하게 하기', '암로디핀 복용 확인', '신경학적 증상 모니터링'] },
  { confidence: 38, title: '불안정 협심증', icd: 'I20.0', severity: 'medium', color: '#a55eea', desc: '안정 시에도 지속되는 흉통과 ST 변화 가능성을 고려합니다. 심근경색과 감별 진단이 필요합니다.', actions: ['안정 취하게 하기', '산소포화도 지속 모니터링', '니트로글리세린 투여 검토'] }
]

const VITAL_ANALYSIS = [
  { label: '심박수', value: 96, unit: 'bpm', normal: '60-100', status: 'warn', trend: 'up', icon: <Heart size={18}/>, color: '#ff9f43' },
  { label: '수축기 혈압', value: 158, unit: 'mmHg', normal: '<120', status: 'critical', trend: 'up', icon: <Activity size={18}/>, color: '#ff4d6d' },
  { label: '산소포화도', value: 94, unit: '%', normal: '95-100', status: 'warn', trend: 'down', icon: <Droplets size={18}/>, color: '#ff9f43' },
  { label: '체온', value: 37.6, unit: '°C', normal: '36.5-37.5', status: 'warn', trend: 'up', icon: <Thermometer size={18}/>, color: '#ff9f43' }
]

const RADAR_DATA = [
  { sub: '심장관련', val: 28 }, { sub: '혈압수치', val: 22 }, { sub: '호흡기능', val: 55 }, { sub: '체온조절', val: 62 }, { sub: '산소포화', val: 50 }, { sub: '의식상태', val: 85 }
]

const TREND_DATA = [
  { t: '08:00', hr: 78, bp: 142 }, { t: '08:15', hr: 80, bp: 145 }, { t: '08:30', hr: 82, bp: 148 }, { t: '08:45', hr: 85, bp: 150 }, { t: '09:00', hr: 89, bp: 153 }, { t: '09:15', hr: 93, bp: 156 }, { t: '09:30', hr: 96, bp: 158 }
]

const SEV_LABEL = { critical: '위험', high: '주의', medium: '경계', low: '정상' }

export default function AIAnalysis({ patient }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [scanning, setScanning] = useState(true)
  const [progress, setProgress] = useState(0)
  useEffect(() => { const t = setInterval(() => { setProgress(p => { if (p >= 100) { setScanning(false); clearInterval(t); return 100 }; return p + 4 }) }, 60); return () => clearInterval(t) }, [])
  const rescan = () => { setScanning(true); setProgress(0) }

  if (scanning && progress < 100) {
    return (
      <div style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050d1a', gap: 30 }}>
        <div style={{ position: 'relative', width: 160, height: 160 }}>
          <svg width="160" height="160" style={{ position: 'absolute' }}>
            <circle cx="80" cy="80" r="70" stroke="rgba(13,217,197,0.1)" strokeWidth="6" fill="none"/>
            <circle cx="80" cy="80" r="70" stroke="#0dd9c5" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s', transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Brain size={40} color="#0dd9c5" /><span style={{ fontSize: 28, fontWeight: 950, color: '#0dd9c5' }}>{progress}%</span></div>
        </div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 950, color: '#fff', marginBottom: 10 }}>AI 심층 분석 및 추론 중...</div><div style={{ fontSize: 16, color: '#8da2c0' }}>{progress < 30 ? '데이터 패킷 수집 중' : progress < 60 ? '병력 데이터 분석' : progress < 85 ? '진단 모델 추론' : '리포트 생성 중'}</div></div>
      </div>
    )
  }

  const diag = DIAGNOSES[activeIdx]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.8fr 1.1fr', height: 'calc(100vh - 72px)', background: '#050d1a', minHeight: 0 }}>
      {/* Left Panel */}
      <div style={{ borderRight: '1px solid rgba(13,217,197,0.1)', background: 'rgba(10,22,40,0.95)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Brain size={20} color="#0dd9c5" /><span style={{ fontSize: 16, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase' }}>AI 종합 분석 리포트</span><button onClick={rescan} style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: 6, background: 'rgba(13,217,197,0.1)', border: '1px solid rgba(13,217,197,0.2)', color: '#0dd9c5', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>재분석</button></div>
        <RiskGauge score={RISK_SCORE} />
        <div style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 11, color: '#4a6080', fontWeight: 800, marginBottom: 6 }}>분석 대상 정보</div><div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{patient?.name || '김항해'}</div><div style={{ fontSize: 14, color: '#8da2c0', marginTop: 2 }}>{patient?.age || 55}세 · {patient?.role || '기관장'} · {patient?.blood || 'A+'}형</div><div style={{ fontSize: 13, color: '#ff9f43', marginTop: 6, fontWeight: 700 }}>⚠ 병력: {patient?.chronic || '고혈압, 고지혈증'}</div></div>
        <div style={{ fontSize: 13, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase' }}>감별 진단 후보</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DIAGNOSES.map((d, i) => (<button key={i} onClick={() => setActiveIdx(i)} style={{ padding: '14px', borderRadius: 14, textAlign: 'left', cursor: 'pointer', background: activeIdx === i ? `${d.color}15` : 'rgba(255,255,255,0.02)', border: `1.5px solid ${activeIdx === i ? d.color : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.15s' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><ConfidenceBadge value={d.confidence} color={d.color} /><span style={{ fontSize: 14, fontWeight: 900, color: activeIdx === i ? '#fff' : '#8da2c0' }}>{d.title}</span></div><div style={{ display: 'flex', gap: 8 }}><span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${d.color}20`, color: d.color, fontWeight: 800 }}>{SEV_LABEL[d.severity]}</span><span style={{ fontSize: 10, color: '#4a6080', fontWeight: 700 }}>ICD: {d.icd}</span></div></button>))}
        </div>
      </div>

      {/* Center Panel */}
      <div style={{ borderRight: '1px solid rgba(13,217,197,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '24px', background: `linear-gradient(135deg, ${diag.color}10, rgba(10,22,40,0.9))`, borderBottom: `1px solid ${diag.color}25` }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: `${diag.color}20`, border: `1.5px solid ${diag.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={24} color={diag.color} /></div><div><div style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{diag.title}</div><div style={{ display: 'flex', gap: 8, marginTop: 4 }}><span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 6, background: `${diag.color}25`, color: diag.color, fontWeight: 800 }}>{SEV_LABEL[diag.severity]} 수준</span><span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#8da2c0', fontWeight: 800 }}>신뢰도 {diag.confidence}%</span></div></div></div><p style={{ fontSize: 15, color: '#8da2c0', lineHeight: 1.6, fontWeight: 500 }}>{diag.desc}</p></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}><div style={{ marginBottom: 32 }}><div style={{ fontSize: 13, fontWeight: 950, color: diag.color, textTransform: 'uppercase', marginBottom: 16 }}>권고 즉각 조치 사항</div><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{diag.actions.map((a, i) => (<div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}><div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: `${diag.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 950, color: diag.color }}>{i + 1}</div><span style={{ fontSize: 15, color: '#e8f0fe', lineHeight: 1.5, fontWeight: 600 }}>{a}</span></div>))}</div></div><div><div style={{ fontSize: 13, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase', marginBottom: 16 }}>바이탈 정밀 추이 분석</div><div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: '16px' }}><ResponsiveContainer width="100%" height={180}><LineChart data={TREND_DATA}><XAxis dataKey="t" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis yAxisId="hr" domain={[60, 120]} tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} width={30} /><YAxis yAxisId="bp" orientation="right" domain={[120, 180]} tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} width={35} /><Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(13,217,197,0.2)', borderRadius: 10, fontSize: 13 }} /><Line yAxisId="hr" type="monotone" dataKey="hr" stroke="#ff4d6d" strokeWidth={3} dot={{ r: 3, fill: '#ff4d6d' }} name="심박수" isAnimationActive={false} /><Line yAxisId="bp" type="monotone" dataKey="bp" stroke="#ff9f43" strokeWidth={3} dot={{ r: 3, fill: '#ff9f43' }} name="수축기혈압" isAnimationActive={false} /></LineChart></ResponsiveContainer></div></div></div>
      </div>

      {/* Right Panel */}
      <div style={{ padding: '20px', overflowY: 'auto', background: 'rgba(10,22,40,0.5)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase' }}>항목별 상세 분석</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{VITAL_ANALYSIS.map((v, i) => (<VitalAnalysisCard key={i} {...v} />))}</div>
        <div style={{ padding: '16px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 11, fontWeight: 900, color: '#8da2c0', marginBottom: 6, textTransform: 'uppercase' }}>신체 기능 레이더 차트</div><ResponsiveContainer width="100%" height={160}><RadarChart data={RADAR_DATA}><PolarGrid stroke="rgba(13,217,197,0.1)" /><PolarAngleAxis dataKey="sub" tick={{ fill: '#4a6080', fontSize: 10, fontWeight: 700 }} /><Radar dataKey="val" stroke="#ff4d6d" fill="#ff4d6d" fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} /></RadarChart></ResponsiveContainer></div>
        <div style={{ padding: '16px', borderRadius: 20, background: 'rgba(13,217,197,0.06)', border: '1px solid rgba(13,217,197,0.2)' }}><div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}><Shield size={18} color="#0dd9c5" /><span style={{ fontSize: 14, fontWeight: 950, color: '#0dd9c5' }}>AI 최종 종합 판정</span></div><p style={{ fontSize: 14, color: '#e8f0fe', lineHeight: 1.6, fontWeight: 600 }}>위험도 <span style={{ color: '#ff4d6d', fontWeight: 900 }}>극심(72/100)</span> 단계입니다. 즉각적인 응급 처치 돌입을 권고합니다.</p></div>
      </div>
    </div>
  )
}

function RiskGauge({ score }) {
  const color = score >= 70 ? '#ff4d6d' : score >= 40 ? '#ff9f43' : '#26de81'
  return (
    <div style={{ padding: '24px 16px', borderRadius: 20, textAlign: 'center', background: `linear-gradient(135deg, ${color}10, rgba(10,22,40,0.8))`, border: `1.5px solid ${color}30` }}>
      <div style={{ position: 'relative', width: 140, height: 80, margin: '0 auto 12px' }}><svg width="140" height="80" viewBox="0 0 140 80"><path d="M 10 80 A 60 60 0 0 1 130 80" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" strokeLinecap="round" /><path d="M 10 80 A 60 60 0 0 1 130 80" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="188" strokeDashoffset={`${188 * (1 - score / 100)}`} style={{ transition: 'none' }} /></svg><div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}><div style={{ fontSize: 36, fontWeight: 950, color, lineHeight: 1 }}>{score}</div><div style={{ fontSize: 12, color: '#4a6080', fontWeight: 800 }}>/ 100</div></div></div>
      <div style={{ fontSize: 16, fontWeight: 950, color }}>{score >= 70 ? '위험 — 즉각 처치' : '주의 관찰'}</div>
    </div>
  )
}

function ConfidenceBadge({ value, color }) { return (<div style={{ minWidth: 44, padding: '2px 6px', borderRadius: 6, background: `${color}20`, textAlign: 'center' }}><span style={{ fontSize: 13, fontWeight: 950, color }}>{value}%</span></div>) }

function VitalAnalysisCard({ label, value, unit, normal, status, trend, icon, color }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus; const trendColor = status === 'normal' ? '#26de81' : status === 'warn' ? '#ff9f43' : '#ff4d6d'
  return (
    <div style={{ padding: '14px', borderRadius: 14, background: status === 'critical' ? 'rgba(255,77,109,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${status === 'critical' ? 'rgba(255,77,109,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div><div style={{ flex: 1 }}><div style={{ fontSize: 12, color: '#4a6080', fontWeight: 800 }}>{label}</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span style={{ fontSize: 20, fontWeight: 950, color }}>{value}</span><span style={{ fontSize: 12, color: '#4a6080', fontWeight: 700 }}>{unit}</span></div></div><div style={{ textAlign: 'right' }}><TrendIcon size={18} color={trendColor} /><div style={{ fontSize: 10, color: '#4a6080', marginTop: 2, fontWeight: 700 }}>{normal}</div></div></div>
    </div>
  )
}

function LegendDot({ color, label }) { return (<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 3, borderRadius: 2, background: color }} /><span style={{ fontSize: 11, color: '#4a6080', fontWeight: 700 }}>{label}</span></div>) }
