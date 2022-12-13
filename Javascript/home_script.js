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



function search() {
    const search = {
        bounds: map.getBounds(),
        types: ['tourist_attraction']
    }

    const search1 = {
        bounds: map.getBounds(),
        types: ['restaurant', 'bakery', 'cafe']
    }

    const search2 = {
        bounds: map.getBounds(),
        types: ['lodging']
    }

    document.getElementById('result').innerHTML = ''

    places.nearbySearch(search, (results, status, pagination) => {
        console.log('results', results)
        localStorage.setItem('results', JSON.stringify(results))
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < (results.length > 10 ? 10 : results.length); i++) {
                var imageUrl = getPhoto(results[i]);
                console.log("imageUrl: " + imageUrl);
                addResult(results[i], i, imageUrl);

            }
        }
    })

    places.nearbySearch(search1, (results, status, pagination) => {
        console.log('results', results)
        localStorage.setItem('results', JSON.stringify(results))
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < (results.length > 10 ? 10 : results.length); i++) {
                var imageUrl = getPhoto(results[i]);
                console.log("imageUrl: " + imageUrl);
                addResult(results[i], i, imageUrl);

            }
        }
    })

    places.nearbySearch(search2, (results, status, pagination) => {
        console.log('results', results)
        localStorage.setItem('results', JSON.stringify(results))
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < (results.length > 10 ? 10 : results.length); i++) {
                var imageUrl = getPhoto(results[i]);
                console.log("imageUrl: " + imageUrl);
                addResult(results[i], i, imageUrl);

            }
        }
    })
}

    const form = document.getElementById('recommendations-form')

    form.addEventListener("submit", addBookmark)

async function addBookmark(event) {

    event.preventDefault()
    const cardImageElem = document.getElementById('cardImageTag')
    console.log(cardImageElem)

    const imageURL = document.getElementById('cardImageTag').src

    const title = document.getElementById('title-tag').value

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


}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', search());
} else {
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
    const bookmarkDivTag = document.createElement('div')
    const bookmarkButtonTag = document.createElement('input')
    bookmarkButtonTag.setAttribute('type', 'submit')
    bookmarkButtonTag.setAttribute("id", "bookmark-button")
    bookmarkButtonTag.setAttribute('onclick', 'addBookmark()')
    const bookmarkImageTag = document.createElement('img')
    bookmarkImageTag.setAttribute('class', 'bookmark-btn')
    bookmarkImageTag.setAttribute('src', '../Images-Fonts/Bookmark_fill.png')
    bookmarkDivTag.appendChild(bookmarkButtonTag)
    bookmarkDivTag.appendChild(bookmarkImageTag)

   
    const citiesHide = document.getElementById("cities");
    citiesHide.style.display = "none";


    const title = document.getElementById("title_rec");
    title.innerHTML = "RECOMMENDATIONS FOR YOU";

    const activityImageDivTag = document.createElement('div')
    activityImageDivTag.appendChild(cardImgTag)
    activityImageDivTag.appendChild(bookmarkDivTag)
  
    cardATag.setAttribute('class', 'card')

    cardATag.onclick = function () {
        localStorage.setItem('index', i);
        location.href = '/HTML/More-Info.html';
    }

    cardATag.style.textDecoration = 'none'



    cardImgTag.setAttribute('class', 'card__img')
    cardImgTag.setAttribute('alt', '')
    cardImgTag.setAttribute('src', photo)


    cardBodyTag.setAttribute('class', 'card__body d-flex')

    h3Tag.setAttribute('class', 'card_title')
    const textData = document.createTextNode(result.name)
    h3Tag.appendChild(textData)

    iconTag.setAttribute('class', 'alt_img')
    iconTag.setAttribute('src', result.icon)
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

    autocomplete.addListener('place_changed', function onPlaceChanged() {
      const place = autocomplete.getPlace()
  
      if (place.geometry && place.geometry.location) {
          map.panTo(place.geometry.location)
          map.setZoom(15)
          search()
          localStorage.setItem('location', document.getElementById('searchTextField').value)
      } else {
          document.getElementById('searchTextField').placeholder = 'Enter a city'
      }
  })
    
}

const hamburger = document.querySelector('#hamburger');
const navsub = document.querySelector('#nav-list');


hamburger.addEventListener('click', () => {
 navsub.classList.toggle('show')
 hamburger.classList.toggle('open')
});
