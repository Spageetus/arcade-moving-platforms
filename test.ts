tiles.setCurrentTilemap(assets.tilemap`testLevel`)
scene.setBackgroundColor(9)

let playerSprite = sprites.create(assets.image`playerImage`, SpriteKind.Player)
console.log(playerSprite.id)
tiles.placeOnTile(playerSprite, tiles.getTileLocation(0, 0))
playerSprite.ay = 600
controller.moveSprite(playerSprite, 100, 0)
Platforms.makePlatformer(playerSprite)


let p1 = Platforms.create(assets.image`platform1x1`)
p1.y += 16
p1.setFlag(SpriteFlag.BounceOnWall, true)
p1.vx = 50

controller.up.onEvent(ControllerButtonEvent.Pressed, function()
{
    if(playerSprite.isHittingTile(CollisionDirection.Bottom) || Platforms.isSpriteOnPlatform(playerSprite))
    {
        playerSprite.ay = 600
        playerSprite.vy = -250
    }
})