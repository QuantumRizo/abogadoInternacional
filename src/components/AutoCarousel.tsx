import React, { useState, useEffect } from 'react';

// Definimos la estructura que debe tener cada imagen
interface CarouselImage {
  id: number;
  url: string;
  alt: string;
}

interface AutoCarouselProps {
  images: CarouselImage[]; // Recibe un array de imágenes
}

const AutoCarousel = ({ images }: AutoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reiniciar índice si cambian las imágenes (seguridad)
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    // Si no hay imágenes, no iniciamos el intervalo
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images]); // Agregamos images a la dependencia

  // Renderizado condicional si no hay imágenes
  if (!images || images.length === 0) return null;

  return (
    <section className="w-full h-full flex flex-col justify-center">
      <div className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center">
        
        {/* FOTO */}
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="w-full h-full object-contain rounded-2xl shadow-2xl transition-all duration-500"
        />

        {/* INDICADORES */}
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