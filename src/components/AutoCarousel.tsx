import React, { useState, useEffect } from 'react';

interface CarouselImage {
  id: number;
  url: string;
  alt: string;
}

interface AutoCarouselProps {
  images: CarouselImage[];
  height?: string; // Ahora recibimos una cadena para el estilo (ej: "400px")
}

const AutoCarousel = ({ images, height = "500px" }: AutoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <section className="w-full flex flex-col items-center justify-center">
      {/* 1. Usamos 'style={{ height }}' para forzar la altura sí o sí.
         2. Quitamos clases de altura de Tailwind para evitar conflictos.
      */}
      <div 
        className="relative w-full flex justify-center items-center"
        style={{ height: height }}
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          // CLAVE: 'max-w-full' evita que se salga, pero 'h-full' es lo que manda ahora.
          // 'w-auto' permite que se haga angosta si es necesario.
          className="h-full mx-auto object-contain rounded-2xl shadow-2xl transition-all duration-500"
        />

        {/* Indicadores */}
        <div className="absolute bottom-4 flex space-x-2">
          {images.map((_, index) => (
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