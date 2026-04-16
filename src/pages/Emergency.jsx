import { useState, useEffect } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

export default function Emergency({ patient }) {
  const [ready, setReady] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setElapsed(p => p + 1), 1000)
    setTimeout(() => setReady(true), 400)
    return () => clearInterval(t)
  }, [])

  if (!ready) return <div style={{ height: 'calc(100vh - 72px)', background: '#020408' }} />

  return (
    <div style={{ 
      height: 'calc(100vh - 72px)', width: '100%', background: '#020408', color: '#fff',
      fontFamily: '"Pretendard", sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      
      {/* ── 배경 ── */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: 'url("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, filter: 'grayscale(0.5) brightness(0.2)'
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020408 98%)' }} />

      {/* ── 메인 레이아웃 ── */}
      <div style={{ 
        position: 'relative', zIndex: 1, display: 'grid', 
        gridTemplateColumns: '0.7fr 2.3fr 1fr', 
        gridTemplateRows: '1fr auto', 
        gap: '20px', padding: '20px', height: '100%', boxSizing: 'border-box' 
      }}>
        
        {/* [LEFT] 긴급 경고 및 바이탈 센서 영역 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflowY: 'auto' }}>
          
          {/* 긴급 경고 */}
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', border: '2px solid #b91c1c', borderRadius: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f87171', marginBottom: 8 }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px' }}>긴급 경보 (CRITICAL)</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 950, color: '#fff' }}>아스피린 절대 금기</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>과거 병력: 아나필락시스 쇼크 반응</div>
          </div>

          {/* 바이탈 센서 영역 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '20px', backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Activity size={18} color="#ff3b5c"/>
                <span style={{ fontSize: '14px', fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>정밀 생체 모니터링 (BPM)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: '56px', fontWeight: 950, color: '#ff3b5c', lineHeight: 1 }}>96</span>
                <span style={{ fontSize: '20px', color: '#64748b', fontWeight: 800 }}>BPM</span>
                <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#00d4aa' }}>정상 범위</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <VitalMiniCard label="산소포화도" value="94" unit="%" color="#00aaff" status="위험" />
              <VitalMiniCard label="호흡수" value="18" unit="/min" color="#00d4aa" status="정상" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <VitalMiniCard label="혈압" value="158/95" unit="mmHg" color="#c084fc" status="높음" />
              <VitalMiniCard label="체온" value="37.6" unit="°C" color="#ff6a00" status="미열" />
            </div>
          </div>
        </section>

        {/* [CENTER] AI 리포트(상단) 및 상황 관제(하단) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
          
          {/* AI 분석 리포트 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1.5px solid rgba(13, 217, 197, 0.2)', borderRadius: '28px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#0dd9c5' }} />
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '18px', background: 'rgba(13, 217, 197, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={32} color="#0dd9c5" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#0dd9c5', letterSpacing: '1px' }}>AI 종합 진단 리포트</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,59,92,0.1)', color: '#ff3b5c', fontWeight: 800 }}>신뢰도 94%</span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 950, color: '#fff' }}>좌측 제 4~6번 늑골 골절 및 외상성 기흉 의심</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>호흡 부조화 및 흉부 압박 통증 수치 상승 기반 판독 결과</div>
              </div>
              <button style={{ padding: '12px 24px', borderRadius: '16px', background: 'rgba(13, 217, 197, 0.15)', border: '1px solid rgba(13, 217, 197, 0.3)', color: '#0dd9c5', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
                상세 보기
              </button>
            </div>
          </div>

          {/* 중앙 상황 관제 뷰 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 900, letterSpacing: '3px', marginBottom: '8px' }}>MDTS MISSION CONTROL</div>
              <div style={{ fontSize: '32px', fontWeight: 950, textShadow: '0 0 30px rgba(14, 165, 233, 0.4)' }}>응급 처치 지침 수행 중</div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)', filter: 'blur(10px)' }} />
              <button style={{ 
                position: 'relative',
                background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)', border: '1px solid rgba(255,255,255,0.4)', padding: '24px 60px', borderRadius: '50px',
                fontSize: '24px', fontWeight: 950, color: '#fff', cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)', transition: 'all 0.2s'
              }}>
                진단 결과 최종 전송
              </button>
            </div>
          </div>
        </section>

        {/* [RIGHT] 환자 정보 영역 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: 20, textTransform: 'uppercase' }}>환자 기본 정보</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="#8da2c0" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 950, color: '#fff' }}>{patient?.name || '김항해'}</div>
                <div style={{ fontSize: '14px', color: '#8da2c0', fontWeight: 600 }}>기관장 / 55세</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InfoRow label="혈액형" value={patient?.blood || 'A+ (Rh+)'} />
              <InfoRow label="키/몸무게" value="178cm / 82kg" />
              <InfoRow label="기저질환" value={patient?.chronic || '고혈압, 당뇨'} color="#ff9f43" />
              <InfoRow label="복용약물" value="아스피린(중단), 리피토" />
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>특이사항</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>최근 3개월 내 협심증 증상으로 내원 이력 있음. 약물 알레르기 주의 요망.</div>
            </div>

            {/* 좌측에서 이동된 센서 데이터 상태 라벨 */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 10px #00d4aa' }} />
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#00d4aa', letterSpacing: '0.5px' }}>센서 실시간 데이터 수신 중</div>
            </div>
          </div>
        </section>

        {/* [BOTTOM] ACTION SELECTOR */}
        <section style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, paddingTop: '10px' }}>
          <ActionButton icon={<Pill size={22}/>} label="약물 투여" color="#e2c483" desc="진통제/항생제" />
          <ActionButton icon={<Scissors size={22}/>} label="소독/처치" color="#a5c6ff" desc="상처 드레싱" />
          <ActionButton icon={<Shield size={22}/>} label="부목 고정" color="#c5a8ff" desc="골절 부위 고정" />
          <ActionButton icon={<Zap size={22}/>} label="지혈/압박" color="#fb7185" desc="직접 압박 지혈" />
          <ActionButton icon={<Wind size={22}/>} label="기도 확보" color="#67d4ff" desc="산소 공급 장치" />
          <ActionButton icon={<History size={22}/>} label="처치 기록" color="#94a3b8" desc="세션 로그 기록" />
        </section>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .action-btn:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.5); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </div>
  )
}

function VitalMiniCard({ label, value, unit, color, status }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: '24px', fontWeight: 950, color }}>{value}</span>
        <span style={{ fontSize: '12px', opacity: 0.5, fontWeight: 700 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '10px', color: status === '정상' ? color : '#ff3b5c', fontWeight: 800, marginTop: 4 }}>{status}</div>
    </div>
  )
}

function InfoRow({ label, value, color = 'rgba(255,255,255,0.8)' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 800, color }}>{value}</span>
    </div>
  )
}

function ActionButton({ icon, label, color, desc }) {
  return (
    <button className="action-btn" style={{ 
      position: 'relative', background: `linear-gradient(165deg, ${color} 0%, ${color}dd 100%)`, 
      border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '14px 10px', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
      cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)', pointerEvents: 'none' }} />
      <div style={{ color: '#020617', opacity: 0.9 }}>{icon}</div>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: 900, color: '#020617', whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'rgba(2,6,23,0.55)', fontWeight: 800, whiteSpace: 'nowrap' }}>{desc}</div>
      </div>
    </button>
  )
}
