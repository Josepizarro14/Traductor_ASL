import { useEffect, useRef } from 'react';

function VideoCapture({ onFrame, currentLetter }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      } 
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(err => console.error("Error accediendo a la cámara:", err));

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 225;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const base64data = canvas.toDataURL('image/jpeg', 0.7);
      onFrame(base64data);
    }, 100);

    return () => clearInterval(interval);
  }, [onFrame]);

  return (
    <div className="video-container">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="video-feed"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="letter-overlay">
        {currentLetter}
      </div>
    </div>
  );
}

export default VideoCapture;