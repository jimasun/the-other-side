export default function(){
    bindEvents('signs')
    bindEvents('planets')
}

function bindEvents(cat){

    let satelite = document.querySelector(`#astrology .satelite.${cat}`),
        galery = document.querySelector(`#astrology .galery.${cat}`),
        content = document.querySelector('#astrology>.content'),

        items = galery.querySelectorAll(`.img-cap>.img`),
        chosen = galery.querySelector(`.chosen`),
        chosenImg = galery.querySelector(`.chosen>.img`),
        chosenCap = galery.querySelector(`.chosen>.cap`)

    satelite.addEventListener('click', function(e){
        galery.classList.remove('hidden')
        content.classList.remove('shown')
        arangeSigns(cat)
    });

    for (const item of items){
        item.addEventListener('mouseover', function(e){

            while(chosenImg.firstElementChild){
                chosenImg.removeChild(chosenImg.firstElementChild)
            }

            while(chosenCap.lastElementChild){
                if (chosenCap.lastElementChild.classList.contains('shape')){
                    break
                }
                chosenCap.removeChild(chosenCap.lastElementChild)
            }

            const img = e.target.cloneNode(),
                  cap = e.target.nextElementSibling.cloneNode(true)

            chosenImg.appendChild(img)
            chosenCap.appendChild(cap)

            setTimeout(function(){
                chosen.classList.remove('hidden')
                chosen.classList.add('shown')
                chosen.offsetWidth
                chosen.classList.add('opacity')
            },0)
        });
    }
}

function arangeSigns(cat){
    const signs = document.querySelectorAll(`#astrology .galery.${cat} .img-cap`),
        radius = 300,
        range = 360,
        steps = signs.length,
        step = range / steps,
        startAngle = cat == 'planets' ? 0 : -180 + step / 2,
        centerX = (document.body.offsetWidth - signs[0].offsetWidth) / 2,
        centerY = (document.body.offsetHeight - signs[0].offsetHeight) / 2

    let angle = startAngle,
        rad = null

    signs.forEach(function(s){
        angle += step,
        rad = angle * Math.PI / 180

        !function(rad){
            setTimeout(function(){
                s.classList.remove('origin')
                s.style.left = `${centerX + radius * Math.cos(rad)}px`
                s.style.top = `${centerY + radius * Math.sin(rad)}px`
            }, 0)
        }(rad)
    })

    setTimeout(function(){
        signs[0]
            .querySelector('.img')
            .dispatchEvent(new MouseEvent('mouseover'))
    }, 500)
}
