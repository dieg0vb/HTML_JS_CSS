var modelo = {

	obtenerCatalogoHoy: function () {
		var url = 'https://demo8983883.mockable.io/productos/camisetas/hoy';
		url = 'hoy.json';
		var promesa = $.get(url);
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
