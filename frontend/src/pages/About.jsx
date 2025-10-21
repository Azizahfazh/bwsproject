import React from "react";
import { FaHandSparkles, FaUsers, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen px-4 py-16 bg-gray-100">
      <div className="flex flex-col items-center mx-auto max-w-7xl">
        {/* Judul */}
        <div className="flex items-center mb-12 space-x-2">
          <FaHandSparkles className="text-3xl text-pink-500 animate-pulse" />
          <h1 className="text-4xl font-bold text-pink-500">About HYNailArt</h1>
        </div>

        {/* Section 1 - Tentang Kami */}
        <div className="flex flex-col items-center p-8 mb-8 transition duration-700 transform bg-white shadow-lg md:flex-row rounded-xl hover:scale-105">
          <FaHandSparkles className="mb-4 text-6xl text-pink-500 md:mb-0 md:mr-8" />
          <div>
            <h2 className="mb-2 text-2xl font-bold text-pink-500">Tentang Kami</h2>
            <p className="text-gray-700">
              HYNailArt adalah layanan nail art profesional yang memberikan pengalaman manicure
              dan pedicure cantik dan nyaman. Kami menghadirkan desain modern, teknik terbaru,
              dan produk berkualitas tinggi.
            </p>
          </div>
        </div>

        {/* Section 2 - Tim Profesional */}
        <div className="flex flex-col items-center p-8 mb-8 transition duration-700 transform bg-white shadow-lg md:flex-row-reverse rounded-xl hover:scale-105">
          <FaUsers className="mb-4 text-6xl text-pink-500 md:mb-0 md:ml-8" />
          <div>
            <h2 className="mb-2 text-2xl font-bold text-pink-500">Tim Profesional</h2>
            <p className="text-gray-700">
              Tim kami terdiri dari ahli nail art berpengalaman yang selalu mengikuti tren
              fashion terkini. Mereka berdedikasi memberikan layanan terbaik dengan penuh
              perhatian dan kreativitas.
            </p>
          </div>
        </div>

        {/* Section 3 - Filosofi Kami */}
        <div className="flex flex-col items-center p-8 transition duration-700 transform bg-white shadow-lg md:flex-row rounded-xl hover:scale-105">
          <FaHeart className="mb-4 text-6xl text-pink-500 md:mb-0 md:mr-8" />
          <div>
            <h2 className="mb-2 text-2xl font-bold text-pink-500">Filosofi Kami</h2>
            <p className="text-gray-700">
              Kami percaya setiap orang berhak tampil percaya diri dengan tangan yang cantik.
              Pelayanan ramah, higienis, dan kualitas maksimal adalah prinsip yang selalu kami
              pegang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
