ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.gladiator',
    'game.levels.arena'
)
.defines(function(){

MyGame = ig.Game.extend({
    init: function() {
        // initialize your game world, bind some 
        // keys, etc.
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        
        ig.input.bind( ig.KEY.K, 'k' );
        
        this.loadLevel( LevelArena );
    }
});


// Start the Game with 62fps, a resolution of 322x242, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 62, 320, 320, 2 );

});
