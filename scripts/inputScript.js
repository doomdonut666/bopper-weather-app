const form = document.querySelector('.top-banner form');
const apiKey = "3727298d5f718b4abe846f814a39ada9";
const input = document.querySelector('input');
const msg = document.querySelector('.msg')
const list = document.querySelector('.cities');

// render function
const renderCity = (data) => {
  const li = createLiElementUsingData(data);
  list.append(li);
  saveCities(data.name); // saving citties
};

window.addEventListener('load', async () => {
  const savedCities = JSON.parse(localStorage.getItem('myCities')) || [];

  if (savedCities.length === 0) {
    return;
  }

  try {
    const fetchPromises = savedCities.map(async (cityName) => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)

      if (!response.ok) {
        throw new Error(`Error! City ${cityName} not found!`);
      }

      return response.json();
    });

    const citiesData = await Promise.all(fetchPromises);
    
    citiesData.forEach((data) => renderCity(data));

  } catch (error) {
    console.error(error);
    msg.textContent(`Oops! I can't load some cities. Look in the console :(`);
  }
});

// save cities list to localstorage
const saveCities = (city) => {
  const cities = JSON.parse(localStorage.getItem('myCities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('myCities', JSON.stringify(cities));
  }
};

const createLiElementUsingData = (data) => {
  const { main, name, sys, weather } = data;
  const li = document.createElement("li");
  li.classList.add("city");
  const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

  li.innerHTML = ` 
    <h2 class="city-name" data-name="${name},${sys.country}"> 
        <span>${name}</span> 
        <sup>${sys.country}</sup> 
    </h2> 
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div> 
    <figure> 
        <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
        <figcaption>${weather[0]["description"]}</figcaption> 
    </figure> 
  `;
  return li;
};

const addElementToList = (li) => list.append(li);

const isCityAlreadyAdded = (inputVal) => {
  const listItems = document.querySelectorAll(".ajax-section .city");

  // Using some, not filter because some stops when finds element 
  return Array.from(listItems).some(el => {
    let content = "";

    if (inputVal.includes(",")) {
      if (inputVal.split(",")[1].length > 2) {
        inputVal = inputVal.split(",")[0];
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      } else {
        content = el.querySelector(".city-name").dataset.name.toLowerCase();
      }
    } else {
      content = el.querySelector(".city-name span").textContent.toLowerCase();
    }

    return content === inputVal.toLowerCase();
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputValue = input.value;

  if (isCityAlreadyAdded(inputValue)) {
    msg.textContent = 'Oh, you already know the weather for this city :0';
    form.reset();
    input.focus();
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found :(");

    const data = await response.json();
    renderCity(data); // Используем новую универсальную функцию
    msg.textContent = 'Done :)';
  } catch (error) {
    msg.textContent = 'Please enter valid city :(';
  }

  form.reset();
  input.focus();
});
