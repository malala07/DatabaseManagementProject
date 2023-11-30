create database hotels;
use hotels;

CREATE TABLE hotels (
  AccomodationId INT PRIMARY KEY auto_increment,
  HotelName VARCHAR(255),
  StarLevel INT,
  Location VARCHAR(255),
  AveragePrice INT,
  Amenities VARCHAR(255)
);
