import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Rent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Header />

      <main className="container mx-auto mt-8 flex-1 px-6">
        <h1 className="text-center text-2xl font-semibold mb-8">
          Find your property
        </h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="relative rounded-[34px] overflow-hidden shadow-sm bg-white"
            >
              <div className="h-40 bg-gray-200" />
              <div className="h-24 bg-[#46a796]" />
              <span className="absolute top-2 left-2 bg-[#3f37f0] text-white text-xs px-2 py-1 rounded">
                For rent
              </span>
              <div className="absolute right-2 top-2 text-white font-bold">
                &rsaquo;
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;