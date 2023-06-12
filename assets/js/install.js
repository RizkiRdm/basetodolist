let deferredPrompt;

window.addEventListener("beforeinstallprompt", function (event) {
	// Prevent the default prompt
	event.preventDefault();

	// Store the event for later use
	deferredPrompt = event;

	// Show your custom "Add to Home Screen" button or UI
	showAddToHomeScreenUI();
});

function showAddToHomeScreenUI() {
	// Create a toast element
	const toast = document.createElement("div");
	toast.classList.add("toast");
	toast.textContent = "Add to Home Screen";

	// Append the toast to the document body
	document.body.appendChild(toast);

	// After a certain duration, remove the toast
	setTimeout(function () {
		toast.remove();
	}, 3000); // Display the toast for 3 seconds
}

function addToHomeScreen() {
	// Show the prompt to install the PWA
	deferredPrompt.prompt();

	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice.then(function (choiceResult) {
		if (choiceResult.outcome === "accepted") {
			console.log("User accepted the A2HS prompt");
		} else {
			console.log("User dismissed the A2HS prompt");
		}

		// Clear the deferred prompt variable
		deferredPrompt = null;
	});
}
