namespace SpriteKind {
    export const Platform = SpriteKind.create()
}

namespace Helper
{
    export function distanceFrom(x1: number, y1: number, x2: number, y2: number)
    {
        let dx = x2-x1
        let dy = y1-y2
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    }
}

/**
 * Gives access to Platform functions
 */
//% color=190 weight=100 icon="\uf151" block="Platforms" advanced=true
//% groups='["Create", "SpriteKind", "Behavior", "Collision", "others"]'
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
            if(this.gravity == 0)
            {
                console.log("WARNING: sprite with id:" + sprite.id + " has a y acceleration of 0")
            }
        }
    }

    let allPlatformers: Platformer[]
    let spritesRidePlatforms: boolean
    const platformKind = SpriteKind.Platform

    /**
     * returns SpriteKind.Platform
     */
    //% block="Platform" color=#3B6FEA group='SpriteKind'
    //% blockid="platformKind"
    export function getPlatformKind()
    {
        return platformKind
    }

    /**
     * Creates a platform using an image
     * @param image
     */
    //% block="platform $img" group='Create' weight=100
    //% img.shadow="screen_image_picker"
    //% blockid="createPlatform"
    //% blockSetVariable=myPlatform
    export function create(img: Image) {
        if (SpriteKind.Platform == undefined) { //Platform kind is undefined when this function runs for the first time
            //SpriteKind.Platform = SpriteKind.Player-1
        }
        return sprites.create(img, SpriteKind.Platform)
    }

    function getSpritesPlatformer(sprite: Sprite) {
        let spriteId = sprite.id
        if (spriteId >= allPlatformers.length) {
            return null
        }
        return allPlatformers[spriteId]
    }

    /**
     * Allows a sprite to use platforms
     * @param Sprite
     */
    //% block="make %sprite=variables_get(mySprite) use platforms"
    //% blockid="makeSpritePlatformer"
    //% group='Create'
    //% 
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
     * Returns if Sprites are allowed to ride on top of platforms
     * @returns boolean
     */
    //% block="do sprites ride platforms"
    //% blockid="getSpritesRidePlatforms"
    //% group='Behavior'
    export function doSpritesRidePlatforms()
    {
        return spritesRidePlatforms
    }

    /**
     * Changes sprite riding behavior
     * @param boolean
     */
    //% block="set sprites ride platforms %b"
    //% blockid="setSpritesRidePlatforms"
    //% group='Behavior'
    //% b.shadow="toggleOnOff"
    export function setSpritesRidePlatforms(b: boolean)
    {
        spritesRidePlatforms = b
    }

    /**
     * Returns true if a sprite is on top of a platform
     * @param Sprite
     * @returns boolean
     */
    //% block="Is %sprite=variables_get(mySprite) on a platform"
    //% blockid="isSpriteOnPlatform"
    //% group='others'
    export function isSpriteOnPlatform(sprite: Sprite) {
        if (sprite.id < allPlatformers.length) //sprite could be a platformer
        {
            if (allPlatformers[sprite.id] != null) //sprite is a platformer
            {
                return allPlatformers[sprite.id].isOnPlatform
            }
        }
        return false
    }


    /**
     * Handles Platform Collision (use inside of an overlap container)
     * @param sprite, platform
     */
    //% block="make %sprite=variables_get(mySprite) collide with %platform=variables_get(myPlatform)" group='others'
    //% blockid="platformCollisionHandler"
    //% group='Collision'
    export function platformCollisionHandler(sprite: Sprite, platform: Sprite) //many inconstistancies, needs redoing
    {
        if(platform.kind() != SpriteKind.Platform) //ensures that function is only called on sprite of Kind Platform
        {
            throw "invalid SpriteKind. otherSprite must be of kind Platform"
        }
        let spritePlatformer = getSpritesPlatformer(sprite)
        if(spritePlatformer == null) //makes sure sprite is a platformer
        {
            throw "Sprite with id: " + sprite.id + " is not a Platformer"
        }
        let sLeft_pRight_distance = Math.abs(sprite.left - platform.right)
        let sRight_pLeft_distance = Math.abs(sprite.right - platform.left)
        let sTop_pBottom_distance = Math.abs(sprite.top - platform.bottom)
        let sBottom_pTop_distance = Math.abs(sprite.bottom - platform.top)

        console.logValue("sLeft_pRight_distance", sLeft_pRight_distance)
        console.logValue("sRight_pLeft_distance", sRight_pLeft_distance)
        console.logValue("sTop_pBottom_distance", sTop_pBottom_distance)
        console.logValue("sBottom_pTop_distance", sBottom_pTop_distance)
        let closest = Math.min(Math.min(sLeft_pRight_distance, sRight_pLeft_distance), Math.min(sTop_pBottom_distance, sBottom_pTop_distance))
        
        if(closest = sLeft_pRight_distance) //collision on right side of platform
        {
            console.log("right side collision")
            sprite.vx = 0
            sprite.vy = 0
            sprite.left = platform.right
        }
        else if(closest = sRight_pLeft_distance) //collision on left side of platform
        {
            console.log("left side collision")
            sprite.vx = 0
            sprite.vy = 0
            while(sprite.overlapsWith(platform))
            {
                sprite.x-=2
            }
        }
        else if(closest = sTop_pBottom_distance) //collision on bottom of platform
        {
            throw "bottom collision"
            sprite.vx = 0
            sprite.vy = 0
            sprite.top = platform.bottom
        }
        else if(closest = sBottom_pTop_distance) //collision on top of platform
        {
            throw "top collision"
            sprite.vx = 0
            sprite.vy = 0
            sprite.bottom = platform.top
            spritePlatformer.isOnPlatform = true
            spritePlatformer.currentPlatform = platform
            sprite.ay = 0
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
