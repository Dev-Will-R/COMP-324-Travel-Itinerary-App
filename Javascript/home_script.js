let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            types: ['(cities)'],
            componentRestrictions: {'contry': ['AU']},
            fields: ['geometry']
        }
    );
}


const hamburger = document.querySelector('#hamburger');
const navsub = document.querySelector('#nav-list');


hamburger.addEventListener('click', () => {
 navsub.classList.toggle('show')
 hamburger.classList.toggle('open')
});
