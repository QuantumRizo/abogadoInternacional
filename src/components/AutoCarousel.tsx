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

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 my-8">

      {/* CONTENEDOR "INVISIBLE" 
         1. Le quitamos el bg-gray (fondo gris).
         2. Le quitamos el shadow (sombra de la caja).
         3. Usamos flex justify-center para que la foto flote en medio.
      */}
      <div className="relative w-full h-[500px] flex justify-center items-center">
        
        {/* FOTO */}
        <img
          src={SLIDES[currentIndex].url}
          alt={SLIDES[currentIndex].alt}
          // CLAVE: 
          // - max-h-full / max-w-full: La foto nunca se sale del área, pero tampoco se estira.
          // - object-contain: Muestra la foto entera SIEMPRE.
          // - shadow-2xl y rounded-xl: Se lo ponemos A LA IMAGEN, no a la caja.
          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-500"
        />

        {/* INDICADORES (Puntos) */}
        {/* Los cambié a gris (gray-300/gray-800) porque al no haber fondo oscuro, 
            si fueran blancos no se verían sobre el fondo de tu página web */}
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