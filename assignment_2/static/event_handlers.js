import * as forms from './form.js';


document.getElementById('clear-button').addEventListener('click', function() {
    forms.clear_forms();
});

document.getElementById('submit-button').addEventListener('click', function() {
    forms.search_forms('', '');
});