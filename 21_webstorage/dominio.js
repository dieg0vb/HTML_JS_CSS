/** Uno de los modelos de camiseta que se encuentran actualmente a la venta, 
    incluyendo la información de las unidades que el usuario quiere comprar
    de cada talla.
*/
var ModeloCamiseta = function(nombre, precio, imagen, colores) {
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
    this.colores = colores;
    // Guarda el número de camisetas que el usuario desea comprar de cada talla
    this.tallasCompradas = {
        S : 0, M : 0, L : 0, XL : 0
    };
};

/** Como regla de negocio no dejamos comprar más de tres unidades. */
ModeloCamiseta.LIMITE = 3;

/** Calcula el precio total que el usuario deberá pagar para comprar las
    camisetas de este modelo.
*/
ModeloCamiseta.prototype.total = function() {
    return this.precio * this.numeroCamisetas();
};

/** Calcula el número total de camisetas de este modelo que el usuario 
    quiere comprar. 
*/
ModeloCamiseta.prototype.numeroCamisetas = function() {
    var totalCamisetas = 0;
    /* Recorre los nombres de las propiedades de tallasCompradas (S, M, L, XL),
       recupera el valor de cada una de ellas y las acumula. */
    for (var prop in this.tallasCompradas) {
        totalCamisetas = totalCamisetas + this.tallasCompradas[prop];
    }
    return totalCamisetas;
};

/** Incremente el número de camisetas que el usuario ha comprado de una 
    determinada talla siempre que respete las reglas de negocio (máximo 3).
*/
ModeloCamiseta.prototype.incrementarCompraTalla = function(talla) {
    talla = talla.toUpperCase();
    if (this.numeroCamisetas() === ModeloCamiseta.LIMITE) {
        /* throw es similar a un return pero indica que se ha producido un error.
           Si el throw no es capturado en un bloque catch se interrumpe la ejecución
           del script. */
        throw 'Limite superado';
    } 
    this.tallasCompradas[talla] = this.tallasCompradas[talla] + 1;    
};

/** Decrementa el número de camisetas que el usuario ha comprado de una 
    determinada talla siempre que respete las reglas de negocio (máximo 3).
*/
ModeloCamiseta.prototype.decrementarCompraTalla = function(talla) {
    talla = talla.toUpperCase();
    if (this.numeroCamisetas() === 0) {
        throw 'No has comprado camisetas de esta talla.';
    } 
    this.tallasCompradas[talla] = this.tallasCompradas[talla] - 1;    
};

/** Pone a cero los contadores de tallas compradas para este modelo. */
ModeloCamiseta.prototype.vaciar = function() {
    /* prop valdrá en cada iteración el nombre de una propiedad: S, M, L y XL. */
    for (var prop in this.tallasCompradas) {
        this.tallasCompradas[prop] = 0;
    }
};

/** Modeliza el carrito de la compra, es decir, una colección de camisetas. */
var Carrito = function() {
    /* Las camisetas se guardan en un objeto usando como nombre de propiedad el nombre
       del modelo. De esta manera si un modelo de camiseta se llama "Firefly" en el objeto
       existirá una propiedad con ese nombre para recuperar el objeto ModeloCamiseta 
       correspondiente. */
    this.modelos = { };
};

/** Añade un modelo al carrito, indexándolo por su nombre. */
Carrito.prototype.registrarModelo = function(modelo) {
    this.modelos[modelo.nombre] = modelo;
};

/** Descarta los modelos existentes. */
Carrito.prototype.vaciar = function() {
    this.modelos = {};
};

/** Calcula el coste total de todos los modelos y tallas comprados. */
Carrito.prototype.total = function() {
    var total = 0;
    
    for (var modelo in this.modelos) {        
        var modeloActual = this.modelos[modelo];
        total = total + modeloActual.total();
    }
    
    return total;
};












