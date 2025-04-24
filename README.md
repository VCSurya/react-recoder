# Universal Recorder - React App

This is a React implementation of the Universal Recorder application. The application allows users to record, view, and manage automation events.

## Prerequisites

- Node.js and npm installed on your machine
- Backend server running on port 5000 (assumed from API endpoints)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Running the application

To start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Features

- Record mouse clicks and keyboard events
- Play back automated sequences
- Add new events manually
- View and edit event details
- Capture and crop screenshots
- Save automation flows

## Project Structure

- `src/components`: React components
- `src/contexts`: Context providers for state management
- `src/hooks`: Custom React hooks
- `src/styles`: CSS stylesheets
- `src/assets`: Static assets

## API Integration

The application integrates with a backend server running on `http://127.0.0.1:5000`. Make sure the server is running before using the application.

## Building for Production

To build the app for production:

```bash
npm run build
```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. 