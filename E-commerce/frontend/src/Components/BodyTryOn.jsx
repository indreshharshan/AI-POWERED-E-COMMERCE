import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { X, Camera as CameraIcon, Info, Sun, Activity, Loader2 } from 'lucide-react';

const BodyTryOn = ({ isOpen, onClose, product }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    
    // UI state
    const [selectedColor, setSelectedColor] = useState('black');
    const [selectedSize, setSelectedSize] = useState('M');
    const selectedSizeRef = useRef('M');
    const [selectedBackground, setSelectedBackground] = useState('Original');
    
    useEffect(() => {
        selectedSizeRef.current = selectedSize;
    }, [selectedSize]);
    
    useEffect(() => {
        if (!isOpen) return;

        let camera = null;
        const pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        // Setup image processor for the dress
        const dressImage = new Image();
        dressImage.crossOrigin = "Anonymous";
        dressImage.src = product.image;
        
        let processedDressCanvas = document.createElement('canvas');
        let isDressProcessed = false;

        dressImage.onload = () => {
            // For new flat-lay products, use the full image to preserve collars and hems
            const cropY = 0; 
            const cropH = dressImage.height; 
            
            processedDressCanvas.width = dressImage.width;
            processedDressCanvas.height = cropH;
            
            const pCtx = processedDressCanvas.getContext('2d');
            // Draw only the cropped portion
            pCtx.drawImage(dressImage, 0, cropY, dressImage.width, cropH, 0, 0, dressImage.width, cropH);
            
            // Remove white/light background to make it transparent
            try {
                const imgData = pCtx.getImageData(0, 0, processedDressCanvas.width, processedDressCanvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];
                    
                    // If pixel is very close to white, make it fully transparent
                    if (r > 240 && g > 240 && b > 240) {
                        data[i+3] = 0; 
                    } 
                    // Soften the edges for pixels that are light gray
                    else if (r > 220 && g > 220 && b > 220) {
                        data[i+3] = 150; 
                    }
                }
                pCtx.putImageData(imgData, 0, 0);
                isDressProcessed = true;
            } catch (e) {
                console.error("Canvas CORS issue:", e);
                // Fallback to un-transparent if canvas is tainted
                isDressProcessed = true; 
            }
        };

        pose.onResults((results) => {
            if (isLoading) setIsLoading(false);
            
            const canvasCtx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, width, height);
            
            // Draw the camera frame
            canvasCtx.drawImage(results.image, 0, 0, width, height);

            if (results.poseLandmarks && isDressProcessed) {
                const landmarks = results.poseLandmarks;
                
                const nose = landmarks[0];
                const leftShoulder = landmarks[11];
                const rightShoulder = landmarks[12];
                const leftHip = landmarks[23];
                const rightHip = landmarks[24];

                if (leftShoulder.visibility > 0.5 && rightShoulder.visibility > 0.5) {
                    const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
                    const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

                    const shoulderWidth = Math.hypot(
                        (leftShoulder.x - rightShoulder.x) * width,
                        (leftShoulder.y - rightShoulder.y) * height
                    );

                    // Calculate precise torso height using hips if visible, else estimate
                    let torsoHeight;
                    if (leftHip.visibility > 0.5 && rightHip.visibility > 0.5) {
                        const midHipX = (leftHip.x + rightHip.x) / 2;
                        const midHipY = (leftHip.y + rightHip.y) / 2;
                        torsoHeight = Math.hypot(
                            (midShoulderX - midHipX) * width,
                            (midShoulderY - midHipY) * height
                        );
                    } else {
                        // Estimate torso height based on shoulder proportions
                        torsoHeight = shoulderWidth * 1.8;
                    }

                    // Apply dynamic sizing based on user selected size
                    let sizeMultiplier = 1.0;
                    switch (selectedSizeRef.current) {
                        case 'S': sizeMultiplier = 0.85; break;
                        case 'M': sizeMultiplier = 1.0; break;
                        case 'L': sizeMultiplier = 1.15; break;
                        case 'XL': sizeMultiplier = 1.30; break;
                    }

                    // Dynamic Dress Sizing tailored to user's exact body measurements and selected fit
                    // Multiplying by 2.2 to account for sleeves dropping past the shoulder joints
                    const dressWidth = shoulderWidth * 2.2 * sizeMultiplier; 
                    
                    // Multiplying by 1.4 to ensure the clothing drops naturally past the waist/hips
                    const dressHeight = torsoHeight * 1.4 * sizeMultiplier;

                    // Anchor the dress to the center of the collarbone
                    const centerX = midShoulderX * width;
                    const centerY = midShoulderY * height;

                    // Calculate the natural tilt of the shoulders
                    const angle = Math.atan2(
                        (leftShoulder.y - rightShoulder.y) * height,
                        (leftShoulder.x - rightShoulder.x) * width
                    );

                    canvasCtx.save();
                    canvasCtx.translate(centerX, centerY);
                    canvasCtx.rotate(angle);
                    
                    // 1. Add realistic drop shadow to create 3D depth against the body
                    canvasCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                    canvasCtx.shadowBlur = 20;
                    canvasCtx.shadowOffsetX = 0;
                    canvasCtx.shadowOffsetY = 10;
                    
                    // 2. Use 'multiply' blend mode so the user's real shirt wrinkles and lighting show THROUGH the dress
                    // This gives a profound "real-time feel" as the cloth conforms to their actual lighting
                    canvasCtx.globalCompositeOperation = 'multiply';
                    canvasCtx.globalAlpha = 0.85;

                    const leftElbow = landmarks[13];
                    const rightElbow = landmarks[14];

                    // --- Dynamic 2D Articulated Mesh System ---
                    // Slices the static product image into 3 parts (Torso, Left Sleeve, Right Sleeve)
                    // and dynamically rotates the sleeves based on the user's elbow joints in real-time.
                    const drawArticulatedDress = () => {
                        const lSleevePct = 0.25;
                        const rSleevePct = 0.25;
                        const torsoPct = 0.50;

                        const pWidth = processedDressCanvas.width;
                        const pHeight = processedDressCanvas.height;
                        const lsSrcW = pWidth * lSleevePct;
                        const rsSrcW = pWidth * rSleevePct;
                        const tSrcW = pWidth * torsoPct;
                        const tSrcX = lsSrcW;

                        const lsDestW = dressWidth * lSleevePct;
                        const rsDestW = dressWidth * rSleevePct;
                        const tDestW = dressWidth * torsoPct;
                        const tDestX = (-dressWidth / 2) + lsDestW;

                        // 1. Draw Center Torso
                        canvasCtx.drawImage(
                            processedDressCanvas,
                            tSrcX, 0, tSrcW, pHeight,
                            tDestX, -dressHeight * 0.18, tDestW, dressHeight
                        );

                        // 2. Draw Left Sleeve (Image Left, mapped to User's Right Arm)
                        let lSleeveRot = 0;
                        if (rightElbow && rightElbow.visibility > 0.4) {
                            let rArmAngle = Math.atan2((rightElbow.y - rightShoulder.y)*height, (rightElbow.x - rightShoulder.x)*width);
                            let relRArmAngle = rArmAngle - angle;
                            lSleeveRot = relRArmAngle - (Math.PI / 2); 
                            // Constrain to realistic fabric tearing limits
                            if (lSleeveRot < -Math.PI/1.2) lSleeveRot = -Math.PI/1.2;
                            if (lSleeveRot > Math.PI/4) lSleeveRot = Math.PI/4;
                        }

                        canvasCtx.save();
                        canvasCtx.translate(-shoulderWidth / 2.2, 0); // Pivot at left shoulder
                        canvasCtx.rotate(lSleeveRot);
                        canvasCtx.drawImage(
                            processedDressCanvas,
                            0, 0, lsSrcW, pHeight,
                            -lsDestW, -dressHeight * 0.18, lsDestW, dressHeight
                        );
                        canvasCtx.restore();

                        // 3. Draw Right Sleeve (Image Right, mapped to User's Left Arm)
                        let rSleeveRot = 0;
                        if (leftElbow && leftElbow.visibility > 0.4) {
                            let lArmAngle = Math.atan2((leftElbow.y - leftShoulder.y)*height, (leftElbow.x - leftShoulder.x)*width);
                            let relLArmAngle = lArmAngle - angle;
                            rSleeveRot = relLArmAngle - (Math.PI / 2); 
                            // Constrain to realistic fabric tearing limits
                            if (rSleeveRot > Math.PI/1.2) rSleeveRot = Math.PI/1.2;
                            if (rSleeveRot < -Math.PI/4) rSleeveRot = -Math.PI/4;
                        }

                        canvasCtx.save();
                        canvasCtx.translate(shoulderWidth / 2.2, 0); // Pivot at right shoulder
                        canvasCtx.rotate(rSleeveRot);
                        canvasCtx.drawImage(
                            processedDressCanvas,
                            pWidth - rsSrcW, 0, rsSrcW, pHeight,
                            0, -dressHeight * 0.18, rsDestW, dressHeight
                        );
                        canvasCtx.restore();
                    };

                    drawArticulatedDress();
                    
                    // 3. Draw it again normally with partial opacity to restore the product's color brilliance
                    canvasCtx.shadowColor = 'transparent';
                    canvasCtx.globalCompositeOperation = 'source-over';
                    canvasCtx.globalAlpha = 0.85;
                    drawArticulatedDress();
                    canvasCtx.restore();

                    // 4. REALISM MAGIC: Redraw the user's head & neck OVER the dress.
                    // This prevents the dress from looking like a flat sticker pasted over the user's chin.
                    if (nose.visibility > 0.5) {
                        canvasCtx.save();
                        canvasCtx.beginPath();
                        
                        // Create an ellipse clip path around the head and neck
                        const headRadiusX = shoulderWidth * 0.35;
                        const headRadiusY = shoulderWidth * 0.55;
                        
                        // The center of the head is at the nose
                        canvasCtx.ellipse(
                            nose.x * width, 
                            (nose.y * height) - (headRadiusY * 0.1), // shift slightly up 
                            headRadiusX, 
                            headRadiusY, 
                            0, 0, Math.PI * 2
                        );
                        
                        // Soften the edge of the head clip
                        canvasCtx.filter = 'blur(4px)';
                        canvasCtx.clip();
                        
                        // Redraw the webcam video just for the head area
                        canvasCtx.drawImage(results.image, 0, 0, width, height);
                        canvasCtx.restore();
                    }
                }
            }
            canvasCtx.restore();
        });

        if (videoRef.current) {
            camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await pose.send({ image: videoRef.current });
                },
                width: 1280,
                height: 720,
                facingMode: facingMode
            });
            
            camera.start().catch(err => {
                console.error("Camera Start Error:", err);
                if (err.name === "NotReadableError") {
                    setError("Camera is already in use.");
                } else {
                    setError("Camera access denied.");
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
            pose.close();
        };
    }, [isOpen, facingMode, product.image]);

    const takeScreenshot = () => {
        const link = document.createElement('a');
        link.download = `try-on-${product.name}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] bg-[#f4f5f9] flex flex-col pt-8 pb-8 px-4 sm:px-8 overflow-hidden items-center animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">AR Try-On</h1>
                <p className="text-gray-600 text-sm font-medium">Try clothes in Augmented Reality</p>
                <p className="text-gray-500 text-xs mt-1">Allow camera access to try on outfits virtually.</p>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row w-full max-w-7xl h-[calc(100vh-160px)] gap-6 justify-center">
                
                {/* Left Sidebar: Select Outfit */}
                <div className="w-full lg:w-48 xl:w-56 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col p-5">
                    <h3 className="font-bold text-gray-900 mb-5 text-sm">Select Outfit</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                        {/* Selected Item */}
                        <div className="border-2 border-blue-500 rounded-xl p-3 cursor-pointer bg-blue-50/20 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                            <img src={product.image} className="w-full h-auto object-contain rounded-lg mix-blend-multiply" alt="Selected outfit" />
                        </div>
                        {/* Mock other items to match UI */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-gray-300 transition-colors bg-gray-50">
                                <img src={product.image} className="w-full h-auto object-contain rounded-lg mix-blend-multiply opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all" alt={`Outfit option ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Camera Feed */}
                <div className="flex-1 max-w-4xl bg-[#e5e7eb] rounded-[24px] overflow-hidden relative shadow-sm border border-gray-200/60">
                    <video ref={videoRef} className="hidden" playsInline muted />
                    <canvas 
                        ref={canvasRef} 
                        className="w-full h-full object-cover transform scale-x-[-1]" 
                        width={1280} 
                        height={720} 
                    />
                    
                    {/* States */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f4f5f9] z-10">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium text-sm animate-pulse">Initializing Camera...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f4f5f9] z-10 p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <Info className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-gray-900 font-bold mb-2">Camera Unavailable</p>
                            <p className="text-gray-500 text-sm max-w-xs">{error}</p>
                        </div>
                    )}
                    
                    {/* Capture Button */}
                    {!isLoading && !error && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                            <button 
                                onClick={takeScreenshot} 
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all group"
                            >
                                <CameraIcon className="w-7 h-7 text-blue-500 group-hover:text-blue-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Controls */}
                <div className="w-full lg:w-64 xl:w-72 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-6 text-sm">Try-On Controls</h3>
                    
                    {/* Color */}
                    <div className="mb-7">
                        <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Color</p>
                        <div className="flex gap-3">
                            {['black', 'blue-600', 'gray-500', 'white'].map((c, i) => (
                                <div 
                                    key={c}
                                    onClick={() => setSelectedColor(c)}
                                    className={`w-8 h-8 rounded-full cursor-pointer bg-${c} ${c === 'white' ? 'border border-gray-300' : ''} ${c === 'black' ? 'bg-black' : ''} ${selectedColor === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                    style={c === 'black' ? {backgroundColor: '#000'} : c.includes('blue') ? {backgroundColor: '#2563eb'} : c.includes('gray') ? {backgroundColor: '#6b7280'} : {backgroundColor: '#fff'}}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="mb-7">
                        <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Size</p>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setSelectedSize(s)}
                                    className={`flex-1 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${selectedSize === s ? 'bg-[#0f172a] text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Background */}
                    <div className="mb-8">
                        <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Background</p>
                        <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl">
                            {['Original', 'Studio', 'Outdoor'].map(bg => (
                                <button 
                                    key={bg}
                                    onClick={() => setSelectedBackground(bg)}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${selectedBackground === bg ? 'bg-[#0f172a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {bg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wider">Tips</p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50/50 text-blue-600"><Activity className="w-3.5 h-3.5" /></span>
                                Stand straight for best results
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50/50 text-blue-600"><Sun className="w-3.5 h-3.5" /></span>
                                Ensure good lighting
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50/50 text-blue-600"><Info className="w-3.5 h-3.5" /></span>
                                Allow camera permissions
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.08)] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all border border-gray-100 z-50 group"
            >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
    );
};

export default BodyTryOn;
