# HomeVision Backend Take Home

This is a Node/Express server that fetches the first ten pages from the HomeVision API and downloads the associated images when it receives a GET request at `/`

## Requirements

- [NodeJS ^17.5](https://nodejs.org/en/download/current/)

## Running locally

1. Clone the repository
1. Navigate to the project folder in a terminal
1. Install dependencies: `npm i`
1. Start the dev server: `npm run dev`
1. Open a browser to `localhost:8000`
1. The browser should display an array of ten pages of results from the HomeVision API, and the associated images should be downloaded to an `images` folder in the project folder

## Code description

- `index.ts` sets up the express server
- `functions.ts` contains the functionality to make requests to the HomeVision API and download images
- `types.ts` contains type definitions
