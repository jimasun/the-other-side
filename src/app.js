'use strict'

let clouds = [
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
    cloudFloatIntervalFrequency = 50,
    overlay = null

function loadResources(){
    for (let cloud of clouds){
        cloudsData[cloud] = {
            cloud: codeToNode(require(cloudsPath + cloud + '/cloud.html')),
            // script: require(cloudsPath + cloud + '/script.js'),
            style: codeToStyle(require(cloudsPath + cloud + '/style.css')),
            content: null
        }
    }
}

function initClouds(){

    overlay = document.querySelector('#overlay')

    overlay.addEventListener('click', function(e){
        closeContent(e)
    })

    for (let cloud of clouds){
        displayCloud(cloud)
        bindCloudEvents(cloud)
        floatCloud(cloud)
    }
}

function displayCloud(cloud){
    const cloudData = cloudsData[cloud]

    cloudData.cloud.appendChild(cloudData.style)
    cloudData.cloud.style.left = Math.random() * (document.body.offsetWidth - cloudData.cloud.offsetWidth) + 'px'
    cloudData.cloud.style.top = Math.random() * (document.body.offsetHeight - cloudData.cloud.offsetHeight) + 'px'

    cloudData.content = cloudData.cloud.querySelector('.content')
    cloudData.content.classList.toggle('closed')

    cloudData.float = {
        dirX: Math.random() < .5 ? -1 : 1,
        dirY: Math.random() < .5 ? -1 : 1,
        paused: false
    }

    document.body.appendChild(cloudData.cloud)
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
        if (boxTop - cloudSpeed <= 0) cloudData.float.dirY = 1
        if (boxBottom + cloudSpeed >= docHeight) cloudData.float.dirY = -1

        if (cloudData.float.dirX == 1 && boxRight + cloudSpeed <= docWidth){
            cloudData.cloud.style.left = cloudData.cloud.offsetLeft + cloudSpeed + 'px'
        }

        if (cloudData.float.dirX == -1 && boxLeft - cloudSpeed >= 0){
            cloudData.cloud.style.left = cloudData.cloud.offsetLeft - cloudSpeed + 'px'
        }

        if (cloudData.float.dirY == 1 && boxBottom + cloudSpeed <= docHeight){
            cloudData.cloud.style.top = cloudData.cloud.offsetTop + cloudSpeed + 'px'
        }

        if (cloudData.float.dirY == -1 && boxTop - cloudSpeed >= 0){
            cloudData.cloud.style.top = cloudData.cloud.offsetTop - cloudSpeed + 'px'
        }
    }, cloudFloatIntervalFrequency)
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
    cloudsData[cloud].content.classList.add('opened')
    cloudsData[cloud].content.classList.remove('closed')
}

function closeContent(e){
    if (
            (e && e.target !== overlay)
            || !overlay.classList.contains('displayed')
    ){
        return
    }

    overlay.classList.remove('displayed')

    for (let cloud of clouds){
        const c = cloudsData[cloud]

        if (c.float.paused){
            c.float.paused = false
            c.content.classList.add('closed')
            c.content.classList.remove('opened')
        }
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