import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaTrashAlt } from 'react-icons/fa';

const MyWishlist = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.email) {
      // Fetch the wishlist when the component mounts
      axiosSecure.get(`/customer/wishlist/${user.email}`)
        .then(response => setWishlist(response.data.items || []))
        .catch(error => console.error('Error fetching wishlist:', error));
    }
  }, [user]);

  const removeFromWishlist = (productId) => {
    if (user?.email) {
      // Remove product from the wishlist
      axiosSecure.delete(`/customer/wishlist/${user.email}/${productId}`)
        .then(() => {
          // Update wishlist after removal
          setWishlist(wishlist.filter(item => item.productId !== productId));
        })
        .catch(error => console.error('Error removing from wishlist:', error));
    }
  };

  const addToWishlist = (productId) => {
    if (user?.email) {
      // Add product to the wishlist
      axiosSecure.post(`/customer/wishlist/${productId}`, { userEmail: user.email })
        .then(response => {
          setWishlist(prevState => [...prevState, { productId }]);  // Update wishlist
        })
        .catch(error => console.error('Error adding to wishlist:', error));
    }
  };

  if (!user) {
    return <p>Please log in to see your wishlist.</p>;
  }

  if (wishlist.length === 0) {
    return <p>Your wishlist is empty.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">My Wishlist</h2>
      <ul className="space-y-4">
        {wishlist.map((item) => (
          <li key={item.productId} className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <img src={item.productImage || 'https://via.placeholder.com/100'} alt={item.productName} className="w-16 h-16 object-cover rounded" />
              <span className="ml-4">{item.productName}</span>
            </div>
            <button onClick={() => removeFromWishlist(item.productId)} className="text-red-500 hover:text-red-700">
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyWishlist;


