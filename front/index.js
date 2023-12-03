const flightDetailsContainer = document.getElementById('flightDetails');

function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove("form__message--success", "form__message--error");
  messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}
function getFlightDetailsW() {
  const depaturePlaceInput = document.getElementById('depatureName');
  const depaturePlace = depaturePlaceInput.value;
  
  const arrivalDateInput = document.getElementById('startDate');
  const arrivalDate = arrivalDateInput.value;
  
  

  

  /*const apiUrl = `http://localhost:3000/flightDetailNumber/${depaturePlace}/${arrivalDate}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const flightDetailsContainer = document.getElementById('flightDetails');
      flightDetailsContainer.innerHTML = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      console.error('Error fetching flight details:', error);
      alert('Error fetching flight details. Please try again.');
    });*/

  const apiDUrl = `http://localhost:3000/flightDetail/${depaturePlace}/${arrivalDate}`;

  fetch(apiDUrl)
    .then(response => response.json())
    .then(data => {
      
      
      // Clear previous content
      flightDetailsContainer.innerHTML = '';

      // Create a table to display the flight details
      const table = document.createElement('table');
      table.classList.add('flight-table');

      // Create table headers
      const headers = ['Flight Number', 'Airline', 'Departure Airport', 'Departure Date', 'Flight Status'];
      const headerRow = document.createElement('tr');
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Create table rows with flight details
      data.forEach(flight => {
        const row = document.createElement('tr');
        const flightNumberCell = document.createElement('td');
        flightNumberCell.textContent = flight.FlightNumber;
        row.appendChild(flightNumberCell);

        const airlineCell = document.createElement('td');
        airlineCell.textContent = flight.airlineName;
        row.appendChild(airlineCell);

        const departureAirportCell = document.createElement('td');
        departureAirportCell.textContent = flight.DepartureAirport;
        row.appendChild(departureAirportCell);

        const departureDateCell = document.createElement('td');
        departureDateCell.textContent = new Date(flight.DepartureDate).toLocaleString();
        row.appendChild(departureDateCell);

        const flightStatusCell = document.createElement('td');
        flightStatusCell.textContent = flight.FlightStatus;
        row.appendChild(flightStatusCell);

        table.appendChild(row);
      });

      // Append the table to the flightDetailsContainer
      flightDetailsContainer.appendChild(table);


    })
    .catch(error => {
      console.error('Error fetching flight details:', error);
      alert('Error fetching flight details. Please try again.');
    });
  

}

//making it async might work so that the function works as soon as the page opens
async function setFlightDetail(){
  const apiUrl = 'http://127.0.0.1:5000/fetch-flight-data';

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
}


document.addEventListener('DOMContentLoaded',() => {
  
  const searchButton = document.getElementById('search');
    
  const travelDetail = document.querySelector("#flightForm")
  const loginForm = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");

  document.querySelector("#linkLogin").addEventListener("click", e => {
      e.preventDefault();
      travelDetail.classList.add("form");
      loginForm.classList.remove("form");
      flightDetailsContainer.innerHTML = '';
  });

  document.querySelector("#linkCreateAccount").addEventListener("click", e => {
    e.preventDefault();
    loginForm.classList.add("form--hidden");
    createAccountForm.classList.remove("form--hidden");
    flightDetailsContainer.innerHTML = '';
  });

  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    

    setFormMessage(loginForm, "error", "Invalid username/password combination");
});


  searchButton.addEventListener('click',() =>{
      //const city = cityInput.value;
      setFlightDetail();
      getFlightDetailsW();
      //getFlightDetails();// passess the input value/ city to display result
  });



    
    


});