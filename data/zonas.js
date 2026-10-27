// Regiones y comunas disponibles para el despacho (versión reducida para la entrega).
export const regiones = [
  { nombre: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "La Florida", "Cerrillos"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
  { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "Coronel", "Los Ángeles"] },
  { nombre: "La Araucanía", comunas: ["Temuco", "Villarrica", "Pucón"] },
];

export function comunasDe(nombreRegion) {
  const region = regiones.find((r) => r.nombre === nombreRegion);
  return region ? region.comunas : [];
}
