import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Información de contacto */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent">Alfredo Miranda</h3>
            <p className="text-primary-foreground/80 mb-4">
              Abogado especialista en derecho migratorio
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contacto</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+52 222 102 5628</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>abgalfmiranda@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Puebla, Puebla</span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Horario de Atención</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {currentYear} Alfredo Miranda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
