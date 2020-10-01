$(document).ready(function () {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBBMDzzSwSCLPsl18WxcoUpgRVRsgvHdjU",
    authDomain: "en-route-8abd1.firebaseapp.com",
    databaseURL: "https://en-route-8abd1.firebaseio.com",
    projectId: "en-route-8abd1",
    storageBucket: "en-route-8abd1.appspot.com",
    messagingSenderId: "750172600914",
    appId: "1:750172600914:web:c6599d165dc496eb3abd8b",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //Reference to firebase database
  var database = firebase.database();

  var trainName = "";
  var destinationCity = "";
  var firstTrain = "";
  var trainFrequency = "";

  //current time variable
  var currentTime = moment().format("HH:mm");
  console.log(currentTime);

  //Click function for submiting new train info
  $("#addTrain").on("click", function (e) {
    //prevent default
    e.preventDefault();

    //grab user input for train name
    trainName = $("#trainNameInput").val().trim();

    //grab user input for destination city name
    destinationCity = $("#destinationCityInput").val().trim();

    //grab user input for first train time
    //add moment to change user input into military time
    firstTrain = moment($("#trainTimeInput").val().trim(), "HH:mm").format(
      "HH:mm"
    );

    //grab user input for train frequency in minutes
    //add moment to variable to format input into minutes
    trainFrequency = moment($("#trainFrequencyInput").val().trim(), "m").format(
      "m"
    );

    //variable to convert first train time
    var convertFirstTrain = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(convertFirstTrain);

    // Difference between the times
    var timeDifference = moment().diff(moment(convertFirstTrain), "minutes");
    console.log(timeDifference);

    // Time apart (remainder)
    var timeRemainder = timeDifference % trainFrequency;
    console.log(timeRemainder);

    // Minute Until Train
    var minTillTrain = trainFrequency - timeRemainder;
    console.log(minTillTrain);

    //variable to hold next train time
    var nextTrainTime = moment().add(minTillTrain, "minutes").format("hh:mm A");
    console.log(nextTrainTime);

    //temporary object for holding train data
    var newTrain = {
      trainName: trainName,
      destinationCity: destinationCity,
      firstTrain: firstTrain,
      trainFrequency: trainFrequency,
      minTillTrain: minTillTrain,
      nextTrainTime: nextTrainTime,
    };

    //Adding firebase reference to update train info variables
    database.ref().push(newTrain);

    console.log(newTrain.trainName);
    console.log(newTrain.destinationCity);
    console.log(newTrain.firstTrain);
    console.log(newTrain.trainFrequency);
    console.log(newTrain.minTillTrain);
    console.log(newTrain.nextTrainTime);

    $("#trainNameInput").val("");
    $("#destinationCityInput").val("");
    $("#trainTimeInput").val("");
    $("#trainFrequencyInput").val("");
  });

  //grab the information about new train added from firebase
  database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());

    var newName = snapshot.val().trainName;
    console.log(newName);
    var newDestination = snapshot.val().destinationCity;
    console.log(newDestination);
    var newFirstTrain = snapshot.val().firstTrain;
    console.log(newFirstTrain);
    var newFrequency = snapshot.val().trainFrequency;
    console.log(newFrequency);
    var newMinTill = snapshot.val().minTillTrain;
    console.log(newMinTill);
    var newNextTrain = snapshot.val().nextTrainTime;
    console.log(newNextTrain);

    var newRow = $("<tr>").append(
      $("<td>").text(newName),
      $("<td>").text(newDestination),
      $("<td>").text(newFrequency),
      $("<td>").text(newNextTrain),
      $("<td>").text(newMinTill)
    );

    // Append the new row to the table
    $("#trainTable > tbody").append(newRow);
  });
});
