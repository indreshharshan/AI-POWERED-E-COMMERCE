
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { API_URL } from "../config";
// import all_product from "../assets/all_product";  
const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i < 300+1; i++) {
    cart[i] = 0;
  }
  return cart;
};




export const ShopContext = createContext(); 

const ShopContextProvider = ({ children }) => {
  const [all_product, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [searchQuery, setSearchQuery] = useState("");
  const [visualSearchResults, setVisualSearchResults] = useState(null);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });
  const [appliedPromo, setAppliedPromo] = useState(null); // { discountAmount, finalAmount, code }
  
  useEffect(() => {
   fetch(`${API_URL}/products/allproducts`).then((res)=> res.json()).then((data)=> setAllProducts(data));
   
    if (localStorage.getItem('auth-token')) {
      fetch(`${API_URL}/cart/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: "",
      }).then((res) => res.json()).then((data) => setCartItems(data));
    }
  },[])


  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem('auth-token')) {
      fetch(`${API_URL}/cart/addtocart`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId })
      }).then((res) => res.json()).then((data) => console.log("Added to cart:", data));
    }
  };
  const removeFromCart = (id) => {
    setCartItems((prev) => ({
      ...prev, [id]: prev[id] - 1
    }))
     if (localStorage.getItem('auth-token')) {
      fetch(`${API_URL}/cart/removefromcart`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": id })
      }).then((res) => res.json()).then((data) => console.log("Removed from cart:", data));
    }
    
  }
  const getTotalAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
            totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  }

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  } 


  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage({ text: "Please enter a promo code", type: "error" });
      return;
    }
    setPromoLoading(true);
    setPromoMessage({ text: "", type: "" });
    try {
      const res = await fetch(`${API_URL}/api/coupon/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.trim(),
          cartTotal: getTotalAmount()
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedPromo({
          code: data.coupon.code,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount
        });
        setPromoMessage({ text: data.message, type: "success" });
      } else {
        setAppliedPromo(null);
        setPromoMessage({ text: data.message, type: "error" });
      }
    } catch (err) {
      setPromoMessage({ text: "Failed to validate promo code. Try again.", type: "error" });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoMessage({ text: "", type: "" });
  };

  const getFinalTotal = () => {
    if (appliedPromo) return appliedPromo.finalAmount;
    return getTotalAmount();
  };

  const contextValue = { 
    all_product, 
    cartItems,
    addToCart, 
    removeFromCart,
    getTotalAmount,
    getTotalCartItems, 
    searchQuery, 
    setSearchQuery, 
    visualSearchResults, 
    setVisualSearchResults,
    promoCode,
    setPromoCode,
    promoLoading,
    setPromoLoading,
    promoMessage,
    setPromoMessage,
    appliedPromo,
    setAppliedPromo,
    handleApplyPromo,
    handleRemovePromo,
    getFinalTotal
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
}
export default ShopContextProvider;