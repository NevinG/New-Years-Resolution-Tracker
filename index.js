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
const popupGoalsContainer = document.getElementById("popup-goals-container");
const progressLastYearButton = document.getElementById("progress-last-year-button");
const progressNextYearButton = document.getElementById("progress-next-year-button");
const progressYearButton = document.getElementById("progress-year-button");
const popupExitButton = document.getElementById("popup-exit-button");
//global variables
// localStorage.setItem("goals", JSON.stringify({
//     "YYYY":{
//         "daily":[
//             {
//                 "goal": "goal 1",
//                 "quantity": 1,
//                 "progressColor": "green", 
//                 "progressToggled": true,
//                 "calendarDates":{
//                     "YYYY-MM-DD": 1,
//                 }
//             }
//         ],
//         "weekly":[
//             {
//                 "goal": "goal 2",
//                 "quantity": 1,
//                 "progressColor": "green",
//                 "progressToggled": true,
//                 "calendarDates":{
//                     "YYYY-MM-DD": 1,
//                 }
//             }
//         ],
//         "monthly":[
//             {
//                 "goal": "goal 3",
//                 "quantity": 1,
//                 "progressColor": "green",
//                 "progressToggled": true,
//                 "calendarDates":{
//                     "YYYY-MM-DD": 1,
//                 }
//             }
//         ],
//         "yearly":[
//             {
//                 "goal": "goal 4",
//                 "quantity": 1,
//                 "progressColor": "green",
//                 "progressToggled": true,
//                 "calendarDates":{
//                     "YYYY-MM-DD": 1,
//                 }
//             }
//         ]
//     }
// }));
const defaultYearlyGoalsObject = {
    "daily": [],
    "weekly": [],
    "monthly": [],
    "yearly": []
}
let curCalYear = undefined;

let goals = JSON.parse(localStorage.getItem("goals")) ?? {};
//console.log(goals);

//get current date
getInitialMonth();

//event-handlers
lastMonth.onclick = clickLastMonth;
nextMonth.onclick = clickNextMonth;

progressLastYearButton.onclick= clickLastYear;
progressNextYearButton.onclick= clickNextYear;

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
        updateCalendar();
    }
    else if(e.target.value == "progress"){
        calendarContainer.style.display = "none";
        progressContainer.style.display = "flex";
        progressYearButton.value = curCalYear;
        updateProgress();
    }
    calendarProgressToggle2.value = e.target.value;
    calendarProgressToggle.value = e.target.value;
}

function updateCalendar(){
    //get new year of the calendar
    let newDate = new Date(calendarMonthInput.value + "-01T08:00:00.000Z");
    curCalYear = newDate.getFullYear();

    //reset them all
    calendarGrid.innerHTML = null;
    for(let i = 0; i < 42; i++){
        let calDay = document.createElement("div");
        calDay.id = "calendar-day";
        calendarGrid.appendChild(calDay);
        calDay.onclick = clickCalendarDay;
    }

    const days = calendarGrid.children;

    //add content to the respective days of the month
    let date = new Date(calendarMonthInput.value + "-01T08:00:00.000Z");
    let firstDate = new Date(date.getTime());
    const firstDay = date.getDay();
    let day = 1;
    let lastIndex;
    for(let month = date.getMonth(); date.getMonth() == month; date.setDate(date.getDate() + 1)){
        lastIndex = firstDay - 1 + date.getDate();
        days[lastIndex].innerHTML = day;
        days[lastIndex].className = "current-cal-day";
        days[lastIndex].calDate = date.toISOString().substring(0,10);
        day++;

        const calendarDaysGoalIndicatorContainer = document.createElement("div");
        calendarDaysGoalIndicatorContainer.className = "calendar-day-goal-indicator-container";
        days[lastIndex].appendChild(calendarDaysGoalIndicatorContainer);
        ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
            if(goals[curCalYear]){
                for(let j = 0; j < goals[curCalYear][goalType].length; j++){
                    if((goals[curCalYear][goalType][j]["calendarDates"][days[lastIndex].calDate] ?? 0) > 0){
                        const childDiv = document.createElement("div");
                        childDiv.className = "calendar-day-goal-indicator";
                        days[lastIndex].children[0].appendChild(childDiv);
                    }
                }
            }
        });
    }
    //add to days after
    day = 1;
    for(let i = lastIndex + 1; i < 42; i++){
        days[i].innerHTML = day;
        days[i].className = "other-cal-day";
        days[i].calDate = date.toISOString().substring(0,10);
        days[i].onclick = undefined;
        date.setDate(date.getDate() + 1);
        day++;
    }
    //add to days before
    for(let i = firstDay - 1; i >= 0; i--){
        firstDate.setDate(firstDate.getDate() - 1);
        days[i].innerHTML = firstDate.getDate();
        days[i].calDate = firstDate.toISOString().substring(0,10);
        days[i].onclick = undefined;
        days[i].className = "other-cal-day";
    }

    loadGoals();
}

function updateProgress(){
    //add goals to the goal list
    dailyProgressGoalList.innerHTML = '';
    weeklyProgressGoalList.innerHTML = '';
    monthlyProgressGoalList.innerHTML = '';
    yearlyProgressGoalList.innerHTML = '';
    ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
        if(goals[curCalYear]){
            for(let i = 0; i < goals[curCalYear][goalType].length; i++){
                let goal = document.createElement("div");
                goal.className="progress-goal";
        
                let goalToggleInput = document.createElement("input");
                goalToggleInput.type = "checkbox";
                goalToggleInput.onchange= (e) => {
                    goals[curCalYear][goalType][i]["progressToggled"] = e.target.checked;
                    saveGoals();
                    updateProgressGoals();
                }
                goalToggleInput.checked = goals[curCalYear][goalType][i]["progressToggled"];
        
                let goalText = document.createElement("span");
                goalText.innerHTML = goals[curCalYear][goalType][i]["goal"];
        
                let goalColorInput = document.createElement("input");
                goalColorInput.type = "color";
                goalColorInput.className = "goal-color-picker";
                goalColorInput.value = goals[curCalYear][goalType][i]["progressColor"];
                goalColorInput.onchange = (e) => {
                    goals[curCalYear][goalType][i]["progressColor"] = e.target.value;
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
        }
    });

    //add each progress day element
    progressGrid.innerHTML = '';
    let date = new Date();
    date.setFullYear(parseInt(progressYearButton.value));
    const year = date.getFullYear();
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    while(date.getFullYear() == year){
        let progressDay = document.createElement("div");
        progressDay.id = "progress-day";
        progressDay.date = date.toISOString().substring(0,10);
        progressGrid.appendChild(progressDay);
        date.setDate(date.getDate() + 1);
    }

    //get the selected goals
    //divide them up on the screen
    //give them the right colors
    const progressDays = progressGrid.children;
    for(let i = 0; i < progressDays.length; i++){
        ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
            if(goals[curCalYear]){
                for(let j = 0; j < goals[curCalYear][goalType].length; j++){
                    let progressGoal = document.createElement("div");
                    progressGoal.className = "progress-goal";
                    progressGoal.style.backgroundColor = goals[curCalYear][goalType][j]["progressColor"];
                    progressGoal.style.display = goals[curCalYear][goalType][j]["progressToggled"] ? "block" : "none";
                    progressDays[i].appendChild(progressGoal);
                }
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
            if(goals[curCalYear]){
                for(let j = 0; j < goals[curCalYear][goalType].length; j++){
                    //check if goal is completed
                    if(goalType == "daily"){
                        //calculate total quantity to this point
                        let quantity = goals[curCalYear][goalType][j]["calendarDates"][progressDays[i].date]
                        if( quantity >= goals[curCalYear][goalType][j].quantity){
                            progressDays[i].children[goalIndex].style.backgroundColor = goals[curCalYear][goalType][j]["progressColor"];
                            progressDays[i].children[goalIndex].style.display = "block";
                        }
                        else{
                            progressDays[i].children[goalIndex].style.backgroundColor = "transparent";
                            progressDays[i].children[goalIndex].style.display = "none";
                        }
                    }
                    else if(goalType == "weekly"){
                        //calculate total quantity to this point
                        let quantity = 0;
                        let testDate = new Date();
                        testDate.setFullYear(progressDays[i].date.substring(0,4));
                        testDate.setMonth(parseInt(progressDays[i].date.substring(5,7)) - 1);
                        testDate.setDate(progressDays[i].date.substring(8,10));
                        testDate.setDate(testDate.getDate() - testDate.getDay());
                        testDate.setHours(0);
                        for(let k = 0; k < 7; k++){
                            quantity += goals[curCalYear][goalType][j]["calendarDates"][testDate.toISOString().substring(0,10)] ?? 0;
                            testDate.setDate(testDate.getDate() + 1);
                        }
                        if( quantity >= goals[curCalYear][goalType][j].quantity){
                            progressDays[i].children[goalIndex].style.backgroundColor = goals[curCalYear][goalType][j]["progressColor"];
                            progressDays[i].children[goalIndex].style.display = "block";
                        }
                        else{
                            progressDays[i].children[goalIndex].style.backgroundColor = "transparent";
                            progressDays[i].children[goalIndex].style.display = "none";
                        }
                    }
                    else if(goalType == "monthly"){
                        //calculate total quantity to this point
                        let quantity = 0;
                        let testDate = new Date();
                        testDate.setFullYear(progressDays[i].date.substring(0,4));
                        testDate.setMonth(parseInt(progressDays[i].date.substring(5,7)) - 1);
                        testDate.setDate(progressDays[i].date.substring(8,10));
                        testDate.setDate(1);
                        testDate.setHours(0);
                        const month = testDate.getMonth();
                        while(month == testDate.getMonth()){
                            quantity += goals[curCalYear][goalType][j]["calendarDates"][testDate.toISOString().substring(0,10)] ?? 0;
                            testDate.setDate(testDate.getDate() + 1);
                        }
                        if( quantity >= goals[curCalYear][goalType][j].quantity){
                            progressDays[i].children[goalIndex].style.backgroundColor = goals[curCalYear][goalType][j]["progressColor"];
                            progressDays[i].children[goalIndex].style.display = "block";
                        }
                        else{
                            progressDays[i].children[goalIndex].style.backgroundColor = "transparent";
                            progressDays[i].children[goalIndex].style.display = "none";
                        }
                    }
                    else if(goalType == "yearly"){
                        //calculate total quantity to this point
                        let quantity = 0;
                        let testDate = new Date();
                        testDate.setFullYear(progressDays[i].date.substring(0,4));
                        testDate.setMonth(parseInt(progressDays[i].date.substring(5,7)) - 1);
                        testDate.setDate(progressDays[i].date.substring(8,10));
                        testDate.setDate(1);
                        testDate.setMonth(0);
                        testDate.setHours(0);
                        const year = testDate.getFullYear();
                        while(year == testDate.getFullYear()){
                            quantity += goals[curCalYear][goalType][j]["calendarDates"][testDate.toISOString().substring(0,10)] ?? 0;
                            testDate.setDate(testDate.getDate() + 1);
                        }
                        if( quantity >= goals[curCalYear][goalType][j].quantity){
                            progressDays[i].children[goalIndex].style.backgroundColor = goals[curCalYear][goalType][j]["progressColor"];
                            progressDays[i].children[goalIndex].style.display = "block";
                        }
                        else{
                            progressDays[i].children[goalIndex].style.backgroundColor = "transparent";
                            progressDays[i].children[goalIndex].style.display = "none";
                        }
                    }
                    
                    progressDays[i].children[goalIndex].style.display = goals[curCalYear][goalType][j]["progressToggled"] ? progressDays[i].children[goalIndex].style.display : "none";
                    goalIndex++;
                }
            }
        });
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
    curCalYear = date.getFullYear();
    progressYearButton.value = new Date().getFullYear();
    updateCalendar();
    updateProgress();
}

function clickLastYear(){
    progressYearButton.value = parseInt(progressYearButton.value) - 1;
    curCalYear = progressYearButton.value;
    updateProgress();
}

function clickNextYear(){
    progressYearButton.value = parseInt(progressYearButton.value) + 1;
    curCalYear = progressYearButton.value;
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

function clickCalendarDay(e){
    let target = e.target;
    if(e.target.id != "calendar-day"){
        target = e.target.parentElement.parentElement;
    }
    const clickedOnDate = target.calDate;
    calPopup.style.display = "flex";

    //position the popup
    popupGoalsContainer.style.top = Math.min(e.clientY, document.body.offsetHeight - popupGoalsContainer.offsetHeight) + "px";
    popupGoalsContainer.style.left = Math.max(e.clientX,popupGoalsContainer.offsetWidth) + "px";

    popupDailyProgressGoalList.innerHTML = '';
    popupWeeklyProgressGoalList.innerHTML = '';
    popupMonthlyProgressGoalList.innerHTML = '';
    popupYearlyProgressGoalList.innerHTML = '';
    
    //add goals to the popup
    ["daily", "weekly", "monthly", "yearly"].forEach(goalType => {
        for(let i = 0; i < goals[curCalYear][goalType].length; i++){
            let goal = document.createElement("div");
            goal.className="popup-goal";
    
            let goalToggleInput = document.createElement("input");
            goalToggleInput.type = "checkbox";
            goalToggleInput.checked = (goals[curCalYear][goalType][i]["calendarDates"][clickedOnDate] ?? 0) > 0; //TODO logic for this
            goalToggleInput.goalType = goalType;
            goalToggleInput.goalIndex = i;

            let goalInputQuantity = document.createElement("input");
            goalInputQuantity.className = "goal-input-quantity-popup";
            goalInputQuantity.type = "number";
            goalInputQuantity.value = goals[curCalYear][goalType][i]["calendarDates"][clickedOnDate] ?? 0
            goalInputQuantity.disabled = !goalToggleInput.checked;
            goalInputQuantity.onchange = (e) => {
                if(goalInputQuantity.value == 0)
                    goalToggleInput.checked = false;
                    goals[curCalYear][goalType][i]["calendarDates"][clickedOnDate] = parseInt(goalInputQuantity.value);
                saveGoals();
            }

            goalToggleInput.onchange= () => {
                goalInputQuantity.value = goalToggleInput.checked ? goalInputQuantity.value == 0 ? 1 : goalInputQuantity.value : 0;
                goals[curCalYear][goalType][i]["calendarDates"][clickedOnDate] = parseInt(goalInputQuantity.value);
                goalInputQuantity.disabled = !goalToggleInput.checked;

                //change day goal indicators
                if(goalInputQuantity.disabled){
                    target.children[0].children[0].remove()
                }else{
                    const childDiv = document.createElement("div");
                    childDiv.className = "calendar-day-goal-indicator";
                    target.children[0].appendChild(childDiv);
                }
                saveGoals();
            };
    
            let goalText = document.createElement("span");
            goalText.innerHTML = goals[curCalYear][goalType][i]["goal"];
            
            let goalChildDiv = document.createElement("div");
            
            goalChildDiv.appendChild(goalToggleInput);
            goalChildDiv.appendChild(goalText);

            goal.appendChild(goalChildDiv);
            goal.appendChild(goalInputQuantity);
            
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
}

function loadGoals(){
    //remove all old goals
    while(addDailyGoal.parentElement.childElementCount > 1){
        addDailyGoal.parentElement.children[0].remove()
    }
    while(addWeeklyGoal.parentElement.childElementCount > 1){
        addWeeklyGoal.parentElement.children[0].remove()
    }
    while(addMonthlyGoal.parentElement.childElementCount > 1){
        addMonthlyGoal.parentElement.children[0].remove()
    }
    while(addYearLongGoal.parentElement.childElementCount > 1){
        addYearLongGoal.parentElement.children[0].remove()
    }

    if(!goals[curCalYear])
        return;

    //daily
    for(let i = 0; i < goals[curCalYear]["daily"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals[curCalYear]["daily"][i]["goal"] == '' ? "new goal" : goals[curCalYear]["daily"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "daily";
        addDailyGoal.parentElement.insertBefore(goal, addDailyGoal);
    }
    //weekly
    for(let i = 0; i < goals[curCalYear]["weekly"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals[curCalYear]["weekly"][i]["goal"] == '' ? "new goal" : goals[curCalYear]["weekly"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "weekly";
        addWeeklyGoal.parentElement.insertBefore(goal, addWeeklyGoal);
    }
    //monthly
    for(let i = 0; i < goals[curCalYear]["monthly"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals[curCalYear]["monthly"][i]["goal"] == '' ? "new goal" : goals[curCalYear]["monthly"][i]["goal"];
        goal.onclick = editGoal;
        goal.goalType = "monthly";
        addMonthlyGoal.parentElement.insertBefore(goal, addMonthlyGoal);
    }
    //yearly
    for(let i = 0; i < goals[curCalYear]["yearly"].length; i++){
        let goal = document.createElement("p");
        goal.innerHTML = goals[curCalYear]["yearly"][i]["goal"] == '' ? "new goal" : goals[curCalYear]["yearly"][i]["goal"];
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
    goals[curCalYear][goalInput.goalType][index]["goal"] = goalInput.value;
    goals[curCalYear][goalInput.goalType][index]["quantity"] = parseInt(goalQuantityInput.value);
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
    newGoalQuantity.value = goals[curCalYear][e.target.goalType][index]["quantity"];
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
    goals[curCalYear][e.target.goalType].splice(index,1);
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
    if(!goals[curCalYear]){
        goals[curCalYear] = JSON.parse(JSON.stringify(defaultYearlyGoalsObject));
    }
    goals[curCalYear]["daily"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true, calendarDates:{}});
    saveGoals();
}

function clickAddWeeklyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "weekly";
    addWeeklyGoal.parentElement.insertBefore(goal, addWeeklyGoal);

    //add in goals object
    goals[curCalYear]["weekly"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true, calendarDates:{}});
}

function clickAddMonthlyGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "monthly";
    addMonthlyGoal.parentElement.insertBefore(goal, addMonthlyGoal);

    //add in goals object
    goals[curCalYear]["monthly"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true, calendarDates:{}});
}

function clickAddYearLongGoal(){
    let goal = document.createElement("p");
    goal.innerHTML = "new goal";
    goal.onclick = editGoal;
    goal.goalType = "yearly";
    addYearLongGoal.parentElement.insertBefore(goal, addYearLongGoal);

    //add in goals object
    goals[curCalYear]["yearly"].push({goal: 'new goal', quantity: 1, progressColor: randomColor(), progressToggled: true, calendarDates:{}});
}

function randomColor(){
    return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

//closes the cal popup on click
popupExitButton.onclick = clickmeParent;
calPopup.onclick = clickmeParent;
function clickmeParent(e){
    calPopup.style.display = "none";
}

popupGoalsContainer.onclick = clickmeChild;
function clickmeChild(e){
    e.stopPropagation();
}