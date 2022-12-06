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





// var ac = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
// google.maps.event.addEventListener(ac, 'place_changed', function(){
//   var place = ac.getPlace();
//   console.log(place)
// })




const hamburger = document.querySelector('#hamburger');
const navsub = document.querySelector('#nav-list');


hamburger.addEventListener('click', () => {
 navsub.classList.toggle('show')
 hamburger.classList.toggle('open')
});






// let map
// let places = {}
// let markers = []
// let autocomplete
 
 
// const countries = {
//    us: {
//        center: {
//            lat: 37.1,
//            lng: -95.7
//        },
//        zoom: 3
//    }
// }
 
// const images = [
//    '../Images-Fonts/lasagrada 1.png',
//    '../Images-Fonts/casabatllo 1.png',
//    '../Images-Fonts/lasagrada 1.png'
// ]
 
// function onPlaceChanged() {
//    const place = autocomplete.getPlace()
 
//    if (place.geometry && place.geometry.location) {
//        map.panTo(place.geometry.location)
//        map.setZoom(15)
//        search()
//        localStorage.setItem('location', document.getElementById('searchTextField').value)
//    } else {
//        document.getElementById('searchTextField').placeholder = 'Enter a city'
//    }
// }
 
// function getPlaceDetails(place) {
//    const request = { placeId: `${place.place_id}` };
//    service = new google.maps.places.PlacesService(map);
//    return new Promise((resolve, reject) => {
//      service.getDetails(request, (result, status) => {
//        if (status == google.maps.places.PlacesServiceStatus.OK) {
//          resolve(result);
//        } else {
//          reject(status);
//        }
//      });
//    });
//  }
 
// function search() {
//    const search = {
//        bounds: map.getBounds(),
//        //types: ['lodging']
//        types: ['tourist_attraction', 'lodging', 'restaurant', 'amusement_park', 'art_gallery', 'bakery', 'cafe', 'movie_theater' , 'museum', 'night_club', 'park', 'shopping_mall', 'stadium']
//    }
//    const search1 = {
//        bounds: map.getBounds(),
//        types: ['tourist_attraction', 'amusement_park', 'art_gallery', 'movie_theater' , 'museum', 'night_club', 'park', 'shopping_mall', 'stadium']
//    }
//    const search2 = {
//        bounds: map.getBounds(),
//        types: ['restaurant', 'bakery', 'cafe']
//    }
//    const search3 = {
//        bounds: map.getBounds(),
//        types: ['lodging']
//    }
 
 
//    const touristAttractions = document.getElementById('tourist-attractions')
//    const hotels = document.getElementById('hotels')
//    const restaurants = document.getElementById('restaurants')
 
  
 
//    document.getElementById('result').innerHTML = ''
 
   

//    places.nearbySearch(search, (results, status, pagination) => {
//        localStorage.setItem('results', JSON.stringify(results))
//        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//            for (let i = 0; i < (results.length > 15 ? 15 : results.length); i++) {
//                var imageUrl = getPhoto(results[i]);
//                console.log("imageUrl: " + imageUrl);
//                addResult(results[i], i, imageUrl);
//                //createPhotoMarker(results[i]);
//                //const cardImgTag = document.getElementById('cardImageTag')
//            }
//        }
//    })
 
// //    places.nearbySearch(search1, (results1, status, pagination) => {
// //        localStorage.setItem('results', JSON.stringify(results))
// //        if (status === google.maps.places.PlacesServiceStatus.OK && results1) {
// //            for (let i = 0; i < (results1.length > 5 ? 5 : results1.length); i++) {
// //                var imageUrl = getPhoto(results1[i]);
// //                console.log("imageUrl: " + imageUrl);
// //                addResult(results1[i], i, imageUrl);
// //            }
// //        }
// //    })
 
// //    places.nearbySearch(search2, (results2, status, pagination) => {
// //        localStorage.setItem('results', JSON.stringify(results2))
// //        if (status === google.maps.places.PlacesServiceStatus.OK && results2) {
// //            for (let i = 0; i < (results2.length > 5 ? 5 : results2.length); i++) {
// //                var imageUrl = getPhoto(results2[i]);
// //                console.log("imageUrl: " + imageUrl);
// //                addResult(results2[i], i, imageUrl);
// //            }
// //        }
// //    })
 
// //    places.nearbySearch(search3, (results3, status, pagination) => {
// //        localStorage.setItem('results', JSON.stringify(results3))
// //        if (status === google.maps.places.PlacesServiceStatus.OK && results3) {
// //            for (let i = 0; i < (results3.length > 5 ? 5 : results3.length); i++) {
// //                var imageUrl = getPhoto(results3[i]);
// //                console.log("imageUrl: " + imageUrl);
// //                addResult(results3[i], i, imageUrl);
// //            }
// //        }
// //    })
  
// }
 
 
// // const search1 = {
// //     bounds: map.getBounds(),
// //     types: ['tourist_attraction', 'amusement_park', 'art_gallery', 'movie_theater' , 'museum', 'night_club', 'park', 'shopping_mall', 'stadium']
// // }
// // const search2 = {
// //     bounds: map.getBounds(),
// //     types: ['restaurant', 'bakery', 'cafe']
// // }
// // const search3 = {
// //     bounds: map.getBounds(),
// //     types: ['lodging']
// // }
 
// // const touristAttractions = document.getElementById('tourist-attractions')
// // const hotels = document.getElementById('hotels')
// // const restaurants = document.getElementById('restaurants')
 
// // function search1() {

// //     alert("inside search")

// //     const search1 = {
// //         bounds: map.getBounds(),
// //         types: ['tourist_attraction', 'amusement_park', 'art_gallery', 'movie_theater' , 'museum', 'night_club', 'park', 'shopping_mall', 'stadium']
// //     }
// //     places.nearbySearch(search1, (results, status, pagination) => {
// //         alert("inside search1")
// //         localStorage.setItem('results', JSON.stringify(results))
// //         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
// //             for (let i = 0; i < (results.length > 5 ? 5 : results.length); i++) {
// //                 var imageUrl = getPhoto(results[i]);
// //                 console.log("imageUrl: " + imageUrl);
// //                 addResult(results[i], i, imageUrl);
// //             }
// //         }
// //     })
// // }
 
// // function search2() {
// //     places.nearbySearch(search2, (results, status, pagination) => {
// //         alert("inside search2")
// //         localStorage.setItem('results', JSON.stringify(results))
// //         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
// //             for (let i = 0; i < (results.length > 5 ? 5 : results.length); i++) {
// //                 var imageUrl = getPhoto(results[i]);
// //                 console.log("imageUrl: " + imageUrl);
// //                 addResult(results[i], i, imageUrl);
// //             }
// //         }
// //     })
// // }
 
// // function search3() {
// //     places.nearbySearch(search3, (results, status, pagination) => {
// //         alert("inside search3")
// //         localStorage.setItem('results', JSON.stringify(results))
// //         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
// //             for (let i = 0; i < (results.length > 5 ? 5 : results.length); i++) {
// //                 var imageUrl = getPhoto(results[i]);
// //                 console.log("imageUrl: " + imageUrl);
// //                 addResult(results[i], i, imageUrl);
// //             }
// //         }
// //     })
// // }
 
// // touristAttractions.onclick = (places.nearbySearch(search1))
// // restaurants.onclick = (places.nearbySearch(search2))
// // hotels.onclick = (places.nearbySearch(search3))
 
 
 
//    const form = document.getElementById('recommendations-form')
//    form.addEventListener("submit", addBookmark)
 
// async function addBookmark(event) {
//    alert("Inside addBookmark")
//    event.preventDefault()
//    const cardImageElem = document.getElementById('cardImageTag')
//    alert("cardImageElem: " + cardImageElem)
//    const imageURL = await document.getElementById('cardImageTag').src
//    alert("imageURL: ", imageURL)
//    const title = await document.getElementById('title-tag').value
//    alert("title: ", title)
//    const result = await fetch('/api/bookmarks', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//            imageURL,
//            title
//        })
//    }).then((res) => res.json())
 
//    if(result.status === 'ok') {
//        alert('Success')
//    } else {
//        alert(result.error)
//    }
 
// }
 
// if(document.readyState === 'loading') {
//    document.addEventListener('DOMContentLoaded', search());
// } else {
//    //The DOMContentLoaded event has already fired. Just run the code.
//    search()
// }

 
// function addResult(result, i, photo) {
//    const results = document.getElementById('result')
//    const cardATag = document.createElement('a')
//    const cardDivTag = document.createElement('div')
//    const cardImgTag = document.createElement('img')
//    cardImgTag.setAttribute('id', 'cardImageTag')
//    const cardBodyTag = document.createElement('div')
//    const h3Tag = document.createElement('h3')
//    cardImgTag.setAttribute("id", "title-tag")
//    const iconTag = document.createElement('img')
 
 
//    // creating icon for bookmarks
//     const bookmarkDivTag = document.createElement('div')
 
//    const bookmarkButtonTag = document.createElement('input')
//    bookmarkButtonTag.setAttribute('type', 'submit')
//    bookmarkButtonTag.setAttribute("id", "bookmark-button")
//    //bookmarkButtonTag.setAttribute('formmethod', 'post')
//    bookmarkButtonTag.setAttribute('onclick', 'addBookmark()')
//    //bookmarkButtonTag.addEventListener("submit", addBookmark())
//    const bookmarkImageTag = document.createElement('img')
//    bookmarkImageTag.setAttribute('class', 'bookmark-btn')
//    bookmarkImageTag.setAttribute('src', '../Images-Fonts/Bookmark_fill.png')
//    bookmarkDivTag.appendChild(bookmarkButtonTag)
//    bookmarkDivTag.appendChild(bookmarkImageTag)
//    //bookmarkButtonTag.setAttribute('class', 'btn')
 
//    const activityImageDivTag = document.createElement('div')
//    activityImageDivTag.appendChild(cardImgTag)
//    activityImageDivTag.appendChild(bookmarkDivTag)
//     cardATag.setAttribute('class', 'card')
//    // cardATag.setAttribute('href', '/pages/index-detail.html')
//    cardATag.onclick = function () {
//        localStorage.setItem('index', i);
//        location.href = '/HTML/More-Info.html';
//    }
 
//    cardATag.style.textDecoration = 'none'
 
//    cardDivTag.setAttribute('class', 'card__img')
 
//    cardImgTag.setAttribute('class', 'card__img')
//    cardImgTag.setAttribute('alt', '')
//    cardImgTag.setAttribute('src', photo)
//   // cardImgTag.setAttribute('src', images[i])
 
//    cardBodyTag.setAttribute('class', 'card__body d-flex')
 
//    h3Tag.setAttribute('class', 'card_title')
//    const textData = document.createTextNode(result.name)
//    h3Tag.appendChild(textData)
 
//    iconTag.setAttribute('class', 'alt_img')
//    iconTag.setAttribute('src', result.icon)
 
//    //cardATag.appendChild(cardImgTag)
//    cardATag.appendChild(activityImageDivTag)
//    cardBodyTag.appendChild(h3Tag)
//    cardBodyTag.appendChild(iconTag)
//    cardATag.appendChild(cardDivTag)
//    cardATag.appendChild(cardBodyTag)
 
//    results.appendChild(cardATag)
// }
 
// function getPhoto(place) {
//    var photos = place.photos;
//    if (!photos) {
//      return;
//    }
 
//    var imageUrl = photos[0].getUrl({maxWidth: 400, maxHeight: 400})
//    console.log("imageUrl: " + imageUrl)
//    return imageUrl
// }
 
 
// function initMap() {
//    map = new google.maps.Map(document.getElementById('map'), {
//        zoom: countries['us'].zoom,
//        center: countries['us'].center,
//        mapTypeControl: false,
//        panControl: false,
//        zoomControl: false,
//        streetViewControl: false
//    })
 
//    autocomplete = new google.maps.places.Autocomplete(
//        document.getElementById('searchTextField'),
//        {
//            types: ['(cities)'],
//            fields: ['geometry']
//        }
//    )
 
//    places = new google.maps.places.PlacesService(map)
 
//    autocomplete.addListener('place_changed', onPlaceChanged)
  
// }


