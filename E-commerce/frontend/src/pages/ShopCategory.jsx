import { RiArrowDropDownLine, RiFilter2Line, RiStarFill, RiCheckboxCircleFill } from "react-icons/ri";
import React from "react";
import Item from "../Components/Item";
import { ShopContext } from "../Context/ShopContext";
import { useContext, useState, useMemo } from "react";
import BannerSlider from "../Components/BannerSlider";
import banner2 from '../assets/Banner2.jpeg';
import banner5 from '../assets/Banner5.jpeg';
import banner6 from '../assets/Banner6.jpeg';

const ShopCategory = ({ category: initialCategory, banner }) => {
  const { all_product, searchQuery, visualSearchResults, setVisualSearchResults } = useContext(ShopContext);
  const [sort, setSort] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState([50, 5000]); 
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleOccasionChange = (occ) => {
    if (selectedOccasions.includes(occ)) {
      setSelectedOccasions(selectedOccasions.filter(o => o !== occ));
    } else {
      setSelectedOccasions([...selectedOccasions, occ]);
    }
  };

  const products = useMemo(() => {
    let baseProducts = visualSearchResults || all_product;
    let filtered = initialCategory === "all" ? baseProducts : baseProducts.filter((item) => item.category === initialCategory);
    
    if (searchQuery) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.category));
    }

    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((item) => selectedOccasions.includes(item.occasion));
    }

    filtered = filtered.filter((item) => item.new_price >= priceRange[0] && item.new_price <= priceRange[1]);

    // Filter by Rating
    if (minRating > 0) {
        filtered = filtered.filter((item) => (item.rating || 0) >= minRating);
    }

    // Filter by Stock
    if (inStockOnly) {
        filtered = filtered.filter((item) => item.available !== false);
    }

    // Filter by Discount
    if (minDiscount > 0) {
        filtered = filtered.filter((item) => {
            const discount = ((item.old_price - item.new_price) / item.old_price) * 100;
            return discount >= minDiscount;
        });
    }

    if (sort === "asc") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "desc") {
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sort === "low-high") {
        return [...filtered].sort((a, b) => a.new_price - b.new_price);
    }
    if (sort === "high-low") {
        return [...filtered].sort((a, b) => b.new_price - a.new_price);
    }
    return filtered;
  }, [all_product, initialCategory, sort, searchQuery, selectedCategories, selectedOccasions, priceRange, minRating, inStockOnly, minDiscount]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setPriceRange([50, 5000]);
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setSort("");
    setVisualSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Dynamic Banner Slider */}
      <BannerSlider images={[banner2, banner5, banner6]} />

      {/* Banner Section */}
      {banner && (
        <div className="w-full md:flex hidden h-[250px] mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
             <h1 className="text-4xl font-bold text-white uppercase tracking-widest">{initialCategory} Collection</h1>
          </div>
          <img
            src={banner}
            alt={`${initialCategory} Banner`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter */}
          <aside className={`lg:w-72 flex-shrink-0 transition-all duration-300 ${isFilterVisible ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100 overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <RiFilter2Line className="text-red-500" /> Filters
                </h3>
                <button 
                    onClick={resetFilters}
                    className="text-xs font-medium text-red-500 hover:underline"
                >
                    Reset
                </button>
              </div>

              {/* Stock Toggle */}
              <div className="mb-8">
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-xl cursor-pointer" onClick={() => setInStockOnly(!inStockOnly)}>
                   <span className="text-sm font-bold text-red-600">In Stock Only</span>
                   <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${inStockOnly ? 'bg-red-500' : 'bg-gray-300'}`}>
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-all duration-300 ${inStockOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                   </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {['men', 'women', 'kid'].map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCategories.includes(cat) ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Occasion</h4>
                <div className="space-y-2">
                  {['casual', 'formal', 'party', 'sports', 'ethnic'].map((occ) => (
                    <div 
                        key={occ}
                        onClick={() => handleOccasionChange(occ)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${selectedOccasions.includes(occ) ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50 border border-transparent'}`}
                    >
                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${selectedOccasions.includes(occ) ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
                            {selectedOccasions.includes(occ) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                        <span className={`text-sm font-medium capitalize ${selectedOccasions.includes(occ) ? 'text-red-600' : 'text-gray-600'}`}>{occ}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Customer Ratings</h4>
                <div className="space-y-2">
                   {[4, 3, 2, 1].map((star) => (
                       <div 
                            key={star}
                            onClick={() => setMinRating(star)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${minRating === star ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'}`}
                       >
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <RiStarFill key={i} size={14} className={i < star ? 'text-amber-400' : 'text-gray-200'} />
                                ))}
                                <span className="text-xs font-bold text-gray-500 ml-1">& Up</span>
                            </div>
                            {minRating === star && <RiCheckboxCircleFill className="text-amber-500" />}
                       </div>
                   ))}
                </div>
              </div>

              {/* Discount Filter */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Offers & Discounts</h4>
                <div className="grid grid-cols-2 gap-2">
                    {[10, 30, 50, 70].map((d) => (
                        <button 
                            key={d}
                            onClick={() => setMinDiscount(d)}
                            className={`p-2 rounded-lg text-[10px] font-black border transition-all ${minDiscount === d ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100' : 'bg-white border-gray-200 text-gray-600 hover:border-green-400'}`}
                        >
                            {d}% OFF OR MORE
                        </button>
                    ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest flex justify-between">
                   Price Range <span className="text-red-500">${priceRange[1]}</span>
                </h4>
                <input 
                    type="range" 
                    min="50" 
                    max="5000" 
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([50, parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              <div className="pt-4 text-center">
                 <p className="text-[10px] text-gray-400 font-bold opacity-50 uppercase tracking-tighter">Certified Authentic Products</p>
              </div>
            </div>
          </aside>

          {/* Product Section */}
          <main className="flex-grow">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-red-50 rounded-lg text-red-500 lg:hidden" onClick={() => setIsFilterVisible(!isFilterVisible)}>
                    <RiFilter2Line size={20} />
                 </div>
                 <p className="text-sm text-gray-600">
                   Showing <span className="font-black text-gray-900 text-lg">{products.length}</span> items {visualSearchResults && <span className="text-red-500 font-bold ml-2">(AI Visual Match)</span>}
                 </p>
              </div>
              {visualSearchResults && (
                <button 
                  onClick={() => setVisualSearchResults(null)}
                  className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  Clear Visual Search
                </button>
              )}

              <select
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 outline-none cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">SORT BY: RELEVANCE</option>
                <option value="low-high">PRICE: LOW TO HIGH</option>
                <option value="high-low">PRICE: HIGH TO LOW</option>
                <option value="asc">NAME: A - Z</option>
                <option value="desc">NAME: Z - A</option>
              </select>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((item, index) => (
                    <React.Fragment key={index}>
                        <div 
                            className="reveal-item"
                            style={{ animationDelay: `${(index % 6) * 100}ms` }}
                        >
                            <Item
                                id={item.id}
                                image={item.image}
                                name={item.name}
                                new_price={item.new_price}
                                old_price={item.old_price}
                                category={item.category}
                                rating={item.rating}
                            />
                        </div>
                        
                        {/* Unique Break Sections at specific indexes */}
                        {index === 5 && (
                            <div className="col-span-full my-8 reveal-item">
                                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div>
                                            <span className="text-red-500 font-black text-xs tracking-widest uppercase mb-4 block">Limited Time Offer</span>
                                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">FLASH SALE <br /> UP TO 70% OFF</h2>
                                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl">Explore Sale</button>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="w-48 h-48 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-2xl animate-bounce">
                                                <span className="text-white text-4xl font-black">70%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {index === 11 && (
                            <div className="col-span-full my-8 reveal-item">
                                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-2xl border border-blue-400/20">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div>
                                            <span className="text-blue-400 font-black text-xs tracking-widest uppercase mb-4 block">New Season</span>
                                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">PREMIUM <br /> ACCESSORIES</h2>
                                            <button className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-blue-900 transition-all shadow-xl">Shop Now</button>
                                        </div>
                                        <div className="w-64 h-40 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                            <span className="text-blue-200 text-6xl italic font-black opacity-20">LUXE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {index === 17 && (
                            <div className="col-span-full my-8 reveal-item">
                                <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-2xl border border-emerald-400/20">
                                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div>
                                            <span className="text-emerald-400 font-black text-xs tracking-widest uppercase mb-4 block">Eco-Friendly Collection</span>
                                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">SUSTAINABLE <br /> FASHION</h2>
                                            <button className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-emerald-900 transition-all shadow-xl">Learn More</button>
                                        </div>
                                        <div className="flex gap-4">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-12 h-32 bg-white/10 rounded-full backdrop-blur-md border border-white/10 group-hover:h-40 transition-all duration-700"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RiFilter2Line size={30} className="text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Matching Items</h2>
                    <p className="text-gray-500 mb-8 text-xs">Try adjusting your filters to find what you're looking for.</p>
                    <button onClick={resetFilters} className="bg-red-500 text-white px-10 py-3 rounded-full font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">
                        Reset All Filters
                    </button>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
