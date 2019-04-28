# AirBnb Scraper
Scapes AirBnb listing pages

## Requirements
Requires Node V10+ for 'fs' promises

## Installation
```
npm install @stayko/airbnb-scraper
```

## Usage

```javascript
import Scraper from '@stayko/airbnb-scraper';

const scraper = new Scraper("https://www.airbnb.com/rooms/28299515?location=London%2C%20United%20Kingdom&adults=1&toddlers=0&guests=1&check_in=2019-04-26&check_out=2019-04-30&s=-xq9rVl0")

//Promise
scraper.scrapeHTML().then(result => console.log(result));

//async await
const result = await scraper.scrapeHTML();

/*
Example result:

{ 
  title: 'HS4-5 Premium Location in Heart of Brick Lane!',
  location: 'Greater London',
  description:
   [ 
    'Private room in apartment2 guests1 bedroom1 bed2 shared baths',
    'Sparkling clean · 9 recent guests“Arturs flat is nice, clean and tidy.”',
    'Self check-inCheck yourself in with the keypad.',
    'Great check-in experience95% of recent guests gave the check-in process a 5-star rating.',
    ],
  amenities:
   [
     'Wireless Internet',
     'Kitchen',
     'Dryer',
     'Laptop friendly workspace'
    ],
  images:
   [ 
    'https://a0.muscache.com/im/pictures/dbca3c9b-1ec6-4a6d-bfe6-66acfc51ec5d.jpg?aki_policy=xx_large',
    'https://a0.muscache.com/im/pictures/4921db74-ab6b-4da7-b504-12ea3139b3f2.jpg?aki_policy=large',
    'https://a0.muscache.com/im/pictures/78556ddc-8183-48ea-9e72-8bb9567ef5ca.jpg?aki_policy=large',
    'https://a0.muscache.com/im/pictures/96a10fc5-b280-41f0-b6b1-8f692e72b8a6.jpg?aki_policy=large',
    'https://a0.muscache.com/im/pictures/f2697a94-ded8-42cd-8136-f49e37a9666c.jpg?aki_policy=large' 
    ] 
 }

/*

```


## Utility functions

```javascript
import Scraper from '@stayko/airbnb-scraper';

const scraper = new Scraper("https://www.airbnb.com/rooms/28299515?location=London%2C%20United%20Kingdom&adults=1&toddlers=0&guests=1&check_in=2019-04-26&check_out=2019-04-30&s=-xq9rVl0")

const result = await scraper.scrapeHTML();

Scraper.saveImagesToDisk(result.images, '/saved/images'); //saves all images to specified directory
Scraper.saveTextToDisk(result.title, '/saved/file.txt'); //saves scraped text to specified text file

```