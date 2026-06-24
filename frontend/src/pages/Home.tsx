import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Mic, Camera, Settings, Sparkles } from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');

  const handleStartLive = async () => {
    setIsRequesting(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request camera and microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Stop the tracks immediately as we just needed permission here. We'll request again in Live page
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.warn('Camera permission denied or not available. Proceeding in simulation mode.', err);
    } finally {
      setIsRequesting(false);
      navigate('/live', { state: { liveTitle: liveTitle || 'ขายของออนไลน์ราคาถูก!' } });
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        
        {/* Header Section */}
        <div className="home-header">
          <div className="icon-wrapper">
            <Camera size={32} />
          </div>
          <div>
            <h1 className="home-title">Live Studio Setup</h1>
            <p className="home-subtitle">เตรียมความพร้อมก่อนเริ่มสตรีมของคุณ</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="setup-section">
          <label className="section-label">หัวข้อไลฟ์ (Live Title)</label>
          <div className="input-group">
            <input 
              type="text" 
              className="live-topic-input" 
              placeholder="เช่น เสื้อผ้าแฟชั่นลดราคา..."
              value={liveTitle}
              onChange={(e) => setLiveTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Features / Settings Preview */}
        <div className="setup-section">
          <label className="section-label">สถานะระบบ (System Status)</label>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper success">
                <Video size={20} />
              </div>
              <div className="feature-info">
                <span className="feature-title">Camera</span>
                <span className="feature-status text-success">พร้อมใช้งาน</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper success">
                <Mic size={20} />
              </div>
              <div className="feature-info">
                <span className="feature-title">Microphone</span>
                <span className="feature-status text-success">พร้อมใช้งาน</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper neutral">
                <Sparkles size={20} />
              </div>
              <div className="feature-info">
                <span className="feature-title">Beauty Filter</span>
                <span className="feature-status text-muted">ปิด</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper neutral">
                <Settings size={20} />
              </div>
              <div className="feature-info">
                <span className="feature-title">Settings</span>
                <span className="feature-status text-muted">ค่าเริ่มต้น</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="start-live-btn" 
          onClick={handleStartLive}
          disabled={isRequesting}
        >
          {isRequesting ? 'กำลังเชื่อมต่อ...' : 'เริ่มไลฟ์สด (Go Live)'}
        </button>

      </div>
    </div>
  );
}
