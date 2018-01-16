# CFC Datadash
## Overview
An interactive data-dashboard displaying season data for Chelsea FC from their foundation in 1905 t0 2015.

## Technologies used
* Flask: A micro-framework used for the back-end 
* Mongodb: A no-SQL database used to store the data
* Crossfilter.js: To better prepare the data and to make use of it's two-way-binding
* DC.js + D3.js: Working together with crossfilter, renders the interactive charts to the browser
* Queue.js: Simplifies asynchronous use of data
* Bootstrap: Mainly used as a skeleton for the HTML elements
* JQuery: To cover the page until loaded

## Inspiration
The code for this project has in part been inspired by the 
[Code Institute School Donations](https://github.com/jamcoy/school_donations).
I've mirrored the directories layout somewhat. I also followed the same idea of 
passing the data from Flask to javascript using a Flask route.