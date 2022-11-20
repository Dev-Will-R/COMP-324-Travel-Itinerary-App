let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            types: ['establishment'],
            componentRestrictions: {'contry': ['AU']},
            fields: ['place_id', 'geometry', 'name']
        }
    );
}


const hamburger = document.querySelector('#hamburger');
const navsub = document.querySelector('#nav-list');


hamburger.addEventListener('click', () => {
 navsub.classList.toggle('show')
 hamburger.classList.toggle('open')
});
