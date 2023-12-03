CREATE TABLE sers (
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
    SeatClass VARCHAR(50),
    AccommodationType VARCHAR(50), 
    StarLevel INT,
    Amenities VARCHAR(255),
    -- if needed add more specific 
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
