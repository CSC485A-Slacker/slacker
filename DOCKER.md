# Development Instructions


## Requirements

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose/) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/).


## Getting Started
Docker should be up and running, including docker-compose and the docker-daemon.
> Docker will handle installing the necessary dependies and run the app inside a container. You will need to build the project and bring up all services and volumes.

First update your node packages by navigating to the /src directory and running 
`npm install`

Then navigate to the root directory and run:

`docker-compose up --build`

It will take a few minutes to get the container up and running. Afterwards,  a QR code will appear in your terminal. Scanning this will take you to [Expo Go (iOS)](https://apps.apple.com/ca/app/expo-go/id982107779) or [Expo (Andriod)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_CA&gl=US) where you will connect to the Slacker app.

When you are finished, to stop all containers, press `CTRL-C` in your terminal.
