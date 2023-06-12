// Select all DOM elements
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const modal = document.querySelector("[data-info-modal]");
const splashScreen = document.querySelector(".splash-screen");

let taskItem = [];
let taskRemover = [];

// Store current date
const date = new Date();

// Import task complete sound
const taskCompleteSound = new Audio("/assets/sounds/task-complete.mp3");

// Convert weekday number to weekday name
const getWeekdayName = function (dayNumber) {
	const weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	return weekdays[dayNumber] || "Not a valid day";
};

// Convert month number to month name
const getMonthName = function (monthNumber) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return months[monthNumber] || "Not a valid month";
};

// Store weekday name, month name, and month-of-day number
const weekdayName = getWeekdayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// Update header time date
const headerTime = document.querySelector("[data-header-time]");
headerTime.textContent = `${weekdayName}, ${monthName}, ${monthOfDay}`;

// Toggle active class on element
const toggleActiveClass = function (elem) {
	elem.classList.toggle("active");
};

// Toggle active class on multiple elements
const addEventOnMultiElem = function (elems, event) {
	elems.forEach(function (elem) {
		elem.addEventListener("click", event);
	});
};

// Create taskItem element node and return it
const createTaskItemNode = function (taskText) {
	const createTaskItem = document.createElement("li");
	createTaskItem.classList.add("task-item");
	createTaskItem.setAttribute("data-task-item", "");

	createTaskItem.innerHTML = `
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>
    <p class="item-text">${taskText}</p>
    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>
  `;

	return createTaskItem;
};

// Task input validation
const validateTaskInput = function (taskIsValid) {
	if (taskIsValid) {
		// If task exists, add new task at the bottom
		if (taskList.childElementCount > 0) {
			taskList.insertBefore(createTaskItemNode(taskInput.value), taskItem[0]);
		} else {
			taskList.appendChild(createTaskItemNode(taskInput.value));
		}

		// Clear task input field after adding a task
		taskInput.value = "";

		// Hide welcome note
		welcomeNote.classList.add("hide");

		// Update taskItem DOM selection
		taskItem = document.querySelectorAll("[data-task-item]");
		taskRemover = document.querySelectorAll("[data-task-remove]");
	} else {
		// If user did not enter a task
		console.log("Please write something!");
	}
};

// If there are existing tasks, hide welcome note
const toggleWelcomeNote = function () {
	if (taskList.childElementCount > 0) {
		welcomeNote.classList.add("hide");
	} else {
		welcomeNote.classList.remove("hide");
	}
};

// Remove task when click delete button or check button
const removeTask = function () {
	const parentElement = this.parentElement;

	if (this.dataset.taskRemove === "complete") {
		parentElement.classList.add("complete");
		taskCompleteSound.play();

		setTimeout(function () {
			parentElement.remove();
			toggleWelcomeNote();
			saveTasks();
		}, 250);
	} else {
		parentElement.remove();
		toggleWelcomeNote();
		saveTasks();
	}
};

// Add task function
const addTask = function () {
	validateTaskInput(taskInput.value);
	addEventOnMultiElem(taskRemover, removeTask);
	saveTasks();
};

// Add keypress listener on task input
taskInput.addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		addTask();
	}
});

// Toggle active class on menu when clicked
const toggleMenu = function () {
	toggleActiveClass(menu);
};
addEventOnMultiElem(menuTogglers, toggleMenu);

// Toggle active class on modal when clicked
const toggleModal = function () {
	toggleActiveClass(modal);
};
addEventOnMultiElem(modalTogglers, toggleModal);

// Add "loaded" class on body after window load
window.addEventListener("load", function () {
	splashScreen.classList.add("hidden");
	document.body.classList.add("loaded");
	loadTasks();
});

// Change body background when theme button is clicked
const changeTheme = function () {
	const hueValue = this.dataset.hue;
	document.documentElement.style.setProperty("--hue", hueValue);

	themeBtns.forEach(function (btn) {
		btn.classList.remove("active");
	});

	this.classList.add("active");
};
addEventOnMultiElem(themeBtns, changeTheme);

// Local storage functions

// Save tasks
const saveTasks = function () {
	const tasks = [];
	taskItem.forEach(function (task) {
		tasks.push(task.querySelector(".item-text").textContent);
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Load tasks
const loadTasks = function () {
	const tasks = JSON.parse(localStorage.getItem("tasks"));
	if (tasks) {
		tasks.forEach(function (taskText) {
			taskList.appendChild(createTaskItemNode(taskText));
		});
		taskItem = document.querySelectorAll("[data-task-item]");
		taskRemover = document.querySelectorAll("[data-task-remove]");
		toggleWelcomeNote();
	}
};
