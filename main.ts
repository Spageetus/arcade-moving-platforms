namespace SpriteKind
{
    export let Platform = SpriteKind.Player-1
}

//% color=190 weight=100 icon="\uf151" block="Platforms" advanced=true
//% groups=['Create', 'SpriteKind', 'Behavior', 'others']
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
    let spritesRidePlatforms: boolean
    //% block="Platform" color=#3B6FEA group='SpriteKind'
    export let platformId = SpriteKind.Player-1

    /**
     * Creates a platform using an image
     * @param image
     */
    //% block="platform $img" group='Create'
    //% img.shadow="screen_image_picker"
    export function create(img: Image) {
        if (SpriteKind.Platform == undefined) { //Platform kind is undefined when this function runs for the first time
            SpriteKind.Platform = SpriteKind.Player-1
        }
        return sprites.create(img, SpriteKind.Platform)
    }

    /**
     * Allows a sprite to use platforms
     * @param Sprite
     */
    //$ block="make $sprite platformer"
    export function makePlatformer(sprite: Sprite)
    {
        if(allPlatformers == null)
        {
            allPlatformers = []
        }
        let temp = allPlatformers
        while(allPlatformers.length <= sprite.id)
        {
            allPlatformers.push(null)
        }
        allPlatformers[sprite.id] = new Platformer(sprite)
    }

    /**
     * Returns true if a sprite is on top of a platform
     * @param Sprite
     * @returns boolean
     */
    //% block="Is $sprite on a platform" group='others'
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

    /**
     * Returns if Sprites are allowed to ride on top of platforms
     * @returns boolean
     */
    //% block="sprites ride platforms"
    //% group='behavior'
    export function doSpritesRidePlatforms()
    {
        return spritesRidePlatforms
    }

    /**
     * Changes sprite riding behavior
     * @param boolean
     */
    //% block="set sprites ride platforms %b"
    //% group='behavior'
    export function setSpritesRidePlatforms(b: boolean)
    {
        spritesRidePlatforms = b
    }
    /**
     * Handles Platform Collision (use inside of an overlap container)
     * @param sprite, platform
     */
    //% block="make $sprite collide with $platform" group='others'
    export function platformCollisionHandler(sprite: Sprite, platform: Sprite) //call function inside of overlap container
    {
        if(platform.kind() != SpriteKind.Platform)
        {
            console.log("Cannot ride non-Platform sprites")
            return
        }
        if (allPlatformers == null || sprite.id >= allPlatformers.length)
        {
            console.log("No platformers")
            return
        }
        let currentPlatformer = allPlatformers[sprite.id]
        if(currentPlatformer == null)
        {
            console.log("Sprite with id: " + sprite.id + " is not a Platformer")
            return
        }
        if (sprite.bottom <= platform.y - (platform.y - platform.top)/4) //hits top of platform
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
        if (sprite.right < platform.x) { //hits left side of platform
            //sprite.right = platform.left
            while (sprite.right < (platform.left + platform.x)/2 && sprite.overlapsWith(platform)) {
                sprite.right -= 2
            }
        }
        else if (sprite.left > platform.x) { //hits right side of platform
            //sprite.left = platform.right
            while(sprite.left > (platform.right + platform.x)/2 && sprite.overlapsWith(platform))
            {
                sprite.left += 1
            }
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

                    if (sprite.left > p.currentPlatform.right || sprite.right < p.currentPlatform.left) //drops platformer off of platform if it walks off the edge
                    {
                        p.isOnPlatform = false
                        p.currentPlatform = null
                        sprite.ay = p.gravity
                        continue
                    }

                    if (sprite.bottom < p.currentPlatform.top-2) { //sprite jumps off of platform (added wiggle room to prevent jittering)
                        p.isOnPlatform = false
                        p.currentPlatform = null
                        sprite.ay = p.gravity
                        continue
                    }

                    if (spritesRidePlatforms) { //makes sprites have same velocity as platform
                        sprite.vx = p.currentPlatform.vx
                        sprite.vy = p.currentPlatform.vy
                    }
                    else //stops sprite from staying on platform
                    {
                        sprite.vx = 0
                    }
                }
            }
        }
    })
}
