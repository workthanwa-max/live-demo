import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Settings, Clock, Users, DollarSign, MessageSquare, Heart } from 'lucide-react';
import Comment from '../components/Comment';
import type { CommentData } from '../components/Comment';
import { getRandomComment } from '../data/mockData';
import './Live.css';

interface HeartAnimation {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
}

export default function Live() {
  const navigate = useNavigate();
  const location = useLocation();
  const liveTitle = location.state?.liveTitle || 'กำลังไลฟ์สด...';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  
  const [viewers, setViewers] = useState(1240);
  const [sales, setSales] = useState(0);
  const [liveDuration, setLiveDuration] = useState(0); // in seconds
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Initialize camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(activeStream);
          if (videoRef.current) {
            videoRef.current.srcObject = activeStream;
          }
        } else {
          throw new Error('mediaDevices API not available');
        }
      } catch (err) {
        console.warn('Failed to access camera in live page. Running in simulation mode without camera.', err);
        setIsVideoMuted(true);
        setIsMicMuted(true);
      }
    };
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate Comments, Viewers, Sales, Duration, and Hearts
  useEffect(() => {
    let commentCount = 0;
    const maxComments = 1000;

    // Timer for duration
    const timerInterval = setInterval(() => {
      setLiveDuration(prev => prev + 1);
    }, 1000);

    // Comments data interval
    const dataInterval = setInterval(() => {
      if (commentCount < maxComments) {
        const newComment = getRandomComment(commentCount);
        setComments(prev => [...prev, newComment]);
        
        // If purchased, randomly add to sales
        if (newComment.isPurchased) {
            setSales(prev => prev + (Math.floor(Math.random() * 5) + 1) * 150);
        }

        commentCount++;
        setViewers(prev => prev + Math.floor(Math.random() * 10) - 3);
      } else {
        clearInterval(dataInterval);
      }
    }, 1500);

    // Hearts interval - faster for continuous flow
    let heartId = 0;
    const heartInterval = setInterval(() => {
      // 2 to 5 hearts every 400ms = lots of hearts smoothly appearing
      const newHearts = Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(() => ({
        id: heartId++,
        left: Math.random() * 60 + 20, // 20% to 80% to keep them somewhat grouped
        size: Math.random() * 14 + 18, // slightly larger
        color: ['#fe2c55', '#ff9900', '#ff00ff', '#ff1493', '#ff69b4', '#00e5ff'][Math.floor(Math.random() * 6)],
        duration: Math.random() * 2 + 4, // 4 to 6 seconds duration
      }));

      setHearts(prev => {
        const updated = [...prev, ...newHearts];
        return updated.slice(-150); // Keep up to 150 hearts on screen
      });
    }, 400);

    return () => {
      clearInterval(timerInterval);
      clearInterval(dataInterval);
      clearInterval(heartInterval);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const handleEndLive = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };

  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMicMuted(!audioTracks[0].enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoMuted(!videoTracks[0].enabled);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="live-indicator">
            <span className="live-dot"></span> LIVE
          </div>
          <div className="live-title-display">
            {liveTitle}
          </div>
        </div>
        
        <div className="header-center">
          <div className="metric-card">
            <Clock size={16} className="metric-icon text-muted" />
            <div className="metric-info">
              <span className="metric-value">{formatDuration(liveDuration)}</span>
              <span className="metric-label">เวลา</span>
            </div>
          </div>
          <div className="metric-card">
            <Users size={16} className="metric-icon text-muted" />
            <div className="metric-info">
              <span className="metric-value">{viewers.toLocaleString()}</span>
              <span className="metric-label">ผู้ชม</span>
            </div>
          </div>
          <div className="metric-card highlight">
            <DollarSign size={16} className="metric-icon text-success" />
            <div className="metric-info">
              <span className="metric-value text-success">฿{sales.toLocaleString()}</span>
              <span className="metric-label text-success">ยอดขาย</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="end-stream-btn" onClick={handleEndLive}>
            จบการไลฟ์
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Left Panel: Camera & Controls */}
        <div className="video-panel">
          <div className="video-wrapper">
            <video 
              ref={videoRef} 
              className={`dashboard-video ${isVideoMuted ? 'muted' : ''}`}
              autoPlay 
              playsInline 
              muted 
            />
            {/* Floating Hearts Area */}
            <div className="floating-hearts-container">
              {hearts.map(h => (
                <div 
                  key={h.id} 
                  className="floating-heart" 
                  style={{ 
                    left: `${h.left}%`, 
                    color: h.color, 
                    fontSize: `${h.size}px`,
                    animation: `floatUp ${h.duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards` 
                  }}
                >
                  <Heart fill="currentColor" size={h.size} />
                </div>
              ))}
            </div>
            
            {isVideoMuted && (
              <div className="video-off-overlay">
                <VideoOff size={48} />
                <span>Camera is turned off</span>
              </div>
            )}

            {/* Floating Control Dock */}
            <div className="controls-dock">
              <button 
                className={`dock-btn ${isMicMuted ? 'danger' : ''}`} 
                onClick={toggleMic}
                title={isMicMuted ? 'เปิดไมค์' : 'ปิดไมค์'}
              >
                {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                className={`dock-btn ${isVideoMuted ? 'danger' : ''}`} 
                onClick={toggleVideo}
                title={isVideoMuted ? 'เปิดกล้อง' : 'ปิดกล้อง'}
              >
                {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <div className="dock-divider"></div>
              <button className="dock-btn" title="ตั้งค่า">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat Stream */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-title">
              <MessageSquare size={16} />
              <h3>คอมเมนต์สด ({comments.length})</h3>
            </div>
          </div>
          <div className="chat-stream" ref={chatContainerRef}>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
