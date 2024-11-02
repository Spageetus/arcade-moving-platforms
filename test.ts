let p1 = MoveablePlatform.create(assets.image`platform1x1`)
tiles.setCurrentTilemap(assets.tilemap`testLevel`)
scene.setBackgroundColor(9)

let playerSprite = sprites.create(assets.image`playerImage`, SpriteKind.Player)
tiles.placeOnTile(playerSprite, tiles.getTileLocation(0, 0))
playerSprite.ay = 600
controller.moveSprite(playerSprite, 100, 0)

let platforms = sprites.allOfKind(SpriteKind.Platform)
console.log(SpriteKind.Platform)

controller.up.onEvent(ControllerButtonEvent.Pressed, function()
{
    if(playerSprite.isHittingTile(CollisionDirection.Bottom))
    {
        playerSprite.vy = -250
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Platform, function(sprite: Sprite, platform: Sprite)
{
    MoveablePlatform.platformCollisionHandler(sprite, platform)
})