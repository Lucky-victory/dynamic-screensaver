class DynamicScreenSaver {
  constructor(container = '', options = {}) {
    this.container = document.querySelector(container);
    this.renderTemplate();
    this.timeContainer=this.container.querySelector('.time-container');
    this.timeFormatToggle=this.container.querySelector('.time-format-toggle');
    this.timeFormatLabel=this.container.querySelector('.time-format-label');
    this.popUpContainer=this.container.querySelector('.popup');
    this.imageAttribution=this.container.querySelector('.image-attribution');
    this.usernameForm=this.container.querySelector('.username-form');
    this.usernameErrorMessage=this.container.querySelector('.username-error');
    this.usernameInput=this.container.querySelector('.username-input');
    this.editUsername=this.container.querySelector('.edit-username');
    this.dateContainer=this.container.querySelector('.date-container');
    this.greetingElem=this.container.querySelector('.greeting');
    this.quoteContent=this.container.querySelector('.quote-content');
    this.quoteAuthor=this.container.querySelector('.quote-author');
    this.userNameElem=this.container.querySelector('.user-name');
    this.options = options;
    this.quoteAPIUrl = this.options && this.options.quoteAPIUrl;
    this.imageAPIUrl = this.options && this.options.imageAPIUrl;
    
    this.quote = null;
    this.is24HourClock = false;
    this.currentDate=null;
    this.storedData=this.dssStorage().getData();
this.username=this.storedData.username;
 // checks if local storage has an initial state for 24 hours clock, 
 // if it has it, then set is24hoursClock variable to it's value
 // otherwise, store the value to local storage
 this.has24Hours=this.dssStorage().getData().has24Hours;
 this.has24Hours ?
this.is24HourClock=this.has24Hours :
  this.dssStorage().setData({'has24Hours':this.is24HourClock})

  this.timeFormatToggle.addEventListener('click',()=>{
      this.is24HourClock=!this.is24HourClock;
        this.dssStorage().setData({'has24Hours':this.is24HourClock})
      this.renderTime();
    });
    this.usernameForm.addEventListener('submit',(evt)=>{
      evt.preventDefault();
      if(this.usernameInput.value===''){
        this.usernameErrorMessage.textContent='hey buddy,your name please';
        return;
      }
      
 this.usernameErrorMessage.textContent=''
      
this.username=this.usernameInput.value;
      this.renderUser(this.username);

      this.usernameInput.blur();
      this.popUpContainer.classList.remove('pop');
        this.editUsername.style.visibility='visible';
          
this.renderDate();
this.renderTime();
        
    });
this.editUsername.addEventListener('click',()=>{
  this.popUpContainer.classList.add('pop');
  this.usernameInput.value=this.username;
  this.usernameInput.focus();
  this.editUsername.style.visibility='hidden';
})
    
     if (!this.username) {
       this.popUpContainer.classList.add('pop');
       this.usernameInput.focus();
  
     } else {
       this.renderDate();
       this.renderTime();
       this.renderUser(this.username);
       this.editUsername.style.visibility='visible'
     }  
     
    this.fetchQuotes();
    this.fetchImage();
  
  }
  /** Fetches quote from an API

**/
  fetchQuotes() {
    if (this.quoteAPIUrl) {
      fetch(this.quoteAPIUrl, {
        method: 'get',
      }).then((res) => res.json()).then((res) => {
        this.quote = res.data;
        this.quoteContent.textContent = this.quote.content;
        this.quoteAuthor.textContent = '- '+this.quote.author;
      }).catch((err) => {
        if (err) {
          console.log(err);
        }
      });
      
    }
  }
  dssStorage(){
    return {
      getData(){
        return (JSON.parse(localStorage.getItem('DSS_DATA') || '{}'))
      },
      setData(data){
        const initialData=this.getData();
        const newData={...initialData,...data};
        localStorage.setItem('DSS_DATA',JSON.stringify(newData));
      }
    }
  }
  /**Fetches images from an API.
   * 
   * **/
  async fetchImage(searchValue='morning'){
    try{
    const perPage=25;
    const hours=this.currentDate && this.currentDate.getHours() || new Date().getHours();
    if (hours >=12 && hours <=16){ searchValue='afternoon';}
  else if(hours > 16 && hours <= 20){
    
  searchValue='evening';
  } 

  else if(hours > 20 && hours <= 24){
    
  searchValue='night';
  }
  else {
    searchValue='morning';
}
const reqBody={
perPage,
searchValue
}
     const response=await  fetch(this.imageAPIUrl, {
         method: 'post',
         headers:{
         'Content-Type':'application/json'  
           
         },
         body:JSON.stringify(reqBody)
       });
       let bgImage= await response.json();
       bgImage=bgImage.data;
    const randomIndex=Math.floor(Math.random() * perPage);
    const imageSrc=bgImage.photos[randomIndex].src.landscape;
    this.container.style.backgroundImage=`url(${imageSrc})`;
    const imagePhotographer=bgImage.photos[randomIndex].photographer;
    const imagePhotographerUrl=bgImage.photos[randomIndex].photographer_url;
this.imageAttribution.textContent='By '+imagePhotographer;
this.imageAttribution.href=imagePhotographerUrl
    }
      catch(err){
        
           console.log(err);
         
       }
     
  }
  /**Renders html to the container
   * 
   * */
  renderTemplate(){
    this.container.innerHTML = `
    <div class='time-format-toggle-container'>
    <label class='time-format-label' for='time_format_toggle'>
    </label>
    <input class='time-format-toggle' type='checkbox' id='time_format_toggle'/>
    </div>
          <div class="user-container">
              <span class="greeting" id="greeting"></span>,<span class="user-name"></span>
         <button class='edit-username' title='edit username'>🖊️</button>   </div> 
            <h1 class="time-container"> </h1> 
        <div class = "date-container">
            
            </div> 
            <div class = "quote-container" >
            <h2>Quote of the day.</h2> 
            <p class= "quote-content" >
            </p> 
            <em class="quote-author"> </em> 
            </div>
             <div class="popup"><h2 class='popup-title'>what's your name?</h2>
              <form class="username-form" autocomplete='off'>
                <input type="text" class="username-input input" />
                <span class="username-error"></span>
                <button class="button" type="submit">ok</button>
              </form>
              
              </div>
              <a class='image-attribution' ></a>
        `;
  }
  setTimeFormat(){
this.timeFormatLabel.textContent = this.is24HourClock ? '24hr' : '12hr';
this.timeFormatToggle.checked=this.is24HourClock ? true : false;
}
  renderTime() {
  
    const {hours,minutes,meridiem}=this.formatTime();
this.timeContainer.innerHTML=`<time class="time"><span id="hour">${hours}</span>:<span id="minutes">${minutes}</span></time><span id="meridiem" class="small-text meridiem">${meridiem}</span> `;
this.renderGreeting();
this.setTimeFormat();
setInterval(()=>{
  this.renderTime();
},1000)
  }
  renderDate(){
const {date,month,weekDay}=this.formatTime();
this.dateContainer.innerHTML=`
 <span id="week_day">${weekDay}</span> 
 <span id = "date" > ${date}, </span> 
 <span id = "month" >${month} </span>
`
}
/** Renders morning,noon,evening, or night greeting
 
*/
renderGreeting(){
const hours=this.currentDate.getHours();
let greeting='';

  if (hours >=12 && hours <=16){ greeting='afternoon';}
  else if(hours > 16 && hours <= 20){
    
  greeting='evening';
  } 

  else if(hours > 20 && hours <= 24){
    
  greeting='night';
  }
  else {
    greeting='morning';
}

this.greetingElem.textContent= 'good '+greeting;

  
}
renderUser(username=''){
this.userNameElem.textContent=username;
this.dssStorage().setData({username})
}

  formatTime() {
    this.currentDate=new Date();
    
    this.hours = this.currentDate.getHours();
    this.minutes = this.currentDate.getMinutes();
    let meridiem = this.hours > 12 ? 'pm' : 'am'
    meridiem = (!this.is24HourClock) ? meridiem : '';
    let hours=this.hours;
   hours= hours == 0 ? '0'+hours : hours;
    if(!this.is24HourClock){
      
   hours = (this.hours % 12 == 0) ? 12 : this.hours % 12;
   
    }
    
    let minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const weekDay = weekDays[this.currentDate.getDay()];
    const months = ['january', 'febuaury', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const month = months[this.currentDate.getMonth()];
    const date = this.currentDate.getDate();
    return {
      hours,
      minutes,
      month,
      weekDay,
      meridiem,
      date

    }

  }
}
const DSS=new DynamicScreenSaver('.dss-container',{
  quoteAPIUrl:'https://quote-generator-21.herokuapp.com/random'
  ,imageAPIUrl:'/.netlify/functions/fetch_image'})

