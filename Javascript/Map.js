
function initGoogle() {
    if(navigator.geolocation) {
        console.log("Geolocation is here")

        // position of user
        navigator.geolocation.getCurrentPosition((loc) => {
            location.lat = loc.coords.latitude;
            location.lng = loc.coords.longitude;

            map = new google.maps.Map(document.getElementById("map"), options);
        },
        (err) => {
            console.log("User clicked no")
            map = new google.maps.Map(document.getElementById("map"), options)
        },
        )
    } else {
        console.log("Geolocation is not supported");
        map = new google.maps.Map(document.getElementById('map'), options);
    }

    autocomplete = new google.maps.places.Autocomplete(document.getElementById("input"), 
    {
        fields: ['geometry', 'name'],
    })

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        new google.maps.Marker({
            position: place.geometry.location,
            title: place.name,
            map: map
        })
    });
}


