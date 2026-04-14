import { useState } from 'react'
import { Database, Settings, Ship } from 'lucide-react'
import { LoginInput } from '../../../components/ui/index.jsx'
import logoImg from '../../../assets/logo.png'

export default function LoginView({ onLogin, loginData, setLoginData, mousePos, setMousePos }) {
  const [focusedField, setFocusedField] = useState(null)

  return (
    <div
      style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#020b16', color:'#fff', fontFamily:'Pretendard', overflow:'hidden', position:'relative', cursor:'default' }}
      onMouseMove={e => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })}
    >
      {/* ══ 상단: 수면 위 배경 (Sky/Surface Above) ══ */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%', background:'linear-gradient(180deg, #020b16 0%, #051a2e 100%)', pointerEvents:'none' }}/>

      {/* ══ 하단: 수면 아래 배경 (Underwater Deep) ══ */}
      <div style={{ position:'absolute', top:'45%', left:0, right:0, bottom:0, background:'#041a2e', pointerEvents:'none' }}/>

      {/* ══ 수평선 물결 애니메이션 (참고 이미지 기반) ══ */}
      <div style={{ position:'absolute', left:0, right:0, top:'45%', height:'55%', zIndex:5, pointerEvents:'none', transform:`translateY(${(mousePos.y - 0.5) * 10}px)`, transition:'transform 1.2s ease-out' }}>
        {/* 심해 레이어 */}
        <svg style={{ position:'absolute', top:-40, width:'200%', animation:'waveMove 12s linear infinite', opacity:0.4 }} height="100%" viewBox="0 0 2880 160" preserveAspectRatio="none">
          <path d="M0,80 C180,40 360,120 540,80 C720,40 900,120 1080,80 C1260,40 1440,120 1620,80 C1800,40 1980,120 2160,80 C2340,40 2520,120 2700,80 C2880,40 2880,40 2880,40 L2880,1000 L0,1000Z" fill="#031224"/>
        </svg>
        
        {/* 중간 물결 */}
        <svg style={{ position:'absolute', top:-60, width:'200%', animation:'waveMove 8s linear infinite', opacity:0.6 }} height="100%" viewBox="0 0 2880 160" preserveAspectRatio="none">
          <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 C1680,100 1920,20 2160,60 C2400,100 2640,20 2880,60 L2880,1000 L0,1000Z" fill="#06283d" stroke="#00e5cc33" strokeWidth="1"/>
        </svg>

        {/* 최상단 물결 (하이라이트 라인) */}
        <svg style={{ position:'absolute', top:-80, width:'200%', animation:'waveMove 6s linear infinite', opacity:0.9 }} height="100%" viewBox="0 0 2880 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-surface-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ffeb" stopOpacity="0.6"/>
              <stop offset="5%" stopColor="#00ffeb" stopOpacity="0.9"/>
              <stop offset="15%" stopColor="#10909e" stopOpacity="1"/>
              <stop offset="100%" stopColor="#041a2e" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path d="M0,90 C160,50 320,130 480,90 C640,50 800,130 960,90 C1120,50 1280,130 1440,90 C1600,50 1760,130 1920,90 C2080,50 2240,130 2400,90 C2560,50 2720,130 2880,90 L2880,1000 L0,1000Z" fill="url(#wave-surface-grad)"/>
          <path d="M0,90 C160,50 320,130 480,90 C640,50 800,130 960,90 C1120,50 1280,130 1440,90 C1600,50 1760,130 1920,90 C2080,50 2240,130 2400,90 C2560,50 2720,130 2880,90" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" style={{ filter:'drop-shadow(0 0 10px #fff)' }}/>
        </svg>
      </div>

      {/* ══ 상단 네비 바 ══ */}
      <div style={{ position:'relative', zIndex:10, padding:'22px 48px' }} />

      {/* ══ 메인 콘텐츠 ══ */}
      <div style={{ position:'relative', zIndex:12, flex:1 }}>
        <div style={{ position:'absolute', left:52, top:'42%', transform:'translateY(-50%)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16, background:'rgba(0,229,200,0.08)', border:'1px solid rgba(0,229,200,0.25)', borderRadius:30, padding:'6px 16px' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#00e5cc', boxShadow:'0 0 8px #00e5cc', animation:'loginPulse 2s infinite' }}/>
            <span style={{ fontSize:13, fontWeight:700, color:'#00e5cc', letterSpacing:2.5 }}>Maritime Medical AI System</span>
          </div>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:64, fontWeight:950, lineHeight:1.1, letterSpacing:-2, color:'#ffffff', filter:'drop-shadow(0 4px 24px rgba(255,255,255,0.18))' }}>선박 탑재형<br/>엣지 의료 지원</div>
            <div style={{ fontSize:64, fontWeight:800, lineHeight:1.1, fontStyle:'italic', letterSpacing:-1, marginTop:10, background:'linear-gradient(90deg, #39ff6a 0%, #00ffcc 55%, #00e5ff 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 2px 20px rgba(0,255,180,0.4))', paddingRight:24, paddingBottom:8 }}>AI Medical System</div>
          </div>
          <div style={{ display:'flex', gap:30 }}>
            {[{val:'24H',label:'실시간 바이탈'},{val:'4종',label:'응급처치 분류'},{val:'99%',label:'오프라인 가용'},{val:'12단계',label:'처치 프로토콜'}].map(({val,label})=>(
              <div key={val}>
                <div style={{ fontSize:28, fontWeight:950, color:'#fff', lineHeight:1, letterSpacing:-0.5 }}>{val}</div>
                <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.36)', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:460 }}>
          <div style={{ position:'relative', padding:1.5, borderRadius:28, background:'rgba(0,229,200,0.1)', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-50%', left:'-50%', width:'200%', height:'200%', background:'conic-gradient(transparent, transparent, transparent, #00e5cc)', animation:'borderRotate 4s linear infinite', transformOrigin:'center' }} />
            <div style={{ background:'rgba(5,14,28,0.92)', backdropFilter:'blur(32px)', borderRadius:26.5, padding:'48px 44px', position:'relative', zIndex:2 }}>
              <div style={{ textAlign:'center', marginBottom:36 }}>
                <img src={logoImg} alt="logo" style={{ width:86, height:86, margin:'0 auto 16px', display:'block', objectFit:'contain' }} />
                <div style={{ fontSize:26, fontWeight:900, letterSpacing:0.3, marginBottom:7 }}>MDTS</div>
                <div style={{ fontSize:16, color:'rgba(100,116,139,0.9)' }}>바다 위 어디서든, 멈추지 않는 의료 AI</div>
              </div>
              <form onSubmit={onLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <LoginInput icon={<Database size={20}/>} placeholder="시리얼 넘버" value={loginData.serial} onChange={v=>setLoginData({...loginData,serial:v})} focused={focusedField==='serial'} setFocused={v=>setFocusedField(v?'serial':null)} />
                <LoginInput icon={<Settings size={20}/>} placeholder="기기 번호" value={loginData.device} onChange={v=>setLoginData({...loginData,device:v})} focused={focusedField==='device'} setFocused={v=>setFocusedField(v?'device':null)} />
                <LoginInput icon={<Ship size={20}/>} placeholder="선박 번호" value={loginData.ship} onChange={v=>setLoginData({...loginData,ship:v})} focused={focusedField==='ship'} setFocused={v=>setFocusedField(v?'ship':null)} />
                <button type="submit" style={{ marginTop:10, padding:'22px', borderRadius:18, background:'linear-gradient(90deg,#00c9b1,#00a8e8)', color:'#000', fontWeight:900, border:'none', cursor:'pointer', fontSize:19, boxShadow:'0 4px 28px rgba(0,200,180,0.4)' }}>시스템 접속</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes waveMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes loginPulse { 0%,100%{opacity:1;box-shadow:0 0 6px #00e5cc} 50%{opacity:0.4;box-shadow:0 0 14px #00e5cc} }
        @keyframes borderRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
