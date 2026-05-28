const form = document.querySelector('.top-banner form');
const apiKey = "3727298d5f718b4abe846f814a39ada9";
const input = document.querySelector('input');
const msg = document.querySelector('.msg')
const list = document.querySelector('.cities');
const listArray = Array.from(list);

const isCityAlreadyAdded = (inputVal) => {
    const listItems = document.querySelectorAll(".ajax-section .city");
    
    // Используем Array.from для преобразования NodeList в массив и метод .some()
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

  console.log(url);
  try {
    const response = await fetch(url);

    // Response status check
    if (!response.ok) {
      throw new Error("City not found :(");
    }

    // getting json data from response
    const data = await response.json();
    const { main, name, sys, weather } = data;

    // getting icon via url, using icons from Envato
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]
      }.svg`;

    // creating li element with data we got
    const li = document.createElement("li");
    li.classList.add("city");
    const markup = ` 
    <h2 class="city-name" data-name="${name},${sys.country}"> 
    <span>${name}</span> 
    <sup>${sys.country}</sup> 
    </h2> 
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup> 
    </div> 
    <figure> 
    <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
    <figcaption>${weather[0]["description"]}</figcaption> 
    </figure> 
`;
    li.innerHTML = markup;
    list.appendChild(li);

    console.log(data); // I'll remove it later
    msg.textContent = 'Done :)';
  } catch (error) {
    msg.textContent = 'Please enter valid city :(';
    console.log(error);
  }

  form.reset();
  input.focus();
});
