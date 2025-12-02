import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Fondo con parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary/90"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Overlay decorativo */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>

      {/* Contenido */}
      <div 
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Experto en Derecho Migratorio
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-balance">
  Asesoría legal profesional para obtención de tus documentos de viaje y solución a tus situaciones legales. 
</p>
        <div className="flex flex-col gap-4 text-primary-foreground/90">
  

  <Button 
    size="lg" 
    onClick={() => navigate('/citas')}
    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform"
  >
    Agendar Cita
  </Button>
  <p className="text-lg leading-snug">
  Do you need legal assistance in English? Make an appointment by clicking the “Agendar Cita” button above.
</p>
</div>

      </div>
    </section>
  );
}
