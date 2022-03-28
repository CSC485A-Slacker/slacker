// import * as TaskManager from 'expo-task-manager';
// import * as BackgroundFetch from 'expo-background-fetch';

// const UPDATE_CHECKINS_TASK = 'update-checkins';

// TaskManager.defineTask(UPDATE_CHECKINS_TASK, async () => {
//   const now = Date.now();

//   console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

//   // Be sure to return the successful result type!
//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

// async function registerUpdateCheckinsAsync() {
//   return BackgroundFetch.registerTaskAsync(UPDATE_CHECKINS_TASK, {
//     minimumInterval: 5, // seconds
//     stopOnTerminate: false, // android only,
//     startOnBoot: true, // android only
//   });
// }

// async function checkStatusAsync () {
//     const status = await BackgroundFetch.getStatusAsync();
//     const isRegistered = await TaskManager.isTaskRegisteredAsync(UPDATE_CHECKINS_TASK);
//     console.log(`status: ${status}`);
//     console.log(`is registered: ${isRegistered}`);
//   };

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function timedBackground() {
        const now = Date.now();
        console.log(`timedBackground at date: ${new Date(now).toISOString()}`);
        // delay(1000).then(() => console.log(`timedBackground at date: ${new Date(now).toISOString()}`));
}



export {  timedBackground }
