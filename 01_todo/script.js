document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const taskBtn = document.getElementById("task-btn");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTask(task));

  //to add task we have to click add task button on screen
  taskBtn.addEventListener("click", handleTask);

  //now to add task just press enter
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleTask();
    }
  });

  function handleTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
    addTask(taskText);
    taskInput.value = "";
  }

  function addTask(taskText) {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTask();
    renderTask(newTask);
  }

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
    <span>${task.text}</span>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">delete</button>
    `;
    taskList.appendChild(li);

    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTask();
    });
    //delete functionality
    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTask();
    });
    //Edit functionality
    li.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const editTaskText = tasks.find((t) => t.id === task.id);
      const newText = prompt("Edit task", editTaskText.text);
      //if forget take reference from mdn
      if (newText === null || newText === "") {
        return;
      }
      //update object
      editTaskText.text = newText;
      saveTask();
      li.querySelector("span").textContent = newText;
    });
  }

  function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
