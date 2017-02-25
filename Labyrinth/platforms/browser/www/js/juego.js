var app={
 inicio: function(){
    DIAMETRO_BOLA = 50;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
   app.vigilaSensores();
   app.iniciaJuego();
  },

 iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#2E9AFE';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/finish.png');
      game.load.image('level3', 'assets/level3.png');
      console.log(ancho);
      console.log(alto);
    }

    function create() {


      //Meta
      objetivo = game.add.sprite(40, app.inicioFinishY(),'objetivo');
      //Bola
      bola = game.add.sprite(40, 60,'bola');
      // LEVEL MAZE
       // creation of a bitmap data with the same size as the game
          /*this.bitmap = game.add.bitmapData(game.width, game.height);
          
          // drawing proper "level" image on the bitmap data
          this.bitmap.draw("level3");
          
          // updating bitmap data to let it have actual image data
          this.bitmap.update();
          
          // adding the bitmap data as a sprite
          level = game.add.sprite(0, 0, this.bitmap);*/
          level = game.add.sprite(0, 0, 'level3');

          //SCORE
          scoreText = game.add.text(16, alto-50, "SCORE:"+puntuacion, { fontSize: '50px', fill: '#edf0f0' });

          game.physics.arcade.enable(bola);
          game.physics.arcade.enable(objetivo);
          game.physics.arcade.enable(level);

          bola.body.collideWorldBounds = true;
          bola.body.onWorldBounds = new Phaser.Signal();
          bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);

          level.body.collideWorldBounds = true;
          level.body.onWorldBounds = new Phaser.Signal();
          level.body.onWorldBounds.add(app.colisionEscenario, this);
          level.body.immovable = true;

    }

    function update(){
         var factorDificultad = 300;
         bola.body.velocity.y = (velocidadY * factorDificultad);
         bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));


         //game.physics.arcade.collide(bola, level, app.colisionEscenario, null, this);
         game.physics.arcade.overlap(bola, objetivo, app.finalizaJuego, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = "SCORE:"+puntuacion;
  },

  inicioFinishX: function(){
    return ancho - DIAMETRO_BOLA;
  },

  inicioFinishY: function(){
    return alto - 100;
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
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  },

  finalizaJuego: function(){
    game.physics.arcade.disable(bola);
  },

  colisionEscenario: function(){
    console.log("Me choco con las paredes")
  }
  
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}