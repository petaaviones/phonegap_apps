var app={

	inicio: function(){
		velocidadX = 0;
    	velocidadY = 0;
    	puntuacion = 0;

		app.vigilaSensores();
		app.iniciaJuego();
	},

	iniciaJuego: function(){
	},

	vigilaSensores: function(){
    
	    function onError() {
	        console.log('onError!');
	    }

	    function onSuccess(datosAceleracion){
	      app.detectaAgitacion(datosAceleracion);
	      app.registraDireccion(datosAceleracion);
	    }

	    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
	},

	detectaAgitacion: function(datosAceleracion){
	    var agitacionX = datosAceleracion.x > 10;
	    var agitacionY = datosAceleracion.y > 10;

	    if (agitacionX || agitacionY){
	      console.log("Agitacion, reiniciamos el juego");
	      setTimeout(app.recomienza, 1000);
	    }
  	},

  	recomienza: function(){
    	document.location.reload(true);
  	},

  	registraDireccion: function(datosAceleracion){
    	velocidadX = datosAceleracion.x ;
    	velocidadY = datosAceleracion.y ;
  	}

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}