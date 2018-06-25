'use strict'

const SimpleScrollbar = require('simple-scrollbar')

const clouds = [
        'aurareading',
        'astrology',
        'chaosmagic',
        'clairvoyance',
        'tarot',
        'healing',
        'palmreading',
        'natalchart'
    ],
    cloudsActive = [
        'astrology',
        'palmreading',
        'tarot'
    ],
    cloudsPath = './clouds/',
    cloudsData = [],
    cloudSpeed = 5,
    cloudFloatIntervalFrequency = 100,
    overlay = document.querySelector('#overlay'),
    close = document.querySelector('#close'),
    logo = document.querySelector('#logo'),
    about = document.querySelector('#about'),
    aboutClose = document.querySelector('#about .close'),
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
            script: require(cloudsPath + cloud + '/script.js').default,
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

    logo.addEventListener('click', function(e){
        openAbout(e)
    })

    aboutClose.addEventListener('click', function(e){
        closeAbout(e)
    })

    for (let cloud of clouds){
        displayCloud(cloud)
        bindCloudEvents(cloud)
        cloudsData[cloud].script()
        floatCloud(cloud)
    }
}

function displayCloud(cloud){
    const cloudData = cloudsData[cloud],
          variateHeight = Math.random() * maxHeightVar * (Math.random() < .5 ? -1 : 1)

    cloudData.satelite = {
        el: cloudData.cloud.querySelectorAll('.satelite'),
        paused: true,
        intervalId: null
    }
    // cloudData.readable = cloudData.cloud.querySelector('.readable')
    cloudData.content = cloudData.cloud.querySelector('.content')
    cloudData.clouddata = cloudData.cloud.querySelectorAll('.clouddata')

    if (cloudsActive.indexOf(cloud) != -1){
        cloudData.cloud.classList.add('active')
    }

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
        floatSatelites(cloud)
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

function floatSatelites(cloud){
    if (!cloudsData[cloud].satelite.el.length) return

    const satelite = cloudsData[cloud].satelite,
        sFloatData = [],
        updateInterval = 200


    satelite.el.forEach(function(e, i){
        const maxDeviation = 50

        sFloatData[i] = {
            dirX: Math.random() < .5 ? -1 : 1,
            dirY: Math.random() < .5 ? -1 : 1,
            stepFactor: 2,
            maxDevLeft: e.offsetLeft - maxDeviation,
            maxDevTop: e.offsetTop - maxDeviation,
            maxDevRight: e.offsetLeft + e.offsetWidth + maxDeviation,
            maxDevBottom: e.offsetTop + e.offsetHeight + maxDeviation,
            dirChangeSteps: 10 + Math.random() * 5,

            stepsSinceDirChange: 0
        }
    })

    satelite.paused = false

    satelite.intervalId = setInterval(function(){

        if (satelite.paused) return

        satelite.el.forEach(function(e, i){

            const sateliteLeftPoint = e.offsetLeft,
              sateliteTopPoint = e.offsetTop,
              sateliteRightPoint = sateliteLeftPoint + e.offsetWidth,
              sateliteBottomPoint = sateliteTopPoint + e.offsetHeight,
              floatData = sFloatData[i]

            if (floatData.stepsSinceDirChange >= floatData.dirChangeSteps){
                floatData.dirX = Math.random() < .5 ? -1 : 1
                floatData.dirY = Math.random() < .5 ? -1 : 1

                floatData.stepsSinceDirChange = 0
            }

            if (sateliteLeftPoint - floatData.stepFactor <= floatData.maxDevLeft) floatData.dirX = 1
            if (sateliteTopPoint - floatData.stepFactor <= floatData.maxDevTop) floatData.dirY = 1
            if (sateliteRightPoint + floatData.stepFactor >= floatData.maxDevRight) floatData.dirX = -1
            if (sateliteBottomPoint + floatData.stepFactor >= floatData.maxDevBottom) floatData.dirY = -1

            if (floatData.dirX == -1){
                e.style.left = e.offsetLeft - floatData.stepFactor + 'px'
            }

            if (floatData.dirY == -1){
                e.style.top = e.offsetTop - floatData.stepFactor + 'px'
            }

            if (floatData.dirX == 1){
                e.style.left = e.offsetLeft + floatData.stepFactor + 'px'
            }

            if (floatData.dirY == 1){
                e.style.top = e.offsetTop + floatData.stepFactor + 'px'
            }

            floatData.stepsSinceDirChange++
        })
    }, updateInterval)
}

function openAbout(){
    about.classList.add('displayed')
    about.offsetWidth
    about.classList.add('shown')
}

function closeAbout(){
    about.classList.remove('shown')

    setTimeout(function(){
        about.classList.remove('displayed')
    }, transitionDuration)
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

    const gallery = document.querySelector(`.galery:not(.hidden)`)

    if (gallery){
        closeGallery(gallery)
        return
    }

    overlay.classList.remove('shown07')
    close.classList.remove('shown')

    setTimeout(function(){
        overlay.classList.remove('displayed')
        close.classList.remove('displayed')
    }, transitionDuration)

    clouds.forEach(function(v){
        const c = cloudsData[v]

        c.satelite.paused = true
        c.float.paused = false

        c.clouddata.forEach(function(v){
            v.classList.add('hidden')
        })

        c.content.classList.remove('shown')
        setTimeout(function(){
            c.content.classList.remove('displayed')
        }, transitionDuration)
    })
}

function closeGallery(gallery){
    gallery
        .classList
        .add('hidden')

    gallery
        .querySelector(`.chosen`)
        .classList
        .remove('opacity')

    gallery
        .querySelectorAll(`.img-cap`)
        .forEach(function(e){
            e.classList.add('origin')
            e.style = null
        })

    gallery
        .parentElement
        .querySelector('.content')
        .classList
        .add('shown')
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