import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, Bell, Database, Wifi, Globe, 
  Server, Activity, Smartphone, LogOut, ChevronRight, 
  Cloud, HardDrive, Cpu, Radio, Battery, Zap, History, UserCheck, Ship,
  Edit2, Save, CheckCircle2, AlertTriangle
} from 'lucide-react'

export default function Settings() {
  // [기기 정보 관리 상태]
  const [shipName, setShipName] = useState('MV KOREA STAR')
  const [deviceNo, setDeviceNo] = useState('MED-001')
  const [serialNo, setSerialNo] = useState('SN-2026-X99')
  const [isEditing, setIsEditing] = useState(false)

  // [상태 데이터]
  const [latency, setLatency] = useState(24)
  const [cpuUsage, setCpuUsage] = useState(12)

  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(prev => Math.max(15, Math.min(45, prev + (Math.random() * 10 - 5))))
      setCpuUsage(prev => Math.max(5, Math.min(25, prev + (Math.random() * 4 - 2))))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleSave = () => {
    setIsEditing(false)
    alert('기기 정보가 안전하게 저장되었습니다.')
  }

  return (
    <div style={{ padding: '40px', height: 'calc(100vh - 72px)', background: '#020617', color: '#fff', overflowY: 'auto', fontFamily: '"Pretendard", sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* 상단 제목 : 가장 쉬운 말로 표현 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: 38, fontWeight: 950, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
              <SettingsIcon color="#0dd9c5" size={40} /> 기기 및 통신 관리
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', fontWeight: 700 }}>우리 배의 의료 시스템이 잘 작동하고 있는지 확인하는 곳입니다.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Badge icon={<Ship size={14}/>} label={shipName} color="#38bdf8" />
            <Badge icon={<UserCheck size={14}/>} label="관리자 : 이선장" color="#0dd9c5" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          
          {/* [1] 선박 및 기기 정보 관리 (직접 수정 가능) */}
          <section style={{ background: 'rgba(13, 217, 197, 0.03)', border: '2px solid rgba(13, 217, 197, 0.2)', borderRadius: 32, padding: '32px', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12, color: '#0dd9c5' }}>
                <HardDrive size={26} /> 기기 등록 정보 관리
              </h2>
              {isEditing ? (
                <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: 12, background: '#0dd9c5', color: '#020617', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Save size={18}/> 정보 저장하기
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit2 size={18}/> 정보 수정하기
                </button>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: 16, color: '#64748b', fontWeight: 800, marginLeft: 4 }}>현재 선박명</label>
                <input 
                  disabled={!isEditing}
                  value={shipName}
                  onChange={e => setShipName(e.target.value)}
                  style={{ width: '100%', background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent', border: isEditing ? '1px solid #0dd9c5' : '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '18px 20px', color: '#fff', fontSize: 20, fontWeight: 900, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: 16, color: '#64748b', fontWeight: 800, marginLeft: 4 }}>기기 관리 번호</label>
                <input 
                  disabled={!isEditing}
                  value={deviceNo}
                  onChange={e => setDeviceNo(e.target.value)}
                  style={{ width: '100%', background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent', border: isEditing ? '1px solid #0dd9c5' : '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '18px 20px', color: '#fff', fontSize: 20, fontWeight: 900, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: 16, color: '#64748b', fontWeight: 800, marginLeft: 4 }}>기기 시리얼 번호 (S/N)</label>
                <input 
                  disabled={!isEditing}
                  value={serialNo}
                  onChange={e => setSerialNo(e.target.value)}
                  style={{ width: '100%', background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent', border: isEditing ? '1px solid #0dd9c5' : '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '18px 20px', color: '#fff', fontSize: 20, fontWeight: 900, outline: 'none' }}
                />
              </div>
            </div>
          </section>

          {/* [2] 인터넷 및 육상 연결 상태 (쉬운 용어) */}
          <section style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: '32px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8' }}>
              <Radio size={24} /> 육상과 연결 상태
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <StatusCard 
                label="위성 인터넷 (스타링크)" 
                value="정상 작동 중" 
                sub={`반응 속도 : ${latency.toFixed(0)} ms (매우 빠름)`} 
                color="#0dd9c5" 
                icon={<Globe size={20}/>}
                percentage={85}
              />
              <StatusCard 
                label="의료 센터로 데이터 보내기" 
                value="전송 완료" 
                sub="방금 전 모든 정보가 전송되었습니다." 
                color="#38bdf8" 
                icon={<Server size={20}/>}
                percentage={100}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 10 }}>
                <MiniStat label="인터넷 신호 강도" value="매우 좋음" color="#10b981" />
                <MiniStat label="데이터 전송 속도" value="쾌적함" color="#0dd9c5" />
              </div>
            </div>
          </section>

          {/* [3] 기기 성능 및 건강 상태 (쉬운 용어) */}
          <section style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: '32px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: '#fb923c' }}>
              <Cpu size={24} /> 기기 작동 상태
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <ResourceBar label="기기 머리 쓰는 중 (CPU)" value="여유로움" percentage={cpuUsage} color="#fb923c" />
              <ResourceBar label="동시 작업 가능량 (메모리)" value="넉넉함" percentage={13} color="#a78bfa" />
              <ResourceBar label="기록 저장 공간" value="많이 남음" percentage={12} color="#38bdf8" />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <DeviceBadge name="혈압계" battery={82} status="연결됨" />
                <DeviceBadge name="산소계" battery={45} status="연결됨" />
                <DeviceBadge name="카메라" battery={100} status="대기 중" />
              </div>
            </div>
          </section>

          {/* [4] 최근 있었던 일 (로그) */}
          <section style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: '32px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: '#a78bfa' }}>
              <History size={24} /> 최근 시스템 기록
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <LogItem time="15:32" event="환자 정보가 육상으로 잘 전달되었습니다." type="success" />
              <LogItem time="14:10" event="육상 의료진과 대화 창을 열었습니다." type="info" />
              <LogItem time="12:45" event="경보 : 이선장 선원의 혈압이 조금 높습니다." type="warning" />
              <LogItem time="09:20" event="의료 시스템이 최신 버전으로 업데이트되었습니다." type="success" />
              <button style={{ marginTop: 10, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>더 많은 기록 보기</button>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

function Badge({ icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: 14, fontWeight: 800 }}>
      {icon} {label}
    </div>
  )
}

function StatusCard({ label, value, sub, color, icon, percentage }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{label}</div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{sub}</div>
          </div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 950, color }}>{value}</div>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 950, color }}>{value}</div>
    </div>
  )
}

function ResourceBar({ label, value, percentage, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 15, color: '#cbd5e1', fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 15, color: '#fff', fontWeight: 900 }}>{value}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

function DeviceBadge({ name, battery, status }) {
  return (
    <div style={{ flex: 1, padding: '14px', borderRadius: 18, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Battery size={14} color={battery < 30 ? '#ef4444' : '#10b981'} />
        <span style={{ fontSize: 12, fontWeight: 900, color: battery < 30 ? '#ef4444' : '#10b981' }}>{battery}%</span>
      </div>
      <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, fontWeight: 700 }}>{status}</div>
    </div>
  )
}

function LogItem({ time, event, type }) {
  const colors = { success: '#10b981', info: '#38bdf8', warning: '#fb923c', error: '#f43f5e' }
  return (
    <div style={{ display: 'flex', gap: 15, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: 13, color: '#475569', fontWeight: 800, fontFamily: 'monospace' }}>[{time}]</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[type] }} />
        <span style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 600 }}>{event}</span>
      </div>
    </div>
  )
}

