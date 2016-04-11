ig.module( 
    'game.entities.gladiator' 
)
.requires(
    'impact.entity',
    'impact.animation'
)
.defines(function(){

EntityGladiator = ig.Entity.extend({
    size: {x: 8, y: 8},
    offset: {x: 12, y: 24},
    animSheet: new ig.AnimationSheet( 'media/gladiator.png', 32, 32),
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.BOTH,
    speed: 40,
    zIndex: 1000,
    collides: ig.Entity.COLLIDES.ACTIVE,
    
    xFlip: false,
    currentAnimString: null,
    shadowSheet: new ig.AnimationSheet( 'media/gladiatorshadow.png', 32, 32),
    shadowAnims: [],
    currentShadowAnim: null,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0] );
        this.addAnim( 'walking', 0.1, [0,1,2] );
        
        this.shadowAnims['idle'] = new  ig.Animation(this.shadowSheet, 0.1, [0] );
        this.shadowAnims['walking'] = new  ig.Animation(this.shadowSheet, 0.1, [0,1,2] );
        
        this.parent( x, y, settings );
    },

    update: function() {
        if (ig.input.state('up')) {
            this.vel.y = -this.speed;
        } else if (ig.input.state('down')) {
            this.vel.y = this.speed;
        } else {
            this.vel.y = 0;
        }
            
        if (ig.input.state('left')) {
            this.vel.x = -this.speed;
            this.xFlip = true;
        } else if (ig.input.state('right')) {
            this.vel.x = this.speed;
            this.xFlip = false;
        } else {
            this.vel.x = 0;
        }
        
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            this.currentAnimString = 'walking'
        } else {
            this.currentAnimString = 'idle'
        }
        
        this.currentAnim = this.anims[this.currentAnimString]
        this.currentAnim.flip.x = this.xFlip
        this.currentShadowAnim = this.shadowAnims[this.currentAnimString]
        
		this.parent();
    },
    
    draw: function() {
        this.parent();
    },
    
    drawShadow: function(shadowAngle, shadowStrength) {
        shadowStrength = shadowStrength || .25
        
        if (this.currentShadowAnim) {
            this.currentShadowAnim.tile = this.currentAnim.tile
            
            this.currentShadowAnim.flip.x = this.xFlip
            if (shadowAngle > 1.57) {
                this.currentShadowAnim.flip.x = this.currentShadowAnim.flip.x
            }
          
            var xDraw = this.pos.x - this.offset.x - ig.game.screen.x
            var yDraw = this.pos.y - this.offset.y - ig.game.screen.y
            
            this.currentShadowAnim.alpha = shadowStrength
            this.currentShadowAnim.angle = shadowAngle
            this.currentShadowAnim.pivot.x = 16
            this.currentShadowAnim.pivot.y = 32
            this.currentShadowAnim.draw(xDraw, yDraw)
        }
    },
});

});