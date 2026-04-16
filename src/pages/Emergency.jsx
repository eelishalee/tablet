import { useState, useEffect } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

// ── 데이터 시뮬레이션 ──
const WAVE_DATA = Array.from({ length: 40 }, (_, i) => ({ val: 60 + Math.random() * 20 }))

export default function Emergency({ patient }) {
  const [ready, setReady] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [activeAction, setActiveAction] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setElapsed(p => p + 1), 1000)
    setTimeout(() => setReady(true), 400)
    return () => clearInterval(t)
  }, [])

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (!ready) return <div style={{ height: 'calc(100vh - 72px)', background: '#020408' }} />

  return (
    <div style={{ 
      height: 'calc(100vh - 72px)', width: '100%', background: '#020408', color: '#fff',
      fontFamily: '"Pretendard", sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      
      {/* ── 배경 : 실전 현장 그래픽 ── */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: 'url("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25, filter: 'grayscale(0.5) brightness(0.4)'
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020408 85%)' }} />

      {/* ── 메인 대시보드 레이아웃 ── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '380px 1fr 400px', gridTemplateRows: '1fr 180px', gap: '24px', padding: '24px', height: '100%', boxSizing: 'border-box' }}>
        
        {/* [LEFT] VITAL AID - 정밀 모니터링 (메인 대시보드 컬러 동기화) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BentoCard label="VITAL AID - ECG" icon={<Activity size={20} color="#ff3b5c"/>} height="240px">
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={WAVE_DATA}>
                    <Line type="monotone" dataKey="val" stroke="#ff3b5c" strokeWidth={3} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '64px', fontWeight: 950, color: '#ff3b5c' }}>96<span style={{ fontSize: '20px', color: '#64748b', marginLeft: '8px' }}>BPM</span></div>
                <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 800, color: '#00d4aa' }}>● LIVE</div>
              </div>
            </div>
          </BentoCard>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <BentoCard label="SPO2" icon={<Wind size={18} color="#00aaff"/>}>
              <div style={{ fontSize: '42px', fontWeight: 950, color: '#00aaff' }}>94<span style={{ fontSize: '18px', opacity: 0.6 }}>%</span></div>
              <div style={{ fontSize: '14px', color: '#ff3b5c', fontWeight: 800, marginTop: 4 }}>LOW</div>
            </BentoCard>
            <BentoCard label="TEMP" icon={<Thermometer size={18} color="#ff6a00"/>}>
              <div style={{ fontSize: '42px', fontWeight: 950, color: '#ff6a00' }}>37.6<span style={{ fontSize: '18px', opacity: 0.6 }}>°C</span></div>
              <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 800, marginTop: 4 }}>STABLE</div>
            </BentoCard>
          </div>

          <BentoCard label="BLOOD PRESSURE" icon={<Zap size={18} color="#c084fc"/>}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <div style={{ fontSize: '48px', fontWeight: 950, color: '#c084fc' }}>158</div>
              <div style={{ fontSize: '24px', color: '#64748b', fontWeight: 800 }}>/ 95 <span style={{ fontSize: '14px' }}>mmHg</span></div>
            </div>
          </BentoCard>

          <BentoCard label="RESPONSE SESSION" icon={<Clock size={18}/>} variant="vivid" color="#1e1b4b">
            <div style={{ fontSize: '52px', fontWeight: 950, color: '#ff3b5c', fontFamily: 'monospace', textAlign: 'center' }}>{formatTime(elapsed)}</div>
          </BentoCard>
        </section>

        {/* [CENTER] SITUATION VIEW */}
        <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '14px', color: '#0ea5e9', fontWeight: 900, letterSpacing: '4px', marginBottom: '8px' }}>MDTS MISSION CONTROL</div>
            <div style={{ fontSize: '32px', fontWeight: 950, textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>현장 처치 진행 중</div>
          </div>
          <button style={{ 
            background: 'rgba(14, 165, 233, 0.1)', border: '2.5px solid #0ea5e9', padding: '24px 48px', borderRadius: '40px',
            fontSize: '24px', fontWeight: 900, color: '#fff', backdropFilter: 'blur(10px)', cursor: 'pointer',
            boxShadow: '0 0 40px rgba(14, 165, 233, 0.25)', transition: '0.2s'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)'}>
            진단 리포트 최종 전송
          </button>
        </section>

        {/* [RIGHT] FIRST AID - 뇌 아이콘 제거 완료 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BentoCard label="REMOTE DOCTOR" icon={<Video size={18} color="#ff3b5c"/>} noPadding height="200px">
            <div style={{ height: '100%', position: 'relative', background: '#000' }}>
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>Dr. 박지민 (대기 중)</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>부산대학교병원 응급의학과</div>
              </div>
            </div>
          </BentoCard>

          {/* AI 정밀 판독 결과 섹션 - icon={<Brain/>} 제거됨 */}
          <BentoCard label="정밀 판독 리포트" icon={null} noPadding flex={1}>
            <div style={{ height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
              <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200" style={{ height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.3) contrast(1.5)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', top: '22%', left: '45%', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,59,92,0.3)', border: '2px solid #ff3b5c', animation: 'pulse 1.5s infinite' }} />
              <div style={{ position: 'absolute', bottom: '20px', width: '85%', background: 'rgba(15,23,42,0.92)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#ff3b5c', marginBottom: 4 }}>AI ANALYSIS</div>
                <div style={{ fontSize: '18px', fontWeight: 950 }}>좌측 제 4~6번 늑골 골절</div>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: 4 }}>외상성 기흉 및 내출혈 의심 (94%)</div>
              </div>
            </div>
          </BentoCard>

          <div style={{ padding: '20px', background: 'rgba(255,59,92,0.08)', border: '1.5px solid rgba(255,59,92,0.2)', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ff3b5c', marginBottom: 8 }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '1px' }}>ALLERGY WARNING</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 950 }}>아스피린 (ASPIRIN) 절대 금기</div>
          </div>
        </section>

        {/* [BOTTOM] ACTION SELECTOR */}
        <section style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
          <ActionButton icon={<Pill size={28}/>} label="약물 투여" color="#c084fc" desc="진통제/항생제" />
          <ActionButton icon={<Scissors size={28}/>} label="소독/처치" color="#00d4aa" desc="상처 드레싱" />
          <ActionButton icon={<Shield size={28}/>} label="부목 고정" color="#00aaff" desc="골절 부위 고정" />
          <ActionButton icon={<Zap size={28}/>} label="지혈/압박" color="#ff3b5c" desc="직접 압박 지혈" />
          <ActionButton icon={<Wind size={28}/>} label="기도 확보" color="#0ea5e9" desc="산소 공급 장치" />
          <ActionButton icon={<History size={28}/>} label="처치 기록" color="#94a3b8" desc="세션 로그 기록" />
        </section>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }
        button:hover { filter: brightness(1.2); transform: translateY(-2px); transition: 0.2s; }
      `}</style>
    </div>
  )
}

function BentoCard({ children, label, icon, height, noPadding = false, variant = 'glass', color, flex }) {
  return (
    <div style={{ 
      height: height || 'auto', flex: flex || 'none', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      background: variant === 'glass' ? 'rgba(255, 255, 255, 0.03)' : color,
      border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)'
    }}>
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {icon && <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>}
        <div style={{ fontSize: '13px', fontWeight: 950, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.8 }}>{label}</div>
      </div>
      <div style={{ flex: 1, padding: noPadding ? 0 : '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function ActionButton({ icon, label, color, desc }) {
  return (
    <button style={{ 
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px',
      padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
      cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)'
    }}>
      <div style={{ color }}>{icon}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 900 }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{desc}</div>
      </div>
    </button>
  )
}
