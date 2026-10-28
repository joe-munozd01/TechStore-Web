// ===== Artículos del blog (contenido estático) =====
export const articulos = [
  {
    slug: "como-elegir-un-notebook",
    titulo: "Cómo elegir un notebook según lo que necesitas",
    resumen: "Procesador, memoria RAM y almacenamiento: qué mirar antes de comprar.",
    fecha: "2026-10-05",
    contenido: [
      "Antes de comparar precios conviene definir para qué lo vas a usar. Para estudiar y trabajar con documentos basta un equipo con 8 GB de RAM y un disco SSD; para juegos o edición de video se recomienda un procesador de gama alta, 16 GB de RAM y tarjeta gráfica dedicada.",
      "El almacenamiento SSD hace que el equipo arranque y abra programas mucho más rápido que un disco tradicional. Si puedes elegir, prefiere 512 GB o más.",
      "Por último, revisa el peso y la duración de la batería si vas a moverte con el equipo todos los días.",
    ],
  },
  {
    slug: "cuidados-para-tus-perifericos",
    titulo: "Cuidados básicos para mouse y teclado",
    resumen: "Limpieza y buenas prácticas para que tus periféricos duren más.",
    fecha: "2026-10-12",
    contenido: [
      "El polvo y la grasa acumulada son los enemigos de un teclado. Una vez al mes, desconéctalo, dale vuelta para sacar las migas y límpialo con un paño levemente húmedo.",
      "En los mouse inalámbricos, revisa que el sensor esté limpio y usa una superficie lisa. Si usa pilas, retíralas cuando vayas a dejarlo guardado mucho tiempo.",
      "Evita comer o beber sobre el teclado: un derrame puede dañarlo de forma permanente.",
    ],
  },
];

export function obtenerArticulos() {
  return articulos.map((a) => ({ ...a }));
}

export function obtenerArticulo(slug) {
  const encontrado = articulos.find((a) => a.slug === slug);
  return encontrado ? { ...encontrado } : null;
}
