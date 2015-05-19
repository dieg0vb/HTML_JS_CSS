describe('Camiseta', function() {

    var camiseta;
    
    beforeEach(function() {
        camiseta = new Camiseta(
            'Alice', 10, ['Negro'], 'http://...');
    });
    
    
    it('Compra de una camiseta de cada talla', function() {
        camiseta.comprarS();
        camiseta.comprarM();
        
        expect(camiseta.tallaS).toBe(1);
        expect(camiseta.tallaM).toBe(1);
    });
    
    
    it('Comprar 2 camisetas de 10 euros cuesta 20 euros', function() {

        camiseta.comprarS();
        camiseta.comprarM();
        
        expect(camiseta.total()).toBe(20);
    });

    it('No puedes comprar más de LIMITE camisetas', function() {
        camiseta.comprarS();
        camiseta.comprarM();
        camiseta.comprarS();
        expect(function() {
          camiseta.comprarS();  
        }).toThrow();
    });
    
    
});







