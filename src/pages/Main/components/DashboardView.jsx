import { Activity, History, Droplets, Upload, AlertTriangle, Camera, Mic, User } from 'lucide-react'
import MdtsLogo from '../../../components/MdtsLogo.jsx'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({ 
  activePatient, activeTab, hr, spo2, rr, bp, bt, chat, prompt, setPrompt, 
  handlePromptAnalysis, startEmergencyAction, activeEmergencyGuide, 
  setActiveEmergencyGuide, activeStep, setActiveStep, handleTraumaAnalysis 
}) {
  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 440px', overflow: 'hidden' }}>
      
      {/* [Left] Patient Info Panel */}
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 24, padding: '24px 24px 20px 24px', marginBottom: 30 }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <div style={{ width: 110, height: 110, borderRadius: 27, background: '#fff', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 24px rgba(56,189,248,0.2)' }}>
                {activePatient?.id?.includes('100') ? (
                  <img src="photo.jpeg" alt="Captain" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 5px' }} />
                ) : (
                  <User size={68} color="#38bdf8" />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 37, fontWeight: 950, marginBottom: 4, letterSpacing: '-0.6px' }}>{activePatient?.name}</div>
                <div style={{ fontSize: 23, color: '#38bdf8', fontWeight: 800, marginBottom: 2 }}>{activePatient?.role}</div>
                <div style={{ fontSize: 18, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <InfoItem label="나이/성별" value={`${activePatient?.age || 0}세 / 남`} size="xl_ultra" />
              <InfoItem label="혈액형" value={activePatient?.blood} size="xl_ultra" />
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 17, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>과거력 (Past History)</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{activePatient?.history}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 24, fontWeight: 800, marginBottom: 16 }}><History size={26}/> 최근 진료 이력</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { date: '2026.03.12', title: '정기 건강검진', status: '정상' },
                  { date: '2026.01.05', title: '가벼운 감기 증상', status: '처방완료' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 16, color: '#64748b', marginBottom: 4 }}>{item.date}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 19, fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: 16, color: '#38bdf8', fontWeight: 700 }}>{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 24, fontWeight: 800, marginBottom: 16 }}><Droplets size={26}/> 투약/처치 로그</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { time: '14:15', action: '아스피린 300mg 투여', note: '흉통 완화 목적' },
                  { time: '14:08', action: '산소 공급 시작', note: '10L/min 유지' }
                ].map((log, idx) => (
                  <div key={idx} style={{ borderLeft: '2px solid rgba(56,189,248,0.3)', paddingLeft: 16, marginBottom: 4 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0' }}>{log.time} - {log.action}</div>
                    <div style={{ fontSize: 16, color: '#64748b', marginTop: 2 }}>{log.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2dd4bf', fontSize: 21, fontWeight: 800, marginBottom: 16 }}><Upload size={26}/> 데이터 전송 상태</div>
              <div style={{ background: 'rgba(45,212,191,0.05)', padding: '16px', borderRadius: 16, border: '1px solid rgba(45,212,191,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#94a3b8' }}>육상 의료 센터 동기화</span>
                  <span style={{ fontSize: 14, color: '#2dd4bf', fontWeight: 800 }}>연결됨</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#2dd4bf' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#05070a' }}>
          <button onClick={() => startEmergencyAction('CARDIAC')} className="emergency-action-btn" style={{ width: '100%', padding: '22px', borderRadius: 18, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 20 }}><AlertTriangle size={26} /> 응급 처치 액션 시작</button>
        </div>
      </aside>

      {/* [Center] Vitals, Timeline, Chat */}
      <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#fb7185" live />
            <DashboardVital label="산소포화도" value={spo2} unit="%" color="#38bdf8" live />
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#2dd4bf" live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#e2e8f0" editable />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#fbbf24" editable />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 45px 45px 45px' }}>
          {activeTab === 'DASHBOARD' && (
            <div style={{ position: 'relative', paddingLeft: 45 }}>
              <div style={{ position: 'absolute', left: 8.5, top: 0, bottom: 0, width: 3, background: 'rgba(255,255,255,0.05)' }} />
              <TimelineItem time="14:02" label="급성 흉부 통증 발생 및 최초 발견" detail="선교 내 이동 중 갑작스러운 심장 쪼임 호소하며 쓰러짐" />
              <TimelineItem time="14:05" label="AI 분석 : 심근경색(STEMI) 고위험 판정" detail="ECG 데이터 및 증상 기반 엣지 AI 정밀 분석 완료" highlight />
            </div>
          )}
          {activeTab === 'GUIDE' && (
            <EmergencyGuide 
              activeEmergencyGuide={activeEmergencyGuide} 
              setActiveEmergencyGuide={setActiveEmergencyGuide} 
              activeStep={activeStep} 
              setActiveStep={setActiveStep} 
            />
          )}
        </div>

        <div style={{ padding: '20px 40px 36px 40px', background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(8, 14, 28, 0.75)', borderRadius: 24, padding: '10px 14px 10px 18px', border: '1px solid rgba(56,189,248,0.25)', backdropFilter: 'blur(20px)' }}>
            <button style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mic size={20} color="#38bdf8" /></button>
            <input placeholder="환자 증상 입력 또는 AI 질문..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()} style={{ flex: 1, background: 'none', border: 'none', color: '#e2e8f0', fontSize: 18, outline: 'none' }} />
            <button onClick={handlePromptAnalysis} style={{ padding: '10px 28px', borderRadius: 16, background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', color: '#000', fontWeight: 900, fontSize: 17 }}>분석 실행</button>
          </div>
        </div>
      </section>

      {/* [Right] AI Assistant Panel */}
      <aside style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden', height: '100%' }}>
        <div style={{ padding: 32, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 11 }}><Activity size={22} color="#38bdf8" /> MDTS AI 의료 어시스턴트</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {chat?.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
              <div style={{ padding: '12px 16px', borderRadius: 18, background: m.role === 'ai' ? 'rgba(56,189,248,0.1)' : 'rgba(99,102,241,0.18)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '88%', fontSize: 14, color: '#e2e8f0' }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <button onClick={handleTraumaAnalysis} className="trauma-capture-btn" style={{ width: '100%', padding: '22px', borderRadius: 18, background: '#0ea5e9', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontWeight: 800, fontSize: 20 }}><Camera size={26} /> 외상 촬영 & AI 분석</button>
        </div>
      </aside>
    </div>
  )
}
