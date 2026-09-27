
class Calendar{
    constructor(calendar,date,prevBtnId,nextBtnId){
        this.calendar = document.getElementById(calendar);
        this.datetext = document.getElementById(date);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);

        this.months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
    this.currentDay = this.today.getDate();

    this.monthDays =[];
    this.currentIndex = 0;

    this.init();

    }

    init() {
    this.generateMonthDaysArray();   
    this.renderDays();
    this.initEventListeners();
  }

  generateMonthDaysArray() {

    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const monthName = this.months[this.currentMonth];

    for (let i = 1; i <= totalDays; i++) {
      this.monthDays.push({
        dayNumber: i,
        monthName: monthName,
        year: this.currentYear
      });
    }

    const todayIndex = this.monthDays.findIndex(d => d.dayNumber === this.currentDay);
    this.currentIndex = Math.max(0, todayIndex);
  }

  renderDays() {
    this.calendar.innerHTML = '';
    const daysToShow = this.monthDays.slice(this.currentIndex, this.currentIndex + 7);

    daysToShow.forEach(dayObj => {
      const dayCard = document.createElement('div');
      dayCard.classList.add('day-month');
      
      dayCard.innerHTML = 
      `
        <p class="month">${dayObj.monthName}</p>
        <p class="day">${dayObj.dayNumber}</p>
     `;

      if (dayObj.dayNumber === this.currentDay) {
        dayCard.classList.add('active');
        this.updateHeaderText(dayObj.monthName, dayObj.dayNumber,dayObj.year);
      }

      dayCard.addEventListener('click', () => {
        this.currentDate = dayObj.dayNumber; 
        this.renderDays(); 
      });

      this.calendar.appendChild(dayCard);
});
}

initEventListeners() {
    this.nextBtn.addEventListener('click', () => {
      if (this.currentIndex + 7 < this.monthDays.length) {
        this.currentIndex++;
        this.renderDays();
      }
    });

    this.prevBtn.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.renderDays();
      }
    });
  }

  updateHeaderText(month, day, year) {
    if (this.datetext) {
      this.datetext.innerText = `${month} ${day}, ${year}`;
    }
  }
}

  document.addEventListener('DOMContentLoaded', () => {
  const calendarclass = new Calendar(
    'calendar', 
    'date', 
    'prev-btn', 
    'next-btn'
  );
});



class TodoInfo{
    constructor(title,describtion=''){
        this.id = crypto.randomUUID();
        this.title = title;
        this.describtion = describtion;
        this.is_completed = false;
        this.created_at= new Date();
    }

    toggleComplete() {
        this.is_completed = !this.is_completed;
      }

}

class TodoMangement{
    constructor(){
        this.todos = [];
    }

    addTodo(title,describtion){
        const task = new TodoInfo(title,describtion);
        this.todos.push(task);
        return task;
    }

    removeTask(id){
      this.todos = this.todos.filter((task)=>task.id !== id);

    }
}


class TodoUI{
    constructor(AllTodo){
        this.TodoAll = AllTodo;
        this.initElement();
        this.bindElement();
    }

    initElement(){
        this.TodoForm=document.querySelector('#todoForm');
        this.TodoTitle=document.querySelector('#todoTitle');
        this.TodoDescription=document.querySelector('#todoDescription');
        this.TodoList=document.querySelector('#todoList');

    }

    bindElement(){
        this.TodoForm.addEventListener('submit',(event)=>{
            event.preventDefault();
            this.handleAddTask();
        });
    }

    handleAddTask(){
        const title = this.TodoTitle.value.trim();       
        const describtion = this.TodoDescription.value.trim();

        if(title){
         this.TodoAll.addTodo(title,describtion);
         this.clearForm();
         this.render();
        }
    }


    clearForm(){
        this.TodoTitle.value ='';
        this.TodoDescription.value='';
    }

    render(){
        this.TodoList.innerHTML=''; 
        if(this.TodoAll.todos.length===0){
            this.emptyState();
        }

        else{
          this.TodoAll.todos.forEach((value)=>{
            this.TodoList.appendChild(this.createTaskElement(value));

          });
        }
    }

    emptyState(){

        this.TodoList.innerHTML=
        `
        <div class="empty">
        <p>NO Tasks Yet !!!</p>
        </div>
        `;

    }

    createTaskElement(task){

        const task_element = document.createElement('div');
        task_element.className = `task-item ${task.is_completed?'completed':''}`;

        task_element.innerHTML = 
        `
          <div class="task-left">
                <input type="checkbox"${task.is_completed?'checked':''}>
                <span class="task-text${task.is_completed?'completed':''}">${task.title}</span>
                ${task.describtion ? `<p class="task-describtion">${task.describtion}</p>`:''}

            </div>
            
            <div class="task-actions">
                <button class="check-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
            `;

        const checkbox = task_element.querySelector('input[type="checkbox"]');
        const checkBtn = task_element.querySelector('.check-btn');
        console.log(checkBtn);
        const deleteBtn = task_element.querySelector('.delete-btn');
        console.log(deleteBtn);

        
        checkbox.addEventListener('change', () => {
            task.toggleComplete();
            this.render();

        });

        checkBtn.addEventListener('click', ()=> {
            task.toggleComplete();
            checkbox.checked = task.completed;
            this.render();
        });

        deleteBtn.addEventListener('click', ()=> {
            this.TodoAll.removeTask(task.id);
            this.render();
        });


        return task_element;


    }
  }


const TodoManage = new TodoMangement();
const UI = new TodoUI(TodoManage);
console.log(UI);