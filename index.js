//get elements
const calendarGrid = document.getElementById("calendar-grid");
const progressGrid = document.getElementById("progress-grid");
const calendarContainer = document.getElementById("goals-calendar-container");
const progressContainer = document.getElementById("progress-calendar-container");
const lastMonth = document.getElementById("last-month-button");
const nextMonth = document.getElementById("next-month-button");
const calendarMonthInput = document.getElementById("calendar-month");
const addDailyGoal = document.getElementById("add-daily-goal");
const addWeeklyGoal = document.getElementById("add-weekly-goal");
const addMonthlyGoal = document.getElementById("add-monthly-goal");
const addYearLongGoal = document.getElementById("add-year-long-goal");
const calendarProgressToggle = document.getElementById("calendar-progress-toggle");
const calendarProgressToggle2 = document.getElementById("calendar-progress-toggle2");

//global variables

//get current date
getInitialMonth();

//event-handlers
lastMonth.onclick = clickLastMonth;
nextMonth.onclick = clickNextMonth;

addDailyGoal.onclick= clickAddDailyGoal;
addWeeklyGoal.onclick= clickAddWeeklyGoal;
addMonthlyGoal.onclick= clickAddMonthlyGoal;
addYearLongGoal.onclick= clickAddYearLongGoal;

calendarMonthInput.onchange = () =>{updateCalendar();}

calendarProgressToggle.onchange = changedCalendarProgressToggle;
calendarProgressToggle2.onchange = changedCalendarProgressToggle;

//functions
//uses the given date object and update the calendar
function changedCalendarProgressToggle(e){
    if(e.target.value == "calendar"){
        calendarContainer.style.display = "flex";
        progressContainer.style.display = "none";
    }
    else if(e.target.value == "progress"){
        calendarContainer.style.display = "none";
        progressContainer.style.display = "flex";
    }
    calendarProgressToggle2.value = e.target.value;
    calendarProgressToggle.value = e.target.value;
}

function updateCalendar(){
    //reset them all
    calendarGrid.innerHTML = null;
    for(let i = 0; i < 42; i++){
        let calDay = document.createElement("div");
        calDay.id = "calendar-day";
        calendarGrid.appendChild(calDay)
    }

    const days = calendarGrid.children;

    //add content to the respective days of the month
    let date = new Date(calendarMonthInput.value + "-01T08:00:00.000Z");
    let firstDate = date;
    const firstDay = date.getDay();
    let day = 1;
    let lastIndex;
    for(let month = date.getMonth(); date.getMonth() == month; date.setDate(date.getDate() + 1)){
        lastIndex = firstDay - 1 + date.getDate();
        days[lastIndex].innerHTML = day;
        days[lastIndex].className = "current-cal-day";
        day++;
    }
    //add to days after
    day = 1;
    for(let i = lastIndex + 1; i < 42; i++){
        days[i].innerHTML = day;
        days[i].className = "other-cal-day";
        day++;
    }
    //add to days before
    for(let i = firstDay - 1; i >= 0; i--){
        firstDate.setDate(firstDate.getDate() - 1);
        days[i].innerHTML = firstDate.getDate();
        days[i].className = "other-cal-day";
    }
}

function updateProgress(){
    for(let i = 0; i < 7 * 53; i++){
        let progressDay = document.createElement("div");
        progressDay.id = "progress-day";
        progressGrid.appendChild(progressDay)
    }
}

function getInitialMonth(){
    let date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    calendarMonthInput.value = date.toISOString().substring(0,7);
    updateCalendar();
    updateProgress();
}

function clickLastMonth(){
    let date = new Date(calendarMonthInput.value + "-01T08:00:00.000Z");
    date.setMonth(date.getMonth() - 1);
    calendarMonthInput.value = date.toISOString().substring(0,7);
    updateCalendar();
}

function clickNextMonth(){
    let date = new Date(calendarMonthInput.value + "-01T08:00:00.000Z");
    date.setMonth(date.getMonth() + 1);
    calendarMonthInput.value = date.toISOString().substring(0,7);
    updateCalendar();
}

function confirmGoal(e){
    e.target.removeEventListener("focusout", confirmGoal);
    let confirmedGoal = document.createElement("p");
    confirmedGoal.innerHTML = e.target.value;
    confirmedGoal.onclick = editGoal;
    e.target.parentElement.parentElement.insertBefore(confirmedGoal, e.target.parentElement);
    e.target.parentElement.remove();
}

function editGoal(e){
    let newGoal = document.createElement("div");
    let newGoalInput = document.createElement("input");
    let newGoalDelete = document.createElement("button");
    newGoal.appendChild(newGoalInput);
    newGoal.appendChild(newGoalDelete);

    newGoalInput.className = "goal-input";
    newGoalInput.value = e.target.innerHTML;
    newGoalInput.addEventListener("change", confirmGoal);
    newGoalInput.addEventListener("focusout", confirmGoal);
    
    newGoalDelete.innerHTML = 'X';
    newGoalDelete.onclick = deleteGoal;
    newGoalDelete.onmouseenter = () =>{
        newGoalInput.removeEventListener("focusout", confirmGoal);
    }
    newGoalDelete.onmouseleave = () =>{
        newGoalInput.addEventListener("focusout", confirmGoal);
    }


    e.target.parentElement.insertBefore(newGoal, e.target);
    e.target.remove();

    newGoalInput.focus();
}

function deleteGoal(e){
    e.target.parentElement.remove()
}

function clickAddDailyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    addDailyGoal.parentElement.insertBefore(goal, addDailyGoal);
}

function clickAddWeeklyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    addWeeklyGoal.parentElement.insertBefore(goal, addWeeklyGoal);
}

function clickAddMonthlyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    addMonthlyGoal.parentElement.insertBefore(goal, addMonthlyGoal);
}

function clickAddYearLongGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    addYearLongGoal.parentElement.insertBefore(goal, addYearLongGoal);
}