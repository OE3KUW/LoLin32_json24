let gateway = `ws://${window.location.hostname}/ws`;
let websocket;
window.addEventListener('load', onload);

function onload(event) {
    initWebSocket();
    initButton();
    getCurrentValue();
}

function initWebSocket() {
    console.log('open a WebSocket connection. . . ');
    websocket= new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

function onMessage(event) {

    if (event.data.charAt(0) == 'O')  // ON / OFF
    {
        console.log("ON | OFF");
        document.getElementById('state').innerHTML = event.data;
    }  
    if (event.data.charAt(0) == 'O')  // ON / OFF
    {
        console.log("ON | OFF");
        document.getElementById('state').innerHTML = event.data;
    }    
    
    if (event.data.charAt(0) == 'B')  // BAT
    {
        len = event.data.length;
        text = event.data.substring(3, len);  // von bis! 
        console.log("Battery: ");
        console.log(text);
        document.getElementById('battery').innerHTML = text;

        let svgBatteryGreen = document.getElementById('batteryGreen');
        let level = parseFloat(text);
        level = level * 57;  // max-width( = 300) / maxVoltage (5.2V)
        let batteryGreen = parseInt(level);
        console.log(batteryGreen);
        svgBatteryGreen.setAttribute("width", batteryGreen);
    }

    if (event.data.charAt(0) == 's')  // sLa
    {
        len = event.data.length;
        text = event.data.substring(3, len);  
        //sliderLevel = document.getElementById("pwmSlider");
        //sliderLevel.setAttribute("value", text);

        document.getElementById("pwmSlider").value = text;

        document.getElementById("textSliderValue").innerHTML = text;
        console.log("new sLa");
        console.log(text);
      
    }  
}

function initButton() {
    document.getElementById('bON').addEventListener('click', toggleON);
    document.getElementById('bOFF').addEventListener('click', toggleOFF);
}

function toggleON(event) {
    console.log("toggleON");
    websocket.send('bON'); 
}

function toggleOFF(event) {
    console.log("toggleOFF");
    websocket.send('bOFF'); 
}

function getCurrentValue()
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200)
        {
            document.getElementById("pwmSlider").value = this.responseText;
        }
    };
    xhr.open("GET", "/currentValue", true);
    console.log("xhr.send");
    xhr.send();
}
function updateSliderPWM(element) {
    let sliderValue = document.getElementById("pwmSlider").value;
    sliderValue = "sLa" + sliderValue;
    console.log(sliderValue);
    websocket.send(sliderValue);
}
