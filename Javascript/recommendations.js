let map
let places
let markers = []
let autocomplete

const countries = {
    us: {
        center: {
            lat: 37.1,
            lng: -95.7
        },
        zoom: 3
    }
}

const images = [
    '/assets/images/lasagrada 1.png',
    '/assets/images/casabatllo 1.png',
    '/assets/images/lasagrada 1.png'
]

function onPlaceChanged() {
    const place = autocomplete.getPlace()

    if (place.geometry && place.geometry.location) {
        map.panTo(place.geometry.location)
        map.setZoom(15)
        search()
        localStorage.setItem('location', document.getElementById('searchTextField').value)
    } else {
        document.getElementById('searchTextField').placeholder = 'Enter a city'
    }
}

function search() {
    const search = {
        bounds: map.getBounds(),
        types: ['lodging']
    }

    document.getElementById('result').innerHTML = ''

    places.nearbySearch(search, (results, status, pagination) => {
        console.log('results', results)
        localStorage.setItem('results', JSON.stringify(results))
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < (results.length > 3 ? 3 : results.length); i++) {
                addResult(results[i], i)
            }
        }
    })
}

function addResult(result, i) {
    const results = document.getElementById('result')
    const cardATag = document.createElement('a')
    const cardDivTag = document.createElement('div')
    const cardImgTag = document.createElement('img')
    const cardBodyTag = document.createElement('div')
    const h3Tag = document.createElement('h3')
    const iconTag = document.createElement('img')

    cardATag.setAttribute('class', 'card')
    // cardATag.setAttribute('href', '/pages/index-detail.html')
    cardATag.onclick = function () {
        localStorage.setItem('index', i);
        location.href = '/pages/more-info.html';
    }

    cardATag.style.textDecoration = 'none'

    cardDivTag.setAttribute('class', 'card__img')

    cardImgTag.setAttribute('class', 'card__img')
    cardImgTag.setAttribute('alt', '')
    cardImgTag.setAttribute('src', images[i])

    cardBodyTag.setAttribute('class', 'card__body d-flex')

    h3Tag.setAttribute('class', 'card_title')
    const textData = document.createTextNode(result.name)
    h3Tag.appendChild(textData)

    iconTag.setAttribute('class', 'alt_img')
    iconTag.setAttribute('src', result.icon)

    cardATag.appendChild(cardImgTag)
    cardBodyTag.appendChild(h3Tag)
    cardBodyTag.appendChild(iconTag)
    cardATag.appendChild(cardDivTag)
    cardATag.appendChild(cardBodyTag)

    results.appendChild(cardATag)
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['us'].zoom,
        center: countries['us'].center,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false
    })

    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('searchTextField'),
        {
            types: ['(cities)'],
            fields: ['geometry']
        }
    )

    places = new google.maps.places.PlacesService(map)

    autocomplete.addListener('place_changed', onPlaceChanged)
}
