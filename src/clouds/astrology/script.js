export default function(){
    bindEvents()
}

function bindEvents(){

    let satelite = document.querySelector('#astrology .satelite'),
        galery = document.querySelector('#astrology>.galery'),
        content = document.querySelector('#astrology>.content'),

        items = document.querySelectorAll('#astrology>.galery>.img-cap>.img'),
        chosen = document.querySelector('#astrology>.galery>.chosen'),
        chosenImg = document.querySelector('#astrology>.galery>.chosen>.img'),
        chosenCap = document.querySelector('#astrology>.galery>.chosen>.cap')

    satelite.addEventListener('click', function(e){
        galery.classList.remove('hidden')
        content.classList.remove('shown')
        arangeZodiac()
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

            chosen.classList.remove('hidden')
            chosen.classList.add('shown')
        });
    }
}

function arangeZodiac(){
    const signs = document.querySelectorAll('#astrology .img-cap'),
        radius = 300,
        range = 360,
        steps = 12,
        step = range / steps,
        centerX = (document.body.offsetWidth - signs[0].offsetWidth) / 2,
        centerY = (document.body.offsetHeight - signs[0].offsetHeight) / 2

    let angle = -step,
        rad = angle * Math.PI / 180

    signs.forEach(function(s){
        angle += step,
        rad = angle * Math.PI / 180

        s.style.left = `${centerX + radius * Math.cos(rad)}px`
        s.style.top = `${centerY + radius * Math.sin(rad)}px`
    })
}