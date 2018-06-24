export default function(){
    bindEvents()
}

function bindEvents(){

    let satelite = document.querySelector('#tarot .satelite'),
        galery = document.querySelector('#tarot>.galery'),
        content = document.querySelector('#tarot>.content'),

        items = document.querySelectorAll('#tarot>.galery>.img-cap>.img'),
        chosen = document.querySelector('#tarot>.galery>.chosen'),
        chosenImg = document.querySelector('#tarot>.galery>.chosen>.img'),
        chosenCap = document.querySelector('#tarot>.galery>.chosen>.cap')

    satelite.addEventListener('click', function(e){
        galery.classList.remove('hidden')
        content.classList.remove('shown')
    });

    for (const item of items){
        item.addEventListener('mouseover', function(e){

            while(chosenImg.firstChild){
                chosenImg.removeChild(chosenImg.firstChild)
            }

            while(chosenCap.firstChild){
                chosenCap.removeChild(chosenCap.firstChild)
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