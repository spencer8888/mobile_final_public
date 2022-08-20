/*
---------------------------------------------------------
-----Password Code
---------------------------------------------------------
*/
function verifyPassword(){
    var password = getPassword();
    console.log("getPassword:",password);
    console.log("passcode value:",document.getElementById("passcode").value);
    console.log("storage password:",JSON.parse(localStorage.getItem("boiler")));
    if(document.getElementById("passcode").value==password){
        location.replace("#pageMenu");
    }
    else{
        alert("Incorrect password, please try again.");
    }
}
   
function getPassword(){
    if (typeof(Storage) == "undefined"){	
        alert("Your Browser does not support HTML5 localStorage. Try upgrading.");
    }
    else if (localStorage.getItem("boiler") != null){
        return JSON.parse(localStorage.getItem("boiler")).NewPassword;
    }
    else{
        return "password";
    }
}
/*
---------------------------------------------------------
-----Boiler Info Code
---------------------------------------------------------
*/
function getBoilerForm(){
   saveBoilerForm();
   return true; 
}

function saveBoilerForm(){
if(checkBoilerForm()){
    var boiler = {
        "BoilerID" : $("#txtBoilerID").val(),
        "DateOfPurchase" : $("#datePurchaseDate").val(),
        "NumberMaxPressure" : $("#numberMaxPressure").val(),
        "NumberMaxTemp" : $("#numberMaxTemp").val(),
        "NewPassword" : $("#changePassword").val(),
    };
    try{
        localStorage.setItem("boiler", JSON.stringify(boiler));
        alert("Saving Information");
        $.mobile.changePage("#pageMenu");
    }
    catch(e){
    /* Google browsers use different error 
    * constant
    */
        if (window.navigator.vendor==="Google Inc."){
            if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR){
            alert("Error: Loading from local storage.");
        }
        console.log(e);
    } 
}
else{
    alert("Please complete the form properly.");
}
}

function checkBoilerForm(){
var d = new Date();
var month = d.getMonth()+1;
var date = d.getDate();
var year = d.getFullYear();

if(($("#txtBoilerID").val() != "") &&
    ($("#datePurchaseDate").val() != "") &&
    ($("#numberMaxPressure").val() != "") &&
    ($("#numberMaxTemp").val() != "")){
    console.log("Boiler info correct")
    return true;
}
else{
    return false;
}
}

function showBoilerForm(){
try{
    var boiler = JSON.parse(localStorage.getItem("boiler"));
}
catch(e){
    /* Google browsers use different error 
    * constant
    */
        if (window.navigator.vendor==="Google Inc."){
            if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR){
            alert("Error: Loading from local storage.");
        }
        console.log(e);
    } 
if(boiler != null){
document.getElementById("boilerID").innerHTML = boiler.BoilerID;
document.getElementById("purchaseDate").innerHTML = boiler.DateOfPurchase;
$("#maxPressure").html(boiler.NumberMaxPressure);
$("#maxTemp").html(boiler.NumberMaxTemp);
$("#displayPassword").html(boiler.NewPassword);
}
}
/*
---------------------------------------------------------
-----Boiler Records Code
---------------------------------------------------------
*/
function loadBoilerInformation(){
try{
    var boiler=JSON.parse(localStorage.getItem("boiler"));
}
catch(e){
    /* Google browsers use different error 
    * constant
    */
        if (window.navigator.vendor==="Google Inc."){
            if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR){
            alert("Error: Loading from local storage.");
        }
        console.log(e);
    }
if(boiler != null){
    $("#divUserSection").empty();
    $("#divUserSection").append(
        "Boiler ID:"+boiler.BoilerID+
        "<br>Date of Purchase: "+boiler.DateOfPurchase+
        "<br>Maximum Pressure: "+boiler.NumberMaxPressure+" PSI"+
        "<br>Maximum Temperature: "+boiler.NumberMaxTemp+"&#8457;");
    $("#divUserSection").append("<br><a href ='#pageBoilerInfo' data-mini='true' id='btnProfile' data-role='button' data-icon='edit' data-iconpos='left' data-inline='true' >Edit Profile</a>");
    $('#btnProfile').button();
}
}

/*Runs the function to diaplsy the user information, history, graph or 
*suggestions, every time their div is shown.
*/ 
$(document).on("pageshow", function(){
if($('.ui-page-active').attr('id')=="pageBoilerInfo"){
    showBoilerForm();
}
else if($('.ui-page-active').attr('id')=="pageRecords"){
    loadBoilerInformation();
    listRecords();
}
else if($('.ui-page-active').attr('id')=="pageAdvice"){
    advicePage();
    resizeGraph();
}
else if($('.ui-page-active').attr('id')=="pageGraph"){
    drawGraph();
    resizeGraph();
}
});
/*The value of the Submit Record button is used
*to determine which operation should be
*performed.
*/
$("#btnAddRecord").click(function(){
    $("#btnSubmitRecord").val("Add");
    if($("btnSubmitRecord").hasClass("btn-ui-hidden")){
        $("#btnSubmitRecord").button("refresh");
    }
});

$("#pageNewRecordForm").on("pageshow",function(){
//We need to know if we are editing or adding a record everytime we show this page
    var formOperation=$("btnSubmitRecord").val()

    if(formOperation=="Add"){
        clearRecordForm();
    }
    else if(formOperation=="Edit"){
        //If we are editing a record we load the stored data in the form.
        showRecordForm($("#btnSubmitRecord").attr("indexToEdit"));
    }
});

$("#frmNewRecordForm").submit(function(){
var formOperation=$("btnSubmitRecord").val();

if(formOperation=="Add"){
    addRecord();
    $.mobile.changePage("#pageRecords");
}
else if(formOperation=="Edit"){
    editRecord($("#btnSubmitRecord").attr("indexToEdit"));
    $.mobile.changePage("#pageRecords");
    $("#btnSubmitRecord").removeAttr("indexToEdit");
}

/*Must return false, or else submitting form
* results in reloading the page
*/
return false;
});

function addRecord(){
if(checkBoilerRecord()){
    var record={
        "RecordPressure" : $('#numberRecordPressure').val(),
        "RecordTemperature" : $('#numberRecordTemp').val()
    };
    try{
        var tblRecords=JSON.parse(localStorage.getItem("tblRecords"));
        if(tblRecords==null){
            tblRecords=[];
        }
        tblRecords.push(record);
        localStorage.setItem("tblRecords", JSON.stringify(tblRecords));
        alert("Saving Information");
        clearRecordForm();
        listRecords();
    }
    catch(e){
        /* Google browsers use different error 
        * constant
        */
            if (window.navigator.vendor==="Google Inc."){
                if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                    alert("Error: Local Storage limit exceeded.");
                }
            }
            else if(e == QUOTA_EXCEEDED_ERR){
                alert("Error: Loading from local storage.");
            }
            console.log(e);
    }
}
else{
    alert("Please complete the form properly");
}
return true;
}
/* 
*  Checks that users have entered all valid info.
*/
function checkRecordForm(){
if(($("#numberRecordPressure").val() != "") &&
    ($("#numberRecordTemp").val() != "")){
    return true;
}
else{
    return false;
} 
}

function listRecords(){
try{
    var tblRecords=JSON.parse(localStorage.getItem("tblRecords"));
}
catch(e){
    /* Google browsers use different error 
    * constant
    */
        if (window.navigator.vendor==="Google Inc."){
            if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR){
            alert("Error: Loading from local storage.");
        }
        console.log(e);
}
//Load previous records, if they exist.
if(tblRecords !=null){
    //Sort By...
    //tblRecords.sort(comparesDates);
    
    //Initializing the Table
    $('#tblRecords').html(
        "<thead>"+
        "   <tr>"+
        "       <th><abbr title='Recorded Pressure'></abbr></th>"+
        "       <th><abbr title='Recorded Temperature'></abbr></th>"+
        "       <th>Edit / Delete</th>"+
        "   </tr>"+
        "</thead>"+
        "<tbody>"+
        "</tbody>"
    );
    //Loop to insert the each record in the table
    for(var i=0;i<tblRecords.length;i++){
        var rec=tblRecords[i]
        $("#tblRecords tbody").append("</tr"+
            " <td>"+rec.RecordPressure+"/td>"+
            " <td>"+rec.RecordTemperature+"/td>"+
            " <td><a data-inline='true' data-mini='true' data-role='button' href='#pageNewRecordForm' onclick='callEdit("+i+")' data-icon='edit' data-iconpos='notext'></a>"+
            "     <a data-inline='true' data-mini='true' data-role='button' href='#' onclick='callDelete("+i+")' data-icon='delete' data-iconpos='notext'></a></td>"+
            "</tr");
    }
    $('#tblRecords [data-role="button"]').button();       
}
else{
    $("#tblRecords").html("");
}
return true;
}

function callEdit(index){
$("#btnSubmitRecord").attr("indexToEdit", index);
$("#btnSubmitRecord").val("Edit");
if($("btnSubmitRecord").hasClass("btn-ui-hidden")){
    $("#btnSubmitRecord").button("refresh");
}
}

$("#pageNewRecordForm").on("pageshow", function(){
var formOperation=$("#btnSubmitRecord").val();

if(formOperation=="Add"){
    clearRecordForm();
}
else if(formOperation=="Edit"){
    showRecordForm($("#btnSubmitRecord").attr("indexToEdit"));
}
});

$("#frmNewRecordForm").submit(function(){
var formOperation=$("#btnSubmitRecord").val();

if(formOperation=="Add"){
    addRecord();
    $.mobile.changePage("#pageRecords");
}
else if(formOperation=="Edit"){
    editRecord($("#btnSubmitRecord").attr("indexToEdit"));
    $.mobile.changePage("#pageRecords");
    $("#btnSubmitRecord").removeAttr("indexToEdit");
}
return false;
});

function editRecord(index){
if(checkRecordForm){
    try{
        var tblRecords=JSON.parse(localStorage.getItem("tblRecords"));
        tblRecords[index] ={
            "Pressure"      :   $('#numberRecordPressure').val(),
            "temperature"   :   $('#numberRecordTemp').val()
        };
        localStorage.setItem("tblRecords", JSON.stringify(tblRecords));
        alert("Saving Information");
        clearRecordForm();
        listRecords();
    }
    catch(e){
        /* Google browsers use different error 
        * constant
        */
            if (window.navigator.vendor==="Google Inc."){
                if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                    alert("Error: Local Storage limit exceeded.");
                }
            }
            else if(e == QUOTA_EXCEEDED_ERR){
                alert("Error: Loading from local storage.");
            }
            console.log(e);
    }
}
else{
    alert("Please complete the form properly.");
}
}

function clearRecordForm(){
$('#numberRecordPressure').val("");
$('#numberRecordTemp').val("");
return true;
}

function showRecordForm(index){
try{
    var tblRecords=JSON.parse(localStorage.getItem("tblRecords"));
    var rec=tblRecords[index];
    $('#numberRecordPressure').val(rec.RecordPressure);
    $('#numberRecordTemp').val(rec.RecordTemperature);
}
catch(e){
    /* Google browsers use different error 
    * constant
    */
        if (window.navigator.vendor==="Google Inc."){
            if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR){
            alert("Error: Loading from local storage.");
        }
        console.log(e);
}
}

function deleteRecord(index){
try{
    var tblRecords=JSON.parse(localStorage.getItem("tblRecords"));
    tblRecords.splice(index, 1);
    if(tblRecords.length==0){
        localStorage.removeItem("tblRecords");
    }
    else{
        localStorage.setItem("tblRecords", JSON.stringify(tblRecords));
    }
}
catch(e){
    /* Google browsers use different error 
    * constant
    */
        if (window.navigator.vendor==="Google Inc."){
            if(e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR){
            alert("Error: Loading from local storage.");
        }
        console.log(e);
}
}

function callDelete(index){
deleteRecord();
listRecords();
}

$("#btnClearHistory").click(function(){
localStorage.removeItem("tblRecords");
listRecords();
alert("All records have been deleted.");
});


/*
------------Advice Page-----------
*/

function advicePage(){

    if(localStorage.getItem("tblRecords")===null){
        alert("No Records exist,");
        
        $(location).attr("href", "#pageMenu");
    }
    else{
        var boiler=JSON.parse(localStorage.getItem("boiler"));
        //tblRecords.sort()
        var i=tblRecords.length-1;
        var temperature=tblRecords[i].RecordTemperature
        var c=document.getElementById("AdviceCanvas");
        var ctx=c.getContext("2d");
        ctx.fillStyle="#c0c0c0";
        ctx.font="22px Arial";
        drawAdviceCanvas(ctx,RecordTemperature, temperature)
    }   
}

function drawAdviceCanvas(ctx, RecordTemperature, temperature){
    ctx.font="22px Arial";
    ctx.fillStyle="black";
    ctx.fillText("Your current temperature is " + temperature + ".");

    if (RecordTemperature < 70){
        ctx.fillText("The temperature is NORMAL");
        levelAwrite(ctx,temperature);
        levelAmeter(ctx,temperature);
    }
    else if (RecordTemperature >= 70 && RecordTemperature <= 140){
        ctx.fillText("The temperature is MODERATE");
        levelBwrite(ctx,temperature);
        levelBmeter(ctx,temperature);
    }
    else if (RecordTemperature > 140){
        ctx.fillText("The temperature is HIGH");
        levelCwrite(ctx,temperature);
        levelCmeter(ctx,temperature);
    }
}

function levelAwrite(ctx,temperature){
    if (temperature < 70){
        writeAdvice(ctx,"green");
    }
    else if (temperature >= 70 && RecordTemperature <= 140){
        writeAdvice(ctx,"yellow");
    }
    else(temperature > 140)
        writeAdvice(ctx,"red");
    
}

function writeAdvice(){
    var adviceLine1 = "";
    var adviceLine2 = "";
    if(level=="red"){
        adviceLine1="Please attend to Boiler.";
        adviceLine2="Temperature is too high.";
    }
    else if(level=="yellow"){
        adviceLine1="Monitor the Boiler.";
        adviceLine2="Temperature is elevated.";
    }
    else if(level=="green"){
        adviceLine1="The Boiler temperature is normal.";
        adviceLine2="Temperature is normal.";
    }
    ctx.fillText("Your Temperature is "+ level + ".");
    ctx.fillText(adviceLine1, 25, 410);
    ctx.fillText(adviceLine2, 25, 440);
}

function levelAMeter(ctx,temperature){
    if(temperature < 70){
        var cg=new RGraph.CornerGauge("AdviceCanvas", 0, 3, temperature).Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5,"yellow"], [0.01, 0.1, "#0f0"]])
    }
    else{
        var cg=new RGraph.CornerGauge("AdviceCanvas", 0, temperature, temperature).Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5,"yellow"], [0.01, 0.1, "#0f0"]])
    }
    drawMeter(cg);
}

function levelBMeter(ctx,temperature){
    if(temperature >= 70 && temperature <= 140){
        var bcg=new RGraph.CornerGauge("AdviceCanvas", 0, 3, temperature).Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5,"yellow"], [0.01, 0.1, "#0f0"]])
    }
    else{
        var bcg=new RGraph.CornerGauge("AdviceCanvas", 0, temperature, temperature).Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5,"yellow"], [0.01, 0.1, "#0f0"]])
    }
    drawMeter(bcg);
}

function levelCMeter(ctx,temperature){
    if(temperature > 140){
        var ccg=new RGraph.CornerGauge("AdviceCanvas", 0, 3, temperature).Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5,"yellow"], [0.01, 0.1, "#0f0"]])
    }
    else{
        var ccg=new RGraph.CornerGauge("AdviceCanvas", 0, temperature, temperature).Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5,"yellow"], [0.01, 0.1, "#0f0"]])
    }
    drawMeter(ccg);
}

function drawMeter (g){
    g.Set("chart.value.text.units.post", "&#8457;")
        .Set("chart.value.text.boxed", false) 
        .Set("chart.value.text.size", 14) 
        .Set("chart.value.text. font", "Verdana") 
        .Set("chart.value.text.bold", true) 
        .Set("chart.value.text.decimals", 2) 
        .Set("chart.shadow.offsetx", 5) 
        .Set("chart.shadow.offsety", 5) 
        .Set("chart.scale.decimals", 2) 
        .Set("chart.title", "TEMPERATURE LEVEL")
        .Set("chart.radius", 250) 
        .Set ("chart.centerx", 50)
        .Set("chart.centery", 250) 
        .Draw();
}

function resizeGraph(){
    if($(window).width() < 700){
        $("#GraphCanvas").css({"width":$(window).width() - 50});
        $("#AdviceCanvas").css({"width":$(window).width() - 50});
    }
}

function drawGraph(){
    if(localStorage.getItem("tblRecords") === null){
        alert("No records exist.");

        $(location).attr("href", "#pageMenu");
    }
    else{
        setupCanvas();

        var TEMParr = new Array();
        var Datearr = new Array();
        getTEMPhistory(TEMParr,Datearr);

        var tempLower = new Array(2);
        var tempUpper = new Array(2);
        getTEMPbounds(tempLower, tempUpper);

        drawLines(TEMParr, tempUpper, tempLower, Datearr);
        labelAxes();
    }
}

function setupCanvas(){
    var c=document.getElementById("GraphCanvas");
    var ctx=c.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 500, 500);
}

function getTEMPhistory(TEMParr, Datearr){
    var tblRecords = Json.parse(localStorage.getItem("tblRecords"));

    tblRecords.sort(compareDates);

    for(var i=0; i< tblRecords.length; i++){
        var date = new Date(tblRecords[i].Date);

        var m = date.getMonth() + 1;
        var d = date.getDate() +1;

        Datearr[i] = (m + "/" + d);

        TEMParr[i = parseFloat(tblRecords[i.temperature])]
    }
}

function getTEMPbounds(){
    var boiler = JSON.parse(localStorage.getItem("boiler"));
    var TEMPlevel = boiler.RecordTemperature;

    if (TEMPlevel == "StageA"){
        tempUpper[0] = tempUpper[1] = 0.1;
        tempLower[0] = tempLower[1] = 0.01;
    }
    else if (TEMPlevel == "StageB"){
        tempUpper[0] = tempUpper[1] = 0.5;
        tempLower[0] = tempLower[1] = 0.1;
    }
    else if (TEMPlevel == "StageC"){
        tempUpper[0] = tempUpper[1] = 2.0;
        tempLower[0] = tempLower[1] = 0.35;
    }
}

function drawLines (TSHarr, tshUpper, tshLower, Datearr){
    var TSHline=new RGraph.Line ("GraphCanvas", TEMParr, tempUpper, tempLower)
        .Set("labels", Datearr)
        .Set("colors", ("blue", "green", "green")) 
        .Set("shadow", true) .Set ("shadow.offsetx", 1) 
        .Set("shadow.offsety", 1) 
        .Set("linewidth", 1) 
        .Set("numxticks", 6) 
        .Set("scale.decimals", 2) 
        .Set("xaxispos", "bottom")
        .Set("gutter.left", 40) 
        .Set("tickmarks", "filledcircle") 
        .Set("ticksize", 5)
        .Set("chart. labels.ingraph"[["TEMP", "blue", "yellow", 1, 80]]) 
        .Set("chart.title", "TEMP") 
        .Draw();
}

function labelAxes (){
    var c = document.getElementById("GraphCanvas"); 
    var ctx=c.getContext("20"); 
    ctx. font="11px Georgia"; 
    ctx.fillStyle="green"; 
    ctx. fillText ("Date (MM/DD)", 400, 470); 
    ctx.rotate (-Math.PI/2); 
    ctx.textAlign="center"; 
    ctx.fillText ("TEMP Value", -250, 10);
}