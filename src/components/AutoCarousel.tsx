import React, { useState, useEffect } from 'react';

const SLIDES = [
  { id: 1, url: "/pepe.jpeg", alt: "Foto 1" },
  { id: 2, url: "/pepe (1).jpeg", alt: "Foto 2" },
  { id: 3, url: "/pepe (2).jpeg", alt: "Foto 3" },
  { id: 4, url: "/pepe (3).jpeg", alt: "Foto 4" }
];

const AutoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // NOTA: Cambié la className de section para quitar 'py-8 my-8' y que se alinee con el texto
  return (
    <section className="w-full h-full flex flex-col justify-center">
      <div className="relative w-full h-[500px] flex justify-center items-center">
        
        {/* FOTO */}
        <img
          src={SLIDES[currentIndex].url}
          alt={SLIDES[currentIndex].alt}
          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-500"
        />

        {/* INDICADORES */}
        <div className="absolute bottom-4 flex space-x-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all shadow-sm border border-gray-200 ${
                currentIndex === index ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AutoCarousel;