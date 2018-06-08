'use strict'

let cloudsPath = './clouds/',
    clouds = ['tarot'],
    cloudsData = [],
    cloudSpeed = 5,
    cloudFloatIntervalFrequency = 50

function loadResources(){
    for (let cloud of clouds){
        cloudsData[cloud] = {
            content: codeToNode(require(cloudsPath + 'tarot/cloud.html')),
            // script: require(cloudsPath + 'tarot/script.js'),
            style: codeToStyle(require(cloudsPath + 'tarot/style.css'))
        }
    }
}

function initClouds(){
    for (let cloud of clouds){
        displayCloud(cloud)
        bindCloudEvents(cloud)
        floatCloud(cloud)
    }
}

function displayCloud(cloud){
    const cloudData = cloudsData[cloud]

    cloudData.content.appendChild(cloudData.style)
    cloudData.content.style.left = Math.random() * (document.body.offsetWidth - cloudData.content.offsetWidth) + 'px'
    cloudData.content.style.top = Math.random() * (document.body.offsetHeight - cloudData.content.offsetHeight) + 'px'

    cloudData.float = {
        dirX: Math.random() < .5 ? -1 : 1,
        dirY: Math.random() < .5 ? -1 : 1,
        paused: false
    }

    document.body.appendChild(cloudData.content)
}

function floatCloud(cloud){
    setInterval(function (){
        const cloudData = cloudsData[cloud]

        if (cloudData.float.paused) return

        let boxLeft = cloudData.content.offsetLeft,
            boxRight = boxLeft + cloudData.content.offsetWidth,
            boxTop = cloudData.content.offsetTop,
            boxBottom = boxTop + cloudData.content.offsetHeight,
            docWidth = document.body.offsetWidth,
            docHeight = document.body.offsetHeight

        if (boxLeft - cloudSpeed <= 0) cloudData.float.dirX = 1
        if (boxRight + cloudSpeed >= docWidth) cloudData.float.dirX = -1
        if (boxTop - cloudSpeed <= 0) cloudData.float.dirY = 1
        if (boxBottom + cloudSpeed >= docHeight) cloudData.float.dirY = -1

        if (cloudData.float.dirX == 1 && boxRight + cloudSpeed <= docWidth){
            cloudData.content.style.left = cloudData.content.offsetLeft + cloudSpeed + 'px'
        }

        if (cloudData.float.dirX == -1 && boxLeft - cloudSpeed >= 0){
            cloudData.content.style.left = cloudData.content.offsetLeft - cloudSpeed + 'px'
        }

        if (cloudData.float.dirY == 1 && boxBottom + cloudSpeed <= docHeight){
            cloudData.content.style.top = cloudData.content.offsetTop + cloudSpeed + 'px'
        }

        if (cloudData.float.dirY == -1 && boxTop - cloudSpeed >= 0){
            cloudData.content.style.top = cloudData.content.offsetTop - cloudSpeed + 'px'
        }
    }, cloudFloatIntervalFrequency)
}

function toggleFloatCloud(cloud){
    cloudsData[cloud].float.paused
    = cloudsData[cloud].float.paused
    ? false
    : true
}

function bindCloudEvents(cloud){
    const cloudContent = cloudsData[cloud].content
    cloudContent.addEventListener('mouseleave', function(e){
        toggleFloatCloud(cloud)
    })
    cloudContent.addEventListener('mouseover', function(e){
        toggleFloatCloud(cloud)
    })
    cloudContent.addEventListener('click', function(e){
        openCloud(cloud)
    })
}

function openCloud(cloud){
    alert(cloud)
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