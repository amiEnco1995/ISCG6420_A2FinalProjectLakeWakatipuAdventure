
$(document).ready(function(){
    
    localStorage.clear(); 
/*********************************************************************** */
/*************************Start of Weather Section **************************/
/*********************************************************************** */

/* Weather data variables */
    let allWeather, allWeatherString, allWeatherJSON, middayWeatherJSON;
    let summaryWeatherJSON = [];

    let todayWeather;
    let todayWeatherString;
    let todayWeatherJSON;
    let summaryTodayJSON = []; 
   

/*Variables to populate html document */
    let dateToday; 
    let dateTodayArr; 
    let dateTodayFormatted; 
    let tdayText = document.getElementById('tdayText');
    let tdayWeather = document.getElementById('todayWeather');
    let tdayTemp = document.getElementById('todayTemp');
    let tdayWindSpeed = document.getElementById('todayWindSpeed');
    let tdayHumidity = document.getElementById('todayHumidity');  
    
    let daysOfWeek = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat"}; 
    let day1Day = document.getElementById('day1');
    let day2Day = document.getElementById('day2');
    let day3Day = document.getElementById('day3');
    let day4Day = document.getElementById('day4');

    let day1Temp = document.getElementById('day1Temp');
    let day2Temp = document.getElementById('day2Temp');
    let day3Temp = document.getElementById('day3Temp');
    let day4Temp = document.getElementById('day4Temp');

    let timeChoice = document.getElementById('timeChoice').value;
    let currentDate = getSystemDate(); 
    let maxDate = getSystemDatePlusDays(4);
    let dateChoice = document.getElementById('dateChoice').value;





   const fiveDaySettings = {
    "async": true,
	"crossDomain": true,
    "dataType": "json", 
	"url": "https://api.openweathermap.org/data/2.5/forecast?lat=-45.0894&lon=168.5352&units=metric&appid=f53238586dd190f5dab11d5b377ec449",
	"method": "GET",
    "beforeSend": function(){
        $('.loadingLeftMain').removeClass("d-none"); 
        $('.weatherContainer').addClass("d-none");
    },
    "success": function(result,status){
        $('.loadingLeftMain').addClass("d-none"); 
        $('.weatherContainer').removeClass("d-none");
        //get all the weather data
        allWeather = result["list"];
        allWeatherString = JSON.stringify(allWeather); 
        allWeatherJSON = JSON.parse(allWeatherString); 
        
        //filter for only 5 weather records midday
         middayWeatherJSON = getMiddayWeather(allWeatherJSON);

        //get an array containing 5 day forecast with only data points of interest 
         getForecastWeather(middayWeatherJSON, summaryWeatherJSON, 5);

        
        // console.log(result); 
        //console.log(middayWeatherJSON);   
        //console.log(summaryWeatherJSON); 
        //console.log(summaryWeatherJSON[0]["date"]); 

        /*Current date */
        dateToday = extractDateFromISO(summaryWeatherJSON[0]["date"]);
        dateTodayArr = dateToday.split('-'); 
        dateTodayFormatted = formatDate(new Date(dateTodayArr[0], dateTodayArr[1], dateTodayArr[2])); 
        tdayText.innerHTML = dateTodayFormatted; 
        getWeatherPicture(summaryTodayJSON["icon"], '#todayWImage'); 

        /*Day 1 Foreacast*/
        let day1Date = extractDateFromISO(summaryWeatherJSON[1]["date"]);
        let day2Date = extractDateFromISO(summaryWeatherJSON[2]["date"]);
        let day3Date = extractDateFromISO(summaryWeatherJSON[3]["date"]);
        let day4Date = extractDateFromISO(summaryWeatherJSON[4]["date"]);

        day1Day.innerHTML = getDayOfDate(day1Date);
        day2Day.innerHTML = getDayOfDate(day2Date);
        day3Day.innerHTML = getDayOfDate(day3Date);
        day4Day.innerHTML = getDayOfDate(day4Date);

        getWeatherPicture(summaryWeatherJSON[1]["icon"], '#day1Img');
        getWeatherPicture(summaryWeatherJSON[2]["icon"], '#day2Img');
        getWeatherPicture(summaryWeatherJSON[3]["icon"], '#day3Img');
        getWeatherPicture(summaryWeatherJSON[4]["icon"], '#day4Img');

        day1Temp.innerHTML = summaryWeatherJSON[1]["temp"].toFixed(1) + " °C"; 
        day2Temp.innerHTML = summaryWeatherJSON[2]["temp"].toFixed(1) + " °C"; 
        day3Temp.innerHTML = summaryWeatherJSON[3]["temp"].toFixed(1) + " °C"; 
        day4Temp.innerHTML = summaryWeatherJSON[4]["temp"].toFixed(1) + " °C"; 

        console.log(summaryWeatherJSON);   
            
        localStorage.setItem("forecast", JSON.stringify(summaryWeatherJSON));
        
    }
   }


   const todaySettings = {
    "async": true,
	"crossDomain": true,
    "dataType": "JSON", 
	"url": "https://api.openweathermap.org/data/2.5/weather?lat=-45.0894&lon=168.5352&units=metric&appid=f53238586dd190f5dab11d5b377ec449",
	"method": "GET",
    "success": function(result,status){
        //get all today's weather data
        todayWeather = result; 
        todayWeatherString = JSON.stringify(todayWeather);
        todayWeatherJSON = JSON.parse(todayWeatherString); 

        //get an array containing current forecast with only data points of interest
        summaryTodayJSON = getTodayWeather(todayWeatherJSON); 

       //console.log(todayWeatherJSON); 
       //console.log(summaryTodayJSON); 
        
        tdayWeather.innerHTML = summaryTodayJSON["weather"]; 
        tdayTemp.innerHTML = summaryTodayJSON["temp"].toFixed(1) + " °C"; 
        tdayWindSpeed.innerHTML = "Wind Speed: " + summaryTodayJSON["wind"] + " m/s";
        tdayHumidity.innerHTML = "Humidity: " + summaryTodayJSON["humidity"] + " %"; 

        let wAdvice = document.getElementById('wAdvice');
        wAdvice.innerHTML = "Please choose a date"; 
        
        localStorage.setItem("todayWeather", todayWeatherString); 
             

    }
}    

/* AJAX CALLS */
 // Get 5 day forecast 
function ajaxForecast(){

$.ajax(fiveDaySettings);
}
    
ajaxForecast();

//Get today's weather 
function ajaxToday()  {

    $.ajax(todaySettings); 
} 

ajaxToday(); 




//Set to local Storage 
function saveToLocalStorage(){
    localStorage.setItem("dateChoice", dateChoice);
    localStorage.setItem("timeChoice", timeChoice);
}


//Function to get all midday weather for forecast
function getMiddayWeather(sourceArr){
    return sourceArr.filter(function(currentVal, index){
        var targetIndex = [3,11,19,27,35];
        for(let item of targetIndex){
            if(index === item){
                    return currentVal;      
                }    
            }    
        });    
   }     

// function to get 5 day forecast summarised   
function getForecastWeather(sourceArr, targetArr, lengthSource){
    for(let index = 0; index < lengthSource; index++){
        targetArr.push({ date: sourceArr[index]["dt_txt"], 
        temp: sourceArr[index]["main"]["temp"], 
        weather: sourceArr[index]["weather"][0]["main"], 
        icon: sourceArr[index]["weather"][0]["icon"],
        wind: sourceArr[index]["wind"]["speed"],
        humidity: sourceArr[index]["main"]["humidity"]});
      }  
   }   
   
// function to get today's weather summarised   
function getTodayWeather(sourceArr){
    return {temp: sourceArr["main"]["temp"],    
            weather: sourceArr["weather"][0]["main"], 
            icon: sourceArr["weather"][0]["icon"], 
            wind: sourceArr["wind"]["speed"], 
            humidity: sourceArr["main"]["humidity"]};
        }         

        //format dates to DD/MM/YYYY   
 function formatDate(inputDate) {
     let date, month, year; 
  
     date = inputDate.getDate();
    month = inputDate.getMonth();
    year = inputDate.getFullYear();
  
      date = date
      .toString()
          .padStart(2, '0');
          
          month = month    
          .toString()
          .padStart(2, '0');
          
          return `${date}/${month}/${year}`;      
        }  
        
// function to convert ISO date to YYYY-MM-DD format  
function extractDateFromISO(inputDate){
    var temp = inputDate.split(' '); 
    return temp[0]; 
}

//function to place the corresponding weather picture to the correct weather row
function getWeatherPicture(iconCode, targetImgID){
    let iconurl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

    $(targetImgID).attr('src', iconurl);
}

//function to get the day of the date
function getDayOfDate(dateString){
    var tempDate = new Date(dateString);
    var tempDay = tempDate.getDay(); 
    
   for(let item in daysOfWeek){
       if(parseInt(item) === tempDay){
        return daysOfWeek[item]; 
    }
    
   }
   
}

/*********************************************************************** */
/*************************End of Weather Section **************************/
/*********************************************************************** */


/*********************************************************************** */
/*************************Start of Menu Section **************************/
/*********************************************************************** */


let menuXMLDOM; 
let menuString; 

const menuSettings = {
    type: "GET",
    url: "../xmlDocs/menuBoat.xml",
    dataType: "XML",
    success: function(xml){ 
        //convert xml object to string
        menuString = convertToXMLString(xml);
        // console.log(menuString);
        //convert xml string to xml dom object 
        menuXMLDOM = convertToXMLDOM(menuString);
       // console.log(menuXMLDOM); 
       
       
       $(menuXMLDOM).find('Item').each(function(){
            let itemFood = $(this).find('ItemName').text();
            let imgFood = $(this).find('Image').text();
            let aboutFood = $(this).find('Description').text();
            let typeFood = $(this).find('Type').text();
            let priceFood = $(this).find('Price').text(); 
            
            let floatPriceFood = parseFloat(priceFood).toFixed(2);

            let newRow = `<tr class="foodRow"><td class="colImg"><img src="../images/${imgFood}" class="foodImg"></td><td class="colText">${itemFood}</td><td class="colText">${typeFood}</td><td class="colText">${aboutFood}</td><td class="colText">$${floatPriceFood}</td></tr>`;
            
            $('#menuTableID').append(newRow); 
        })
        
    }
}

//Get menu items from XML document 
function ajaxMenu(){
$.ajax(menuSettings); 
}

ajaxMenu();

// function to convert an xmlString to an XML DOM 
function convertToXMLDOM(xmlString){
    var parser = new DOMParser();
    return parser.parseFromString(xmlString,"text/xml");
}

// function to convert an XML object to an XML string
function convertToXMLString(xmlObj){
    var tempObj = new XMLSerializer().serializeToString(xmlObj);
    return tempObj; 
}

/*********************************************************************** */
/*************************End of Menu Section **************************/
/*********************************************************************** */


/*********************************************************************** */
/*************************Start of Page 1 Section **************************/
/*********************************************************************** */


//Get today's date
function getSystemDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

//Get dates four days from today
function getSystemDatePlusDays(numberOfDays){
    var today = new Date();
    var dd = String(today.getDate() + numberOfDays).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}


/* Determine whether the chosen date is favorable*/
$(document).ajaxSuccess(function(){
    
     /*Set date range of calender*/
     $('#dateChoice').attr("min", currentDate);
     $('#dateChoice').attr("max", maxDate);
    
     // get value of date choice change
     $('#dateChoice').on("change",function(){
         dateChoice = document.getElementById('dateChoice').value; 
         localStorage.setItem("dateChoice", dateChoice); 
     });
    
     // Get the value of time combo box change
    $('#timeChoice').on("change",function(){
        timeChoice = document.getElementById('timeChoice').value; 
        localStorage.setItem("timeChoice", timeChoice); 
    });
    
    $('.bookingAllContainer').scrollTop(); 


    let wAdvice = document.getElementById('wAdvice');
    wAdvice.innerHTML = "Please choose a date"; 
    
    
    // get value of date choice change
    $('#dateChoice').on("change",function(){
        dateChoice = document.getElementById('dateChoice').value; 
        var tempForecast = JSON.parse(localStorage.getItem("forecast"));
        //console.log(tempForecast); 
        //console.log(currentDate);
       // console.log(dateChoice); 
       tempForecast.forEach(obj => {
            var tempDate = extractDateFromISO(String(obj["date"]));
            
            if(dateChoice !== currentDate){
                var tempConverted = obj["temp"];
                var tempWeather = String(obj["weather"]);
                
                //match the chosen date with the right date in the forecast object
                if(tempDate === dateChoice){
                   // console.log(tempDate); 
                    //console.log(dateChoice);

                    if((tempConverted > 14) && String(obj["weather"]) !== 'Rain'){
                        wAdvice.innerHTML = "The weather on that date is favorable 🏄‍♂️";  
                        $('#btnAdvice_Next').removeAttr("disabled");
                        $('#btnAdvice_Next').html("Start Booking"); 
                       // console.log(tempConverted);
                        //console.log(tempWeather);
                    
                    }
                    else{
                     wAdvice.innerHTML = "The weather on that date is unfavorable 🌧️";   
                        $('#btnAdvice_Next').attr("disabled", "true");
                        $('#btnAdvice_Next').html("No Bookings"); 
                
                    }
                 }
            }
            else
            {
                wAdvice.innerHTML = "We are taking bookings today ✔️"; 
                $('#btnAdvice_Next').removeAttr("disabled");
                $('#btnAdvice_Next').html("Start Booking"); 
            }


        });
      
        
    });
       
    
});

let firstName = document.getElementById('firstNameID');
let lastName = document.getElementById('lastNameID');
let mobile = document.getElementById('mobileID');
let email = document.getElementById('emailID'); 
let passengers = document.getElementById('passengerID');
let dateChoiceDoc = document.getElementById('dateChoice');
let timeChoiceDoc = document.getElementById('timeChoice'); 

/* Take use to page 2 of booking */ 
$('#btnAdvice_Next').click( function(){

    localStorage.setItem("selection", "[]"); 
    var dateChoice = localStorage.getItem("dateChoice");
    var timeChoice = localStorage.getItem("timeChoice"); 

    if(dateChoice !== "" && timeChoice !== ""){
      var checkFirstNameStore = localStorage.getItem("firstName");
      var checkLastNameStore = localStorage.getItem("lastName");
      var checkMobileStore = localStorage.getItem("mobile");
      var checkEmailStore = localStorage.getItem("email");
      var checkPassengersStore = localStorage.getItem("passengers");
        
        console.log("next page");
        $('.bookingPg1').addClass("d-none"); 
        $('.bookingPg2').removeClass("d-none")
       setDateTimePg2(); 
      
        if(!([checkFirstNameStore, checkLastNameStore, checkMobileStore, checkEmailStore, checkPassengersStore].includes(""))){
         firstName.innerHTML = localStorage.getItem("firstName");
         lastName.innerHTML = localStorage.getItem("lastName");
         mobile.innerHTML = localStorage.getItem("mobile");
         email.innerHTML = localStorage.getItem("email");
         passengers.innerHTML = localStorage.getItem("passengers"); 
            

        }   
    }
    else{
        alert("Please choose a date and time"); 
    }

   
});

//Automatically save variables of interest upon page load
saveToLocalStorage(); 

/*********************************************************************** */
/*************************End of Page 1 Section **************************/
/*********************************************************************** */


/*********************************************************************** */
/*************************Contact Details Section **************************/
/*********************************************************************** */


function setDateTimePg2(){
    var dateInterim = localStorage.getItem("dateChoice").split("-");
    var dateLocalStoreFormatted = formatDate(new Date(dateInterim[0], dateInterim[1], dateInterim[2]));
   
   
    var dateTrip = document.getElementById('dateTripID');
    var timeChoice2 = document.getElementById('timeChoiceID'); 
    
    if(dateLocalStoreFormatted !== ""){
    
       dateTrip.innerHTML = dateLocalStoreFormatted; 
    }
    else{
        dateTrip.innerHTML = dateLocalStoreFormatted; 
    }

    timeChoice2.innerHTML = String(localStorage.getItem("timeChoice")); 
}

$('#btnPrevPg2').click(function(){
    dateChoiceDoc = localStorage.getItem("dateChoice");
    timeChoiceDoc = localStorage.getItem("timeChoice"); 

     $('#dateChoice').val(dateChoiceDoc); 

    $('.bookingPg1').removeClass("d-none");
    $('.bookingPg2').addClass("d-none"); 
});

$('#btnNextPg2').click(function(){
    var tempFirstName = firstName.value; 
    var tempLastName = lastName.value;
    var tempMobile = mobile.value; 
    var tempEmail = email.value;
    var tempPassengers = passengers.value; 

    if([tempFirstName,tempLastName,tempMobile,tempEmail,tempPassengers].includes("")){
        alert("Please fill in all fields"); 
    }
    else{
    $('.bookingPg2').addClass("d-none"); 
    $('.bookingPg3').removeClass("d-none");

    localStorage.setItem("firstName", tempFirstName);
    localStorage.setItem("lastName", tempLastName);
    localStorage.setItem("mobile", tempMobile);
    localStorage.setItem("email", tempEmail);
    localStorage.setItem("passengers", tempPassengers); 
    }

}); 

/*********************************************************************** */
/*************************End of Page 2 Section **************************/
/*********************************************************************** */


/*********************************************************************** */
/*************************Choose Boat Section   **************************/
/*********************************************************************** */


let boatChoice = ""; 

$('#tereImage').click(function(){
    
    if(!($('.tereDiv').hasClass("selectedBoat"))){
        $('.tereDiv').addClass("selectedBoat")
    }
        $('.nuiDiv').removeClass("selectedBoat");

    boatChoice = "Tere";
    localStorage.setItem("boatChoice", boatChoice);     
    
})

$('#nuiImage').click(function(){
    
    if(!($('.nuiDiv').hasClass("selectedBoat"))){
        $('.nuiDiv').addClass("selectedBoat")
       
    }
    $('.tereDiv').removeClass("selectedBoat");

    boatChoice = "Nui";
    localStorage.setItem("boatChoice", boatChoice);   
})

$('#btnNextPg3').click(function(){

    var passengersStorageTemp = String(localStorage.getItem("passengers"));
    document.getElementById("passengerCountTere").innerHTML = passengersStorageTemp; 
    document.getElementById("passengerCountNui").innerHTML = passengersStorageTemp;

    console.log("click"); 
    var boatChoiceStorage = String(localStorage.getItem("boatChoice"));
    console.log("boat choice", boatChoiceStorage); 

    
   
    if(boatChoiceStorage == "null") {alert("Please select a boat")};

   
    if(boatChoiceStorage === "Nui"){
      $('.chooseBoatContainer').addClass("d-none");
        $('.nuiContainer').removeClass("d-none");
        
    }  

    if(boatChoiceStorage === "Tere"){
        $('.chooseBoatContainer').addClass("d-none");
        $('.tereContainer').removeClass("d-none");
      
    }

    var sessionStore, sessionStoreJSON;
    try{
        sessionStore = $('#sessionID').text();
        sessionStoreJSON = JSON.parse(sessionStore);
        console.log("sessionStore: ", sessionStore);
        console.log("sessionStoreJSON", sessionStoreJSON);
    }
    catch{
        console.log("session not created");
    }

    var tempDateStorage = localStorage.getItem("dateChoice");
    var tempTimeStorage = localStorage.getItem("timeChoice");
    
    /* check if seats booked for that date and time */
    /* Only takes into account if booking has occured once for that seat */
    /* Ran out of time to solve for same seat differen time bookings */
    
    if(sessionStoreJSON !== undefined){
       
        tempTimeStorage = localStorage.getItem("timeChoice");
        tempDateStorage = localStorage.getItem("dateChoice");
        
        sessionStoreJSON.forEach(obj => {

            if(obj["dateBooked"] === tempDateStorage && obj["timeChoice"] === tempTimeStorage){
                var tempSeatIDSession = obj["seatID"];
                console.log(tempSeatIDSession);
                var tempTimeSession = obj["timeChoice"]; 
                console.log(tempTimeSession);
                var timeBooked; 
                var timeMessage;
              
                var tempParent = $("#"+tempSeatIDSession).parent().parent(); 

                  
                if(tempTimeSession === "10AM"){
                   
                       timeBooked = "_timeAM";
                       timeMessage = "10AM: Unavailable";
                       $("#"+tempSeatIDSession).parent().parent().addClass("taken");
                       $("#"+tempSeatIDSession).parent().parent().removeClass("free");
                      
                   
                }
                
                if(tempTimeSession === "2PM"){

                        timeBooked = "_timePM";
                        timeMessage = "2PM: Unavailable";
                        $("#"+tempSeatIDSession).parent().parent().addClass("taken");
                        $("#"+tempSeatIDSession).parent().parent().removeClass("free");
                           
                }


                document.getElementById(tempSeatIDSession+timeBooked).innerHTML = timeMessage;
               

            }
            else if(obj["dateBooked"] === tempDateStorage && obj["timeChoice"] !== tempTimeStorage){
                var tempSeatIDSession = obj["seatID"];
                console.log(tempSeatIDSession);
                var tempTimeSession = obj["timeChoice"]; 
                console.log(tempTimeSession);
                var timeAlreadyBooked; 
                var timeAlreadyBookedMsg; 
                var timeToBook, timeToBookMessage; 
              
                var tempParent = $("#"+tempSeatIDSession).parent().parent(); 

                if(obj["timeChoice"] == "10AM"){

                       timeAlreadyBooked = "_timeAM";
                       timeAlreadyBookedMsg = "10AM: Unavailable";  

                       timeToBook = "_timePM"; 
                       timeToBookMessage = "2PM: Available"; 
                      
                      $("#"+tempSeatIDSession).parent().parent().removeClass("taken");
                      $("#"+tempSeatIDSession).parent().parent().addClass("free");
                     
                           
                      
                       console.log("timechoice not same as storage");
                   
                }
                
                if(obj["timeChoice"] == "2PM"){

                     timeAlreadyBooked = "_timePM";
                     timeAlreadyBookedMsg = "2PM: Unavailable"; 

                     timeToBook = "_timeAM"; 
                     timeToBookMessage = "10AM: Available"; 
                    
                    $("#"+tempSeatIDSession).parent().parent().removeClass("taken");
                    $("#"+tempSeatIDSession).parent().parent().addClass("free");
                     

                    console.log("timechoice not same as storage");                     
                }


                document.getElementById(tempSeatIDSession+timeToBook).innerHTML = timeToBookMessage; 

                document.getElementById(tempSeatIDSession+timeAlreadyBooked).innerHTML = timeAlreadyBookedMsg; 

            }
            else{
                var tempSeatIDSession = obj["seatID"];
                console.log(tempSeatIDSession);
                var tempTimeSession = obj["timeChoice"]; 
                console.log(tempTimeSession);
                var timeBooked; 
                var timeMessage;
              

               
                if(tempTimeSession === "10AM"){
                    timeBooked = "_timeAM";
                    timeMessage = "10AM: Available"; 
                    $("#"+tempSeatIDSession).parent().parent().removeClass("taken");
                    $("#"+tempSeatIDSession).parent().parent().addClass("free");
                    
                }
                
                if(tempTimeSession === "2PM"){
                    timeBooked = "_timePM";
                    timeMessage = "2PM: Available"; 
                    $("#"+tempSeatIDSession).parent().parent().removeClass("taken");
                     $("#"+tempSeatIDSession).parent().parent().addClass("free");
                    

                }

                document.getElementById(tempSeatIDSession+timeBooked).innerHTML = timeMessage;
            }
        })

    }
    else{
        console.log("sessionStore not created"); 
    }

        
});

$('#btnPrevPg3').click(function(){
    var firstNameStorage = String(localStorage.getItem("firstName"));
    var lastNameStorage = String(localStorage.getItem("lastName"));
    var mobileStorage = String(localStorage.getItem("mobile"));
    var emailStorage = String(localStorage.getItem("email")); 
    var passengersStorage = Number(localStorage.getItem("passengers")); 

    $('#firstNameID').val(firstNameStorage);
    $('#lastNameID').val(lastNameStorage);
    $('#mobileID').val(mobileStorage);
    $('#emailID').val(emailStorage);
    $('#passengerID').val(passengersStorage);

    $('.contactContainer').removeClass("d-none");
    $('.chooseBoatContainer').addClass("d-none"); 
})    

/*********************************************************************** */
/*************************End of Page 3 Section **************************/
/*********************************************************************** */

/*********************************************************************** */
/*************************Tere Boat 4 Section **************************/
/*********************************************************************** */

 /*AJAX Call to tere boat layout */
 const tereRecordSettings = {

    url: "tereRecordsV6.xml",
    type: "GET",
    dataType: "XML",
    success: function(xml){
        
        var timeChoice_storage = localStorage.getItem("timeChoice");
        
  
        console.log(xml); 
        $(xml).find('Row').each(function(num){

            var group = $(this).find('Class').attr("group");
         
            var seatID = $(this).find('ID').text();
                
            var price = $(this).find('Price').text();

            var recordDate = $(this).find('Record').attr("date");
            var timeAM; 
        
            $(this).find('Record').each(function(){ timeAM = ((String($(this).find('TimeAM').text())) == "true") ? true : false ;});
        
            var timePM;
    
            $(this).find('Record').each(function(){ timePM = ((String($(this).find('TimePM').text())) == "true") ? true : false ;});

             var selectedTime = (String(timeChoice_storage) === "timeAM") ? timeAM : timePM; 
            
              var seatStatus; 
              var statusAM = (timeAM) ? "Available" : "Unvailable";
              var statusPM = (timePM) ? "Available" : "Unvailable";
              var visible;

                 if(seatID == "NA"){
                     seatStatus = "hideSeat";
                     visible = "invisible";
                 }
                 else if(!!selectedTime)
                 {
                        seatStatus="free";
                        visible = "visible";
       
                 }
                 else if(!(!!selectedTime)){
                        seatStatus = "taken"; 
                        visible = "visible";
                 }

                    
                var ColString = `<td class="colB ${seatStatus} tooltip1" ">${seatID}<span class="tooltiptext1 ${visible}"><h6 id="${seatID}">${seatID}</h6><p id="${seatID}_price">$${parseFloat(price).toFixed(2)}</p><p id="${seatID}_timeAM">10AM: ${statusAM}</p><p id="${seatID}_timePM">2PM: ${statusPM}</span></td>`;
                
                $("#"+ group).append(ColString);

                
              
        })
      
    }
    
}

//Call tereRecords
function ajaxTere(){
    
    $.ajax(tereRecordSettings); 
}

ajaxTere();


$(document).ajaxSuccess(function(){


  let selection = [];
  selection.length = 0;   

    $('.free').click(function(e){

        var tempTimeChoice = localStorage.getItem("timeChoice"); 
        var getPassengerStore = localStorage.getItem("passengers"); 
        var idClicked = String($(this).find('h6').html());
        console.log(idClicked);  

       if(!($(this).hasClass("taken"))){

          if(!selection.includes(idClicked)){
            $(this).addClass("selected");
            selection.push(idClicked);
           
           }
            else{
            var location = selection.indexOf(idClicked);
            selection.splice(location, 1);
             $(this).removeClass("selected");
            }
            
        }
        localStorage.setItem("selection", JSON.stringify(selection)); 
        selection = [...selection]; 
        console.log(selection); 
        
    });



    $('#btnPrevPgTere').click(function(){
        $('.chooseBoatContainer').removeClass("d-none");
        $('.tereContainer').addClass("d-none"); 
        
        var tempSelection = localStorage.getItem("selection");
        var tempSelectionJSON = JSON.parse(tempSelection);
     
    
       tempSelectionJSON.forEach(obj => {
         $("#"+obj).parent().parent().removeClass("selected"); 
         $("#"+obj).parent().parent().addClass("free"); 
        // console.log(obj);    
        // console.log("selection removed"); 
       })
       selection.splice(0, selection.length); 
       localStorage.setItem("selection", JSON.stringify(selection)); 
       
    
    })
    
    
    $('#btnPrevPgNui').click(function(){
        
            $('.chooseBoatContainer').removeClass("d-none");
            $('.nuiContainer').addClass("d-none"); 
            
        
               
             var tempSelection = localStorage.getItem("selection");
             var tempSelectionJSON = JSON.parse(tempSelection);
         
             if(tempSelectionJSON !== null){

                 tempSelectionJSON.forEach(obj => {
                 $("#"+obj).parent().parent().removeClass("selected"); 
                 $("#"+obj).parent().parent().addClass("free"); 
                 console.log(obj);    
                 console.log("selection removed"); 
                })
                selection.splice(0, selection.length); 
                localStorage.setItem("selection", JSON.stringify(selection));
              
             }
               
               
        })
            
        
})




$('#btnNextPgTere').click(function(){
     /*check if selection amount same as passenger declared */
     var tempSelection = localStorage.getItem("selection");
     var tempSelectionJSON = JSON.parse(tempSelection);
    var getPassengerStore = parseInt(localStorage.getItem("passengers")); 

    if(tempSelectionJSON == null){
        alert('Please select seats'); 
    }
    
    if(tempSelectionJSON.length > getPassengerStore || tempSelectionJSON.length !== getPassengerStore){
            alert(`Selection must equal ${getPassengerStore}`);
    }
    else{
            console.log("selection pass"); 
            $('.tereContainer').addClass("d-none");
            $('.mealContainer').removeClass("d-none");
            $('.weatherContainer').addClass("d-none");
            $('.menuContainer').removeClass("d-none"); 
    }

})
    

$('#btnNextPgNui').click(function(){
    /*check if selection amount same as passenger declared */
    var tempSelection = localStorage.getItem("selection");
    var tempSelectionJSON = JSON.parse(tempSelection);
    var getPassengerStore = parseInt(localStorage.getItem("passengers")); 

    if(tempSelectionJSON == null){
        alert('Please select seats'); 
    }

  
    if(tempSelectionJSON.length > getPassengerStore || tempSelectionJSON.length !== getPassengerStore){
        alert(`Selection must equal ${getPassengerStore}`);
      }
    else{
        console.log("selection pass"); 
        $('.nuiContainer').addClass("d-none");
        $('.mealContainer').removeClass("d-none");
        $('.weatherContainer').addClass("d-none");
        $('.menuContainer').removeClass("d-none"); 
     }   
     
})

/******************************************************************************* */
/*************************End of Tere Boat 4 Section **************************/
/******************************************************************************* */


/*********************************************************************** */
/*************************Nui Boat 4 Section **************************/
/*********************************************************************** */


/*AJAX Call to nui boat layout */
const nuiRecordSettings = {

    url: "nuiRecordsV8.xml",
    type: "GET",
    dataType: "XML",
    success: function(xml){
        
        var timeChoice_storage = localStorage.getItem("timeChoice");

        
        console.log(xml); 
        $(xml).find('Row').each(function(num){

            var group = $(this).find('Class').attr("group");// yes this works to find attribute value
           // console.log(group); 
            var seatID = $(this).find('ID').text();
                
            var price = $(this).find('Price').text();

            var recordDate = $(this).find('Record').attr("date");
            var timeAM; 
        
            $(this).find('Record').each(function(){ timeAM = ((String($(this).find('TimeAM').text())) == "true") ? true : false ;});
        
            var timePM;
    
            $(this).find('Record').each(function(){ timePM = ((String($(this).find('TimePM').text())) == "true") ? true : false ;});

             var selectedTime = (String(timeChoice_storage) === "timeAM") ? timeAM : timePM; 
            
              var seatStatus; 
              var statusAM = (timeAM) ? "Available" : "Unvailable";
              var statusPM = (timePM) ? "Available" : "Unvailable";
              var visible;

                 if(seatID == "NA"){
                     seatStatus = "hideSeat";
                     visible = "invisible";
                 }
                 else if(!!selectedTime)
                 {
                        seatStatus="free";
                        visible = "visible";
       
                 }
                 else if(!(!!selectedTime)){
                        seatStatus = "taken"; 
                        visible = "visible";
                 }

                    
                var ColString = `<td class="colB ${seatStatus} tooltip1" ">${seatID}<span class="tooltiptext1 ${visible}"><h6 id="${seatID}">${seatID}</h6><p id="${seatID}_price">$${parseFloat(price).toFixed(2)}</p><p id="${seatID}_timeAM">10AM: ${statusAM}</p><p id="${seatID}_timePM">2PM: ${statusPM}</span></td>`;
                
                $("#"+ group).append(ColString);

                     
        })
      
    }
    
}

//Call nuiRecords
function ajaxNui(){

    $.ajax(nuiRecordSettings); 

}

ajaxNui();



/******************************************************************************* */
/*************************End of Nui Boat 4 Section **************************/
/******************************************************************************* */


/*********************************************************************** */
/*************************Menu Choice Section   **************************/
/*********************************************************************** */


let menuOrderArray = [
    {   "id": "chickenQty",
        "item":"Chicken Sandwich",
        "qty": 0,
        "price": 3.00
    },
    {   "id": "quicheQty", 
        "item":"Quiche",
        "qty": 0,
        "price": 3.00
    },
    {   "id": "cakeQty", 
        "item":"Coconut Cake",
        "qty": 0,
        "price": 4.00
    },
    {   "id": "iceCreamQty",
        "item":"Vanilla Ice Cream",
        "qty": 0,
        "price": 3.00
    },
    {   "id": "juiceQty", 
        "item":"Orange Juice",
        "qty": 0,
        "price": 3.00
    },
    {   "id": "coffeeQty", 
        "item":"Coffee",
        "qty": 0,
        "price": 3.00
    },
];

$('.menuNumPick').click(function(){

    var orderTotalPrice = document.getElementById("orderTotalPrice");
  
    //Update the menuOrderArray
    // Find the id of the number picker clicked
    var itemID = $(this).attr("id");
    // find the value of the number picker clicked 
    var itemQty = $(this).val(); 

    // place the quantity to the right item in menuOrderArray
    menuOrderArray.forEach(obj => {
        if(obj["id"] === itemID){
           obj["qty"] = itemQty;
        }
    })
    let sumOrder = 0; 

    //Update the sum of the order per click
    menuOrderArray.forEach(obj => {
        var tempProduct = parseFloat(obj["price"]) * parseInt(obj["qty"]);

         sumOrder = sumOrder + tempProduct;
    })
   

    orderTotalPrice.innerHTML = "$ " + String(sumOrder.toFixed(2)); 

    localStorage.setItem("totalOrder", String(sumOrder)); 
    localStorage.setItem("orders", JSON.stringify(menuOrderArray)); 
   
   
});


$('#btnPrevPg5').click(function(){
    var boatStorage = localStorage.getItem("boatChoice");
    console.log("click");
    if(boatStorage === "Tere"){
        $('.tereContainer').removeClass("d-none");
        $('.mealContainer').addClass("d-none"); 
    }
    
    if(boatStorage === "Nui"){
        $('.nuiContainer').removeClass("d-none");
        $('.mealContainer').addClass("d-none"); 
    }
   
});



$('#btnNextPg5').click(function(){
    var dateInterim = localStorage.getItem("dateChoice").split("-");
    var dateLocalStoreFormatted = formatDate(new Date(dateInterim[0], dateInterim[1], dateInterim[2]));
   
    $('.summaryContainer').removeClass("d-none"); 
    $('.mealContainer').addClass("d-none"); 
    $('.menuContainer').addClass("d-none");
    $('.finalImgContainer').removeClass("d-none"); 
   

   // console.log("clicked"); 
    if(localStorage["orders"] === undefined){
        localStorage.setItem("orders", JSON.stringify(menuOrderArray)); 
        console.log("no orders were made"); 
    }
    
    
     /*Fill Contact details */
        document.getElementById("bkFirstNameID").innerHTML = localStorage.getItem("firstName");
        document.getElementById('bkLastNameID').innerHTML = localStorage.getItem("lastName");
        document.getElementById('bkMobileID').innerHTML = localStorage.getItem("mobile");
        document.getElementById('bkEmailID').innerHTML = localStorage.getItem("email");
    
    /*Fill Booking details */
        document.getElementById('bkDateTripID').innerHTML = dateLocalStoreFormatted;
        document.getElementById('bktimeChoiceID').innerHTML = localStorage.getItem("timeChoice");
        document.getElementById('bkPassengersID').innerHTML = String(localStorage.getItem("passengers"));
        document.getElementById('bkBoatID').innerHTML = localStorage.getItem("boatChoice");


    /*Fill Seat Selection */
    var selectionStorageJSON = JSON.parse(localStorage.getItem("selection"));
    var tempSeatTotal = []; 

    $('.seatAllInfoSubDiv').empty(); // remove dummy row 

    selectionStorageJSON.forEach(obj =>{
        var tempSeatID = obj;
        var tempSeatPrice = $('#'+obj).parent().find('#'+obj+"_price").text();
        var tempSeatPrice2 = tempSeatPrice.slice(1,tempSeatPrice.length);
        var tempSeatPriceConverted = parseFloat(tempSeatPrice2);
        tempSeatTotal.push(tempSeatPriceConverted);
        console.log($('#'+obj).parent().find('#'+obj+"_price").html()); 
        
        var seatRowString = ` <div class="row bkDTripDiv"> <div class="col-1 bkSeatNoSubDiv">
        <h4 class="bkLabel">Seat: </h4></div> <div class="col-8 bkSeatNoSubDiv">
        <p id="bk_${tempSeatID}">${tempSeatID}</p></div><div class="col-1 bkSeatPriceSubDiv">
        <h4 class="bkLabel">Price: </h4></div><div class="col-2 bkSeatPriceSubDiv">
        <p id="bkPrice_${tempSeatID}">$ ${tempSeatPriceConverted.toFixed(2)}</p></div></div>`;

        $('.seatAllInfoSubDiv').append(seatRowString); 
    })

    /*Total Seat Cost */
    var tempTotalSeatCost = 0;
    tempSeatTotal.forEach(obj => { tempTotalSeatCost += obj });

    document.getElementById('totalSeatID').innerHTML = "$" + String(tempTotalSeatCost.toFixed(2));

    /*Fill Meal Selection */

    $('.bkMealMainDiv').empty(); // remove dummy row 

    var ordersStorageJSON = JSON.parse(localStorage.getItem("orders")); 
    var tempTotalFoodCost = [];

    ordersStorageJSON.forEach(obj => {
        if(obj["qty"] !== 0){
            var tempFoodName = obj["item"];
            var tempFoodQty = String(obj["qty"]); 
            var tempFoodPrice = parseFloat(obj["price"]);
            var tempFoodPriceString = String(tempFoodPrice);

            var tempProduct = tempFoodPrice * parseInt(tempFoodQty); 

            tempTotalFoodCost.push(tempProduct);

            var mealRowString = `<div class="row bkMealDiv"><div class="col-1 bkMealSubDiv">
            <h4 class="bkLabel">Item: </h4></div><div class="col-3 bkMealSubDiv">
            <p>${tempFoodName}</p></div><div class="col-2 bkFoodQtySubDiv">
            <p>Qty: ${tempFoodQty}</p></div><div class="col-6 bkFoodPriceSubDiv">
            <p>Price: $ ${tempFoodPrice.toFixed(2)}</p></div></div>`;

            $('.bkMealMainDiv').append(mealRowString); 

        }
    })

    /*Total Meal Cost */
    var tempTotalMealCost = 0;
    tempTotalFoodCost.forEach(obj => { tempTotalMealCost += obj});

    document.getElementById('totalMealID').innerHTML = "$" + String(tempTotalMealCost.toFixed(2)); 

    /*Total Booking Cost */
    var totalBookingCost = (parseFloat(tempTotalMealCost) + parseFloat(tempTotalSeatCost)).toFixed(2);
    document.getElementById('totalAllID').innerHTML = "$" + String(totalBookingCost); 


    $('#termsID').attr("checked", false);
    $('#hatID').attr("checked", false); 

    $('#termsID').prop("checked", false);
    $('#hatID').prop("checked", false); 


})


/******************************************************************************* */
/*************************End of Menu Section **************************/
/******************************************************************************* */


/*********************************************************************** */
/*************************Summary Page Section   **************************/
/*********************************************************************** */


$('#btnPrevPg6').click(function(){
    console.log("click");
    $('.summaryContainer').addClass("d-none");
    $('.mealContainer').removeClass("d-none"); 

})

$('#btnNextPg6').click(function(){
    // create array of these seat bookings {dateBook: [yyyy,mm,dd],seatID: , timeChoice: }
    $('.summaryContainer').addClass("d-none");
    $('.successContainer').removeClass("d-none");

    var tempSelection = localStorage.getItem("selection");
    var tempSelectionJSON = JSON.parse(tempSelection);
    
    tempSelectionJSON.forEach(obj => {
        $("#"+obj).parent().parent().removeClass("selected"); 
        $("#"+obj).parent().parent().addClass("free"); 
        console.log(obj);    
        console.log("selection removed"); 
    })
  //  selection.splice(0, selection.length); 
        
    var tempBoatChoice = (localStorage.getItem("boatChoice")).toLowerCase();
    $('.'+tempBoatChoice+"Div").removeClass("selectedBoat"); 

    let dateTodayStore =  getSystemDate();
   // let dateTodayArr = dateTodayStore.split("-"); 
    var sessionStore = [];
    var timeChoiceStore = localStorage.getItem("timeChoice");

    tempSelectionJSON.forEach(obj => {
        var tempSeatIDStore = obj;

        var seatStore = {"dateBooked": String(dateTodayStore), "seatID": String(tempSeatIDStore), "timeChoice" : String(timeChoiceStore)};
        sessionStore.push(seatStore); 

    })

 /* Store the session events in an array and store in the document */   
    try{
        var sessionStoreOld = $('#sessionID').text();
        var sessionStoreOldJSON = JSON.parse(sessionStoreOld); 
        console.log("sessionStoreOld: ", sessionStoreOld);
        console.log("sessionStoreOldJSON", sessionStoreOldJSON);
        sessionStore = [...sessionStore, ...sessionStoreOldJSON];
    }
    catch{
        console.log("session not created");
    }
    
    
    document.getElementById('sessionID').innerHTML = JSON.stringify(sessionStore);
    
   

})



// Reset form
$('#btnEndForm').click(function(){
    $('.successContainer').addClass("d-none");
    $('.bookingPg1').removeClass("d-none");
    $('.finalImgContainer').addClass("d-none");
    $('.weatherContainer').removeClass("d-none"); 

    
    localStorage.clear(); 
    
    let dateToday =  getSystemDate(); 
    localStorage.setItem("timeChoice", "10AM"); 
    localStorage.setItem("dateChoice", dateToday); 

    ajaxForecast();
    ajaxToday();
    ajaxMenu();
    

    $('input').val(""); 
    $('#dateChoice').val(dateToday); 
    $('#timeChoice').val("10AM"); 

   
    menuOrderArray = [
        {   "id": "chickenQty",
            "item":"Chicken Sandwich",
            "qty": 0,
            "price": 3.00
        },
        {   "id": "quicheQty", 
            "item":"Quiche",
            "qty": 0,
            "price": 3.00
        },
        {   "id": "cakeQty", 
            "item":"Coconut Cake",
            "qty": 0,
            "price": 4.00
        },
        {   "id": "iceCreamQty",
            "item":"Vanilla Ice Cream",
            "qty": 0,
            "price": 3.00
        },
        {   "id": "juiceQty", 
            "item":"Orange Juice",
            "qty": 0,
            "price": 3.00
        },
        {   "id": "coffeeQty", 
            "item":"Coffee",
            "qty": 0,
            "price": 3.00
        },
    ]; 

    
})




}); 
