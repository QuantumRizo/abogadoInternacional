import AutoCarousel from './AutoCarousel';

// Definimos las fotos de About aquí
const ABOUT_IMAGES = [
  { id: 1, url: "/pepe.jpeg", alt: "Foto 1" },
  { id: 2, url: "/pepe (1).jpeg", alt: "Foto 2" },
  { id: 3, url: "/pepe (2).jpeg", alt: "Foto 3" },
  { id: 4, url: "/pepe (3).jpeg", alt: "Foto 4" }
];

export function About() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
           {/* COLUMNA 1: Texto */}
          <div className="order-2 md:order-1"> 
            {/* Nota: Agregué 'order' por si quieres que en celular salga primero la foto. 
                Si quieres texto primero en cel, quita las clases 'order-...' */}
                
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Alfredo Miranda
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground whitespace-pre-line">
              <p>
                Profesional bilingüe (esp/eng) con formación en Relaciones Internacionales y Derecho, especializado en gestión migratoria, visas y otros temas de Derecho Internacional Privado. Es cofundador y Director General de un despacho jurídico centrado en asuntos migratorios.
              </p>
              <p>
                Cuenta con experiencia directa en el Instituto Nacional de Migración, donde colaboró en la supervisión y coordinación de retornos asistidos, así como en la comunicación con consulados centroamericanos.
              </p>
              <p>
                Ha ejercido como docente en nivel medio superior, impartiendo asignaturas relacionadas con comercio internacional y sistemas financieros. Su experiencia internacional se complementa con estancias en Turquía, Canadá y Reino Unido.
              </p>
              <p>
                Adicionalmente, cuenta con experiencia en el liderazgo en contextos juveniles y multiculturales, gestionando procesos en campamentos internacionales en Estados Unidos.
              </p>
              <p>
                Profesional orientado a la gestión eficiente de asuntos legales, procesos consulares y atención a migrantes.
              </p>
            </div>

            {/* Credenciales */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">5+</div>
                <div className="text-sm text-muted-foreground mt-1">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Asesoría de Confianza</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfacción</div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Carrusel de Fotos */}
          <div className="order-1 md:order-2 w-full">
            {/* AQUI EL CAMBIO: Pasamos las imágenes como prop */}
            <AutoCarousel images={ABOUT_IMAGES} height="450px"/>
            
          </div>

        </div>
      </div>
    </section>
  );
}