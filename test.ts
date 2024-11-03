

//setup
tiles.setTilemap(assets.tilemap`testLevel`)
scene.setBackgroundColor(9)


//player sprite stuff
let playerSprite = sprites.create(assets.image`playerImage`, SpriteKind.Player)
//playerSprite.setFlag(SpriteFlag.ShowPhysics, true)
playerSprite.ay = 600
tiles.placeOnTile(playerSprite, tiles.getTileLocation(0, 6))
controller.moveSprite(playerSprite, 100, 0)
Platforms.makePlatformer(playerSprite)

//platforms
let p1 = Platforms.create(assets.image`platform1x2`)
p1.y += 16

//p1.vx = 25
p1.vy = 10
p1.setFlag(SpriteFlag.BounceOnWall, true)
Platforms.spritesRidePlatforms = true


//controller events
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (playerSprite.isHittingTile(CollisionDirection.Bottom) || Platforms.isSpriteOnPlatform(playerSprite)) {
        playerSprite.vy = -250
        if(Platforms.isSpriteOnPlatform(playerSprite))
        {
            console.logValue("vy", playerSprite.vy)
        }
    }
})

//overlap events
sprites.onOverlap(SpriteKind.Player, SpriteKind.Platform, function (sprite: Sprite, platform: Sprite) {
    Platforms.platformCollisionHandler(sprite, platform)
})

game.onUpdateInterval(2000, function()
{
    p1.vy *= -1
})

forever(function()
{
    playerSprite.sayText(playerSprite.ay)
})