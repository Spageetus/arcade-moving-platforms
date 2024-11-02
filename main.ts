namespace SpriteKind {
    export let Platform = 9999
}
namespace MoveablePlatform
{
    let isOnPlatform = false
    let currentPlatform: Sprite = null
    
    export function create(img: Image) {
        if (SpriteKind.Platform == undefined) { //Platform kind is undefined when this function runs for the first time
            SpriteKind.Platform = 9999
        }
        return sprites.create(img, SpriteKind.Platform)
    }

    export function platformCollisionHandler(sprite: Sprite, platform: Sprite)
    {
        if (sprite.right < platform.x) {
            sprite.right = platform.left
        }
        else if (sprite.left > platform.x) {
            sprite.left = platform.right
        }
        else if (sprite.bottom <= platform.y) //hits top of platform
        {
            isOnPlatform = true
            currentPlatform = platform
            sprite.ay = 0
            sprite.vy = 0
            sprite.bottom = platform.top
        }
        else if (sprite.top >= platform.y) //hit bottom of tile
        {
            sprite.top = platform.bottom
            sprite.vy = 0
        }
    }
}
