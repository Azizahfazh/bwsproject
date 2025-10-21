import React from "react";
import { FaStar, FaGem, FaClock, FaSmile } from "react-icons/fa";

const Home = () => {
  const features = [
    {
      icon: <FaStar className="mb-2 text-3xl text-pink-500" />,
      title: "Kualitas Terbaik",
      description:
        "Kami menggunakan bahan nail art premium untuk hasil yang tahan lama dan cantik.",
    },
    {
      icon: <FaGem className="mb-2 text-3xl text-pink-500" />,
      title: "Desain Kreatif",
      description:
        "Beragam desain unik dan kekinian yang bisa disesuaikan dengan selera kamu.",
    },
    {
      icon: <FaClock className="mb-2 text-3xl text-pink-500" />,
      title: "Cepat & Tepat Waktu",
      description:
        "Proses pengerjaan cepat tanpa mengurangi kualitas, sesuai jadwal booking.",
    },
    {
      icon: <FaSmile className="mb-2 text-3xl text-pink-500" />,
      title: "Pelayanan Ramah",
      description:
        "Staff kami siap membantu dengan senyum dan pelayanan terbaik untuk kenyamananmu.",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-24 text-center bg-pink-50">
      {/* pt-24 memberi jarak dari navbar */}
      <h1 className="mb-8 text-5xl font-bold text-pink-600">
        Keunggulan HYNailArt
      </h1>
      <p className="max-w-2xl mb-12 text-lg text-gray-700">
        Nikmati pengalaman nail art terbaik dengan layanan profesional dan desain
        kreatif.
      </p>

      <div className="grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg"
          >
            {feature.icon}
            <h3 className="mb-2 text-xl font-semibold text-pink-600">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
