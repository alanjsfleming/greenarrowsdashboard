# Green Arrows Dashboard

## Getting the data
The telemetry is gathered from the car from a variety of sensors and an [eChook](https://www.echook.uk/) board. The data is sent from the eChook board to a phone with bluetooth and the eChook app on the phone uses mobile data to send it to a [dweet](https://dweet.io/). The [JavaScript Fetch API](https://www.w3schools.com/jsref/api_fetch.asp) takes the data in json format and it is turned into a dictionary for use.

## How values are calculated: 

### Time Elapsed:
Time0
: Taken when start button pressed

Time elapsed is difference between T0 and Tcurrent

### Estimated Gear
Speed
: From eChook (in miles per hour)

RPM of Motor
: From eChook

Number of teeth of wheel axle gear (big gear)
: Given by user

Diameter of wheel
: 59.44

RPM of wheel calculated by Speed/(59.44*60/63360).

Gear ratio calculated by RPM of motor / RPM of wheel.

Current number of teeth on the motor axle gear is number of teeth on big gear / gear ratio. (Remember Gear ratio = Driver/Driven)

The gear number is then worked out by taking the number of teeth on the motor axle gear away from 22. Another 0.5 is taken off because the output would be consistently off. 

The value is then rounded to the nearest whole number.

### Battery:
Ah total of batteries
: Given by user

Ah used
: From eChook

Battery percentage remaining = (Ah total - Ah used) / Ah total * 100
This is then rounded to 1 decimal place.

### Vt:
Vt
: From eChook

### Amp hours per lap:
Note: this is currently just Ah used / number of laps but this will be updated to a moving average from the last lap. See below...

Everytime a new amp reading is added :

  tempTotal = tempTotal + amp reading
  
  tempNum = tempNum +1
 
When the lap number increases, calculate the average from last lap, display it and reset counters.

### V1:
V1
: From eChook

### V2:
Vt
: From eChook

V1
: From eChook

V2 = Vt - V1

### Amps:
A
: From eChook

### Motor RPM:
RPM
: From eChook

### Speed:
Spd
: From eChook

Speed (in mph) = Spd * 2.237. This is rounded to 1 decimal place.

### Throttle
Thrtl
: From eChook

### Amp Hours used:
AH
: From eChook

### Laps
lap
: From eChook

### Temperature 1:
Tmp1
: From eChook

### Temperature 2:
Tmp2
: From eChook

### Break:
Brk
: From eChook

### Distance:
distance
: From eChook


## To do

### Table

### Line graph
Potentially up to 3 different series

### Motor efficiency
Function of current.

# Database
<<<<<<< HEAD
Firebase Realtime Database
=======

>>>>>>> 747d66c2e438c7713509dec6707bd31f926b6577

### Users
username -> string
password -> string
displayname -> string
cars -> {
  {
   name:"Green Arrows 1",
   dweet:"https://dweet.io/get/latest/dweet/for/Albyn1"
   },
  {
   name:"Green Arrows 1",
   dweet:"https://dweet.io/get/latest/dweet/for/Albyn2"
   }
}

... add google sheets writing


### Cars


### Realtime database

{
  'users' : {
    'green arrows' : {
      1 : { data },
      2 : { data },
      3 : { data },
      ...
    },
    'other team' : {
      1 : { data }
    }
  }

}

### Getting graph of data

Dweet can fetch last 500 dweets. They update ~once per second so last 8 minutes.

If a user opens client, it should join the saved data to the new data and then update the cloud version with this. Only one client should be writing values at a time.

can use: 
alldata = olddata.concat(newdata.filter(newdata.timestamp > olddata[olddata.length-1].timestamp))

call once when page is loaded, 

### Team
race start time is under team
car has "owner" field, teams look for car documents where "owner" is the team uid, can only read write if it is


###
Lap info on summary:
Lap number [ ]
Lap time [ ]
Lap distance [ ]
Lap speed [ ]
Lap efficiency [ ]
Lap amp hours per lap [ ]
Lap battery percentage [ ]



### settings

Lap times

on site load the context gets the user document and the car document and stores it in the brower local storage

on each individual page load, the settings are loaded from the local storage and used to display the page

Pages are:
Overview
Car
Settings





users can set their own settings, which are stored in the user document. These are then used to display the dashboard.

user document contains the following field:

user document identified by uid

team_name -> string
race_start_time -> number (timestamp)
manual_track_length -> number (meters)
theme -> string (light/dark)

car document contains the following fields:

owner -> string (uid of team)

car_name -> string
dweet_name -> string
large_gear_teeth -> number
wheel_diameter -> number
battery_ah -> number

### Data sent by dweet

{
    "Vt": 18.01,
    "V1": 0,
    "A": 20.4,
    "RPM": 1360,
    "Spd": 13.6,
    "Thrtl": 68,
    "AH": 167.53,
    "Lap": 0,
    "Tmp1": 34,
    "Tmp2": 0,
    "Brk": 0,
    "Gear": 0,
    "Distance": 53387.32,
    "Lat": 57.1189133,
    "Lon": -2.1351633
}

Chart.js