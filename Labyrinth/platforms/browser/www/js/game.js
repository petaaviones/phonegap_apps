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
		          startSpot: {x: 200, y: 60},
		          endSpot: {x: 200, y: 590}
		     }
		]


		app.vigilaSensores();
		app.iniciaJuego();
	},

	iniciaJuego: function(){

		function preload() {

			// setting the game on maximum scale mode to cover the entire screen

			if (!game.device.desktop) {
				console.log("es mobile!!!");
		        mobile = true;

		    }  else{
		    	console.log("es desktop!!!");
		    	mobile = false

		    }

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
	        for(var i = 1; i <= gameLevels.length; i++){
	        	game.load.image("level" + i, "assets/levels/level" + i + ".png");
	        }

	        //prueba
      		game.load.image('atari', 'assets/atari130xe.png');

      		console.log("Ancho:"+ancho+",Alto:"+alto);

			//Añadir fondo
			game.stage.backgroundColor = '#2E9AFE';
		}

		function create() {

			// temp variable to access more quicly to level information
          	var levelObject = gameLevels[currentLevel - 1];
          	console.log("Punto Partida-->X:"+levelObject.startSpot.x+",Y:"+levelObject.startSpot.y);



          	//PRUEBA CON LAS FISICAS
          	atari = game.add.sprite(200, 300, 'atari');
          	atari.anchor.set(0.5);
          	game.physics.enable(atari, Phaser.Physics.ARCADE);

          	atari.body.collideWorldBounds = true;
						atari.body.checkCollision = true;
						atari.body.immovable = true;

			console.log("Punto Final-->X:"+levelObject.endSpot.x+",Y:"+levelObject.endSpot.y);
			objetivo = game.add.sprite(levelObject.endSpot.x, levelObject.endSpot.y, 'objetivo');
			// setting finish icon registration point to its centre
			objetivo.anchor.set(0.5);

			bola = game.add.sprite(levelObject.startSpot.x, levelObject.startSpot.y, 'bola');
           	bola.anchor.set(0.5);

           	//añadimos fisicas
           	game.physics.enable(bola, Phaser.Physics.ARCADE);
           	bola.body.collideWorldBounds = true;

			cursors = game.input.keyboard.createCursorKeys();


		}

		function update(){

			game.physics.arcade.collide(atari, bola);

			if(mobile){
				var factorDificultad = 300;
             	bola.body.velocity.y = (velocidadY * factorDificultad);
            	 bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

			}else{

					bola.body.velocity.y = 0;
        	bola.body.velocity.x = 0;

				if (cursors.left.isDown)
				{
					bola.body.velocity.x = -200;

				}
				else if (cursors.right.isDown)
				{
					bola.body.velocity.x = +200;
				}

				if (cursors.up.isDown)
				{
					bola.body.velocity.y = -200;

				}
				else if (cursors.down.isDown)
				{
					bola.body.velocity.y = 200;

				}
			}

		}

		function render(){
			game.debug.bodyInfo(atari, 16, 24);
		}

		var estados = { preload: preload, create: create, update: update, render: render };
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
