describe('Comportamiento camiseta', function() {
    var c;
        
    beforeEach(function() {
        c = new Camiseta('alice', 10, [], 'http://');
    });
    
    it('Es posible comprar camisetas tallas S y M.', function() {
        c.comprarS();
        c.comprarM();
        
        expect(c.tallaS).toBe(1);
        expect(c.tallaM).toBe(1);
    });
    
    it('El coste total se calcula correctamente.', function() {
        c.comprarS();
        c.comprarM();
        
        expect(c.total()).toBe(20);
    });
    
    it('No puedes comprar más de tres camisetas.', function() {
        c.comprarS();
        c.comprarS();
        c.comprarM();
        
        expect(function() {
            c.comprarM();
        }).toThrow();
        
        
    });
    
    
    
});







