const flightDetailsContainer = document.getElementById('flightDetails');
const travelDetail = document.querySelector("#flightForm")
const loginForm = document.querySelector("#login");
const createAccountForm = document.querySelector("#createAccount");
const filterForm = document.querySelector("#filterData");
let logInData = null;
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
      displayResults(data);

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

function displayResults(data){
  // Check if data is null or undefined
  if (data === null || data === undefined) {
    console.error('Data is null.');
    return;
  }

  console.log(data);

  // Clear previous content
  flightDetailsContainer.innerHTML = '';
  //create a filter button
  const filterButton = document.createElement('button');

  // Create a table to display the flight details
  const table = document.createElement('table');
  table.classList.add('flight-table');
  // Set button text
  filterButton.textContent = 'Filter';

  // Set button attributes or styles as needed
  filterButton.setAttribute('type', 'button');
  filterButton.classList.add('form__button'); // Add a CSS class for styling

  filterButton.addEventListener('click', e => {
    // Code to handle button click (filtering logic, for example)
    e.preventDefault();
    filterFunction(data);
    console.log('Filter button clicked!');
  });


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
  flightDetailsContainer.appendChild(filterButton);

}

function filterFunction(data){
  travelDetail.classList.add("filter_form");
  filterForm.classList.remove("filter_form");
  flightDetailsContainer.innerHTML = '';

  filterForm.addEventListener("submit", e =>{
    e.preventDefault();
    const airlineValue = document.getElementById('airline').value;
    const starLevelValue = document.getElementById('starLevel').value;

    // Get selected amenities
    const poolCheckbox = document.getElementById('amenityPool');
    const wifiCheckbox = document.getElementById('amenityWifi');

    const amenities = [];
    if (poolCheckbox.checked) {
        amenities.push('Pool');
    }
    if (wifiCheckbox.checked) {
        amenities.push('WiFi');
    }

    // Create userInput object
    const userInput = {
        airline: airlineValue,
        starLevel: starLevelValue,
        amenities: amenities
        // Add more fields as needed
    };
  
    // Filter the data based on user input
    const filteredData = filterData(data, userInput);

    //Go to travel page
    travelDetail.classList.remove("filter_form");
    filterForm.classList.add("filter_form");

    //Store the filterd data to the database 
    if(logInData == null){
      console.log('no user login');
    }
    else{
      console.log('user logged in', logInData);
      //to update
      const userPreferences = {
        UserID: logInData.UserID,
        AirlineCompany: airlineValue,
        StarLevel: starLevelValue,
        Amenities: amenities
      }
      updateUserPreferences(userPreferences);
    }

    // Display the filtered results
    console.log(filteredData);
    displayResults(filteredData);
  });
  
}
const updateUserPreferences = async (preferences) => {
  try {
    const response = await fetch('http://localhost:3000/updatePreferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      console.log('User preferences updated successfully');
    } else {
      console.error('Failed to update user preferences');
    }
  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
};

function filterData(data, filters) {
  return data.filter(flight => {
      // Implement your filtering logic here
      const matchesAirline = !filters.airline || flight.airlineName.toLowerCase().includes(filters.airline.toLowerCase());
      //const matchesDepartureAirport = !filters.departureAirport || flight.DepartureAirport.toLowerCase().includes(filters.departureAirport.toLowerCase());
      // Add more conditions as needed

      // Return true for flights that match all specified filters
      return matchesAirline ;//&& matchesDepartureAirport;
  });
}



document.addEventListener('DOMContentLoaded',() => {
  
  const searchButton = document.getElementById('search');
    
  

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

    //write an app.get server code so it passes the username/email and 
    //password and checks it it exists on the database if it does then it will
    //store all the userPreference field in one onj to use later.

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Perform the fetch to the server
    fetch(`http://localhost:3000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {

      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful', data);
      alert('Login successful');
      //how to go to travel page
      //how to pass user data to filer
      travelDetail.classList.remove("form");
      loginForm.classList.add("form");
      logInData = data;

      // Store user preferences or perform other actions
    })
    .catch(error => {
      console.error('Error during login:', error);
      setFormMessage(loginForm, 'error', 'Invalid username/password combination');
    });
  });

  createAccountForm.addEventListener("submit", e =>{
    e.preventDefault();
    // Validate user input
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!isValidEmail(email) || !isValidPassword(password) || password !== confirmPassword) {
      setFormMessage(createAccountForm, 'error', 'Invalid email or password.');
      return;
    }

    // If input is valid, send a request to create a new account
    const newUser = { email, password };

    fetch(`http://localhost:3000/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Account created successfully', data);
      alert('Account created successfully');
      loginForm.classList.remove("form--hidden");
      createAccountForm.classList.add("form--hidden");
      // Optionally redirect the user or perform other actions
    })
    .catch(error => {
      console.error('Error creating account:', error);
      setFormMessage(createAccountForm, 'error', 'Error creating account. Please try again.Email might already exist');
    });



  });

  function isValidEmail(email) {
    // Implement email validation logic (e.g., regex)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function isValidPassword(password) {
    // Implement password validation logic (e.g., minimum length)
    return password.length >= 8;
  }


  searchButton.addEventListener('click',() =>{
      //const city = cityInput.value;
      setFlightDetail();
      getFlightDetailsW();
      //getFlightDetails();// passess the input value/ city to display result
  });



    
    


});