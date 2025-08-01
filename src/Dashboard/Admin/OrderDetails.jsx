import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import Logo from '../../assets/Logo1.png'; // Import the logo path

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the orderId from URL parameters
  const [order, setOrder] = useState(null);
  const axiosSecure = useAxiosSecure(); // Custom axios hook to handle secure API requests

  useEffect(() => {
    // Fetch order details using the orderId
    axiosSecure
      .get(`/order/${orderId}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order details", error);
      });
  }, [orderId, axiosSecure]);

  if (!order) {
    return <div>Loading...</div>; // Show loading until the order is fetched
  }

  // Safe check for shippingInfo and address
  const shippingInfo = order.shippingInfo || {}; // Ensure shippingInfo exists
  const address = order.customerInfo?.address || "N/A"; // Default value if address is not found
  const phone = order.customerInfo?.phoneNumber || "N/A"; // Default value if phone number is not found
  const email = order.customerInfo?.userEmail || "N/A"; // Default value if email is not found

  // Download PDF for order details
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add Seller Logo (you can use your actual logo here)
    doc.addImage(Logo, 'PNG', 10, 10, 50, 50); // Change the path to your logo (width: 50, height: 50)

    // Title Section
    doc.setFontSize(18);
    doc.text("Order Details", 20, 60);

    // Motivational Phrase (Thank You message)
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Thank you for your order and being part of Jonoprio.com. We directly import from China to give you the best prices and quality!", 20, 70);
    doc.text("We value your trust, and we're here to provide the best service possible.", 20, 80);
    doc.text("Feel free to reach out with any questions or concerns about your order.", 20, 90);

    // Customer Information Section
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Customer Name: ${order.customerInfo.name}`, 20, 100);
    doc.text(`Email: ${email}`, 20, 110);
    doc.text(`Phone: ${phone}`, 20, 120);
    doc.text(`Address: ${address}`, 20, 130);

    // Order Items Section
    doc.text("Order Items:", 20, 150);
    let yPosition = 160;
    order.orderItems.forEach((item) => {
      doc.text(`${item.productName} - ${item.quantity} x ${item.price}`, 20, yPosition);
      yPosition += 10;
    });

    // Order Summary Section
    doc.text(`Subtotal: ৳${order.subtotal}`, 20, yPosition + 10);
    doc.text(`Shipping Method: ${order.shippingMethod}`, 20, yPosition + 20);
    doc.text(`Shipping Cost: ৳${order.shippingCost}`, 20, yPosition + 30);
    doc.text(`Total Amount: ৳${order.totalAmount}`, 20, yPosition + 40);

    // Order Status and Date
    doc.text(`Status: ${order.status}`, 20, yPosition + 50);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleString()}`, 20, yPosition + 60);

    // Download PDF
    doc.save("order-details.pdf");
  };

  // Print the order details
  const printOrderDetails = () => {
    window.print(); // Trigger the print dialog
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <img src={Logo} alt="Logo" className="mb-4 w-32" /> {/* Display Logo */}

        <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
        <p><strong>Customer Name:</strong> {order.customerInfo.name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ৳{order.totalAmount}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Shipping Method:</strong> {order.shippingMethod}</p>
        <p><strong>Shipping Cost:</strong> ৳{order.shippingCost}</p>

        <h4 className="mt-4 text-lg font-semibold">Order Items</h4>
        <ul>
          {order.orderItems.map((item, index) => (
            <li key={index} className="mb-2">
              <strong>{item.productName}</strong> - {item.quantity} x ৳{item.price}
            </li>
          ))}
        </ul>

        <h4 className="mt-4 text-lg font-semibold">Order Subtotal</h4>
        <p><strong>Subtotal:</strong> ৳{order.subtotal}</p>

        <h4 className="mt-4 text-lg font-semibold">Shipping Info</h4>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Phone:</strong> {phone}</p>

        <h4 className="mt-4 text-lg font-semibold">Order Timeline</h4>
        <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>

        {/* Download PDF Button */}
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-6 cursor-pointer"
        >
          Download Order as PDF
        </button>

        {/* Print Button */}
        <button
          onClick={printOrderDetails}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-6 ml-4 cursor-pointer"
        >
          Print Order Details
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
