// ===== Objeto carrito, mismo estilo de objeto con métodos visto en clase =====
let carrito = {

    agregar: function (nombre, precio) {
        console.log("-- función agregar --");
        this.items.push({ nombre: nombre, precio: precio, cantidad: 1 });
        this.mostrar();
    },

    eliminar: function (posicion) {
        console.log("-- función eliminar --");
        this.items.splice(posicion, 1);
        this.mostrar();
    },

    total: function () {
        var suma = 0;
        for (var i = 0; i < this.items.length; i++) {
            suma = suma + (this.items[i].precio * this.items[i].cantidad);
        }
        return suma;
    },
};

function agregarProductoDeEjemplo() {
    carrito.agregar("Teclado Mecánico RGB", 29990);
}

function generarOrden() {
    if (carrito.items.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    alert("¡Orden generada, gracias por comprar en TechStore!.");
}
