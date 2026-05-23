import React from "react";

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-[90%] md:w-[600px] p-6 rounded-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose}>❌</button>
        </div>

        <p><b>Name:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>City:</b> {order.city}</p>
        <p><b>Address:</b> {order.street}</p>
        <p><b>Status:</b> {order.status}</p>

        <hr className="my-3" />

        <h3 className="font-bold">Items</h3>

        {order.cartItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>Rs {item.price}</span>
          </div>
        ))}

        <hr className="my-3" />

        <p className="font-bold">
          Total: Rs {(order.totalAmount / 0.0057).toFixed(0)}
        </p>

      </div>
    </div>
  );
};

export default OrderModal;