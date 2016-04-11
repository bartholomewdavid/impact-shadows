ig.module( 
    'game.entities.torch' 
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityTorch = ig.Entity.extend({
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/torch.png', 16, 16),
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.BOTH,
    lightSize: 128,
    collides: ig.Entity.COLLIDES.FIXED,
    
    currentAnimString: null,
    shadowSheet: new ig.AnimationSheet( 'media/torchshadow.png', 16, 16),
    shadowAnims: [],
    currentShadowAnim: null,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0,1,2,1] );
        this.shadowAnims['idle'] = new ig.Animation(this.shadowSheet, 0.1, [0,1,2,1] );
        this.parent( x, y, settings );
        
        if( !ig.global.wm ){
            ig.game.spawnEntity(
                EntityTorchSensor, 
                this.pos.x - (this.lightSize / 2) + (this.size.x / 2), 
                this.pos.y - (this.lightSize / 2) + (this.size.y / 2), 
                {
                    size: {
                        x: this.lightSize, 
                        y: this.lightSize
                    },
                    lightSize: this.lightSize,
                    self: this
                })
        }
    },

    update: function() {
        this.currentShadowAnim = this.shadowAnims['idle']
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
            this.currentShadowAnim.pivot.x = 8
            this.currentShadowAnim.pivot.y = 16
            this.currentShadowAnim.draw(xDraw, yDraw)
        }
    },
});

EntityTorchSensor = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/torchsensor.png', 16, 16),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.BOTH,
    zIndex: 100,
    targets: [],
    debug: false,
    minOpacity: 0.1,
    maxOpacity: 0.3,
    
    init: function(x, y, settings) {
        this.parent( x, y, settings)
        this.addAnim('idle', 0.1, [0])
        
        this.width = settings.size.x / 16
        this.height = settings.size.y / 16
        
        ig.game.sortEntitiesDeferred()
    },
    
    draw: function() {
        if (this.debug) {
            var ctx = ig.system.context;
            ctx.save();
            ctx.translate(ig.system.getDrawPos(this.pos.x - this.offset.x - ig.game.screen.x),
                ig.system.getDrawPos(this.pos.y - this.offset.y - ig.game.screen.y));
            ctx.scale(this.width, this.height);
            this.currentAnim.draw(0, 0);
            ctx.restore();
        }
        var pair
        while (pair = this.targets.pop()) {
            pair[0].drawShadow(pair[1], pair[2]);
        }
    },
    
    check: function(other) {
        if (other.drawShadow !== undefined && other != this.self) {
            var shadowData = this.calculateShadow(
                other,
                {
                    x: this.pos.x + (16 * this.width / 2),
                    y: this.pos.y + (16 * this.height / 2),
                })
            this.targets.push([other, shadowData[0], shadowData[1]])
        }
    },
    
    calculateShadow: function(other, lightPos) {
        var otherPos = other.pos
        var otherSize = other.size
        var a = otherPos.x - lightPos.x 
        var o = (otherPos.y + otherSize.y) - lightPos.y
        var h = Math.sqrt(a*a + o*o)
        //Shadow Angle Junk
        var shadowAngle        
        shadowAngle = Math.asin(o/h) + 1.57
        if (a < 0) {
            shadowAngle = -Math.asin(o/h) - 1.57
        }
        
        //Shadow Opacity
        var distRange = this.lightSize * .7
        var opac = this.maxOpacity - this.minOpacity 
        var dist = Math.max(distRange - h, 0.1) 
        var shadowOpacity = (dist / distRange) * opac
        
        return [shadowAngle, shadowOpacity]
    },
})

});