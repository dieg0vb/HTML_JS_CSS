var Camiseta = function(modelo, precio, colores, imagen) {
    this.modelo = modelo;
    this.precio = precio;
    this.colores = colores;
    this.imagen = imagen;
    
    this.tallaS = 0;
    this.tallaM = 0;
    
};

Camiseta.prototype.total = function() {
    return this.precio * (this.tallaS + this.tallaM);
};

Camiseta.prototype.comprarS = function() {
    if (this.tallaM + this.tallaS === 3) {
        throw 'No puedes comprar más de 3 camisetas.';
    }
    this.tallaS = this.tallaS + 1;
};

Camiseta.prototype.comprarM = function() {
    if (this.tallaM + this.tallaS === 3) {
        throw 'No puedes comprar más de 3 camisetas';
    }
    this.tallaM = this.tallaM + 1;
};

Camiseta.prototype.vaciar = function() {
    this.tallaS = 0;
    this.tallaM = 0;
}

try {
    var c1 = new Camiseta('alice', 10, [], 'http://...');
    
    c1.comprarM();
    c1.comprarM();
    c1.comprarS();
    console.info('Coste de c1: %s.', c1.total());
    c1.comprarM();
    console.log('Fin.');
} catch (error) {
    console.log('Se produjo un error: %s.', error);
}






