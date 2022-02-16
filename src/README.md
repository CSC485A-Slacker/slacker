# Developing Slacker Locally

To develop slacker on your local machine you will need ensure you have [node and npm](https://github.com/nvm-sh/nvm) (v16 works) and [expo cli](https://docs.expo.dev/workflow/expo-cli/).

## Setup Project

To setup and run the project, run the following commands from /src :

```console
npm install
expo start      // can also use npm start
```

There are three ways to access the app:

- Go to http://localhost:19002 and select which platform you would like the app to run on.
- Type `a` or `i` in the terminal where the expo start command is running to open the android or iOS simulator, respectively.
- Scan the QR code in the terminal to view the app on your phone.

See below sections on how to set up the appropriate emulator.

---

## Running it on your device

Download the expo app and create an account. Open photos and scan the QR code created in the terminal where the application is running. It will redirect you to the expo app where you can explore your app.

## Running on Android

Download Android studio and setup an android emulator. [Instructions here.](https://www.alphr.com/run-android-emulator/)

## Running on iOS

To run the iOS Simulator, it requires requires XCode which is only available on Mac. [Instructions here.](https://medium.com/macoclock/beginner-get-started-with-xcode-simulator-2021-54485cced60f)

For Windows or Linux machines, please checkout these [other options.](https://techengage.com/best-ios-simulators/)
