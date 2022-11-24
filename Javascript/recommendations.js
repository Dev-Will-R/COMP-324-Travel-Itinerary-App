


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
    '../Images-Fonts/lasagrada 1.png',
    '../Images-Fonts/casabatllo 1.png',
    '../Images-Fonts/lasagrada 1.png'
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
        //types: ['lodging']
        //types: ['lodging', 'restaurant', 'amusement_park', 'art_gallery', 'bakery', 'cafe', 'movie_theater' , 'museum', 'night_club', 'park', 'shopping_mall', 'stadium', 'tourist_attraction']
        types: ['tourist_attraction']
    }

    document.getElementById('result').innerHTML = ''

    places.nearbySearch(search, (results, status, pagination) => {
        console.log('results', results)
        localStorage.setItem('results', JSON.stringify(results))
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < (results.length > 5 ? 5 : results.length); i++) {
                var imageUrl = getPhoto(results[i]);
                console.log("imageUrl: " + imageUrl);
                addResult(results[i], i, imageUrl);
                //createPhotoMarker(results[i]);
               
                //const cardImgTag = document.getElementById('cardImageTag')
            }
        }
    })
}

    const form = document.getElementById('recommendations-form')
    alert("form: " + form);
    form.addEventListener("submit", addBookmark)

async function addBookmark(event) {
    alert("Inside addBookmark")
    event.preventDefault()
    const cardImageElem = document.getElementById('cardImageTag')
    alert("cardImageElem: " + cardImageElem)
    const imageURL = document.getElementById('cardImageTag').src
    alert("imageURL: ", imageURL)
    const title = document.getElementById('title-tag').value
    alert("title: ", title)
    const result = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            imageURL,
            title
        })
    }).then((res) => res.json())

    if(result.status === 'ok') {
        alert('Success')
    } else {
        alert(result.error)
    }

}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', search());
} else {
    //The DOMContentLoaded event has already fired. Just run the code.
    search()
}

function addResult(result, i, photo) {
    const results = document.getElementById('result')
    const cardATag = document.createElement('a')
    const cardDivTag = document.createElement('div')
    const cardImgTag = document.createElement('img')
    cardImgTag.setAttribute('id', 'cardImageTag')
    const cardBodyTag = document.createElement('div')
    const h3Tag = document.createElement('h3')
    cardImgTag.setAttribute("id", "title-tag")
    const iconTag = document.createElement('img')


    // creating icon for bookmarks
  
    const bookmarkDivTag = document.createElement('div')

    const bookmarkButtonTag = document.createElement('input')
    bookmarkButtonTag.setAttribute('type', 'submit')
    bookmarkButtonTag.setAttribute("id", "bookmark-button")
    //bookmarkButtonTag.setAttribute('formmethod', 'post')
    bookmarkButtonTag.setAttribute('onclick', 'addBookmark()')
    //bookmarkButtonTag.addEventListener("submit", addBookmark())
    const bookmarkImageTag = document.createElement('img')
    bookmarkImageTag.setAttribute('class', 'bookmark-btn')
    bookmarkImageTag.setAttribute('src', '../Images-Fonts/Bookmark_fill.png')
    bookmarkDivTag.appendChild(bookmarkButtonTag)
    bookmarkDivTag.appendChild(bookmarkImageTag)
    //bookmarkButtonTag.setAttribute('class', 'btn')

    const activityImageDivTag = document.createElement('div')
    activityImageDivTag.appendChild(cardImgTag)
    activityImageDivTag.appendChild(bookmarkDivTag)
  
    cardATag.setAttribute('class', 'card')
    // cardATag.setAttribute('href', '/pages/index-detail.html')
    cardATag.onclick = function () {
        localStorage.setItem('index', i);
        location.href = '/HTML/More-Info.html';
    }

    cardATag.style.textDecoration = 'none'

    cardDivTag.setAttribute('class', 'card__img')

    cardImgTag.setAttribute('class', 'card__img')
    cardImgTag.setAttribute('alt', '')
    cardImgTag.setAttribute('src', photo)
   // cardImgTag.setAttribute('src', images[i])

    cardBodyTag.setAttribute('class', 'card__body d-flex')

    h3Tag.setAttribute('class', 'card_title')
    const textData = document.createTextNode(result.name)
    h3Tag.appendChild(textData)

    iconTag.setAttribute('class', 'alt_img')
    iconTag.setAttribute('src', result.icon)

    //cardATag.appendChild(cardImgTag)
    cardATag.appendChild(activityImageDivTag)
    cardBodyTag.appendChild(h3Tag)
    cardBodyTag.appendChild(iconTag)
    cardATag.appendChild(cardDivTag)
    cardATag.appendChild(cardBodyTag)

    results.appendChild(cardATag)
}

function getPhoto(place) {
    var photos = place.photos;
    if (!photos) {
      return;
    }

    var imageUrl = photos[0].getUrl({maxWidth: 400, maxHeight: 400})
    console.log("imageUrl: " + imageUrl)
    return imageUrl
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


