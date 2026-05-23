export const responses = [
  // Product / Menu
  { question: /coca[- ]?cola/i, answer: "Coca-Cola ki price Rs. 150 hai for 1L bottle." },
  { question: /pizza/i, answer: "Pizza menu me Margherita, Pepperoni aur BBQ Chicken available hai." },
  { question: /vegetarian/i, answer: "Vegetarian options: Veggie Pizza, Salad, Pasta." },
  { question: /dessert/i, answer: "Desserts: Brownie, Ice Cream, Chocolate Cake." },
  { question: /combo/i, answer: "Available combos: Pizza + Drink, Burger + Fries + Drink." },

  // Order & Delivery
  { question: /order status/i, answer: "Aap apna order ID provide karen, hum check karte hain." },
  { question: /delivery/i, answer: "Delivery estimate 30-45 minutes hai." },
  { question: /cancel order/i, answer: "Order cancel karne ke liye apna order ID bhejen." },

  // Account / Subscription
  { question: /account/i, answer: "Account related help ke liye login karein ya password reset karein." },
  { question: /subscription/i, answer: "Subscription plans: Basic, Premium, Gold. Renewal monthly hai." },

  // Support / Complaints
  { question: /refund/i, answer: "Refund request ke liye apna order ID bhejen." },
  { question: /complaint/i, answer: "Complaint register karne ke liye details share karein." },

  // General / Info
  { question: /timing|hours/i, answer: "Store timing: 9 AM - 11 PM." },
  { question: /location/i, answer: "Hamara store Giddar Kotha, Pakistan me located hai." },
  { question: /contact/i, answer: "Contact number: +92 300 1234567." },

  // Fun / Engagement
  { question: /joke/i, answer: "Ek funny joke: Why did the tomato turn red? Because it saw the salad dressing!" },

  // Default fallback
  { question: /.*/, answer: "Maaf kijiye, mujhe iska jawab nahi pata. Aap kuch aur pooch sakte hain." }
];