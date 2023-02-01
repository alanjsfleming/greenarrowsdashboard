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
Firebase Realtime Database

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