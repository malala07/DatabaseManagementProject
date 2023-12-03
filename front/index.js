
document.addEventListener('DOMContentLoaded',() => {
    const searchButton = document.getElementById('search');
   
    searchButton.addEventListener('click',() =>{
        

        
        //const city = cityInput.value;
        getFlightDetailsW();
        //getFlightDetails();// passess the input value/ city to display result
    });

    function getFlightDetails() {
        const flightIdInput = document.getElementById('flightId');
        const flightId = flightIdInput.value;
        
        setFlightDetail();

        const apiUrl = `http://localhost:3000/flightDetail/${flightId}`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const flightDetailsContainer = document.getElementById('flightDetails');
            flightDetailsContainer.innerHTML = JSON.stringify(data, null, 2);
          })
          .catch(error => {
            console.error('Error fetching flight details:', error);
            alert('Error fetching flight details. Please try again.');
          });

    }
    
    function getFlightDetailsW() {
      const depaturePlaceInput = document.getElementById('depatureName');
      const depaturePlace = depaturePlaceInput.value;
      
      const arrivalDateInput = document.getElementById('startDate');
      const arrivalDate = arrivalDateInput.value;
      
      

      setFlightDetail();

      const apiUrl = `http://localhost:3000/flightDetailNumber/${depaturePlace}/${arrivalDate}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const flightDetailsContainer = document.getElementById('flightDetails');
          flightDetailsContainer.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
          console.error('Error fetching flight details:', error);
          alert('Error fetching flight details. Please try again.');
        });

      const apiDUrl = `http://localhost:3000/flightDetail/${depaturePlace}/${arrivalDate}`;

      fetch(apiDUrl)
        .then(response => response.json())
        .then(data => {
          const flightDetailsContainer = document.getElementById('flightDetails');
          flightDetailsContainer.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
          console.error('Error fetching flight details:', error);
          alert('Error fetching flight details. Please try again.');
        });
      
      


    }


    function setFlightDetail(){
        const apiUrl = 'http://127.0.0.1:5000/fetch-flight-data';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    function setTrauncate(){
        //change this to post code look at dressense 
        const apiUrl = `http://localhost:3000/truncate`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }



});