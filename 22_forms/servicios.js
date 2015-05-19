var modelo = {

    _obtenerCatalogoHoyCache : function() {
        if (typeof window.localStorage === 'undefined') {
            return;
        }
        
        var valor = localStorage.getItem('camisetas');
        if (valor) {
            var datos = JSON.parse(valor);
            var fechaCache = new Date(datos.timestamp);
            var fechaHoy = new Date();
            
            var esMismoDia = (fechaCache.getDate() == fechaHoy.getDate()                                      
                            && fechaCache.getMonth() == fechaHoy.getMonth()
                            && fechaCache.getFullYear() == fechaHoy.getFullYear());
            if (esMismoDia === false) {
                return null;
            }
            var deferred = new $.Deferred();
            deferred.resolve(datos.camisetas);
            var promesa = deferred.promise();
            return promesa;
        } else {
            return null;
        }
    },
    
	obtenerCatalogoHoy: function () {
		var url = 'https://demo8983883.mockable.io/productos/camisetas/hoy';
		//url = 'hoy.json';

        var promesa = this._obtenerCatalogoHoyCache();
        if (promesa == null) {
            promesa = $.get(url);        
            promesa.done(function(datos) {
                var ahora = new Date();
                var valor = {
                    timestamp : ahora.getTime(),
                    camisetas : datos
                }
                localStorage.setItem('camisetas', JSON.stringify(valor));
            });
        }
        
		promesa.done(function (datos) {
			console.table(datos);
		});

		var promesaDatosProcesados = promesa.then(function(datos) {
			var carrito = new Carrito();
			for (var i=0; i < datos.length; i++) {
				var datosActual = datos[i];
				var modeloActual = new ModeloCamiseta(
					datosActual.modelo, datosActual.precio,
					datosActual.imagen, datosActual.colores);
				carrito.registrarModelo(modeloActual);
			}
			return carrito;
		});

		return promesaDatosProcesados;
	}

};
