import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AutoCarousel from '@/components/AutoCarousel';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Services />
        <About />
        <AutoCarousel />
        <Footer />
      </main>
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
