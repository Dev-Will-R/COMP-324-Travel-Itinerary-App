let map

const countries = {
    us: {
        center: {
            lat: 37.1,
            lng: -95.7
        },
        zoom: 3
    }
}

function showInfo(result) {
    document.getElementById('name').textContent = result.name
    document.getElementById('rating').textContent = parseFloat(result.rating).toFixed(1)
    document.getElementById('location').textContent = localStorage.getItem('location') || ''
    document.getElementById('description').innerHTML = result.vicinity + ' ' + result.name
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

    const index = localStorage.getItem('index')
    const results = JSON.parse(localStorage.getItem('results')) || {}

    console.log(index, results);


    if (results && results.length && results[index]['geometry']['location']) {
        map.panTo(results[index]['geometry']['location'])
        map.setZoom(18)
    }

    document.getElementById('back').addEventListener('click', function () {
        history.back()
    })

    if (results[index]) {
        showInfo(results[index])
    }
}
