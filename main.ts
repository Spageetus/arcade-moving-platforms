namespace SpriteKind {
    export let Platform = SpriteKind.Player-1
}
namespace Platforms
{
    class Platformer
    {
        isOnPlatform = false
        currentPlatform: Sprite = null
        sprite: Sprite = null
        gravity = 0
        constructor(sprite: Sprite)
        {
            this.sprite = sprite
            this.gravity = sprite.ay
        }
    }

    let allPlatformers: Platformer[]
    export let spritesRidePlatforms: boolean

    export function create(img: Image) {
        if (SpriteKind.Platform == undefined) { //Platform kind is undefined when this function runs for the first time
            SpriteKind.Platform = SpriteKind.Player-1
        }
        return sprites.create(img, SpriteKind.Platform)
    }

    export function makePlatformer(sprite: Sprite)
    {
        if(allPlatformers == null)
        {
            allPlatformers = []
        }
        console.log("Sprite ID: " + sprite.id)
        let temp = allPlatformers
        while(allPlatformers.length <= sprite.id)
        {
            allPlatformers.push(null)
        }
        allPlatformers[sprite.id] = new Platformer(sprite)
    }

    export function isSpriteOnPlatform(sprite: Sprite)
    {
        if(sprite.id < allPlatformers.length) //sprite could be a platformer
        {
            if(allPlatformers[sprite.id] != null) //sprite is a platformer
            {
                return allPlatformers[sprite.id].isOnPlatform
            }
        }
        return false
    }

    export function platformCollisionHandler(sprite: Sprite, platform: Sprite) //call function inside of overlap container
    {
        if(platform.kind() != SpriteKind.Platform)
        {
            console.log("Cannot ride non-Platform sprites")
            return
        }
        let currentPlatformer = allPlatformers[sprite.id]
        if(currentPlatformer == null)
        {
            console.log("Sprite with id: " + sprite.id + " is not a Platformer")
            return
        }
        if (sprite.right < platform.x) {
            sprite.right = platform.left
        }
        else if (sprite.left > platform.x) {
            sprite.left = platform.right
        }
        else if (sprite.bottom <= platform.y) //hits top of platform
        {
            currentPlatformer.isOnPlatform = true
            currentPlatformer.currentPlatform = platform
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

    game.onUpdate(function()
    {
        if(allPlatformers == null) //stops dereferencing null error
        {
            return
        }
        for(let p of allPlatformers)
        {
            if(p != null) //makes sure platformer exists
            {
                if(p.currentPlatform != null) //makes sure platformer is on a platform
                {
                    let sprite = p.sprite

                    if (spritesRidePlatforms) { //makes sprites have same velocity as platform
                        sprite.vx = p.currentPlatform.vx
                        sprite.vy = p.currentPlatform.vy
                    }
                    else //stops sprite from staying on platform
                    {
                        sprite.vx = 0
                        sprite.vy = 0
                    }

                    if(sprite.left > p.currentPlatform.right || sprite.right < p.currentPlatform.left) //drops platformer off of platform if it walks off the edge
                    {
                        p.isOnPlatform = false
                        p.currentPlatform = null
                        sprite.ay = p.gravity
                    }
                }
            }
        }
    })
}
