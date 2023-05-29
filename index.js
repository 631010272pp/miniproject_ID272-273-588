var titleText = "Monitoring Air Quality in Thailand";
var subtitleText = "Tracking PM2.5 and its dangers";
var titleElement = document.getElementById('hero-title');
var subtitleElement = document.getElementById('hero-subtitle');

function typeAnimation(text, element, delay) {
    let i = 0;
    let interval = setInterval(function() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, delay);
}

typeAnimation(titleText, titleElement, 100); 
typeAnimation(subtitleText, subtitleElement, 50); 
var hamburger = document.getElementById('hamburger');
var menu = document.getElementById('menu');

hamburger.addEventListener('click', function() {
    menu.classList.toggle('active');
});