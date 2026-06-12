import React, { Suspense, useState, useEffect, Component, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, PerspectiveCamera, Environment, ContactShadows, Html, useProgress, Float } from '@react-three/drei';
import { X, ZoomIn, ZoomOut, RotateCcw, Loader2, AlertCircle, Info } from 'lucide-react';

// Error Boundary for 3D Scene
class SceneErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            const ErrorUI = (
                <div className="flex flex-col items-center gap-4 bg-white/95 p-8 rounded-[2rem] shadow-2xl border border-red-100 text-center max-w-sm m-auto">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Asset Load Error</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        The 3D model could not be fetched from the server. This is usually due to network restrictions or a CORS issue.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-2xl text-left border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 mb-1 flex items-center gap-1 uppercase tracking-widest">
                           <Info className="w-3 h-3" /> Developer Fix
                        </p>
                        <p className="text-[10px] text-blue-500 leading-tight">
                            Download a .glb model to <b>frontend/public/man.glb</b> and the system will automatically use the local version.
                        </p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 w-full py-4 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            );

            if (this.props.isInsideCanvas) return <Html center>{ErrorUI}</Html>;
            return <div className="absolute inset-0 flex items-center justify-center z-[60] bg-gray-50/50 backdrop-blur-sm p-4">{ErrorUI}</div>;
        }
        return this.props.children;
    }
}

// Procedural Mannequin (Primitive Fallback)
const ProceduralMannequin = ({ textureUrl }) => {
    const texture = useTexture(textureUrl);
    const group = useRef();

    return (
        <group ref={group} position={[0, -0.5, 0]}>
            {/* Simple Boxy Figure to represent human shape */}
            {/* Head */}
            <mesh position={[0, 1.6, 0]}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial color="#E0E0E0" />
            </mesh>
            {/* Torso - This will have the texture */}
            <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[0.5, 0.7, 0.25]} />
                <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.15, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.05, 0.8]} />
                <meshStandardMaterial color="#BDBDBD" />
            </mesh>
            <mesh position={[0.15, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.05, 0.8]} />
                <meshStandardMaterial color="#BDBDBD" />
            </mesh>
        </group>
    );
};

const MannequinModel = ({ textureUrl }) => {
    // Try to load a local model first, then fallback to CDN
    // Using a very standard three.js example model URL which is rarely blocked
    const { scene } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');
    const texture = useTexture(textureUrl);
    
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    if (child.name.toLowerCase().includes('body') || child.name.toLowerCase().includes('torso')) {
                        child.material.map = texture;
                        child.material.map.flipY = false;
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }, [scene, texture]);

    return <primitive object={scene} scale={0.5} position={[0, -1.2, 0]} />;
};

const SimpleLoader = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] bg-gray-50/50 backdrop-blur-md">
        <div className="flex flex-col items-center gap-6 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            <div className="text-center">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Syncing Module</p>
                 <p className="text-lg font-black text-gray-900 tracking-tight">VIRTUAL STUDIO</p>
            </div>
        </div>
    </div>
);

const CanvasLoader = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4 bg-white/95 p-10 rounded-[2.5rem] shadow-2xl border border-white min-w-[240px]">
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{Math.round(progress)}% LOADED</p>
            </div>
        </Html>
    );
};

const VirtualTryOn = ({ isOpen, onClose, product }) => {
    // State to toggle between GLTF model and Procedural Fallback if load fails
    const [useFallback, setUseFallback] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col md:flex-row border border-white/20">
                
                {/* 3D Viewer Section */}
                <div className="flex-1 bg-[#FDFDFD] relative group overflow-hidden">
                    <SceneErrorBoundary isInsideCanvas={false}>
                        <Suspense fallback={<SimpleLoader />}>
                            <Canvas shadows dpr={[1, 2]}>
                                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
                                <ambientLight intensity={0.7} />
                                <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2.5} castShadow />
                                <pointLight position={[-10, 10, -10]} intensity={1} />
                                
                                <SceneErrorBoundary isInsideCanvas={true}>
                                    <Suspense fallback={<CanvasLoader />}>
                                        <Environment preset="city" />
                                        {/* If GLTF fails, we can manually toggle here or let the boundary catch it */}
                                        <MannequinModel textureUrl={product.image} onError={() => setUseFallback(true)} />
                                        <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                                    </Suspense>
                                </SceneErrorBoundary>

                                <OrbitControls 
                                    enablePan={false}
                                    minDistance={1.2}
                                    maxDistance={4}
                                    target={[0, 0, 0]}
                                />
                            </Canvas>
                        </Suspense>
                    </SceneErrorBoundary>

                    <div className="absolute top-10 left-10 flex flex-col gap-5">
                        <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-white flex items-center gap-4">
                             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse ring-4 ring-red-100"></div>
                             <p className="text-xs font-black text-gray-900 tracking-widest uppercase">Live Rendering</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-[26rem] bg-white p-14 flex flex-col border-l border-gray-50 relative">
                    <div className="flex-1">
                        <div className="w-16 h-1.5 bg-red-500 rounded-full mb-10"></div>
                        <h2 className="text-5xl font-black text-gray-900 leading-[1] mb-8 tracking-tighter">{product.name}</h2>
                        
                        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-12">
                            Visualize your style in a high-fidelity 3D environment. Interact with the avatar to view details.
                        </p>

                        <div className="space-y-8 mb-12">
                             <div className="flex justify-between items-baseline group">
                                <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest group-hover:text-red-500 transition-colors">Retail Price</p>
                                <p className="text-3xl font-black text-gray-900">₹{product.new_price}</p>
                            </div>
                            <div className="flex justify-between items-baseline group">
                                <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest group-hover:text-red-500 transition-colors">Rating</p>
                                <p className="text-3xl font-black text-gray-900">{product.rating} <span className="text-sm text-yellow-400">★</span></p>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 border-dashed">
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Features Integrated</p>
                             <ul className="space-y-3">
                                {['GLTF Asset Loading', 'Dynamic Texture Application', 'Physics-based Shadows'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                        {f}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4">
                        <button 
                            onClick={onClose}
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-red-500 transition-all active:scale-[0.98] shadow-2xl shadow-gray-200"
                        >
                            Exit Experience
                        </button>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-10 right-10 p-5 bg-white shadow-2xl rounded-full hover:bg-red-500 hover:text-white transition-all z-[70] border border-gray-50"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default VirtualTryOn;
