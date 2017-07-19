# Multi-cuisine restaurant finder

This application lets you search restaurants around your location of interest and within the range you are willing to commute to get there.

## API and Endpoints used
- [Google Maps Geocoder](https://developers.google.com/maps/documentation/geocoding/start)

- [Places Library](https://developers.google.com/maps/documentation/javascript/places)

In this application, I have used the location information (latitude and longitude) JSON outputs from Google Maps Geocoder's query as a parameter for the Google Places API.

## User input data
- check any or all of the available cuisines
- location of interest (street address or just the zip code)
- search range in miles

![inpzip](https://github.com/roshnikutty/Multi_cuisine_restaurant_search_sort/blob/master/images/input_zip.png)



## Application output
 - A listing of restaurants with
    >1. Name of the restaurant
    >2. Opened or closed information in real time
    >3. Street address
    >4. Restaurant rating on a scale of 1 to 5
    >5. Price range in '$'

    

![openclose](https://github.com/roshnikutty/Multi_cuisine_restaurant_search_sort/blob/master/images/open_closed.png)

    
- 'Sort by rating' button
    > This functionality replaces your search list with the sort result of the listing in descending order of rating.


_Check out this app_