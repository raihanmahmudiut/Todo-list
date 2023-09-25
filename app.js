const addTaskButton = document.getElementById("addTask");
const removeTaskButton = document.getElementById("removeTask");
const clearCompletedTaskButton = document.getElementById("clearCompleted");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const todoContainer = document.getElementById("todoContainer");

const noTasksMessage = document.createElement("div");
noTasksMessage.innerHTML = "No todos to do";
noTasksMessage.classList.add("no-tasks-message");

window.addEventListener("load", () => {
	const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

	storedTasks.forEach((storedTask) => {
		addTask(storedTask.text);
	});
});

function addTask(taskText) {
	if (taskText !== "") {
		const taskItem = document.createElement("div");

		const taskCheckBox = document.createElement("input");
		taskCheckBox.type = "checkbox";
		taskItem.appendChild(taskCheckBox);

		const taskTextSpan = document.createElement("span");
		taskTextSpan.textContent = taskText;
		taskItem.appendChild(taskTextSpan);

		taskCheckBox.addEventListener("change", () => {
			taskTextSpan.classList.toggle("completed", taskCheckBox.checked);
		});

		const removeButton = document.createElement("button");
		removeButton.type = "button";
		removeButton.textContent = "Remove Task";
		removeButton.addEventListener("click", () => {
			// Select the corresponding task item for removal
			taskList.removeChild(taskItem);
			updateTaskListVisibility();
			saveToLocalStorage();
		});
		taskItem.appendChild(removeButton);
		const editButton = document.createElement("button");
		editButton.type = "button";
		editButton.textContent = "Edit Task";

		editButton.addEventListener("click", () => {
			const newTaskText = prompt("Edit the task:", taskText);
			if (newTaskText !== null) {
				taskTextSpan.textContent = newTaskText;
			}
		});
		taskItem.appendChild(editButton);

		taskItem.classList.add("task-item");
		taskList.appendChild(taskItem);

		taskInput.value = "";

		updateTaskListVisibility();
		saveToLocalStorage();
	}
}

addTaskButton.addEventListener("click", () => {
	const taskText = taskInput.value.trim();
	addTask(taskText);
});

taskInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		const taskText = taskInput.value.trim();
		addTask(taskText);
	}
});

function clearCompletedTasks() {
	const completedTasks = document.querySelectorAll(".completed");
	completedTasks.forEach((taskCheckBox) => {
		const taskItem = taskCheckBox.parentElement;
		taskList.removeChild(taskItem);
	});

	updateTaskListVisibility();
	saveToLocalStorage();
}

clearCompletedTaskButton.addEventListener("click", clearCompletedTasks);

// Function to update task list visibility based on the number of tasks
function updateTaskListVisibility() {
	if (taskList.children.length === 0) {
		taskList.style.display = "none";
		if (!todoContainer.contains(noTasksMessage)) {
			todoContainer.insertBefore(noTasksMessage, todoContainer.firstChild);
		}
	} else {
		taskList.style.display = "block";
		if (todoContainer.contains(noTasksMessage)) {
			todoContainer.removeChild(noTasksMessage);
		}
	}
}

// Initial check for task list visibility
updateTaskListVisibility();

function saveToLocalStorage() {
	const tasks = Array.from(document.querySelectorAll(".task-item")).map(
		(taskItem) => ({
			text: taskItem.querySelector("span").textContent,
			completed: taskItem.querySelector("input[type='checkbox']").checked,
		})
	);
	localStorage.setItem("tasks", JSON.stringify(tasks));
}
