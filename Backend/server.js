const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Love@123456',
  database: 'flightreservation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/', (req, res) => {
  return res.json('From Backend Side');
});


app.get('/flightDetailNumber/:airport/:date', async (req, res) => {
  try {
    const { airport, date } = req.params;
    console.log("works");
    // Query to retrieve departure details and count of flights for the specified criteria
    const query = `
      SELECT
        dd.Airport AS DepartureAirport,
        
        DATE(f.FlightDate) AS DepartureDate,
        COUNT(f.FlightID) AS NumberOfFlights
      FROM
        departuredetails dd
      JOIN
        flights f ON dd.DepartureDetailsID = f.DepartureDetailsID
      WHERE
        dd.Airport = ? AND
        
        DATE(f.FlightDate) = ?
      GROUP BY
        dd.Airport, DATE(f.FlightDate);
    `;

    // Using the connection pool to query the database
    pool.query(query, [airport, date], (error, results) => {
      if (error) {
        throw error;
      }

      // Check if any results were found
      if (results.length > 0) {
        res.json(results); // Return the list of flights matching the criteria
      } else {
        res.status(404).json({ message: 'No flights found for the specified criteria' });
      }
    });
  } catch (error) {
    console.error('Error retrieving flight details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/flightDetail/:airport/:date', async (req, res) => {
  try {
    const { airport, date } = req.params;

    // Query to retrieve details for every flight on the specified date from the given airport and timezone
    const query = `
      SELECT
        dd.Airport AS DepartureAirport,
        
        f.FlightDate AS DepartureDate,
        f.FlightStatus,
        f.FlightNumber,
        f.Aircraft,
        f.Live
      FROM
        departuredetails dd
      JOIN
        flights f ON dd.DepartureDetailsID = f.DepartureDetailsID
      WHERE
        dd.Airport = ? AND
        
        DATE(f.FlightDate) = ?;
    `;

    // Using the connection pool to query the database
    pool.query(query, [airport, date], (error, results) => {
      if (error) {
        throw error;
      }

      // Check if any results were found
      if (results.length > 0) {
        res.json(results); // Return the list of flights for the specified airport, timezone, and date
      } else {
        res.status(404).json({ message: 'No flights found for the specified criteria' });
      }
    });
  } catch (error) {
    console.error('Error retrieving flight details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/flightDetail/:flightId', async (req, res) => {
  try {
    const flightId = req.params.flightId;

    // Query to retrieve flight details for the specified FlightID
    const query = `
      SELECT *
      FROM flights
      WHERE FlightID = ?;
    `;

    // Using the connection pool to query the database
    pool.query(query, [flightId], (error, results) => {
      if (error) {
        throw error;
      }

      // Check if any results were found
      if (results.length > 0) {
        res.json(results[0]); // Assuming there is only one flight with the provided FlightID
      } else {
        res.status(404).json({ message: 'Flight not found' });
      }
    });
  } catch (error) {
    console.error('Error retrieving flight details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Assuming you want to use the pool for database connections
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting database connection:', err);
    throw err;
  }

  console.log('Connected to database');

  // You can use the 'connection' object for your database queries here

  // Release the connection when done
  connection.release();
});