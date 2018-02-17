# SnowVisualizer

Done as part of CSCI 5117, Fall 2017

[Assignment description](https://docs.google.com/document/d/1956Z3EZJi9RWU6JqPHEh5ZZBmDOKFex-HtsBLz66tt4/edit#)


## Name of App: Snow Visualizer

## Name of Team: DareDevils

## Students

* Rahul Bora, bora0072@umn.edu
* Kiran Ravindra, ravin047@umn.edu

## Link to Site

https://fathomless-forest-33607.herokuapp.com
https://aqueous-waters-58713.herokuapp.com/

## Key Features

* Parsing the Json data from the NOAA (National Oceanic and Atmospheric Administration | US Department of Commerce) servers and visualizing it.
* Creating custom algorithims to calculate the average over given date range and dynamically change the intensity of the points in google map and also in the table view.
* Creating the custom logic for selecting rows(stations) from the table and vizualizing them in highcharts.
* Customizing a slider from https://github.com/MasterMaps/d3-slider to suit our specific requirements. 


## Screenshots of Site

**Page 1 : Here you select the two states and the month and year of which you want to analyze the snowfall data**

![](https://github.com/umn-5117-f17/module-1-group-assignment-daredevils/blob/master/public/screenshots/screen1.png)

**Page 2 : Here you see two maps that shows the repectives stations with a color coding that shows the intensity of snowfall in each station. You also have a slider that will show you average snowfall in the date range selected**

![](https://github.com/umn-5117-f17/module-1-group-assignment-daredevils/blob/master/public/screenshots/screen2.png)

**Page 3 : Displays the data of each station in tabular format. You can select the station from a state table and then click on visualize to see a comparision of their data over a month**

![](https://github.com/umn-5117-f17/module-1-group-assignment-daredevils/blob/master/public/screenshots/screen3.png)

**Visualization of station data over a month**

![](https://github.com/umn-5117-f17/module-1-group-assignment-daredevils/blob/master/public/screenshots/screen4.png)




## External Dependencies

**Document integrations with 3rd Party code or services here.**

* Highcharts : Used to visualize data of staions in table View.
* google map api : Used to vizualize data over maps.
* d3 Slider : Used from https://github.com/MasterMaps/d3-slider to implement the slider.



## Links to Test Data

The best example will be to compare states with a substantial amount of snowfall, during the months of November to March. 
Few Examples :
Compare Michigan and Minnesota for December, 2016. 
(We have not provided the option for the user to download the CSV file from the NOAA severs and upload in our application. Instead, based on the user input we extract the Json file from the NOAA servers)


