import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, Bell, Database, Wifi, Globe, 
  Server, Activity, Smartphone, LogOut, ChevronRight, 
  Cloud, HardDrive, Cpu, Radio, Battery, Zap, History, UserCheck, Ship,
  Edit2, Save, CheckCircle2, AlertTriangle, MapPin, Users,
  Link, RefreshCw, ShieldCheck, FileText, BarChart3, Clock,
  Table, Key, Download, Trash2, Search
} from 'lucide-react'

export default function Settings() {
  // [기기 및 선박 상태]
  const [shipInfo, setShipInfo] = useState({
    name: 'MV KOREA STAR',
    destination: 'BUSAN, SOUTH KOREA',
    gps: '34°42\'N / 129°02\'E',
    speed: '14.2 knots',
    eta: '2026-04-25 18:00',
    crewCount: 24,
    imoNo: 'IMO 9876543'
  })

  // [DB 상태 데이터 시뮬레이션]
  const [dbStatus, setDbStatus] = useState({
    syncStatus: 'ACTIVE', // ACTIVE, SYNCING, OFFLINE
    lastSync: '2026-04-23 14:20:15',
    pendingRecords: 0,
    storageUsed: '1.2 GB',
    storageTotal: '10.0 GB',
    tableStats: [
      { name: 'tb_crew', records: 24, size: '45 KB' },
      { name: 'tb_medical_history', records: 156, size: '210 KB' },
      { name: 'tb_emergency_logs', records: 89, size: '4.2 MB' },
      { name: 'tb_vital_realtime', records: 45210, size: '840 MB' },
      { name: 'tb_media_scans', records: 32, size: '320 MB' }
    ]
  })

  const [latency, setLatency] = useState(24)
  const [isSyncing, setIsSyncing] = useState(false)

  // 실시간 레이턴시 시뮬레이션
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(prev => Math.max(15, Math.min(45, prev + (Math.random() * 8 - 4))))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleManualSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setDbStatus(prev => ({
        ...prev,
        lastSync: new Date().toLocaleString('ko-KR', { hour12: false }),
        pendingRecords: 0
      }))
    }, 2000)
  }

  return (
    <div style={{ padding: '40px', height: 'calc(100vh - 72px)', background: '#020408', color: '#fff', overflowY: 'auto', fontFamily: '"Pretendard", sans-serif' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* 상단 통합 브리핑 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ padding: '4px 10px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: 6, fontSize: 12, fontWeight: 900, border: '1px solid rgba(56, 189, 248, 0.2)' }}>SYSTEM OPERATIONAL</div>
              <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700 }}>DB 동기화 상태 : {dbStatus.syncStatus}</div>
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 950, marginBottom: 4, letterSpacing: '-1.5px' }}>{shipInfo.name} <span style={{ color: '#64748b', fontWeight: 700, fontSize: 24 }}>Database Control Center</span></h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <HeaderStat label="현재 위치" value={shipInfo.gps} icon={<MapPin size={16}/>} />
            <HeaderStat label="IMO 번호" value={shipInfo.imoNo} icon={<Ship size={16}/>} />
            <HeaderStat label="승선 인원" value={`${shipInfo.crewCount}명`} icon={<Users size={16}/>} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
          
          {/* [Left Column] DB 관리 및 동기화 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* DB 동기화 대시보드 */}
            <section style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(56, 189, 248, 0.02) 100%)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 32, padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8' }}>
                  <Database size={24} /> 실시간 데이터 동기화 (DB Sync)
                </h2>
                <button 
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  style={{ 
                    padding: '12px 24px', borderRadius: 12, background: isSyncing ? 'rgba(56, 189, 248, 0.1)' : '#38bdf8', 
                    color: isSyncing ? '#38bdf8' : '#000', border: 'none', fontWeight: 900, cursor: isSyncing ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, transition: '0.2s'
                  }}
                >
                  <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? '동기화 중...' : '수동 동기화 실행'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
                <DbStatCard label="마지막 성공" value={dbStatus.lastSync} subValue="정상 전송됨" icon={<CheckCircle2 size={20} color="#10b981" />} />
                <DbStatCard label="전송 대기 중" value={`${dbStatus.pendingRecords} 건`} subValue="실시간 전송 대기" icon={<Cloud size={20} color="#38bdf8" />} />
                <DbStatCard label="위성 통신 상태" value={`${latency.toFixed(0)}ms`} subValue="Starlink Link Active" icon={<Wifi size={20} color="#38bdf8" />} />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 24, padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Table size={18} /> 데이터베이스 테이블 현황 (Database Requirements)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {dbStatus.tableStats.map((table, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr', padding: '16px 8px', borderBottom: i === dbStatus.tableStats.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
                      <span style={{ fontSize: 17, fontWeight: 850, color: '#e2e8f0' }}>{table.name}</span>
                      <span style={{ fontSize: 15, color: '#64748b', fontWeight: 700 }}>{table.records.toLocaleString()} records</span>
                      <span style={{ fontSize: 15, color: '#38bdf8', fontWeight: 800 }}>{table.size}</span>
                      <div style={{ textAlign: 'right' }}><ChevronRight size={16} color="#334155" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 데이터 보존 및 보안 정책 */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: 28, padding: '24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#a78bfa', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={20} /> 보안 및 백업 정책
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <PolicyItem label="데이터 암호화 (AES-256)" status="활성화됨" />
                  <PolicyItem label="자동 백업 주기" status="매 12시간" />
                  <PolicyItem label="로그 보존 기간" status="5년 (법적 요구사항)" />
                </div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 28, padding: '24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HardDrive size={20} /> 로컬 저장소 최적화
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 800 }}>저장 공간 사용량</span>
                  <span style={{ fontSize: 14, color: '#fff', fontWeight: 900 }}>{dbStatus.storageUsed} / {dbStatus.storageTotal}</span>
                </div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ width: '12%', height: '100%', background: '#f59e0b', borderRadius: 5 }} />
                </div>
                <button style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontWeight: 800, cursor: 'pointer' }}>인덱스 재구성 및 최적화 실행</button>
              </div>
            </section>

          </div>

          {/* [Right Column] 서버 정보 및 연결 로그 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* 육상 서버 연결 설정 */}
            <section style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 32, padding: '28px' }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#10b981' }}>
                <Server size={22} /> 육상 서버 연결 (Remote Center)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>의료 지원 센터 (본부)</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>End-point URL</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#38bdf8', marginBottom: 16 }}>https://api.maritime-medical.center/v1</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 800 }}>연결 테스트</button>
                    <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 800 }}>키 갱신</button>
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: 14, color: '#64748b', fontWeight: 800, marginBottom: 12 }}>데이터 전송 암호화 키</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.3)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Key size={16} color="#64748b" />
                    <span style={{ fontSize: 14, color: '#475569', fontWeight: 700, letterSpacing: '2px' }}>••••••••••••••••••••••••</span>
                    <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#38bdf8', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>변경</button>
                  </div>
                </div>
              </div>
            </section>

            {/* 시스템 통계 및 로그 */}
            <section style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 32, padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#cbd5e1' }}>
                <History size={22} /> DB 트랜잭션 로그
              </h2>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <LogItem time="15:32" event="tb_vital_realtime (42건) 전송 완료" type="success" />
                <LogItem time="15:30" event="Remote DB 동기화 세션 시작" type="info" />
                <LogItem time="14:55" event="tb_emergency_logs 새로운 레코드 삽입" type="info" />
                <LogItem time="14:10" event="데이터 정합성 체크 (Validation) 성공" type="success" />
                <LogItem time="12:45" event="위성 통신 단절 감지 - 로컬 큐 저장 시작" type="warning" />
                <LogItem time="12:44" event="서버 연결 타임아웃 (Timeout)" type="error" />
                <LogItem time="09:20" event="tb_crew 마스터 데이터 업데이트 완료" type="success" />
              </div>
              <button style={{ marginTop: 24, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 800, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Download size={18} /> 로그 데이터 추출 (.csv)
              </button>
            </section>

          </div>

        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}

function HeaderStat({ label, value, icon }) {
  return (
    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{value}</div>
    </div>
  )
}

function DbStatCard({ label, value, subValue, icon }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {icon}
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>{label}</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 950, color: '#fff', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>{subValue}</div>
    </div>
  )
}

function PolicyItem({ label, status }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 15, color: '#94a3b8', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 15, color: '#fff', fontWeight: 900 }}>{status}</span>
    </div>
  )
}

function LogItem({ time, event, type }) {
  const colors = { success: '#10b981', info: '#38bdf8', warning: '#fb923c', error: '#f43f5e' }
  return (
    <div style={{ display: 'flex', gap: 15, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: 15, color: '#475569', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0 }}>[{time}]</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[type], flexShrink: 0 }} />
        <span style={{ fontSize: 16, color: '#cbd5e1', fontWeight: 700, lineHeight: 1.4 }}>{event}</span>
      </div>
    </div>
  )
}
