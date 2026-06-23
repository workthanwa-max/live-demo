import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Mic, Camera } from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');

  const handleStartLive = async () => {
    setIsRequesting(true);
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // Stop the tracks immediately as we just needed permission here. We'll request again in Live page
      stream.getTracks().forEach(track => track.stop());
      navigate('/live', { state: { liveTitle: liveTitle || 'ขายของออนไลน์ราคาถูก!' } });
    } catch (err) {
      console.error('Permission denied', err);
      alert('กรุณาอนุญาตการใช้งานกล้องและไมโครโฟนเพื่อเริ่มการไลฟ์สด');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="icon-wrapper">
          <Camera size={48} className="icon-pulse" />
        </div>
        <h1 className="home-title">พร้อมไลฟ์สดแล้วหรือยัง?</h1>
        <p className="home-subtitle">เชื่อมต่อกับลูกค้าของคุณแบบเรียลไทม์ ขายของ พูดคุย และสร้างยอดขาย</p>
        
        <div className="features-list">
          <div className="feature-item">
            <Video className="feature-icon" />
            <span>ภาพวิดีโอคมชัดระดับ HD</span>
          </div>
          <div className="feature-item">
            <Mic className="feature-icon" />
            <span>ระบบเสียงชัดเจน ไม่มีสะดุด</span>
          </div>
        </div>

        <input 
          type="text" 
          className="live-topic-input" 
          placeholder="ตั้งหัวข้อไลฟ์สดของคุณ (เช่น เสื้อผ้าแฟชั่นลดราคา)"
          value={liveTitle}
          onChange={(e) => setLiveTitle(e.target.value)}
        />

        <button 
          className="start-live-btn" 
          onClick={handleStartLive}
          disabled={isRequesting}
        >
          {isRequesting ? 'กำลังขอสิทธิ์เข้าถึง...' : 'เริ่มไลฟ์สด'}
        </button>
      </div>
    </div>
  );
}
