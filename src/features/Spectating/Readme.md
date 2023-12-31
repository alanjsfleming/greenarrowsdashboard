Cars can be set to be shared

They will get an 8 digit code to share. Use math.random() and then splice the string

https://firebase.google.com/docs/reference/security/database#parent

People can go to dashowl.co.uk/spectate

Enter the 8 digit code,

It will query spectator_codes collection and return cars ids that have this code.

with the car ids they will be able to get ONLY the dweet_name and owner field ONLY IF the spectator field is true.

They will also be able to get the realtimedatabase ref only if the spectator field is set to true!

They will then be able to subscribe to the realtime database and watch. Or not if thats turned off.

THEY WONT BE ABLE TO SET SPECTATOR TO TRUE IF THEY HAVENT PAID. THEY WONT BE ABLE TO 



