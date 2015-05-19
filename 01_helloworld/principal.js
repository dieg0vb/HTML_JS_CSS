console.log('Inicio.');

var activarPantalla = function(destino) {
    var pantallas = document.querySelectorAll('.pantalla');
    var pantallaDestino = document.querySelector('#' + destino);

    for(var i=0; i < pantallas.length; i++) {
        pantallas[i].className = 'pantalla';
    }
    
    pantallaDestino.className = 'pantalla activa';
};

var botonPulsado = function(evt) {
    evt.preventDefault();
    var cajaTexto = document.querySelector('#nombre');
    var pantallaRespuesta = document.querySelector('#respuesta');
    pantallaRespuesta.innerHTML = 
        '<p> Hola ' + cajaTexto.value + '.</p>';
    activarPantalla('respuesta');
};

var boton = document.querySelector('#aceptar');
boton.onclick = botonPulsado;

console.log('Fin.');