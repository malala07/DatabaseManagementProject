create database flightresrvation;
use flightreservation;

CREATE TABLE airlines (
  AirlineID INT PRIMARY KEY auto_increment,
  AirlineName VARCHAR(255),
  IATA VARCHAR(255),
  ICAO VARCHAR(255)
);

CREATE TABLE arrivaldetails (
    ArrivalDetailsID int PRIMARY KEY AUTO_INCREMENT,
    Airport varchar(255),
    TimeZone varchar(255),
    IATA varchar(255),
    ICAO varchar(255),
    Terminal varchar(255),
    Gate varchar(255),
    Baggage varchar(255),
    Delay int,
    Scheduled datetime,
    Estimated datetime,
    Actual datetime,
    EstimatedRunway datetime,
    ActualRunway datetime
);
CREATE TABLE codesharedflights (
    CodesharedFlightID int PRIMARY KEY AUTO_INCREMENT,
    FlightID int,
    AirlineName varchar(255),
    AirlineIATA varchar(255),
    AirlineICAO varchar(255),
    FlightNumber varchar(255),
    FlightIATA varchar(255),
    FlightICAO varchar(255)
);
CREATE TABLE departuredetails (
    DepartureDetailsID int PRIMARY KEY AUTO_INCREMENT,
    Airport varchar(255),
    TimeZone varchar(255),
    IATA varchar(255),
    ICAO varchar(255),
    Terminal varchar(255),
    Gate varchar(255),
    Delay int,
    Scheduled datetime,
    Estimated datetime,
    Actual datetime,
    EstimatedRunway datetime,
    ActualRunway datetime
);
CREATE TABLE flights (
    FlightID int PRIMARY KEY AUTO_INCREMENT,
    FlightDate date,
    FlightStatus varchar(255),
    DepartureDetailsID int,
    ArrivalDetailsID int,
    AirlineID int,
    FlightNumber varchar(255),
    Aircraft varchar(255),
    Live tinyint(1)
);
CREATE TABLE hotels (
  AccomodationId INT PRIMARY KEY auto_increment,
  HotelName VARCHAR(255),
  StarLevel INT,
  Location VARCHAR(255),
  AveragePrice INT,
  Amenities VARCHAR(255)
);
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Salt VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    RegistrationDate DATE
    -- if needed, add more columns
);


CREATE TABLE UserPreferences (
    PreferenceID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    AirlineCompany VARCHAR(100),
    
    StarLevel INT,
    Amenities VARCHAR(255),
    -- if needed add more specific 
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);



