import Delivery from "../models/Delivery.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const getStats = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    const reviews = await Review.find();

    const totalOrders = deliveries.length;

    const totalRevenue = deliveries.reduce(
      (acc, d) => acc + (d.totalAmount || 0), 0
    );

    const pendingOrders = deliveries.filter(
      (d) => d.status === "Pending"
    ).length;

    const deliveredOrders = deliveries.filter(
      (d) => d.status === "Delivered"
    ).length;

    // ⭐ Rating from Review collection
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : "0.0";

    // 📊 Top products from cartItems
    const productMap = {};
    deliveries.forEach((d) => {
      d.cartItems?.forEach((item) => {
        if (!item.name) return;
        if (!productMap[item.name]) productMap[item.name] = 0;
        productMap[item.name] += item.quantity || 1;
      });
    });
    const topProducts = Object.entries(productMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // 📈 Monthly revenue last 6 months
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthMap = {};
    deliveries.forEach((d) => {
      const date = new Date(d.createdAt);
      const key = monthNames[date.getMonth()];
      if (!monthMap[key]) monthMap[key] = 0;
      monthMap[key] += d.totalAmount || 0;
    });

    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const name = monthNames[d.getMonth()];
      return { name, revenue: Math.round(monthMap[name] || 0) };
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        deliveredOrders,
        avgRating,
        topProducts,
        monthlyRevenue,
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};