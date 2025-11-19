export function About() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-1 gap-12 items-center">

          {/* Contenido */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Alfredo Miranda
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground whitespace-pre-line">
              <p>
Profesional bilingüe (esp/eng) con formación en Relaciones Internacionales y Derecho, especializado en gestión migratoria, visas y otros temas de Derecho Internacional Privado. Es cofundador y Director General de un despacho jurídico centrado en asuntos migratorios, consolidándose como un referente en asesoría para mexicanos y extranjeros en procesos internacionales.
              </p>
              <p>
Cuenta con experiencia directa en el Instituto Nacional de Migración, donde colaboró en la supervisión y coordinación de retornos asistidos, así como en la comunicación con consulados centroamericanos, desempeñándose también como intérprete en inglés y francés. Su trayectoria incluye una sólida interacción con entidades consulares de países como Estados Unidos, Colombia y Guatemala.
              </p>
              <p>
Ha ejercido como docente en nivel medio superior, impartiendo asignaturas relacionadas con comercio internacional y sistemas financieros, además de diseñar contenidos académicos. Su experiencia internacional se complementa con estancias académicas en Turquía, Canadá y Reino Unido, fortaleciendo una visión global y multicultural.
              </p>
              <p>
Adicionalmente, cuenta con expriencia en el liderazgo en contextos juveniles y multiculturales, gestionando procesos en campamentos internacionales en Estados Unidos, así como participando activamente en organizaciones estudiantiles, congresos internacionales y Modelos de Naciones Unidas.
              </p>
              <p>
Profesional orientado a la gestión eficiente de asuntos legales, procesos consulares, atención a migrantes y la solución de problemas en entornos multiculturales y de alta responsabilidad.
              </p>
            </div>

            {/* Credenciales o números destacados */}
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
        </div>
      </div>
    </section>
  );
}
