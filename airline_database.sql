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


