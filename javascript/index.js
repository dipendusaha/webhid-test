document.getElementById('date').innerHTML = new Date().toDateString();

const consentButton = document.getElementById('consent-button');

const deviceFilters = [{ }];
//const deviceFilters = [{ usagePage: 0xFF00}];
//const deviceFilters = [{ usagePage: 0x0b}];
//const deviceFilters = [{ usagePage: 0x0b, usage: 0x20 }];


function handleConnectedDevice(e) {
  console.log("Device connected: " + e.device.productName);
}

function handleDisconnectedDevice(e) {
  console.log("Device disconnected: " + e.device.productName);
}

function handleInputReport(e) {
  console.log(e.device.productName + ": got input report " + e.reportId);
  console.log(new Uint8Array(e.data.buffer));
}


function listCollections(device){
	for (let collection of device.collections) {
	  // A HID collection includes usage, usage page, reports, and subcollections.
	  console.log(`Usage: ` + "0x" + collection.usage.toString(16));
	  console.log(`Usage Page: ` + "0x" + collection.usagePage.toString(16));

	  for (let inputReport of collection.inputReports) {
		console.log(` Input report: ${inputReport.reportId}`);
		// Loop through inputReport.items
		for (let item of inputReport.items) {
			// Loop through item.usages
			for (let usage of item.usages) {
				console.log(`  Usage: ` + "0x" + usage.toString(16));
			}		
		}
	  }

	  for (let outputReport of collection.outputReports) {
		console.log(` Output report: ${outputReport.reportId}`);
		// Loop through outputReport.items
	  }

	  for (let featureReport of collection.featureReports) {
		console.log(` Feature report: ${featureReport.reportId}`);
		// Loop through featureReport.items
	  }

	  // Loop through subcollections with collection.children
	}
}


function onPageLoad(){
	navigator.hid.addEventListener("connect", handleConnectedDevice);
	navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);
}

window.onload = function() {
  onPageLoad();
};

consentButton.addEventListener('click', async () => {
  let device;

  try {
    const devices = await navigator.hid.requestDevice({ filters: deviceFilters });
	if (devices.length == 0) 
		return;
    
	device = devices[0];

	listCollections(device);

	device.opened || await device.open();

	device.addEventListener('inputreport', handleInputReport);
  } catch (error) {
    console.warn('No device access granted', error);
    return;
  }
});
