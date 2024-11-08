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
        console.log("running")
        if(platform.kind() != SpriteKind.Platform) //ensures that function is only called on sprite of Kind Platform
        {
            throw "invalid SpriteKind. otherSprite must be of kind Platform"
        }
        let spritePlatformer = getSpritesPlatformer(sprite)
        if(spritePlatformer == null) //makes sure sprite is a platformer
        {
            throw "Sprite with id: " + sprite.id + " is not a Platformer"
        }
        // to determine where sprite hit platform, calculate which side was hit first
        // velocity ~= pixels/second

        //calculate sprite's position 1/16th second ago
        // t = d/v, d = v*t, v = d/t
        let spLastX = sprite.x + sprite.vx * -1/20
        let spLastY = sprite.y + sprite.vy * -1/20

        let plLastX = platform.x + platform.vx * -1/20
        let plLastY = platform.y + platform.vy * -1/20

        let spLastBottom = spLastY + sprite.height/2 //gets sprite's previous bottom
        let plLastBottom = plLastY + platform.height/2 //gets platform's previous bottom
        
        let spLastTop = spLastY - sprite.height/2 //gets sprite's previous top
        let plLastTop = plLastY - platform.height/2 //gets platform's previous top

        let spLastRight = spLastX + sprite.width/2 //gets sprite's previous right
        let plLastRight = plLastX + platform.width/2 //gets platform's previous right

        let spLastLeft = spLastX - sprite.width/2 //gets sprite's previous left
        let plLastLeft = plLastX - platform.width/2 //gets platform's previous left
        //console.logValue("last top", plLastTop)
        //console.logValue("last right", spLastRight)
        //console.logValue("last left", spLastLeft)
        //console.logValue("last bottom", spLastBottom)

        let dy = Math.abs(spLastBottom - plLastTop)
        let dvy = Math.abs(sprite.vy - platform.vy)
        //console.log(dvy)
        let timeToHitTop = dy/dvy
        console.logValue("Time to hit top", timeToHitTop)
        console.logValue("dy", dy)
        console.logValue("dvy", dvy)
        if (Number.isNaN(timeToHitTop))
        {
            timeToHitTop = Infinity
        }

        dy = Math.abs(spLastTop - plLastBottom)
        dvy = Math.abs(sprite.vy - platform.vy)
        let timeToHitBottom = dy/dvy
        if (Number.isNaN(timeToHitBottom)) {
            timeToHitBottom = Infinity
        }
        console.logValue("Time to hit bottom", timeToHitBottom)
        console.logValue("dy", dy)
        console.logValue("dvy", dvy)

        let dx = Math.abs(spLastLeft - plLastRight)
        let dvx = Math.abs(sprite.vx - platform.vx)
        let timeToHitRight = dx / dvx
        console.logValue("Time to hit right", timeToHitRight)
        console.logValue("dx", dx)
        console.logValue("dvx", dvx)
        if (Number.isNaN(timeToHitRight)) {
            timeToHitRight = Infinity
        }

        dx = Math.abs(spLastRight - plLastLeft)
        dvx = Math.abs(sprite.vx - platform.vx)
        let timeToHitLeft = dx / dvx
        console.logValue("Time to hit left", timeToHitLeft)
        console.logValue("dx", dx)
        console.logValue("dvx", dvx)
        if (Number.isNaN(timeToHitLeft)) {
            timeToHitLeft = Infinity
        }


        let shortestTime = Math.min(Math.min(timeToHitBottom, timeToHitTop), Math.min(timeToHitRight, timeToHitLeft))
        if(shortestTime == timeToHitTop)
        {
            console.log("hitting top")
            sprite.ay = 0
            sprite.setVelocity(0, 0)
            spritePlatformer.currentPlatform = platform
            spritePlatformer.isOnPlatform = true
            sprite.bottom = platform.top
        }
        else if(shortestTime == timeToHitLeft)
        {
            console.log("hitting left")
            sprite.vx = 0
            while(sprite.overlapsWith(platform))
            {
                sprite.x-=2
            }
            //sprite.right = platform.left
        }
        else if(shortestTime == timeToHitRight)
        {
            console.log("hitting right")
            sprite.vx = 0
            while (sprite.overlapsWith(platform)) {
                sprite.x += 2
            }
            //sprite.left = platform.right
        }
        else if(shortestTime == timeToHitBottom)
        {
            console.log("hitting bottom")
            sprite.vx = 0
            sprite.vy = 0
            sprite.top = platform.bottom
        }
        else
        {
            console.logValue("Time to hit right", timeToHitRight)
            console.logValue("Time to hit left", timeToHitLeft)
            console.logValue("Time to hit top", timeToHitTop)
            console.logValue("Time to hit bottom", timeToHitBottom)
            console.logValue("Shortest Time", shortestTime)
            throw "this should never run"
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
