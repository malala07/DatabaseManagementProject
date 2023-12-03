const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        
        a.airlineName
      FROM
        departuredetails dd
      JOIN
        flights f ON dd.DepartureDetailsID = f.DepartureDetailsID
      JOIN
        airlines a ON f.AirlineID = a.AirlineID
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

// Handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Query the database to check username/email and password
  const query = 'SELECT * FROM Users WHERE Email  = ?';
  pool.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0 || !validatePassword(password, results[0].PasswordHash, results[0].Salt)) {
      return res.status(401).send('Invalid username/password combination');
    }

    // If login successful, retrieve user preferences
    const userId = results[0].UserID;
    const preferencesQuery = 'SELECT * FROM UserPreferences WHERE UserID = ?';
    pool.query(preferencesQuery, [userId], (err, preferences) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).send('Internal Server Error');
      }

      const userObj = {
        UserID: userId,
        Email: results[0].Email,
        FirstName: results[0].FirstName,
        LastName: results[0].LastName,
        Preferences: preferences
      };

      res.status(200).json(userObj);
    });
  });
});

// Function to validate password using bcrypt
function validatePassword(inputPassword, hashedPassword, salt) {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}

// Handle create account request
app.post('/create-account', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists in the database
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    // Hash the password and save the new user to the database
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      Email: email,
      PasswordHash: hashedPassword,
      Salt: salt,
      RegistrationDate: new Date().toISOString().split('T')[0]  // Get current date in 'YYYY-MM-DD' format
    };

    const insertQuery = 'INSERT INTO Users SET ?';
    pool.query(insertQuery, newUser, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('User created successfully:', result);
      res.status(201).json({ success: 'Account created successfully.' });
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to retrieve a user by email
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Users WHERE Email = ?';
    pool.query(query, [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
}

app.post('/updatePreferences', (req, res) => {
  const { UserID, AirlineCompany, StarLevel, Amenities } = req.body;
  // Check for undefined or null values and set them to appropriate defaults
  const sanitizedStarLevel = StarLevel || 0;
  const sanitizedAmenities = Amenities ? Amenities.join(', ') : '';//convert array to string
  const sql = `INSERT INTO UserPreferences (UserID, AirlineCompany, StarLevel, Amenities) VALUES (?, ?, ?, ?) 
               ON DUPLICATE KEY UPDATE AirlineCompany = VALUES(AirlineCompany), StarLevel = VALUES(StarLevel), Amenities = VALUES(Amenities)`;

  pool.query(sql, [UserID, AirlineCompany, sanitizedStarLevel, sanitizedAmenities], (err, result) => {
    if (err) {
      console.error('Error updating user preferences:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('User preferences updated successfully');
    res.status(200).send('User preferences updated successfully');
  });
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