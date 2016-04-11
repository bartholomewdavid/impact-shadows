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

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0,1,2,1] );
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
                    lightSize: this.lightSize
                })
        }
    },

    update: function() {
		this.parent();
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
        if (other.drawShadow !== undefined) {
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