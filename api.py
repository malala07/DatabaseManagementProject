# api.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import pandas as pd
import requests
import csv

app = Flask(__name__)
CORS(app)  

@app.route('/fetch-flight-data', methods=['GET'])
def fetch_flight_data():
    
    response = requests.get('http://api.aviationstack.com/v1/flights?access_key=0274cb254b3c5249cfa22e5ecc532c2b&arr_iata=LGA')

    if response.status_code == 200:
        data = response.json()
        # Check if the 'data' key is present in the response
        if 'data' in data:
            # Extract the list of flights
            
            flights = data['data']
    
   
            # Create a DataFrame from the list of dictionaries
            df = pd.DataFrame(flights)
            #if 'live' in df.columns:
            #  print('yes')
            # df = df.drop(columns= 'live')
                
                
            # Specify the CSV file name
            csv_file_name = 'output2.csv'

            # Save the DataFrame to a CSV file
            df.to_csv(csv_file_name, index=False)
            print(f"CSV file '{csv_file_name}' created successfully.")
        else:
            print("No 'data' key found in the response.")
        
        db = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Love@123456',
        database='FlightReservation'
        )

        # Create a cursor object
        cursor = db.cursor()
        try: 
            cursor.execute('DELETE FROM airlines')
            cursor.execute('DELETE FROM arrivaldetails')
            cursor.execute('DELETE FROM codesharedflights')
            cursor.execute('DELETE FROM departuredetails')
            cursor.execute('DELETE FROM flights')
            db.commit()
        except Exception as e:
            print(f"Error during deleteing table: {e}")###


        flightData = data['data']
        #print(flightData)
        # Loop through the data
        for flight in flightData:
            # Prepare SQL query for each table and execute
            # Insert into DepartureDetails table
            departure_query = """
            INSERT INTO DepartureDetails (Airport, TimeZone, IATA, ICAO, Terminal, Gate, Delay, Scheduled, Estimated, Actual, EstimatedRunway, ActualRunway) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            departure_values = (flight['departure']['airport'],
                                flight['departure']['timezone'],
                                flight['departure']['iata'],
                                flight['departure']['icao'],
                                flight['departure']['terminal'],
                                flight['departure']['gate'],
                                flight['departure']['delay'],
                                flight['departure']['scheduled'],
                                flight['departure']['estimated'],
                                flight['departure']['actual'],
                                flight['departure']['estimated_runway'],
                                flight['departure']['actual_runway'])
            cursor.execute(departure_query, departure_values)
            departure_id = cursor.lastrowid  # Get the ID of the last inserted row

            # Insert into ArrivalDetails table (similar to DepartureDetails)
            arrival_query = """
            INSERT INTO ArrivalDetails (Airport, TimeZone, IATA, ICAO, Terminal, Gate, Baggage, Delay, Scheduled, Estimated, Actual, EstimatedRunway, ActualRunway) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            arrival_values = (flight['arrival']['airport'], 
                              flight['arrival']['timezone'], 
                              flight['arrival']['iata'], 
                              flight['arrival']['icao'],
                              flight['arrival']['terminal'],
                              flight['arrival']['gate'], 
                              flight['arrival']['baggage'],
                              flight['arrival']['delay'], 
                              flight['arrival']['scheduled'], 
                              flight['arrival']['estimated'],
                              flight['arrival']['actual'],
                              flight['arrival']['estimated_runway'],
                              flight['arrival']['actual_runway'])
            cursor.execute(arrival_query, arrival_values)
            arrival_id = cursor.lastrowid  # Get the ID of the last inserted row

            # Insert into Airlines table
            airline_query = """
            INSERT INTO Airlines (AirlineName, IATA, ICAO) 
            VALUES (%s, %s, %s)
            """
            airline_values = (flight['airline']['name'],
                              flight['airline']['iata'],
                              flight['airline']['icao'])
            cursor.execute(airline_query, airline_values)
            airline_id = cursor.lastrowid  # Get the ID of the last inserted row

            # Insert into Flights table
            flight_query = """
            INSERT IGNORE INTO Flights (FlightID, FlightDate, FlightStatus, DepartureDetailsID, ArrivalDetailsID, AirlineID, FlightNumber, Aircraft, Live) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            flight_values = (flight['flight']['number'], 
                             flight['flight_date'], 
                             flight['flight_status'],
                             departure_id, arrival_id,
                             airline_id, 
                             flight['flight']['number'],
                             flight['flight']['number'],
                             flight['flight']['number'])
            cursor.execute(flight_query, flight_values)
            
            # If codeshared flight data exists, insert it into CodesharedFlights table
            if flight['flight']['codeshared'] is not None:
                codeshared_query = """
                INSERT INTO CodesharedFlights (FlightID, AirlineName, AirlineIATA, AirlineICAO, FlightNumber, FlightIATA, FlightICAO) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                codeshared_values = (flight['flight']['number'], 
                                     flight['flight']['codeshared']['airline_name'], 
                                     flight['flight']['codeshared']['airline_iata'], 
                                     flight['flight']['codeshared']['airline_icao'], 
                                     flight['flight']['codeshared']['flight_number'], 
                                     flight['flight']['codeshared']['flight_iata'], 
                                     flight['flight']['codeshared']['flight_icao'])
                cursor.execute(codeshared_query,codeshared_values)
                

        # Commit the transaction
        db.commit()

        # Close the connection
        db.close()
        
        print("Data Stored")
        # ... your existing code to process and store data in MySQL
        return jsonify({"message": "Data fetched and stored successfully."})
    else:
        return jsonify({"error": f"Error: {response.status_code}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
