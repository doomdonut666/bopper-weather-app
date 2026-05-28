const form = document.querySelector('.top-banner form');
const apiKey = "3727298d5f718b4abe846f814a39ada9";
const input = document.querySelector('input');
const msg = document.querySelector('.msg')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = input.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`;
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => msg.textContent = 'Please enter valid city :(')
})
