import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Booking = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [step, setStep] = useState(1);

  const today = new Date().toISOString().split("T")[0];
  const timeOptions = ["09:00", "11:00", "13:30", "15:30", "17:00", "19:00"];

  // Load product & Snap.js
  useEffect(() => {
    axios.get(`${API_URL.replace("/api","")}/api/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => { 
        toast.error("Produk tidak ditemukan"); 
        navigate("/katalog"); 
      });

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.REACT_APP_MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [productId, navigate]);

  // Load booked times
  useEffect(() => {
    if (!form.date) return;
    axios.get(`${API_URL}/bookings?productId=${productId}&date=${form.date}`)
      .then(res => setBookedTimes(res.data))
      .catch(() => setBookedTimes([]));
  }, [form.date, productId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTimeSelect = time => setForm({ ...form, time });

  const nextStep = () => {
    if (step === 1 && (!form.name.trim() || !form.phone.trim() || !form.address.trim())) {
      toast.error("Nama, No HP, dan Alamat wajib diisi!");
      return;
    }
    if (step === 2 && (!form.date || !form.time)) {
      toast.error("Tanggal dan Jam wajib dipilih!");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleConfirmPayment = async () => {
    if (!form.name || !form.phone || !form.address || !form.date || !form.time) {
      toast.error("Semua field wajib diisi kecuali Catatan!");
      return;
    }
    setLoading(true);
    try {
      const payload = { productId: product._id, productName: product.name, price: product.price, ...form };
      const res = await axios.post(`${API_URL}/bookings`, payload);
      const snapToken = res.data.snapToken;
      
      if (!window.snap) { 
        toast.error("Snap.js belum dimuat!"); 
        setLoading(false); 
        return; 
      }

      window.snap.pay(snapToken, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil! Status akan diperbarui otomatis via webhook.");
          navigate("/katalog");
        },
        onPending: () => {
          toast("Booking pending, selesaikan pembayaran di Midtrans. Status akan diperbarui via webhook.", { icon: "⏳" });
          navigate("/katalog");
        },
        onError: () => toast.error("Terjadi kesalahan saat pembayaran."),
        onClose: () => toast("Popup ditutup tanpa menyelesaikan pembayaran.", { icon: "⚠️" }),
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Booking gagal!");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="relative flex justify-center p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col w-full max-w-md p-6 bg-white shadow-2xl rounded-3xl">
        
        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {["Data Diri", "Tanggal & Jam", "Ringkasan"].map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`w-10 h-10 mx-auto rounded-full font-bold flex items-center justify-center text-white ${step === i+1 ? "bg-blue-500 scale-110 shadow-lg" : "bg-gray-300"}`}>
                {i+1}
              </div>
              <p className={`mt-1 text-sm font-medium ${step === i+1 ? "text-blue-600" : "text-gray-500"}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Step 1: Data Diri */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="phone" placeholder="No HP" value={form.phone} onChange={handleChange} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="address" placeholder="Alamat" value={form.address} onChange={handleChange} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <textarea name="note" placeholder="Catatan (opsional)" value={form.note} onChange={handleChange} className="h-20 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        )}

        {/* Step 2: Tanggal & Jam */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <input type="date" name="date" value={form.date} onChange={handleChange} min={today} className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <div className="grid grid-cols-3 gap-4 mt-2">
              {timeOptions.map(time => {
                const isBooked = bookedTimes.includes(time);
                const isSelected = form.time === time;
                return (
                  <button key={time} type="button" disabled={isBooked} onClick={() => handleTimeSelect(time)}
                    className={`py-3 rounded-2xl font-semibold transition-transform duration-200 ${isBooked ? "bg-gray-300 text-white cursor-not-allowed" : isSelected ? "bg-blue-500 text-white scale-105 shadow-lg" : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"}`}>
                    {time} {isBooked ? "(Penuh)" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Ringkasan */}
        {step === 3 && (
          <div className="p-4 shadow-inner bg-gray-50 rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-center text-gray-800">Ringkasan Booking</h3>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <p className="font-medium">Nama:</p><p>{form.name}</p>
              <p className="font-medium">No. HP:</p><p>{form.phone}</p>
              <p className="font-medium">Produk:</p><p>{product.name}</p>
              <p className="font-medium">Harga:</p><p>Rp {product.price.toLocaleString()}</p>
              <p className="font-medium">Tanggal:</p><p>{form.date}</p>
              <p className="font-medium">Jam:</p><p>{form.time}</p>
              {form.note && <><p className="font-medium">Catatan:</p><p>{form.note}</p></>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="flex-1 py-3 font-semibold border rounded-2xl hover:bg-gray-100">
              Kembali
            </button>
          )}
          {step < 3 && (
            <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-2xl bg-[#5E84C5] text-white font-semibold hover:bg-blue-600">
              Lanjut
            </button>
          )}
          {step === 3 && (
            <button type="button" onClick={handleConfirmPayment} className="flex-1 py-3 rounded-2xl bg-[#5E84C5] text-white font-semibold hover:bg-blue-600">
              {loading ? "Loading..." : "Bayar & Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
