import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Settings, XCircle, Clock, Users, DollarSign, Pin, Heart } from 'lucide-react';
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
        activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        console.error('Failed to access camera in live page', err);
        alert('Cannot access camera. Returning to home.');
        navigate('/');
      }
    };
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  // Simulate Comments, Viewers, Sales, Duration, and Hearts
  useEffect(() => {
    let commentCount = 0;
    const maxComments = 1000; // Let it run longer

    // Timer for duration
    const timerInterval = setInterval(() => {
      setLiveDuration(prev => prev + 1);
    }, 1000);

    let heartId = 0;
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

      // Add more hearts to make it look active (3 to 6 per tick)
      const newHearts = Array.from({ length: Math.floor(Math.random() * 4) + 3 }).map(() => ({
        id: heartId++,
        left: Math.random() * 80 + 10, // 10% to 90%
        size: Math.random() * 12 + 16,
        color: ['#fe2c55', '#ff9900', '#ff00ff', '#ff1493', '#ff69b4'][Math.floor(Math.random() * 5)],
        duration: Math.random() * 3 + 4, // 4 to 7 seconds duration
      }));

      setHearts(prev => {
        const updated = [...prev, ...newHearts];
        return updated.slice(-60); // Keep more hearts in memory since they last longer
      });

    }, 1500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(dataInterval);
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
          <div className="stat-badge">
            <Clock size={16} /> {formatDuration(liveDuration)}
          </div>
        </div>
        <div className="header-right">
          <div className="stat-badge">
            <Users size={16} /> {viewers.toLocaleString()} คนดู
          </div>
          <div className="stat-badge success">
            <DollarSign size={16} /> ยอดขาย: ฿{sales.toLocaleString()}
          </div>
          <button className="end-stream-btn" onClick={handleEndLive}>
            <XCircle size={18} /> จบการไลฟ์
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
                    animation: `floatUp ${h.duration}s ease-in-out forwards` 
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
          </div>

          <div className="controls-bar">
            <button className={`control-btn ${isMicMuted ? 'danger' : ''}`} onClick={toggleMic}>
              {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
              <span>{isMicMuted ? 'เปิดไมค์' : 'ปิดไมค์'}</span>
            </button>
            <button className={`control-btn ${isVideoMuted ? 'danger' : ''}`} onClick={toggleVideo}>
              {isVideoMuted ? <VideoOff size={24} /> : <Video size={24} />}
              <span>{isVideoMuted ? 'เปิดกล้อง' : 'ปิดกล้อง'}</span>
            </button>
            <button className="control-btn">
              <Settings size={24} />
              <span>ตั้งค่า</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Chat Stream */}
        <div className="chat-panel">
          <div className="chat-header">
            <h3>คอมเมนต์สด ({comments.length})</h3>
            <Pin size={16} className="text-muted" />
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
