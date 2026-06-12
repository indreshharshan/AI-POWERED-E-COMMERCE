import React, { useEffect, useState } from 'react';
import { X, Camera, Info, Loader2, Maximize2, RefreshCw } from 'lucide-react';

const ARViewer = ({ isOpen, onClose, product }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        // Load A-Frame and AR.js scripts dynamically
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.3.0/aframe.min.js';
        
        const arjsScript = document.createElement('script');
        arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';

        const loadScripts = async () => {
            try {
                document.head.appendChild(aframeScript);
                await new Promise((resolve) => (aframeScript.onload = resolve));
                
                document.head.appendChild(arjsScript);
                await new Promise((resolve) => (arjsScript.onload = resolve));
                
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load AR engine. Please check your connection.');
                setIsLoading(false);
            }
        };

        loadScripts();

        return () => {
            // Cleanup: AR.js injects a lot of things into the body and video elements
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video.srcObject) {
                    const tracks = video.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }
                video.remove();
            });
            
            const arjsStyles = document.querySelectorAll('style');
            arjsStyles.forEach(style => {
                if (style.innerText.includes('arjs')) style.remove();
            });

            // A-Frame cleanup
            const scene = document.querySelector('a-scene');
            if (scene) scene.remove();

            // Script cleanup
            if (document.head.contains(aframeScript)) document.head.removeChild(aframeScript);
            if (document.head.contains(arjsScript)) document.head.removeChild(arjsScript);
            
            // Reset body styles that AR.js might have changed
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 z-[210] flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="bg-red-500 p-3 rounded-2xl shadow-lg animate-pulse">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-xl tracking-tight uppercase">AR Live View</h2>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{product?.name || 'Smart Mirror'}</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all border border-white/20"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* AR Content Container */}
            <div className="flex-1 relative bg-black">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-[220]">
                        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-6" />
                        <p className="text-white font-black text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Camera & AR Engine</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-900 z-[220]">
                        <div className="bg-red-500/20 p-6 rounded-full mb-6">
                            <RefreshCw className="w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="text-white font-bold text-2xl mb-4">Connection Lost</h3>
                        <p className="text-white/40 text-sm max-w-sm mb-8">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-10 py-4 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                        >
                            Retry Connection
                        </button>
                    </div>
                )}

                {/* The AR Scene - Injected only after scripts load */}
                {!isLoading && !error && (
                    <div className="w-full h-full">
                        {/* 
                            Note: AR.js appends a full-screen canvas/video. 
                            We use dangerouslySetInnerHTML to inject the A-Frame markup 
                            as it's often easier than managing A-Frame React bindings for a quick lab project.
                        */}
                        <div 
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;" vr-mode-ui="enabled: false">
                                        <a-assets>
                                            <a-asset-item id="model" src="${product.image || '/models/model.glb'}"></a-asset-item>
                                        </a-assets>

                                        <a-marker preset="hiro">
                                            <a-entity 
                                                gltf-model="#model" 
                                                scale="1 1 1" 
                                                position="0 0 0" 
                                                rotation="0 0 0"
                                                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
                                            ></a-entity>
                                        </a-marker>

                                        <a-entity light="type: ambient; intensity: 0.8"></a-entity>
                                        <a-entity light="type: directional; position: 1 1 1; intensity: 0.5"></a-entity>
                                        
                                        <a-entity camera></a-entity>
                                    </a-scene>
                                `
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Footer Instructions */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[210] w-[90%] max-w-lg">
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Info className="w-4 h-4 text-red-400" />
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">AR Instruction</span>
                    </div>
                    <h3 className="text-white text-xl font-black mb-2 leading-tight">Point your camera at a <span className="text-red-500 underline decoration-4 underline-offset-4">HIRO marker</span></h3>
                    <p className="text-white/40 text-xs font-medium px-4 leading-relaxed">
                        The virtual {product.category} will appear in your room instantly. You can rotate and scale by moving the marker.
                    </p>
                    
                    <div className="mt-8 flex justify-center gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                            <Maximize2 className="w-5 h-5 text-white/40 mb-2" />
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Real Scale</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                            <RefreshCw className="w-5 h-5 text-white/40 mb-2" />
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">360 View</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ARViewer;
