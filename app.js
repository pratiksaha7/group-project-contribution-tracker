// Fixed team members for the lab project
var teamMembers = [
  "Pratik Saha",
  "Kumar Harshwardhan",
  "Debdeeb Bhattacharjee",
  "Priyanshu Giri",
  "Protik Kha"
];

// Key name used to save all tasks in localStorage
var taskStorageKey = "gpct_tasks_v1";
var roleStorageKey = "gpct_role_v1";

// Sample tasks are added only one time when localStorage is empty
function addSampleTasks() {
  var savedTasks = localStorage.getItem(taskStorageKey);

  if (savedTasks === null) {
    var sampleTasks = [
      { id: 1, name: "Requirement analysis document", member: "Pratik Saha", status: "Completed" },
      { id: 2, name: "Use case diagram", member: "Kumar Harshwardhan", status: "Completed" },
      { id: 3, name: "Database design plan", member: "Debdeeb Bhattacharjee", status: "In Progress" },
      { id: 4, name: "Login page UI", member: "Priyanshu Giri", status: "Completed" },
      { id: 5, name: "Dashboard layout", member: "Protik Kha", status: "In Progress" },
      { id: 6, name: "Task management module", member: "Pratik Saha", status: "Pending" },
      { id: 7, name: "Contribution report table", member: "Kumar Harshwardhan", status: "Completed" },
      { id: 8, name: "Testing and validation", member: "Debdeeb Bhattacharjee", status: "Pending" },
      { id: 9, name: "Project presentation notes", member: "Priyanshu Giri", status: "Pending" },
      { id: 10, name: "Final documentation", member: "Protik Kha", status: "Completed" }
    ];

    saveTasks(sampleTasks);
  }
}

// Read task list from localStorage
function getTasks() {
  var savedTasks = localStorage.getItem(taskStorageKey);

  if (savedTasks === null) {
    return [];
  }

  return JSON.parse(savedTasks);
}

// Save task list to localStorage
function saveTasks(tasks) {
  localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
}

// Create a new id by finding the highest current id
function getNextTaskId(tasks) {
  var highestId = 0;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id > highestId) {
      highestId = tasks[i].id;
    }
  }

  return highestId + 1;
}

// Calculate dashboard and report values in one place
function getTaskSummary() {
  var tasks = getTasks();
  var completed = 0;
  var pending = 0;
  var inProgress = 0;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "Completed") {
      completed++;
    } else if (tasks[i].status === "In Progress") {
      inProgress++;
    } else {
      pending++;
    }
  }

  var progress = 0;

  if (tasks.length > 0) {
    progress = Math.round((completed / tasks.length) * 100);
  }

  return {
    tasks: tasks,
    total: tasks.length,
    completed: completed,
    pending: pending,
    inProgress: inProgress,
    progress: progress
  };
}

// Set role text in the topbar after login
function showLoggedRole() {
  var roleBox = document.getElementById("loggedRole");

  if (roleBox) {
    var role = localStorage.getItem(roleStorageKey);

    if (role === null) {
      role = "User";
    }

    roleBox.textContent = role;
  }
}

// Login page validation
function setupLoginPage() {
  var loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();

      var role = document.getElementById("role").value;
      var username = document.getElementById("username").value.trim();
      var password = document.getElementById("password").value.trim();
      var message = document.getElementById("loginMessage");

      if (role === "" || username === "" || password === "") {
        message.textContent = "Please select role and enter login details.";
        message.className = "message";
        return;
      }

      // This is a demo login, so no backend authentication is used
      localStorage.setItem(roleStorageKey, role);
      window.location.href = "dashboard.html";
    });
  }
}

// Fill all team member dropdowns
function fillMemberDropdown() {
  var memberDropdown = document.getElementById("memberName");

  if (memberDropdown) {
    for (var i = 0; i < teamMembers.length; i++) {
      var option = document.createElement("option");
      option.value = teamMembers[i];
      option.textContent = teamMembers[i];
      memberDropdown.appendChild(option);
    }
  }
}

// Display dashboard statistics
function showDashboard() {
  var totalBox = document.getElementById("totalTasks");

  if (totalBox) {
    var summary = getTaskSummary();

    document.getElementById("totalTasks").textContent = summary.total;
    document.getElementById("completedTasks").textContent = summary.completed;
    document.getElementById("pendingTasks").textContent = summary.pending;
    document.getElementById("progressNumber").textContent = summary.progress + "%";
    document.getElementById("progressBar").style.width = summary.progress + "%";

    showActivities(summary.tasks);
    showTeamInfo();
  }
}

// Show recent task activities on dashboard
function showActivities(tasks) {
  var activityList = document.getElementById("activityList");

  if (activityList) {
    activityList.innerHTML = "";

    var startIndex = tasks.length - 1;
    var stopIndex = Math.max(tasks.length - 5, 0);

    for (var i = startIndex; i >= stopIndex; i--) {
      var item = document.createElement("li");
      item.textContent = tasks[i].name + " assigned to " + tasks[i].member + " - " + tasks[i].status;
      activityList.appendChild(item);
    }

    if (tasks.length === 0) {
      activityList.innerHTML = "<li>No recent activities available.</li>";
    }
  }
}

// Show team information section on dashboard
function showTeamInfo() {
  var teamList = document.getElementById("teamList");

  if (teamList) {
    teamList.innerHTML = "";

    for (var i = 0; i < teamMembers.length; i++) {
      var memberBox = document.createElement("div");
      memberBox.className = "team-member";

      var avatar = document.createElement("span");
      avatar.className = "avatar";
      avatar.textContent = getInitials(teamMembers[i]);

      var name = document.createElement("strong");
      name.textContent = teamMembers[i];

      memberBox.appendChild(avatar);
      memberBox.appendChild(name);
      teamList.appendChild(memberBox);
    }
  }
}

// Get initials for member avatar
function getInitials(name) {
  var words = name.split(" ");
  var initials = "";

  for (var i = 0; i < words.length; i++) {
    initials += words[i].charAt(0);
  }

  return initials;
}

// Add new task with validation
function setupTaskForm() {
  var taskForm = document.getElementById("taskForm");

  if (taskForm) {
    taskForm.addEventListener("submit", function(event) {
      event.preventDefault();

      var taskName = document.getElementById("taskName").value.trim();
      var memberName = document.getElementById("memberName").value;
      var taskStatus = document.getElementById("taskStatus").value;
      var message = document.getElementById("taskMessage");

      if (taskName === "" || memberName === "") {
        message.textContent = "Please enter task name and select a member.";
        message.className = "message";
        return;
      }

      var tasks = getTasks();

      tasks.push({
        id: getNextTaskId(tasks),
        name: taskName,
        member: memberName,
        status: taskStatus
      });

      saveTasks(tasks);
      taskForm.reset();
      message.textContent = "Task added successfully.";
      message.className = "message success";
      showTasks();
    });
  }
}

// Display all tasks in task table
function showTasks() {
  var taskTableBody = document.getElementById("taskTableBody");

  if (taskTableBody) {
    var tasks = getTasks();
    taskTableBody.innerHTML = "";

    for (var i = 0; i < tasks.length; i++) {
      var row = document.createElement("tr");

      var taskCell = document.createElement("td");
      taskCell.textContent = tasks[i].name;

      var memberCell = document.createElement("td");
      memberCell.textContent = tasks[i].member;

      var statusCell = document.createElement("td");
      statusCell.appendChild(createStatusSelect(tasks[i]));

      var actionCell = document.createElement("td");
      actionCell.appendChild(createDeleteButton(tasks[i].id));

      row.appendChild(taskCell);
      row.appendChild(memberCell);
      row.appendChild(statusCell);
      row.appendChild(actionCell);
      taskTableBody.appendChild(row);
    }

    if (tasks.length === 0) {
      taskTableBody.innerHTML = "<tr><td colspan='4'>No tasks available.</td></tr>";
    }
  }
}

// Create status dropdown for each task row
function createStatusSelect(task) {
  var select = document.createElement("select");
  select.className = "status-select";
  select.setAttribute("data-id", task.id);

  var statuses = ["Pending", "In Progress", "Completed"];

  for (var i = 0; i < statuses.length; i++) {
    var option = document.createElement("option");
    option.value = statuses[i];
    option.textContent = statuses[i];

    if (statuses[i] === task.status) {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", function() {
    updateTaskStatus(task.id, select.value);
  });

  return select;
}

// Update task status in localStorage
function updateTaskStatus(taskId, newStatus) {
  var tasks = getTasks();

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].status = newStatus;
    }
  }

  saveTasks(tasks);
  showTasks();
}

// Create delete button for each task row
function createDeleteButton(taskId) {
  var button = document.createElement("button");
  button.className = "delete-button";
  button.textContent = "Delete";

  button.addEventListener("click", function() {
    deleteTask(taskId);
  });

  return button;
}

// Delete selected task from localStorage
function deleteTask(taskId) {
  var tasks = getTasks();
  var updatedTasks = [];

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== taskId) {
      updatedTasks.push(tasks[i]);
    }
  }

  saveTasks(updatedTasks);
  showTasks();
}

// Build contribution data for all five members
function getContributionData() {
  var tasks = getTasks();
  var totalCompleted = 0;
  var report = [];

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "Completed") {
      totalCompleted++;
    }
  }

  for (var j = 0; j < teamMembers.length; j++) {
    var assigned = 0;
    var completed = 0;

    for (var k = 0; k < tasks.length; k++) {
      if (tasks[k].member === teamMembers[j]) {
        assigned++;

        if (tasks[k].status === "Completed") {
          completed++;
        }
      }
    }

    var percentage = 0;

    if (totalCompleted > 0) {
      percentage = Math.round((completed / totalCompleted) * 100);
    }

    report.push({
      member: teamMembers[j],
      assigned: assigned,
      completed: completed,
      percentage: percentage
    });
  }

  report.sort(function(a, b) {
    return b.completed - a.completed;
  });

  return report;
}

// Display contribution report table
function showReport() {
  var reportTableBody = document.getElementById("reportTableBody");

  if (reportTableBody) {
    var report = getContributionData();
    reportTableBody.innerHTML = "";

    for (var i = 0; i < report.length; i++) {
      var row = document.createElement("tr");

      row.innerHTML =
        "<td>" + (i + 1) + "</td>" +
        "<td>" + report[i].member + "</td>" +
        "<td>" + report[i].assigned + "</td>" +
        "<td>" + report[i].completed + "</td>" +
        "<td>" + report[i].percentage + "%</td>";

      reportTableBody.appendChild(row);
    }

    showLeaderboard(report);
  }
}

// Display visual leaderboard summary
function showLeaderboard(report) {
  var leaderboardList = document.getElementById("leaderboardList");

  if (leaderboardList) {
    leaderboardList.innerHTML = "";

    for (var i = 0; i < report.length; i++) {
      var row = document.createElement("div");
      row.className = "leaderboard-row";

      row.innerHTML =
        "<span class='rank'>" + (i + 1) + "</span>" +
        "<div><strong>" + report[i].member + "</strong>" +
        "<div class='bar-mini'><span style='width:" + report[i].percentage + "%'></span></div></div>" +
        "<strong>" + report[i].percentage + "%</strong>";

      leaderboardList.appendChild(row);
    }
  }
}

// Download report as a simple CSV file
function setupReportDownload() {
  var button = document.getElementById("downloadReport");

  if (button) {
    button.addEventListener("click", function() {
      var report = getContributionData();
      var csv = "Rank,Member Name,Assigned Tasks,Completed Tasks,Contribution %\n";

      for (var i = 0; i < report.length; i++) {
        csv += (i + 1) + "," + report[i].member + "," + report[i].assigned + "," + report[i].completed + "," + report[i].percentage + "%\n";
      }

      var file = new Blob([csv], { type: "text/csv" });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "contribution-report.csv";
      link.click();
    });
  }
}

// Run functions after the page is ready
document.addEventListener("DOMContentLoaded", function() {
  addSampleTasks();
  showLoggedRole();
  setupLoginPage();
  fillMemberDropdown();
  showDashboard();
  setupTaskForm();
  showTasks();
  showReport();
  setupReportDownload();
});
