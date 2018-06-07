'use strict'

function floatBox(boxSelector){

    let speed = 3,
        dirX = Math.random() < .5 ? -1 : 1,
        dirY = Math.random() < .5 ? -1 : 1,
        maxDeviation = 0,
        box = document.querySelector(boxSelector)

        box.style.left = Math.random() * (document.body.offsetWidth - box.offsetWidth) + 'px'
        box.style.top = Math.random() * (document.body.offsetHeight - box.offsetHeight) + 'px'

    let moveTimer = setInterval(function (){
        let boxLeft = box.offsetLeft,
            boxRight = boxLeft + box.offsetWidth,
            boxTop = box.offsetTop,
            boxBottom = boxTop + box.offsetHeight,
            docWidth = document.body.offsetWidth,
            docHeight = document.body.offsetHeight

        if (boxLeft - speed <= 0) dirX = 1
        if (boxRight + speed >= docWidth) dirX = -1
        if (boxTop - speed <= 0) dirY = 1
        if (boxBottom + speed >= docHeight) dirY = -1

        if (dirX == 1 && boxRight + speed <= docWidth){
            box.style.left = box.offsetLeft + speed + 'px'
        }

        if (dirX == -1 && boxLeft - speed >= 0){
            box.style.left = box.offsetLeft - speed + 'px'
        }

        if (dirY == 1 && boxBottom + speed <= docHeight){
            box.style.top = box.offsetTop + speed + 'px'
        }

        if (dirY == -1 && boxTop - speed >= 0){
            box.style.top = box.offsetTop - speed + 'px'
        }
    }, 50)
}

window.addEventListener('load', function(){
    floatBox('#box_1')
    floatBox('#box_2')
    floatBox('#box_3')
    floatBox('#box_4')
    floatBox('#box_5')
    floatBox('#box_6')
})
