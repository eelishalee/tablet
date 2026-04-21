import { useState, useEffect, useRef } from 'react'
import { Activity, History, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock, Database, ChevronRight, Info, ShieldCheck, Zap, Crosshair, Eye, Maximize } from 'lucide-react'
import logoImg from '../../../assets/logo.png'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({
  activePatient, hr, spo2, rr, bp, bt, chat, prompt, setPrompt,
  handlePromptAnalysis, startEmergencyAction, handleTraumaAnalysis,
  isScanning, scanResult, scanError, setScanError, setIsScanning
}) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)

  // 카메라 스트림 관리
  useEffect(() => {
    async function startCamera() {
      if (isScanning) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: 1280, height: 720 } 
          })
          setStream(s)
          if (videoRef.current) videoRef.current.srcObject = s
        } catch (err) {
          console.error("카메라 접근 실패:", err)
        }
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          setStream(null)
        }
      }
    }
    startCamera()
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [isScanning])

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 480px', overflow: 'hidden', height: '100%', position: 'relative', background: '#020408' }}>

      {/* [고도화] 실제 카메라 기반 외상 스캐너 오버레이 */}
      {isScanning && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 500, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* 실제 카메라 피드 */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: scanError ? 0.3 : 1 }} 
          />

          {/* AI 분석 오버레이 (영상 위에 겹침) */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
          
          {/* 그리드 레이어 */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

          {/* 스캔 라인 애니메이션 */}
          {!scanResult && !scanError && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', boxShadow: '0 0 20px #38bdf8', zIndex: 510, animation: 'scanMove 3s infinite linear' }} />
          )}

          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* 뷰파인더 가이드 */}
            <div style={{ position: 'relative', width: '70%', height: '60%', maxWidth: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '4px solid #38bdf8', borderLeft: '4px solid #38bdf8' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: '4px solid #38bdf8', borderRight: '4px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: '4px solid #38bdf8', borderLeft: '4px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '4px solid #38bdf8', borderRight: '4px solid #38bdf8' }} />

              {/* 중앙 조준점 및 정밀 분석 원 */}
              <div style={{ position: 'relative' }}>
                 <Crosshair size={80} color="rgba(56,189,248,0.5)" strokeWidth={1} />
                 {!scanResult && !scanError && (
                   <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: '2px solid rgba(56,189,248,0.3)', animation: 'pulse 1.5s infinite' }} />
                 )}
              </div>

              {/* 상태 메시지 */}
              {!scanResult && !scanError && (
                <div style={{ position: 'absolute', bottom: -100, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, letterSpacing: 10, color: '#38bdf8', fontWeight: 900, marginBottom: 16, textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>AI SCANNING IN PROGRESS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.6)', padding: '14px 36px', borderRadius: '40px', border: '1px solid rgba(56,189,248,0.4)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8', animation: 'pulse 0.8s infinite' }} />
                    <span style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>외상 부위 형태 판독 및 골절 진단 중...</span>
                  </div>
                </div>
              )}

              {/* 판독 불가 안내 (프레임 내부) */}
              {scanError && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, animation: 'fadeIn 0.3s ease' }}>
                  <AlertTriangle size={60} color="#ef4444" />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 950, color: '#fff', marginBottom: 8 }}>ANALYSIS ERROR</div>
                    <p style={{ fontSize: 18, color: '#fda4af', fontWeight: 700 }}>조도 부족 또는 급격한 움직임 감지</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, width: '320px', marginTop: 12 }}>
                    <button onClick={() => setScanError(null)} style={{ flex: 1, padding: '20px', borderRadius: 14, background: '#fff', color: '#000', border: 'none', fontWeight: 950, fontSize: 18, cursor: 'pointer' }}>RETRY</button>
                    <button onClick={() => {setScanError(null); setIsScanning(false);}} style={{ padding: '20px 30px', borderRadius: 14, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>EXIT</button>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 실시간 데이터 수치 (OSD) */}
            <div style={{ position: 'absolute', bottom: 50, left: 50, right: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 40, background: 'rgba(0,0,0,0.5)', padding: '20px 30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 900, marginBottom: 8 }}>SENSOR : LIGHT</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} style={{ width: 5, height: 16, background: i <= 3 ? '#ef4444' : '#1e293b', borderRadius: 1 }} />)}
                  </div>
                </div>
                <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />
                <div>
                  <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 900, marginBottom: 8 }}>SENSOR : STABILITY</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} style={{ width: 5, height: 16, background: i <= 7 ? '#10b981' : '#1e293b', borderRadius: 1 }} />)}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', padding: '20px 32px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 900, marginBottom: 4 }}>OBJECT DISTANCE</div>
                <div style={{ fontSize: 32, fontWeight: 950, color: '#fff', fontStyle: 'italic' }}>34.8 <span style={{ fontSize: 18, fontStyle: 'normal' }}>cm</span></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* [Left] Patient Info Panel */}
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
        <div style={{ flexShrink: 0, padding: '20px 24px 16px 24px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, background: '#fff', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src={activePatient?.avatar || '/CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: '-0.5px' }}>{activePatient?.name}</div>
                <div style={{ fontSize: 18, color: '#38bdf8', fontWeight: 800 }}>{activePatient?.role}</div>
              </div>
              <div style={{ fontSize: 15, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <InfoItem label="나이/성별" value={`${activePatient?.age || 0}세 / 남`} size="xl_ultra" />
            <InfoItem label="혈액형" value={activePatient?.blood} size="xl_ultra" />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'scroll', minHeight: 0, padding: '20px 24px 100px 24px', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><AlertCircle size={20}/> 알레르기 / 주의사항</div>
              <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(activePatient?.allergies || '없음').split(',').map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#fda4af' }}>{a.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Pill size={20}/> 복용 중인 약물</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[{ name: '혈압약 (암로디핀)', purpose: '고혈압' }, { name: '고지혈증약', purpose: '고지혈증' }].map((drug, i) => (
                  <div key={i} style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#fed7aa' }}>{drug.name}</span>
                      <span style={{ fontSize: 13, color: '#fb923c', fontWeight: 700 }}>{drug.purpose}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 20px 24px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 70%, transparent)' }}>
          <button onClick={() => startEmergencyAction('TRAUMA')} style={{ width: '100%', padding: '20px', borderRadius: 16, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 20 }}>
            <AlertTriangle size={26} /> 응급 처치 액션 시작
          </button>
        </div>
      </aside>

      {/* [Center] Vitals & AI Assistant */}
      <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#ff3b5c" live />
            <DashboardVital label="산소포화도" value={spo2} unit="%" color="#00aaff" live isConnected={false} />
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#a78bfa" live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#facc15" editable />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#fb923c" editable />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0d17', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0' }}>
              <Sparkles size={24} color="#38bdf8" /> MDTS 진단 어시스턴트
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>AI ANALYSIS ENGINE v2.0</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: m.role === 'ai' ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: m.role === 'ai' ? '0 0 10px rgba(56,189,248,0.2)' : 'none' }}>
                  {m.role === 'ai' ? <Sparkles size={16} color="#000" /> : <User size={16} color="#fff" />}
                </div>
                <div style={{ flex: 1, maxWidth: '90%' }}>
                   <div style={{ 
                     padding: '12px 18px', borderRadius: m.role === 'ai' ? '0 18px 18px 18px' : '18px 0 18px 18px', 
                     background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                     border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.15)' : '1px solid rgba(255, 255, 255, 0.06)', 
                     fontSize: 16, lineHeight: 1.5, color: '#e2e8f0' 
                   }}>
                     <AiMessageRenderer text={m.text} />
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 24px 24px 24px', background: '#05070a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#0a0f1e', borderRadius: '40px', padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(56,189,248,0.15)' }}>
              <input 
                placeholder="환자 상태 또는 처치 방법에 대해 질문하세요..." 
                value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 16, fontWeight: 500 }} 
              />
              <button onClick={handlePromptAnalysis} style={{ padding: '0 24px', height: 40, borderRadius: '30px', border: 'none', background: '#38bdf8', color: '#000', fontWeight: 950, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                질문 <ArrowUp size={16} strokeWidth={3} />
              </button>
            </div>
            
            <button onClick={handleTraumaAnalysis} style={{ width: '100%', padding: '16px', borderRadius: 14, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 950, fontSize: 18, cursor: 'pointer' }}>
              <Camera size={22} /> 외상 촬영 및 AI 정밀 분석
            </button>
          </div>
        </div>
      </section>

      {/* [Right] Timeline */}
      <aside style={{ display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px', scrollbarWidth: 'none' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#475569', letterSpacing: '1.5px', marginBottom: 36 }}>상황 대응 타임라인</div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, #f43f5e, #facc15, #38bdf8)' }} />
            <div style={{ position: 'relative', paddingLeft: 36, paddingBottom: 48 }}>
              <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#f43f5e', border: '4px solid #05070a', boxShadow: '0 0 0 2px #f43f5e', zIndex: 2 }} />
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', borderRadius: 20, padding: '24px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#f43f5e', marginBottom: 8 }}>09:12 · 사고 발생</div>
                <div style={{ fontSize: 20, fontWeight: 950, color: '#fff' }}>기관실 2층 추락 발생</div>
              </div>
            </div>
            {[
              { time: '09:18', title: 'AI 프로토콜 가동', color: '#facc15' },
              { time: '09:25', title: '의무실 이송 완료', color: '#38bdf8' }
            ].map((item, idx) => (
              <div key={idx} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 40 }}>
                <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#05070a', border: `3px solid ${item.color}`, zIndex: 2 }} />
                <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.time}</div>
                <div style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes scanMove {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}

function AiMessageRenderer({ text }) {
  if (!text) return null;
  const confMatch = text.match(/\[CONFIDENCE: (.*?)\]/);
  const evidenceMatch = text.match(/\[EVIDENCE: (.*?)\]/);
  const guideMatch = text.match(/\[GUIDE: (.*?)\]/);
  const confidence = confMatch ? confMatch[1] : null;
  const evidence = evidenceMatch ? evidenceMatch[1] : null;
  const guide = guideMatch ? guideMatch[1] : null;
  const cleanText = text.replace(/\[.*?\]/g, '').trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ whiteSpace: 'pre-line' }}>{cleanText}</div>
      {(confidence || evidence || guide) && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {confidence && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={14}/> AI 진단 신뢰도</span>
                <span style={{ fontSize: 15, fontWeight: 950, color: '#38bdf8' }}>{confidence}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: confidence, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: 3 }} />
              </div>
            </div>
          )}
          {evidence && (
            <div style={{ background: 'rgba(56,189,248,0.08)', padding: '16px 18px', borderRadius: 16, border: '1px solid rgba(56,189,248,0.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><Info size={14}/> AI 분석 판단 근거</div>
              <div style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.5 }}>{evidence}</div>
            </div>
          )}
          {guide && (
            <button style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={16} color="#38bdf8" /> 의학 가이드 확인 : {guide} <ChevronRight size={14}/>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
