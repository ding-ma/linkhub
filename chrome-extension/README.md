# Chrome Extension (built with TypeScript + React)

## Run Locally

1. `npm install`
1. `npm run dev`

## Develop locally

1. `npm install`
1. `npm run watch`


## Run in Production

1. rename `sample.env.prod` to `.env.prod`
1. make sure to change `endPoint` to your server
1. Follow instructions for backend in the backend folder   
1. `npm install`
1. `npm run build`

## Installation

1. Complete the steps to build the project above
2. Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3. With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this
   repo

## To clear the workspace manually
1. inspect popup
1. click on application then local storage
1. right click to clear the `chrome-extension://`