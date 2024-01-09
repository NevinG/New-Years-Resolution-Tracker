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
const dailyProgressGoalList = document.getElementById("daily-progress-goal-list");
const weeklyProgressGoalList = document.getElementById("weekly-progress-goal-list");
const monthlyProgressGoalList = document.getElementById("monthly-progress-goal-list");
const yearlyProgressGoalList = document.getElementById("yearly-progress-goal-list");
const popupDailyProgressGoalList = document.getElementById("popup-daily-progress-goal-list");
const popupWeeklyProgressGoalList = document.getElementById("popup-weekly-progress-goal-list");
const popupMonthlyProgressGoalList = document.getElementById("popup-monthly-progress-goal-list");
const popupYearlyProgressGoalList = document.getElementById("popup-yearly-progress-goal-list");
const calPopup = document.getElementById("cal-popup");

//global variables
// localStorage.setItem("goals", JSON.stringify({
//     "daily":[
//         {
//             "goal": "goal 1",
//             "quantity": 1,
//             "progressColor": "green", 
//             "progressToggled": true,
//         }
//     ],
//     "weekly":[
//         {
//             "goal": "goal 2",
//             "quantity": 1,
//             "progressColor": "green"
//             "progressToggled": true,
//         }
//     ],
//     "monthly":[
//         {
//             "goal": "goal 3",
//             "quantity": 1,
//             "progressColor": "green"
//             "progressToggled": true,
//         }
//     ],
//     "yearly":[
//         {
//             "goal": "goal 4",
//             "quantity": 1,
//             "progressColor": "green"
//             "progressToggled": true,
//         }
//     ]
// }));
let goals = JSON.parse(localStorage.getItem("goals"));
//console.log(goals);

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
        calDay.onclick = clickCalendarDay;
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
    //add goals to the goal list
    ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
        for(let i = 0; i < goals[goalType].length; i++){
            let goal = document.createElement("div");
            goal.className="progress-goal";
    
            let goalToggleInput = document.createElement("input");
            goalToggleInput.type = "checkbox";
            goalToggleInput.onchange= (e) => {
                goals[goalType][i]["progressToggled"] = e.target.checked;
                saveGoals();
                updateProgressGoals();
            }
            goalToggleInput.checked = goals[goalType][i]["progressToggled"];
    
            let goalText = document.createElement("span");
            goalText.innerHTML = goals[goalType][i]["goal"];
    
            let goalColorInput = document.createElement("input");
            goalColorInput.type = "color";
            goalColorInput.className = "goal-color-picker";
            goalColorInput.value = goals[goalType][i]["progressColor"];
            goalColorInput.onchange = (e) => {
                goals[goalType][i]["progressColor"] = e.target.value;
                saveGoals();
                updateProgressGoals();
            }
    
            goal.appendChild(goalToggleInput);
            goal.appendChild(goalText);
            goal.appendChild(goalColorInput);
            
            switch(goalType){
                case "daily":
                    dailyProgressGoalList.appendChild(goal);
                    break;
                case "weekly":
                    weeklyProgressGoalList.appendChild(goal);
                    break;
                case "monthly":
                    monthlyProgressGoalList.appendChild(goal);
                    break;
                case "yearly":
                    yearlyProgressGoalList.appendChild(goal);
                    break;
            };
        }
    });

    //add goals to the popup
    ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
        for(let i = 0; i < goals[goalType].length; i++){
            let goal = document.createElement("div");
            goal.className="progress-goal";
    
            let goalToggleInput = document.createElement("input");
            goalToggleInput.type = "checkbox";
            goalToggleInput.onchange= (e) => {};
            goalToggleInput.checked = false;
    
            let goalText = document.createElement("span");
            goalText.innerHTML = goals[goalType][i]["goal"];
    
            goal.appendChild(goalToggleInput);
            goal.appendChild(goalText);
            
            switch(goalType){
                case "daily":
                    popupDailyProgressGoalList.appendChild(goal);
                    break;
                case "weekly":
                    popupWeeklyProgressGoalList.appendChild(goal);
                    break;
                case "monthly":
                    popupMonthlyProgressGoalList.appendChild(goal);
                    break;
                case "yearly":
                    popupYearlyProgressGoalList.appendChild(goal);
                    break;
            };
        }
    });
    

    //add each progress day element
    let date = new Date();
    for(let i = 0; i < daysInYear(date.getFullYear()); i++){
        let progressDay = document.createElement("div");
        progressDay.id = "progress-day";
        progressGrid.appendChild(progressDay);
    }

    
    //get the selected goals
    //divide them up on the screen
    //give them the right colors
    const progressDays = progressGrid.children;
    for(let i = 0; i < progressDays.length; i++){
        ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
            for(let j = 0; j < goals[goalType].length; j++){
                let progressGoal = document.createElement("div");
                progressGoal.className = "progress-goal";
                progressGoal.style.backgroundColor = goals[goalType][j]["progressColor"];
                progressGoal.style.display = goals[goalType][j]["progressToggled"] ? "block" : "none";
                progressDays[i].appendChild(progressGoal);
            }
        });
    }
    updateProgressGoals();
}

//TODO
function updateProgressGoals(){
    const progressDays = progressGrid.children;
    for(let i = 0; i < progressDays.length; i++){
        let goalIndex = 0;
        ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
            for(let j = 0; j < goals[goalType].length; j++){
                progressDays[i].children[goalIndex].style.backgroundColor = goals[goalType][j]["progressColor"];
                progressDays[i].children[goalIndex].style.display = goals[goalType][j]["progressToggled"] ? "block" : "none";
                goalIndex++;
            }
        });
    }
}

function daysInYear(year) {
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
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
    loadGoals();
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

function clickCalendarDay(e){
    console.log("clicked");
    calPopup.style.display = "block";
}

function loadGoals(){
    //daily
    for(let i = 0; i < goals["daily"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals["daily"][i]["goal"] == '' ? "new goal" : goals["daily"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "daily";
        addDailyGoal.parentElement.insertBefore(goal, addDailyGoal);
    }
    //weekly
    for(let i = 0; i < goals["weekly"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals["weekly"][i]["goal"] == '' ? "new goal" : goals["weekly"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "weekly";
        addWeeklyGoal.parentElement.insertBefore(goal, addWeeklyGoal);
    }
    //monthly
    for(let i = 0; i < goals["monthly"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals["monthly"][i]["goal"] == '' ? "new goal" : goals["monthly"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "monthly";
        addMonthlyGoal.parentElement.insertBefore(goal, addMonthlyGoal);
    }
    //yearly
    for(let i = 0; i < goals["yearly"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals["yearly"][i]["goal"] == '' ? "new goal" : goals["yearly"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "yearly";
        addYearLongGoal.parentElement.insertBefore(goal, addYearLongGoal);
    }
}

function confirmGoal(e){
    const goalDiv = e.target.parentElement;
    const goalInput = goalDiv.children[0];
    const goalQuantityInput = goalDiv.children[2];

    const index = Array.from(goalDiv.parentElement.children).indexOf(goalDiv);

    //edit goals object
    goals[goalInput.goalType][index]["goal"] = goalInput.value;
    goals[goalInput.goalType][index]["quantity"] = goalQuantityInput.value;
    saveGoals();

    e.target.removeEventListener("focusout", confirmGoal);
    let confirmedGoal = document.createElement("p");
    confirmedGoal.innerHTML = goalInput.value == '' ? "new goal" : goalInput.value;
    confirmedGoal.onclick = editGoal;
    confirmedGoal.goalType = goalInput.goalType;
    
    goalDiv.parentElement.insertBefore(confirmedGoal, goalDiv);
    goalDiv.remove();
}

function editGoal(e){
    const index = Array.from(e.target.parentElement.children).indexOf(e.target);

    let newGoal = document.createElement("div");
    let newGoalInput = document.createElement("input");
    let newGoalQuantity = document.createElement("input");
    let newGoalSpan = document.createElement("span");

    let newGoalDelete = document.createElement("button");
    newGoal.appendChild(newGoalInput);
    newGoal.appendChild(newGoalSpan);
    newGoal.appendChild(newGoalQuantity);
    newGoal.appendChild(newGoalDelete);

    newGoalInput.className = "goal-input";
    newGoalInput.value = e.target.innerHTML;
    newGoalInput.addEventListener("change", confirmGoal);
    newGoalInput.addEventListener("focusout", confirmGoal);
    newGoalInput.goalType = e.target.goalType;

    newGoalSpan.innerHTML = "#";

    newGoalQuantity.className = "goal-input-quantity";
    newGoalQuantity.value = goals[e.target.goalType][index]["quantity"];
    newGoalQuantity.type = "number";
    newGoalQuantity.addEventListener("focusout", confirmGoal);
    newGoalQuantity.onmouseenter = () =>{
        newGoalInput.removeEventListener("focusout", confirmGoal);
    }
    newGoalQuantity.onmouseleave = () =>{
        newGoalInput.addEventListener("focusout", confirmGoal);
    }
    
    newGoalDelete.innerHTML = 'X';
    newGoalDelete.className = 'delete-goal';
    newGoalDelete.goalType = e.target.goalType;
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
    const index = Array.from(e.target.parentElement.parentElement.children).indexOf(e.target.parentElement);
    e.target.parentElement.remove();

    //remove from goals object
    goals[e.target.goalType].splice(index,1);
    saveGoals();
}

function saveGoals(){
    localStorage.setItem("goals", JSON.stringify(goals));
}

function clickAddDailyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "daily";
    addDailyGoal.parentElement.insertBefore(goal, addDailyGoal);

    //add in goals object
    goals["daily"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true});
    saveGoals();
}

function clickAddWeeklyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "weekly";
    addWeeklyGoal.parentElement.insertBefore(goal, addWeeklyGoal);

    //add in goals object
    goals["weekly"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true});
}

function clickAddMonthlyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "monthly";
    addMonthlyGoal.parentElement.insertBefore(goal, addMonthlyGoal);

    //add in goals object
    goals["monthly"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true});
}

function clickAddYearLongGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "yearly";
    addYearLongGoal.parentElement.insertBefore(goal, addYearLongGoal);

    //add in goals object
    goals["yearly"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true});
}

function randomColor(){
    return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}