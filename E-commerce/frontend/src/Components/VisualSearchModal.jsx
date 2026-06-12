import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUpload, FaXmark, FaMagnifyingGlass, FaSpinner } from 'react-icons/fa6';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const VisualSearchModal = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { setVisualSearchResults, setSearchQuery } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Downscale image
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          setPreview(compressedBase64);
          setImage(compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/products/visualsearch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();

      if (data.success) {
        setVisualSearchResults(data.products);
        setSearchQuery(`AI Search: ${data.analysis.color} ${data.analysis.product_type}`);
        navigate('/collections');
        onClose();
      } else {
        alert(`AI Search Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Error: Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCamera className="text-red-500" /> Visual Search
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaXmark className="text-gray-500" />
              </button>
            </div>

            <div className="p-8">
              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">
                    <FaUpload className="text-2xl text-gray-400 group-hover:text-red-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-900 font-bold">Upload an image</p>
                    <p className="text-gray-500 text-sm">Drag and drop or click to browse</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-inner bg-gray-100">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => { setPreview(null); setImage(null); }}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <FaXmark />
                    </button>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                      loading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200'
                    }`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Analyzing Image...
                      </>
                    ) : (
                      <>
                        <FaMagnifyingGlass /> Search Similar Products
                      </>
                    )}
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="p-6 bg-gray-50 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                Powered by Llama 3.2 Vision
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VisualSearchModal;
