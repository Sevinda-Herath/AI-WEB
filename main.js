// Hide .pre-nav and pin .nav to the top on scroll And otherway around
document.addEventListener('DOMContentLoaded', () => {
    let lastScroll = 0;
    let threshold = 200;
    const preNav = document.querySelector('.pre-nav');
    const mainNav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > threshold && currentScroll > lastScroll) {
            preNav.classList.add('pre-nav-hidden');
            mainNav.classList.add('main-nav-fixed');
        } else if (currentScroll < lastScroll) {
            preNav.classList.remove('pre-nav-hidden');
            mainNav.classList.remove('main-nav-fixed');
        }
        lastScroll = currentScroll;
    });
});


// Mouse Pointer Effect - Display Numbers Instead of Squares
let number = 1;
function spark(event){
    let i = document.createElement("span");
    i.classList.add("spark"); // Adding class to the created element
    i.textContent = number++; // Display incrementing number
    
    // Reset number to 1 when it reaches 1000
    if (number > 9999) {
        number = 1;
    }
    
    i.style.left = (event.pageX) + "px";
    i.style.top = (event.pageY) + "px";
    i.style.scale = `${Math.random() * 1.5 }`;
    i.style.setProperty('--x', getRandomTransitionValue());
    i.style.setProperty('--y', getRandomTransitionValue());

    document.body.appendChild(i);
    
    setTimeout(() => {
    if (i.parentElement) {
        document.body.removeChild(i);
    }
    }, 2000);
}
function getRandomTransitionValue(){
    return `${Math.random() * 75 - 10}px`;
}
document.addEventListener("mousemove", spark);