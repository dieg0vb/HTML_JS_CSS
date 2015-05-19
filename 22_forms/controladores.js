'use strict'; // No admite el uso de with ni la declaración implícita de variables en window

/* Un controlador es el componente que prepara una pantalla o responde a la misma. */
var controlador = {

    /* El carrito de la compra que está manipulando el usuario. Inicialmente no existe
       hasta que se carga la pantalla de catálogo. */
    carrito : null,
    
    /* Los diversos elementos que se manipulan de la pantalla pueden guardarse como 
       variables para facilitar su lectura. El prefijo $ es solo un recordatorio de
       que los objetos apuntados por estas propiedades son arrays de jQuery. */
    $nav : $('nav'),
	$pantallaInicio : $('#inicio'),
	$pantallaCatalogo : $('#catalogo'),
    
    $plantillaError : $('#plantillaError'),
	$plantillaProducto : $('#plantillaProducto'),

    /* Desactiva la section que en este momento se está mostrando y activa aquella
       cuyo identificador se facilita. */
	navegar: function (destino) {
		var $origen = $('.activa');
        /* Si se pasa un string se considera que es el id de una pantalla. En caso 
           contrario se considera que se ha pasado un array de jQuery que ya contiene
           la pantalla. */
		var $destino = (typeof destino === 'string') ? $('#' + destino) : destino;

        // Se desvanece la pantalla activa
		$origen.fadeOut(150, function () {
            /* Una vez terminada la animación se intercambia la clase activa entre
               el origen y el destino y se procede a realizar la animación para que
               el destino aparezca. */
			$origen.removeClass('activa');
			$destino.fadeIn(150);
			$destino.addClass('activa');
		});

	},

    /* Recupera las camisetas del catálogo mediante una petición al servidor (utilizando
       el objeto de modelo), actualiza la pantalla de prodcutos y navega hasta ella. */
	navegarCatalogo : function() {
		var self = this;
		var promesa = modelo.obtenerCatalogoHoy();
		promesa.done(function (carrito) {
            self.carrito = carrito;
			self.mostrarCatalogo();
			self.navegar(self.$pantallaCatalogo);
		});
	},
    
    /* Respuesta al botón de agregar una nueva compra de una talla para un modelo de camiseta. */
    agregarCamiseta : function(nombreModelo, talla) {
        try {
            var modelo = this.carrito.modelos[nombreModelo];
            modelo.incrementarCompraTalla(talla);
            this.mostrarCatalogo();
        } catch (error) {
            // Si no se cumplen las reglas de negocio mostramos el error que se ha producido.
            this.mostrarError(error);
        }
    },
    
    /* Respuesta al botón de eliminar una unidad de las compradas para un modelo. */
    quitarCamiseta : function(nombreModelo, talla) {
        try {
            var modelo = this.carrito.modelos[nombreModelo];
            // No podemos eliminar unidades si ya estamos en 0.
            if (modelo.tallasCompradas[talla] > 0) {
                modelo.decrementarCompraTalla(talla);
            }
            this.mostrarCatalogo();
        } catch (error) {
            this.mostrarError(error);
        }
    },

    /* Prepara la pantalla de catálogo con las cajas necesarias para mostrar el carrito
       actual. */
    inicializarPantallaCatalogo : function() {
        var self = this;
        // sustituiremos el contenido de esta fila con las cajas.
        var $row = this.$pantallaCatalogo.find('.row');
        $row.empty();
        // para cada modelo de camiseta que esté en el carrito (4).
        for (var nombreModelo in this.carrito.modelos) {
            var modelo = this.carrito.modelos[nombreModelo];
            // cogemos la plantilla de productos y creamos una copia para uno de los modelos
            var $productoActual = this.$plantillaProducto.clone().show();
            /* Todos los botones de agregar talla hacen básicamente lo mismo así que podemos
               utilizar un único listener para los 4. Es interesante ver cómo es posible pasar
               parémetros al collback utilizando el primer argumento de click() y cómo quedan
               disponibles dentro del callback en evt.data. De esta manera podemos fijar el
               modelo de camiseta asociado a estos botones concretos.
             */
            var $botonesAgregar = $productoActual.find('a.agregar');
            $botonesAgregar.click(modelo /*<-- puede recuperarse con evt.data */, function(evt) {
                var modelo = evt.data; // recupera el primer parámetro de click(): modelo
                var talla = $(this).attr('name');  // el html incluye la talla como name del botón
                self.agregarCamiseta(modelo.nombre, talla);
            });
            var $botonesQuitar = $productoActual.find('a.quitar');
            $botonesQuitar.click(modelo, function(evt) {
                var modelo = evt.data;
                var talla = $(this).attr('name');
                self.quitarCamiseta(modelo.nombre, talla);
            });
            $row.append($productoActual);				
        }
        /* Fijamos un valor null a esta propiedad porque no va a ser necesario que vuelva a
           inicializarse las cajas de la pantalla de catálogo una segunda vez.
        */
        this.$plantillaProducto = null;
    },
    
    /* Crea el markup de las cajas de catálogo a partir de la plantilla una primera vez y 
       actualiza los elementos relevantes del mismo con los valores de los modelos de camiseta
       que en estos momentos se encuentran en el carrito.
    */
	mostrarCatalogo: function () {
        var self = this;
        // Solo si es la primera vez que entramos $plantillaProducto tendrá valor.
		if (this.$plantillaProducto !== null) {
            this.inicializarPantallaCatalogo();
		}
        // $productos guarda un array de jQuery con las cuatro cajas en las que se mostrarán los modelos
		var $productos = this.$pantallaCatalogo.find('[itemtype="http://schema.org/ProductModel"]');
        var i=0;
        // para cada modelo en el carrito
		for (var nombreModelo in this.carrito.modelos) {
            var modeloActual = this.carrito.modelos[nombreModelo];
            // obtenemos un array de jQuery con la caja en la que aparecerá el modelo actual (i).
			var $productoActual = $productos.eq(i);
            // modificamos el contenido de los elementos de sea caja.
			$productoActual.find('[itemprop="name"]').text(modeloActual.nombre);
			$productoActual.find('[itemprop="image"]').attr('src', modeloActual.imagen);
			$productoActual.find('[itemprop="price"]').attr('content', modeloActual.precio).text(modeloActual.precio);            
            // actualizamos los inputs cuyo name coincide con el nombre de cada talla
            for (var talla in modeloActual.tallasCompradas) {
                var $inputTalla = $productoActual.find('input[name='+talla+']');
                $inputTalla.val(modeloActual.tallasCompradas[talla]);
            }
            i = i + 1;
		}
	},
	
    /* Clona la plantilla de error y la añade tras el nav. */
	mostrarError: function (mensaje) {
        var $error = this.$plantillaError.clone();
		$error.find('p').text(mensaje);
        this.$nav.after($error);
        $error.fadeIn();
	},

    /* Inicializa la landing page. */
	inicializarPantallaInicio: function () {
		var self = this;

		var $botonVerCatalogo = this.$pantallaInicio.find('button');
		$botonVerCatalogo.on('click', function() {
			self.navegarCatalogo();
		});
	},

    /* Hace visible el spinner. */
	mostrarCargando : function() {
		$('#spinner').fadeIn();
	},

    /* Hace invisible el spinner. */
	ocultarCargando : function() {
		$('#spinner').fadeOut();
	},

    /* Gestiona de forma centralizada los eventos de ajax para encender y apagar el spinner
       sin que tengamos que preocuparnos en cada invocación individual de $.get, $.post, etc.
       Genera también automáticamente una alerta en caso de error en las comunicaciones.
    */
	inicializarAjax : function() {
		var self = this;
		$(document).ajaxStart(function() {
			self.mostrarCargando();
		});
		$(document).ajaxStop(function() {
			self.ocultarCargando();
		});                
		$(document).ajaxError(function(req, status, error) {
			console.warn(error);
			self.mostrarError('Lo sentimos, se ha producido un error de conexión.');
		});
	},
	
	inicializar : function() {
		this.inicializarAjax();
		this.inicializarPantallaInicio();
	}
};
