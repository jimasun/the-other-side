'use strict'

let cloudsPath = './clouds/',
    clouds = ['tarot'],
    cloudsData = [],
    cloudSpeed = 5,
    cloudFloatIntervalFrequency = 50,
    overlay = null

function loadResources(){
    for (let cloud of clouds){
        cloudsData[cloud] = {
            cloud: codeToNode(require(cloudsPath + 'tarot/cloud.html')),
            // script: require(cloudsPath + 'tarot/script.js'),
            style: codeToStyle(require(cloudsPath + 'tarot/style.css'))
        }
    }
}

function initClouds(){

    overlay = document.querySelector('#overlay')

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

function bindCloudEvents(cloud){
    const cloudContent = cloudsData[cloud].cloud
    cloudContent.addEventListener('mouseleave', function(e){
        toggleFloatCloud(cloud, e)
    })
    cloudContent.addEventListener('mouseover', function(e){
        toggleFloatCloud(cloud, e)
    })
    cloudContent.addEventListener('click', function(e){
        toggleContent(cloud, e)
    })
    overlay.addEventListener('click', function(e){
        toggleContent(cloud, e)
    })
}

function toggleFloatCloud(cloud, e){
    if (e && ( // mouseleave && cloud && overlay opened
            e.target === cloudsData[cloud].cloud &&
            overlay.classList.contains('displayed')
        )
    ){
        return
    }

    if (e && ( // !cloud && !overlay
            e.target !== cloudsData[cloud].cloud &&
            e.target !== overlay
        )
    ){
        return
    }

    cloudsData[cloud].float.paused
    = cloudsData[cloud].float.paused
    ? false
    : true
}

function toggleContent(cloud, e){
    if (e && ( // !cloud && ! overlay
            e.target !== cloudsData[cloud].cloud &&
            e.target !== overlay
        )
    ){
        return
    }


    if (e && // overlay clicked (not cloud which will make it move again)
            e.target === overlay
    ){
        toggleFloatCloud(cloud, e);
    }

    overlay.classList.toggle('displayed')
    cloudsData[cloud].content.classList.toggle('opened')
    cloudsData[cloud].content.classList.toggle('closed')
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