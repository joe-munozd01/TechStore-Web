// ===== Cálculos para los reportes del panel (solo cuentan las compras pagadas) =====

const pagadas = (ordenes) => ordenes.filter((o) => o.ok);

export function ventasTotales(ordenes) {
  return pagadas(ordenes).reduce((suma, o) => suma + o.total, 0);
}

export function ticketPromedio(ordenes) {
  const lista = pagadas(ordenes);
  return lista.length === 0 ? 0 : Math.round(ventasTotales(ordenes) / lista.length);
}

// Unidades vendidas por producto, de mayor a menor.
export function unidadesPorProducto(ordenes) {
  const unidades = {};
  pagadas(ordenes).forEach((o) =>
    o.items.forEach((i) => {
      unidades[i.nombre] = (unidades[i.nombre] || 0) + i.cantidad;
    })
  );
  return Object.keys(unidades)
    .map((nombre) => ({ nombre, unidades: unidades[nombre] }))
    .sort((a, b) => b.unidades - a.unidades);
}
