import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plane, Building2, BookOpen } from 'lucide-react';
import AutoCarousel from './AutoCarousel'; // Importamos el componente

// Imágenes para el carrusel de Servicios (Casos de éxito)
const SUCCESS_STORIES_IMAGES = [
  { id: 1, url: "/caso1.jpg", alt: "Visa Aprobada Caso 1" },
  { id: 2, url: "/caso2.jpg", alt: "Visa Aprobada Caso 2" },
  { id: 3, url: "/caso3.jpg", alt: "Visa Aprobada Caso 3" },
  { id: 4, url: "/caso4.jpg", alt: "Visa Aprobada Caso 4" },
  { id: 5, url: "/caso5.jpg", alt: "Visa Aprobada Caso 5" },
];

const services = [
  // ... (tu lista de servicios se mantiene igual)
  {
    icon: FileText,
    title: 'Pasaporte Mexicano',
    description: `• Asesoría y revisión de documentación para tramitar tu pasaporte.
• Gestión de cita ante Secretaría de Relaciones Exteriores o representación consular.
• OP 7
• Juicios de Jurisdicción Voluntaria para menores.`,
  },
  {
    icon: Building2,
    title: 'Gestión de Visa Americana',
    description: `• Asesoría para el correcto llenado de tu solicitud DS-160.
• Revisión y mejoramiento de tu perfil como solicitante.
• Adelanto de cita consular.
• Preparación para entrevista consular.
• Asesoría para primera vez y renovación.`,
  },
  {
    icon: Plane,
    title: 'Gestión de Visa Canadiense',
    description: `• Asesoría para tramitar tu visa canadiense.
• Revisión de documentos.
• Guía para armar tu itinerario tentativo de viaje.`,
  },
  {
    icon: BookOpen,
    title: 'Programas de Verano en USA',
    description: `• Oportunidades para trabajar en campamentos de verano en Estados Unidos.
• Ser estudiante universitario (indispensable).
• Nivel de inglés básico.`,
  },
  {
    icon: FileText,
    title: 'Otros Servicios Legales',
    description: `• Si no encuentras tu trámite, agenda una cita y cuéntanos tu caso.
• Trabajamos principalmente en los estados de Puebla y Guerrero.`,
  },
];


export function Services() {
  return (
    <section className="py-24 px-4 bg-muted">
      <div className="max-w-7xl mx-auto">

        {/* === SECCIÓN USA + CARRUSEL (NUEVO LAYOUT) === */}
        {/* Usamos grid-cols-2 para dividir pantalla en desktop */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Columna Izquierda: Texto */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              USA: Vive el sueño, viaja la emoción.
              <span className="block text-accent mt-2">Tu próxima gran historia empieza aquí.</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              “Viajar a Estados Unidos nunca ha estado tan al alcance de tu historia. Permítenos acompañarte en cada paso para que disfrutes un viaje seguro, emocionante y hecho completamente a tu estilo.”
            </p>
          </div>

          {/* Columna Derecha: Carrusel de Casos de Éxito */}
          <div className="w-full">
             <AutoCarousel images={SUCCESS_STORIES_IMAGES} height="300px" />
             <p className="text-center text-sm text-muted-foreground mt-4 italic">
               Casos de éxito y visas aprobadas de nuestros clientes
             </p>
          </div>

        </div>
        {/* === FIN SECCIÓN USA === */}

        <div className="text-center mb-16 border-t border-border pt-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Servicios Profesionales
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Especializados en derecho migratorio con experiencia, dedicación y cercanía
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-base whitespace-pre-line">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}