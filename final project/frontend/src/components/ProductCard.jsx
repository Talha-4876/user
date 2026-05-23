import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, addToCart, removeFromCart, getQuantity }) => {
  const navigate = useNavigate();
  const quantity = getQuantity(product._id);

  const discount = product.discountPercent || 0;
  const originalPrice = product.price || 0;
  const discountedPrice = discount
    ? Math.round(originalPrice - (originalPrice * discount) / 100)
    : originalPrice;

  // ← YAHAN LAGAO — JSX se pehle
  console.log(product.name, "| discountPercent:", product.discountPercent, "| price:", product.price);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group relative">

      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            {discount}% OFF
          </span>
        </div>
      )}

      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover group-hover:scale-110 transition duration-300 cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        />
      </div>

      <div className="p-4">
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="font-bold text-lg cursor-pointer hover:text-orange-500 leading-tight"
        >
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-orange-500 font-extrabold text-xl">
            PKR {discountedPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-gray-400 text-sm line-through">
                PKR {originalPrice.toLocaleString()}
              </span>
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                Save PKR {(originalPrice - discountedPrice).toLocaleString()}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => removeFromCart(product._id)}
            className="w-9 h-9 bg-gray-200 rounded-full hover:bg-red-200 text-lg font-bold transition"
          >−</button>
          <span className="font-semibold text-lg min-w-[24px] text-center">{quantity}</span>
          <button
            onClick={() => addToCart({ ...product, price: discountedPrice })}
            className="w-9 h-9 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-lg font-bold transition"
          >+</button>
        </div>

        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full mt-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-lg text-sm font-medium transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;