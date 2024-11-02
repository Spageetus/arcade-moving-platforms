namespace SpriteKind {
    export let Platform = SpriteKind.create()
    for (let sprite of sprites.allOfKind(9999)) {
        sprite.setKind(SpriteKind.Platform)
    }
}

namespace MoveablePlatform
{
    export function create(img: Image) {
        if (SpriteKind.Platform == undefined) { //Platform kind is undefined when this function runs for the first time
            SpriteKind.Platform = 9999
        }
        return sprites.create(img, SpriteKind.Platform)
    }

    export function platformCollisionHandler(sprite: Sprite, platform: Sprite)
    {
        
    }
}

