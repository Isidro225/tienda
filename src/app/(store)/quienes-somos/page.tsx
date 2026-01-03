export const metadata = {
    title: "Quiénes somos | Alsedo Lorenzo e Hijos",
};

export default function QuienesSomosPage() {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h1 className="text-2xl font-black tracking-tight text-app-text">Quiénes Somos</h1>
                <p className="mt-3 text-sm leading-6 text-app-muted">
                    <span className="font-semibold text-app-text">Alsedo Lorenzo e Hijos</span> es una empresa
                    pionera en la distribución de insumos gastronómicos en la ciudad de La Plata, ya que
                    contamos con más de 80 años de experiencia acercando productores con todo tipo de clientes,
                    tanto mayoristas como minoristas.
                </p>

                <p className="mt-4 text-sm leading-6 text-app-muted">
                    En nosotros vas a encontrar un socio en el que podés confiar para conseguir todo lo que
                    necesitás para tu panadería, cátering, microemprendimiento o receta que te tentaste a hacer,
                    ya que contamos con la variedad más amplia, con más de{" "}
                    <span className="font-semibold text-app-text">2.000 productos únicos</span>, de más de{" "}
                    <span className="font-semibold text-app-text">200 marcas</span> distintas de primer nivel.
                    Te los llevamos hasta tu puerta sin que debas realizar esfuerzo alguno.
                </p>
            </section>

            <section className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h2 className="text-sm font-extrabold text-app-text">Dónde encontrarnos</h2>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-app-border bg-app-accentSoft p-4">
                        <div className="text-xs font-semibold text-app-muted">Dirección</div>
                        <div className="mt-1 text-sm font-semibold text-app-text">
                            Av. 19 N° 1414, La Plata
                        </div>
                    </div>

                    <div className="rounded-2xl border border-app-border bg-app-accentSoft p-4">
                        <div className="text-xs font-semibold text-app-muted">Horarios</div>
                        <div className="mt-1 text-sm text-app-text">
                            <div className="font-semibold">Lunes a viernes</div>
                            <div className="text-app-muted">8:00 a 13:00 y 15:00 a 18:00</div>
                            <div className="mt-2 font-semibold">Sábados</div>
                            <div className="text-app-muted">8:00 a 13:00</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-xs text-app-muted">
                    Te esperamos en el local para asesorarte y ayudarte a encontrar exactamente lo que necesitás.
                </div>
            </section>
        </div>
    );
}
