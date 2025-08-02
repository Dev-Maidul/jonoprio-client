import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaTimes } from 'react-icons/fa';
import logo from '../../assets/Logo.png';

const OrderDetailsModal = ({ order, onClose, BASE64_FALLBACK_IMAGE }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const parseNumber = (value) => {
    if (value && typeof value === 'object') {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const formatOrderTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add logo
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, 'PNG', 20, 10, 50, 20);

    doc.setFontSize(18);
    doc.text('Order Details', 105, 40, { align: 'center' });

    // Order summary
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 60);
    doc.text(`Customer: ${order.customerInfo?.name}`, 20, 70);
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, 80);
    doc.text(`Total: ৳${parseNumber(order.totalAmount).toFixed(2)}`, 20, 90);
    doc.text(`Address: ${order.customerInfo?.address || 'N/A'}`, 20, 100);

    // Order items table
    const items = order.orderItems.map(item => [
      item.productName,
      item.variant?.color ? `(${item.variant.color})` : '',
      item.quantity,
      `৳${parseNumber(item.price).toFixed(2)}`,
      `৳${parseNumber(item.price) * parseNumber(item.quantity)}`,
    ]);

    doc.autoTable({
      head: [['Product', 'Variant', 'Quantity', 'Price', 'Subtotal']],
      body: items,
      startY: 120,
      margin: { horizontal: 20 },
      styles: { halign: 'center' },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Payment summary
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text(`Subtotal: ৳${parseNumber(order.subtotal).toFixed(2)}`, 20, finalY);
    doc.text(`Shipping: ৳${parseNumber(order.shippingCost).toFixed(2)}`, 20, finalY + 10);
    doc.text(`Total: ৳${parseNumber(order.totalAmount).toFixed(2)}`, 20, finalY + 20);
    doc.text(`Payment Method: ${order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Mobile Banking / Bank'}`, 20, finalY + 30);

    // Thank you message
    doc.setFontSize(10);
    doc.text('Thank you for being a part of Jonoprio.com', 105, finalY + 50, { align: 'center' });

    doc.save(`Order_${order._id}.pdf`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head><title>Order Details</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center;">
            <img src="${logo}" alt="Logo" style="width: 150px; height: auto; margin-bottom: 20px; border-radius: 100px;" />
            <h1>Order Details</h1>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Customer:</strong> ${order.customerInfo?.name}</p>
            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ৳${parseNumber(order.totalAmount).toFixed(2)}</p>
            
            <h2>Customer Information:</h2>
            <p><strong>Phone:</strong> ${order.customerInfo?.phoneNumber}</p>
            <p><strong>Email:</strong> ${order.customerInfo?.userEmail}</p>
            <p><strong>Address:</strong> ${order.customerInfo?.address || 'N/A'}</p>
            
            <h2>Items:</h2>
            <table border="1" cellpadding="5" cellspacing="0" style="margin: 0 auto; text-align: center;">
              <tr style="background-color: #16a085; color: white;"><th>Product</th><th>Variant</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
              ${order.orderItems.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.variant?.color || ''}</td>
                  <td>${item.quantity}</td>
                  <td>৳${parseNumber(item.price).toFixed(2)}</td>
                  <td>৳${(parseNumber(item.price) * parseNumber(item.quantity)).toFixed(2)}</td>
                </tr>`).join('')}
            </table>
            
            <p><strong>Subtotal:</strong> ৳${parseNumber(order.subtotal).toFixed(2)}</p>
            <p><strong>Shipping:</strong> ৳${parseNumber(order.shippingCost).toFixed(2)}</p>
            <p><strong>Total:</strong> ৳${parseNumber(order.totalAmount).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Mobile Banking / Bank'}</p>

            <div style="margin-top: 40px; font-size: 12px; text-align: center;">
              <p>Thank you for being a part of Jonoprio.com</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 text-center">Order Details (ID: {order._id.substring(0, 8)}...)</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Customer Information:</h3>
          <div className="text-gray-600 space-y-2 text-center">
            <p><strong>Name:</strong> {order.customerInfo?.name}</p>
            <p><strong>Phone:</strong> {order.customerInfo?.phoneNumber}</p>
            <p><strong>Email:</strong> {order.customerInfo?.userEmail}</p>
            <p><strong>Address:</strong> {order.customerInfo?.address}</p>
            {order.customerInfo?.orderNotes && <p><strong>Notes:</strong> {order.customerInfo.orderNotes}</p>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Ordered Products:</h3>
          <div className="space-y-4">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 border-b pb-2 last:border-b-0 last:pb-0">
                <img src={item.productImage || BASE64_FALLBACK_IMAGE} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold text-gray-800">{item.productName} {item.variant?.color ? `(${item.variant.color})` : ''}</p>
                  <p className="text-sm text-gray-600">Quantity: {parseNumber(item.quantity)} x ৳{parseNumber(item.price).toFixed(2)}</p>
                </div>
                <span className="font-bold text-gray-800 ml-auto">৳{(parseNumber(item.price) * parseNumber(item.quantity)).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Payment & Shipping Summary:</h3>
          <div className="text-gray-600 space-y-2 text-center">
            <p><strong>Subtotal:</strong> ৳{parseNumber(order.subtotal).toFixed(2)}</p>
            <p><strong>Shipping:</strong> {order.shippingMethod} (৳{parseNumber(order.shippingCost).toFixed(2)})</p>
            <p><strong>Total:</strong> ৳{parseNumber(order.totalAmount).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Mobile Banking / Bank'}</p>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Order Time:</strong> {formatOrderTime(order.orderDate)}</p>
            <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
          </div>

          {order.paymentMethod === 'mobileBanking' && (
            <div className="mt-4 p-3 border rounded-lg bg-gray-50 text-center">
              <h4 className="font-semibold text-gray-800 mb-1">Mobile Banking Payment Details:</h4>
              <p className="text-gray-600"><strong>Transaction ID:</strong> {order.manualPayment?.transactionId || 'N/A'}</p>
              <p className="text-gray-600"><strong>Payment Amount:</strong> ৳{parseNumber(order.manualPayment?.paymentAmount || order.totalAmount).toFixed(2)}</p>
              {order.manualPayment?.paymentScreenshot?.url && (
                <div className="mt-2">
                  <p className="text-gray-600"><strong>Screenshot:</strong></p>
                  <img
                    src={order.manualPayment.paymentScreenshot.url}
                    alt="Payment Screenshot"
                    className="w-32 h-32 object-cover rounded-md cursor-pointer mx-auto"
                    onClick={() => handleImageClick(order.manualPayment.paymentScreenshot.url)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center space-x-4">
          {/* <button onClick={generatePDF} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Download PDF</button> */}
          <button onClick={handlePrint} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">Print</button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">Close</button>
        </div>
      </motion.div>

      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-60 flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="w-full h-auto max-h-[90vh] object-contain cursor-zoom-out"
              onClick={closeImageModal}
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white text-3xl"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderDetailsModal;