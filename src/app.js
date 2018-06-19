'use strict'

const SimpleScrollbar = require('simple-scrollbar')

const clouds = [
        'astrology',
        'aurareading',
        'chaosmagic',
        'clairvoyance',
        'healing',
        'natalchart',
        'palmreading',
        'tarot'
    ],
    cloudsPath = './clouds/',
    cloudsData = [],
    cloudSpeed = 5,
    cloudFloatIntervalFrequency = 100,
    overlay = document.querySelector('#overlay'),
    close = document.querySelector('#close'),
    header = document.querySelector('#header'),

    topmostPos = header.offsetHeight,
    docHeight = document.body.offsetHeight - topmostPos,
    docWidth = document.body.offsetWidth,
    cloudSpace = docHeight / clouds.length,
    cloudHeight = .8 * cloudSpace,
    maxHeightVar = .2 * cloudSpace,
    transitionDuration = 400 // same as .hidden

function loadResources(){
    for (let cloud of clouds){
        cloudsData[cloud] = {
            cloud: codeToNode(require(cloudsPath + cloud + '/cloud.html')),
            style: codeToStyle(require(cloudsPath + cloud + '/style.css')),
            content: null
        }
    }
}

function initClouds(){

    overlay.classList.add('hidden')
    close.classList.add('hidden')

    overlay.addEventListener('click', function(e){
        closeContent(e)
    })

    close.addEventListener('click', function(e){
        closeContent(e)
    })

    for (let cloud of clouds){
        displayCloud(cloud)
        bindCloudEvents(cloud)
        // floatCloud(cloud)
    }
}

function displayCloud(cloud){
    const cloudData = cloudsData[cloud],
          variateHeight = Math.random() * maxHeightVar * (Math.random() < .5 ? -1 : 1)

    cloudData.satelite = {
        el: cloudData.cloud.querySelector('.satelite'),
        paused: true,
        intervalId: null
    }
    cloudData.readable = cloudData.cloud.querySelector('.readable')
    cloudData.content = cloudData.cloud.querySelector('.content')
    cloudData.content.classList.add('hidden')

    cloudData.float = {
        dirX: Math.random() < .5 ? -1 : 1,
        posX: Math.random() * docWidth,
        posY: cloudSpace * clouds.indexOf(cloud) + variateHeight,
        paused: false
    }

    if (cloudData.float.posX < 0){
        cloudData.float.posX = 0
    }

    if (cloudData.float.posY < topmostPos){
        cloudData.float.posY = topmostPos
    }

    if (cloudData.float.posY + cloudHeight > docHeight){
        cloudData.float.posY = docHeight - cloudHeight / 2
    }

    cloudData.cloud.appendChild(cloudData.style)
    document.body.appendChild(cloudData.cloud)

    if (cloudData.float.posX + cloudData.cloud.offsetWidth > docWidth){
        cloudData.float.posX = docWidth - cloudData.cloud.offsetWidth
    }

    cloudData.cloud.style.left = `${cloudData.float.posX}px`
    cloudData.cloud.style.top = `${cloudData.float.posY}px`

    // if (cloudData.readable){
    //     SimpleScrollbar.initEl(cloudData.readable)
    // }
}

function bindCloudEvents(cloud){
    const cloudContent = cloudsData[cloud].cloud
    cloudContent.addEventListener('mouseleave', function(e){
        toggleFloatCloud(cloud, e)
    })
    cloudContent.addEventListener('mouseover', function(e){
        toggleFloatCloud(cloud, e)
    })
    cloudContent.addEventListener('click', function(e){
        openContent(cloud, e)
        floatSatelite(cloud)
    })
}

function floatCloud(cloud){
    setInterval(function (){
        const cloudData = cloudsData[cloud]

        if (cloudData.float.paused) return

        let boxLeft = cloudData.cloud.offsetLeft,
            boxRight = boxLeft + cloudData.cloud.offsetWidth,
            boxTop = cloudData.cloud.offsetTop,
            boxBottom = boxTop + cloudData.cloud.offsetHeight,
            docWidth = document.body.offsetWidth,
            docHeight = document.body.offsetHeight

        if (boxLeft - cloudSpeed <= 0) cloudData.float.dirX = 1
        if (boxRight + cloudSpeed >= docWidth) cloudData.float.dirX = -1
        // if (boxTop - cloudSpeed <= 0) cloudData.float.dirY = 1
        // if (boxBottom + cloudSpeed >= docHeight) cloudData.float.dirY = -1

        if (cloudData.float.dirX == 1 && boxRight + cloudSpeed <= docWidth){
            cloudData.cloud.style.left = cloudData.cloud.offsetLeft + cloudSpeed + 'px'
        }

        if (cloudData.float.dirX == -1 && boxLeft - cloudSpeed >= 0){
            cloudData.cloud.style.left = cloudData.cloud.offsetLeft - cloudSpeed + 'px'
        }

        // if (cloudData.float.dirY == 1 && boxBottom + cloudSpeed <= docHeight){
        //     cloudData.cloud.style.top = cloudData.cloud.offsetTop + cloudSpeed + 'px'
        // }

        // if (cloudData.float.dirY == -1 && boxTop - cloudSpeed >= 0){
        //     cloudData.cloud.style.top = cloudData.cloud.offsetTop - cloudSpeed + 'px'
        // }
    }, cloudFloatIntervalFrequency)
}

function floatSatelite(cloud){

    const satelite = cloudsData[cloud].satelite

    if (!satelite.el) return

    const maxDeviation = 50,
          maxDevLeft = satelite.el.offsetLeft - maxDeviation,
          maxDevTop = satelite.el.offsetTop - maxDeviation,
          maxDevRight = satelite.el.offsetLeft + satelite.el.offsetWidth + maxDeviation,
          maxDevBottom = satelite.el.offsetTop + satelite.el.offsetHeight + maxDeviation,
          stepFactor = 2,
          dirChangeSteps = 10,
          updateInterval = 200

    let stepsSinceDirChange = 0,
        dirX = Math.random() < .5 ? -1 : 1,
        dirY = Math.random() < .5 ? -1 : 1

    satelite.paused = false

    satelite.intervalId = setInterval(function(){

        if (satelite.paused) return

        const sateliteLeftPoint = satelite.el.offsetLeft,
          sateliteTopPoint = satelite.el.offsetTop,
          sateliteRightPoint = sateliteLeftPoint + satelite.el.offsetWidth,
          sateliteBottomPoint = sateliteTopPoint + satelite.el.offsetHeight

        if (stepsSinceDirChange >= dirChangeSteps){
            dirX = Math.random() < .5 ? -1 : 1
            dirY = Math.random() < .5 ? -1 : 1

            stepsSinceDirChange = 0
        }

        if (sateliteLeftPoint - stepFactor <= maxDevLeft) dirX = 1
        if (sateliteTopPoint - stepFactor <= maxDevTop) dirY = 1
        if (sateliteRightPoint + stepFactor >= maxDevRight) dirX = -1
        if (sateliteBottomPoint + stepFactor >= maxDevBottom) dirY = -1

        if (dirX == -1){
            satelite.el.style.left = satelite.el.offsetLeft - stepFactor + 'px'
        }

        if (dirY == -1){
            satelite.el.style.top = satelite.el.offsetTop - stepFactor + 'px'
        }

        if (dirX == 1){
            satelite.el.style.left = satelite.el.offsetLeft + stepFactor + 'px'
        }

        if (dirY == 1){
            satelite.el.style.top = satelite.el.offsetTop + stepFactor + 'px'
        }

        stepsSinceDirChange++

    }, updateInterval)
}

function toggleFloatCloud(cloud, e){
    if (
            (e && e.target !== cloudsData[cloud].cloud)
            || overlay.classList.contains('displayed')
    ){
        return
    }

    cloudsData[cloud].float.paused
    = cloudsData[cloud].float.paused
    ? false
    : true
}

function openContent(cloud, e){
    if (
            (e && e.target !== cloudsData[cloud].cloud)
            || overlay.classList.contains('displayed')
    ){
        return
    }

    overlay.classList.add('displayed')
    overlay.offsetTop // force rendering
    overlay.classList.add('shown07')
    close.classList.add('displayed')
    close.offsetTop // force rendering
    close.classList.add('shown')

    cloudsData[cloud].content.classList.add('displayed')
    cloudsData[cloud].content.offsetTop // force rendering
    cloudsData[cloud].content.classList.add('shown')
}

function closeContent(e){
    if (
            !overlay.classList.contains('displayed')
    ){
        return
    }

    overlay.classList.remove('shown07')
    close.classList.remove('shown')

    setTimeout(function(){
        overlay.classList.remove('displayed')
        close.classList.remove('displayed')
    }, transitionDuration)

    for (let cloud of clouds){
        const c = cloudsData[cloud]

        c.satelite.paused = true

        c.float.paused = false
        c.content.classList.remove('shown')
        setTimeout(function(){
            c.content.classList.remove('displayed')
        }, transitionDuration)
    }
}

function codeToNode(code){
    let div = document.createElement('div')
    div.innerHTML = code
    return div.firstChild
}

function codeToStyle(code){
    let style = document.createElement('style')
    style.innerHTML = code
    return style
}

window.addEventListener('load', function(){
    loadResources()
    initClouds()
})