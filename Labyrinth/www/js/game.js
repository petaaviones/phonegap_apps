var app={

	inicio: function(){

		//Velocidad de la bola en X
		velocidadX = 0;
		//Velocidad de la bola en Y
    	velocidadY = 0;
    	//Puntuacion
    	puntuacion = 0;
    	// number of levels. Useful to preload each level PNGs
     	levels=1;
     	// current level
     	currentLevel=1 ;
     	//alto dispositivo
     	alto  = document.documentElement.clientHeight;
     	//ancho del dispositivo
    	ancho = document.documentElement.clientWidth;

		// levels information are stored here
    	gameLevels = [
		     {
		          startSpot: {x: 200, y: 120},
		          endSpot: {x: 200, y: 600}
		     }
		]



		app.vigilaSensores();
		app.iniciaJuego();
	},

	iniciaJuego: function(){

		function preload() {

			// setting the game on maximum scale mode to cover the entire screen
      		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      		game.scale.pageAlignHorizontally = true;
      		game.scale.pageAlignVertically = true;

			//Añade fisicas
			game.physics.startSystem(Phaser.Physics.ARCADE);
			//carga de elementos (assets)
			game.load.image('bola', 'assets/bola.png');
      		game.load.image('objetivo', 'assets/finish.png');

      		// preloading all level images, PNG images with transparency
      		console.log("Nº de niveles:"+ gameLevels.length);
      		//TODO: DEJO COMENTADO ESTE CODIGO HASTA QUE TENGAMOS LOS NIVELES
	        for(var i = 1; i <= gameLevels.length; i++){
	        	game.load.image("level" + i, "assets/levels/level" + i + ".png");
	        }
      

      		console.log(ancho);
      		console.log(alto);

			//Añadir fondo
			game.stage.backgroundColor = '#2E9AFE';
		}

		function create() {
		}

		function update(){
		}

		var estados = { preload: preload, create: create, update: update };
    	var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
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