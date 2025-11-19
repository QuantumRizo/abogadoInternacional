import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plane, Building2, BookOpen } from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Pasaporte Mexicano',
    description: `Asesoría y revisión de tu documentación para tramitar tu pasaporte.
Gestión de cita ante Secretaría de Relaciones Exteriores en México o alguna representación consular del país en el extranjero.
OP 7 para menores de edad.
Juicios de Jurisdicción Voluntaria para menores de edad.`,
  },
  {
    icon: Building2,
    title: 'Gestión de Visa Americana',
    description: `Asesoría para correcto llenado de tu solicitud de visa.
Mejoramiento de tu perfil como solicitante.
Adelanto de citas.
Asesoramiento para tu entrevista consular.
Asesoría para primera vez y renovación.`,
  },
  {
    icon: Plane,
    title: 'Gestión de Visa Canadiense',
    description: `Asesoramiento para obtención de tu visa canadiense.
Revisión de documentos y guía en tu itinerario tentativo de viaje.`,
  },
  {
    icon: BookOpen,
    title: 'Programas de Verano en USA',
    description: `¿Estás buscando pasar tu verano colaborando en un campamento de verano en USA?
Ser estudiante universitario (INDISPENSABLE).
Nivel de inglés básico.`,
  },
  {
    icon: FileText,
    title: 'Otros Servicios Legales',
    description: `¿No puedes ver el trámite que necesitas? Agenda una cita y déjanos escucharte.  
Trabajamos principalmente en el Estado de Puebla y Guerrero.`,
  },
];

export function Services() {
  return (
    <section className="py-24 px-4 bg-muted">
      <div className="max-w-7xl mx-auto">

        {/* === TEXTO DE USA ARRIBA === */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            USA: Vive el sueño, viaja la emoción. Tu próxima gran historia empieza en Estados Unidos.
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            “Viajar a Estados Unidos nunca ha estado tan al alcance de tu historia. Permítenos acompañarte en cada paso para que disfrutes un viaje seguro, emocionante y hecho completamente a tu estilo.”
          </p>
        </div>
        {/* === FIN DEL TEXTO DE USA === */}

        <div className="text-center mb-16">
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
