import React, { useEffect, useRef, useState } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { X, Camera as CameraIcon, Download, Loader2, AlertCircle, RefreshCw, ZoomIn, Info } from 'lucide-react';

const FaceTryOn = ({ isOpen, onClose, product }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [offset, setOffset] = useState({ x: 0, y: -20 }); // Manual adjustment
    
    useEffect(() => {
        if (!isOpen) return;

        let camera = null;
        const faceDetection = new FaceDetection({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
            model: 'short',
            minDetectionConfidence: 0.5,
        });

        const productImg = new Image();
        productImg.crossOrigin = "anonymous";
        productImg.src = product.image;

        faceDetection.onResults((results) => {
            if (isLoading) setIsLoading(false);
            
            const canvasCtx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, width, height);

            // 1. Draw Product Image as Base
            canvasCtx.drawImage(productImg, 0, 0, width, height);

            if (results.detections && results.detections.length > 0) {
                setIsFaceDetected(true);
                const detection = results.detections[0].boundingBox;
                
                // 2. Define "Head Position" on the dress
                // In a production app, these coords would come from product metadata
                const targetHeadPos = { 
                    x: width * 0.495, 
                    y: height * 0.16 + offset.y, 
                    width: width * 0.22, 
                    height: height * 0.18 
                };

                // 3. Draw User Face with Mask
                canvasCtx.save();
                
                // Create Oval Mask
                canvasCtx.beginPath();
                canvasCtx.ellipse(
                    targetHeadPos.x + targetHeadPos.width / 2,
                    targetHeadPos.y + targetHeadPos.height / 2,
                    targetHeadPos.width / 2.2,
                    targetHeadPos.height / 1.8,
                    0, 0, Math.PI * 2
                );
                canvasCtx.clip();

                // Draw face from video
                // We crop from videoRef based on detection bounding box
                const sx = detection.xCenter * videoRef.current.videoWidth - (detection.width * videoRef.current.videoWidth / 2);
                const sy = detection.yCenter * videoRef.current.videoHeight - (detection.height * videoRef.current.videoHeight / 1.5);
                const sw = detection.width * videoRef.current.videoWidth;
                const sh = detection.height * videoRef.current.videoHeight;

                canvasCtx.drawImage(
                    videoRef.current,
                    sx, sy, sw, sh,
                    targetHeadPos.x, targetHeadPos.y, targetHeadPos.width, targetHeadPos.height
                );

                // Add subtle shadow/glow to blend
                canvasCtx.restore();
                
                // Feathered Edge
                canvasCtx.beginPath();
                canvasCtx.ellipse(
                    targetHeadPos.x + targetHeadPos.width / 2,
                    targetHeadPos.y + targetHeadPos.height / 2,
                    targetHeadPos.width / 2.2,
                    targetHeadPos.height / 1.8,
                    0, 0, Math.PI * 2
                );
                canvasCtx.strokeStyle = 'rgba(255,255,255,0.1)';
                canvasCtx.lineWidth = 10;
                canvasCtx.stroke();
            } else {
                setIsFaceDetected(false);
            }
            canvasCtx.restore();
        });

        if (videoRef.current) {
            camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await faceDetection.send({ image: videoRef.current });
                },
                width: 640,
                height: 480,
            });
            
            camera.start().catch(err => {
                console.error("Camera Start Error:", err);
                if (err.name === "NotReadableError") {
                    setError("Camera is already in use by another application or tab. Please close other apps and try again.");
                } else {
                    setError("Camera access denied or device not supported.");
                }
                setIsLoading(false);
            });
        }

        return () => {
            if (camera) {
                camera.stop();
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            faceDetection.close();
        };
    }, [isOpen, product.image, offset]);

    const takeScreenshot = () => {
        const link = document.createElement('a');
        link.download = `style-match-${product.name}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
            
            {/* Header */}
            <div className="w-full max-w-2xl mb-6 flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-red-500 p-3 rounded-2xl">
                         <CameraIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-xl tracking-tight uppercase">Face Match AI</h2>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none">Smart Overlay Studio</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-3 bg-white/10 hover:bg-red-500 text-white rounded-full transition-all">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="relative group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <video ref={videoRef} className="hidden" playsInline muted />
                <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={1000} 
                    className="max-h-[70vh] w-auto aspect-[4/5] object-contain rounded-[3rem] border border-white/10 shadow-2xl bg-zinc-900"
                />

                {/* Overlays */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl rounded-[3rem] z-10 transition-opacity">
                        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-6" />
                        <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Scanning Bio-metrics</p>
                    </div>
                )}

                {!isFaceDetected && !isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-[3rem] z-10 pointer-events-none">
                        <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl text-center animate-bounce">
                             <p className="text-white font-bold text-sm">Face Not Detected</p>
                             <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Adjust position in frame</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-zinc-900 rounded-[3rem] z-20">
                        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-4">ENGINE ERROR</h3>
                        <p className="text-white/40 text-sm mb-10">{error}</p>
                        <button onClick={onClose} className="px-12 py-5 bg-white text-black font-black uppercase text-xs rounded-full">Back to Shop</button>
                    </div>
                )}
            </div>

            {/* Float Controls */}
            <div className="mt-8 flex items-center gap-6">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-6">
                    <div className="flex flex-col items-center">
                         <p className="text-[8px] font-black text-white/20 uppercase mb-2">Adjust Y</p>
                         <div className="flex gap-3">
                            <button onClick={() => setOffset(p => ({...p, y: p.y - 5}))} className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-colors"><ZoomIn className="w-4 h-4 text-white rotate-180" /></button>
                            <button onClick={() => setOffset(p => ({...p, y: p.y + 5}))} className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-colors"><ZoomIn className="w-4 h-4 text-white" /></button>
                         </div>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10"></div>
                    <button 
                        onClick={takeScreenshot}
                        className="flex items-center gap-4 px-10 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                    >
                        <Download className="w-5 h-5" />
                        Save Portrait
                    </button>
                </div>
            </div>

            <p className="mt-8 text-white/40 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Info className="w-3 h-3" /> Use portrait mode for best results
            </p>
        </div>
    );
};

export default FaceTryOn;
