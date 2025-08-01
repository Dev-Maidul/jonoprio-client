// Hooks/useCart.js
import { useState, useEffect } from 'react';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching cart data
  useEffect(() => {
    try {
      // In a real app, you would fetch from your API
      const mockCart = [
        {
          _id: { $oid: "688d17d411595539dfa3063d" },
          userId: "s8oyAiKrGJYcmf1C4naKLgH9yY73",
          productId: { $oid: "68892d1ec1554d7e8058229c" },
          productName: "Xenos Roach",
          productImage: "https://res.cloudinary.com/do35vbojp/image/upload/v1753820444/wbylsq1gelsgzznexbxb.jpg",
          price: "5545",
          quantity: { $numberInt: "1" },
          variant: null,
          addedAt: { $date: { $numberLong: "1754077140549" } },
          updatedAt: { $date: { $numberLong: "1754077140549" } }
        }
        // Add more items as needed
      ];
      setCart(mockCart);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item._id.$oid === productId 
          ? { ...item, quantity: { $numberInt: String(newQuantity) } } 
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id.$oid !== productId));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + parseInt(item.quantity.$numberInt), 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseInt(item.price) * parseInt(item.quantity.$numberInt));
    }, 0);
  };

  return { 
    cart, 
    loading, 
    error, 
    updateQuantity, 
    removeItem, 
    getTotalItems, 
    getSubtotal 
  };
};

export default useCart;