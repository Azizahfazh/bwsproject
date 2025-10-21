import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "All",
  "Basic Manicure & Pedicure",
  "Gel Nails",
  "Acrylic Nails",
  "Nail Art / Decorative",
  "French / Classic Style",
  "Custom",
];

const tagColors = {
  "BEST SELLER": "#FF6347",
  "PROMO": "#32CD32",
  "NEW": "#1E90FF",
};

const Katalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailRef = useRef(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
      }
    };
    fetchProducts();
  }, [API_URL]);

  useEffect(() => {
    if (selectedCategory === "All") setFilteredProducts(products);
    else setFilteredProducts(products.filter(p => p.category === selectedCategory));
  }, [selectedCategory, products]);

  const formatCurrency = (value) =>
    Number(value).toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  const prevImage = () => {
    setCurrentImageIndex(prev => {
      const newIndex = prev === 0 ? selectedProduct.images.length - 1 : prev - 1;
      scrollThumbnail(newIndex);
      return newIndex;
    });
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => {
      const newIndex = prev === selectedProduct.images.length - 1 ? 0 : prev + 1;
      scrollThumbnail(newIndex);
      return newIndex;
    });
  };

  const scrollThumbnail = (index) => {
    if (!thumbnailRef.current) return;
    const thumbnailWidth = 65; // 60px width + 5px gap
    const scrollLeft = index * thumbnailWidth - 2 * thumbnailWidth; // tampilkan 2 sebelumnya
    thumbnailRef.current.scrollTo({ left: scrollLeft > 0 ? scrollLeft : 0, behavior: "smooth" });
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    scrollThumbnail(index);
  };

  const handleBooking = (e, productId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu untuk melakukan booking!");
      navigate("/login");
      return;
    }
    navigate(`/booking/${productId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Katalog Produk</h2>

      {/* Filter Kategori */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: selectedCategory === cat ? "#FF69B4" : "#ccc",
              color: selectedCategory === cat ? "#fff" : "#333",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Produk */}
      {filteredProducts.length === 0 ? (
        <p>Belum ada produk.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map(product => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#fff",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => { setSelectedProduct(product); setCurrentImageIndex(0); }}
            >
              {/* Tag */}
              {product.tags && product.tags.length > 0 && (
                <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {product.tags.map((tag, idx) => {
                    const color = tagColors[tag.toUpperCase()] || "#FF69B4";
                    return (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: color,
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px"
                        }}
                      >
                        {tag.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Gambar */}
              <div style={{ width: "100%", height: "160px", overflow: "hidden" }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${API_URL}${product.images[0]}`}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>No Image</div>
                )}
              </div>

              {/* Info Produk */}
              <div style={{ padding: "10px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{product.name}</h3>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {product.description}
                </p>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={{ textDecoration: "line-through", color: "#999" }}>
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  <span>{formatCurrency(product.price)}</span>
                </div>

                {/* Tombol Booking */}
                <button
                  onClick={(e) => handleBooking(e, product._id)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#FF69B4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Produk */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: "absolute",
                top: "5px",
                right: "10px",
                fontSize: "28px",
                fontWeight: "bold",
                border: "none",
                background: "transparent",
                color: "gray",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              &times;
            </button>

            {/* Gambar utama */}
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <div style={{ position: "relative" }}>
                <img
                  src={`${API_URL}${selectedProduct.images[currentImageIndex]}`}
                  alt=""
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />

                {/* Panah kiri */}
                {selectedProduct.images.length > 1 && (
                  <button
                    onClick={prevImage}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10px",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                    }}
                  >
                    &#8249;
                  </button>
                )}

                {/* Panah kanan */}
                {selectedProduct.images.length > 1 && (
                  <button
                    onClick={nextImage}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                    }}
                  >
                    &#8250;
                  </button>
                )}
              </div>
            )}

            {/* Thumbnail */}
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div
                ref={thumbnailRef}
                style={{
                  display: "flex",
                  gap: "5px",
                  overflowX: "auto",
                  padding: "10px"
                }}
              >
                {selectedProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_URL}${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handleThumbnailClick(index)}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: currentImageIndex === index ? "2px solid #FF69B4" : "2px solid transparent"
                    }}
                  />
                ))}
              </div>
            )}

            {/* Info Produk */}
            <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h2 style={{ margin: 0 }}>{selectedProduct.name}</h2>
              <p style={{ margin: 0, color: "#555" }}>{selectedProduct.category}</p>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "16px" }}>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span style={{ textDecoration: "line-through", color: "#999" }}>
                    {formatCurrency(selectedProduct.originalPrice)}
                  </span>
                )}
                <span>{formatCurrency(selectedProduct.price)}</span>
              </div>

              <p style={{ color: "#555" }}>{selectedProduct.description}</p>

              <button
                onClick={(e) => handleBooking(e, selectedProduct._id)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#FF69B4",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Katalog;
