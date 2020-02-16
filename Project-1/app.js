//Variables
let tweetInfo = document.getElementById('tweet-data');
let tweetForm = document.getElementById('form');
let sectionContainer = document.querySelector('.section-container');
let inputTweet = document.getElementById('input-tweet')

let state = {
    prev: '',
    update: ''
}

//Charge items from LS
document.addEventListener('DOMContentLoaded', () => {
    if (localStorageProvider.getItems().length > 0) {
        let tweets = JSON.parse(localStorageProvider.getItems())
        // console.log(typeof(tweets))
        tweets.map(tweet => sectionContainer.innerHTML += `
        <div class="element-container">
    <a href="#" class="remove-tweet" id="remove-tweet">X</a>
    <article class="tweet-container">
            <div class="img-tweet-container">
               <div class="user-info"> <img src="./assets/user.jpg" alt="user-image" class="user-image"/>
               <span class="user-name">John Doe</span></div>
                <span class="tweet-time"> - ${tweetTime()}</span>
                <span class="tweet-edit">Edit</span>
                </div>
                <p class="tweet-text" id="tweet-text">
                ${tweet}
                </p>
                <span class="tweet-save hide-save" id="tweet-save">Save</span>
    </article>
    </div>` )
    }})
//Event Listeners

tweetForm.addEventListener('submit', e => {
    
    e.preventDefault();
    sectionContainer.innerHTML += `
    <div class="element-container">
    <a href="#" class="remove-tweet" id="remove-tweet">X</a>
    <article class="tweet-container">
            <div class="img-tweet-container">
               <div class="user-info"> <img src="./assets/user.jpg" alt="user-image" class="user-image"/>
               <span class="user-name">John Doe</span></div>
                <span class="tweet-time"> - ${tweetTime()}</span>
                <span class="tweet-edit" id="edit">Edit</span>
                </div>
                <p class="tweet-text">
                ${tweetInfo.value}
                </p>
        <span class="tweet-save hide-save">Save</span>
    </article>
    </div>
        `
    saveInLocalStorage(tweetInfo.value);
    tweetForm.reset()

})
sectionContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove-tweet')) {
        let tweetText = e.target.nextElementSibling.childNodes[3];
        removeFromLocalStorage(tweetText.innerText)
        e.target.parentElement.remove()
    }
    if(e.target.classList.contains('tweet-edit')){
        e.target.style.display = 'none'
        //DOM Elements
        let tweetTextContainer = e.target.parentElement.parentElement.childNodes[3]
        let tweetSaveButton = e.target.parentElement.parentElement.childNodes[5]

        state.prev = tweetTextContainer.innerText
        tweetSaveButton.classList.toggle('hide-save');

        if(tweetTextContainer.hasAttribute('contenteditable')){
            tweetTextContainer.removeAttribute('contenteditable')
        }else{
            tweetTextContainer.setAttribute('contenteditable', true)
            selectElementContents(tweetTextContainer)
        }
    }
    if(e.target.classList.contains('tweet-save')){
        //DOM Elements
        let tweetTextElement = e.target.previousElementSibling
        let tweetEditElement = e.target.previousElementSibling.previousElementSibling.childNodes[5]

        state.update = tweetTextElement.innerText
        tweetTextElement.removeAttribute('contenteditable')
        e.target.classList.toggle('hide-save')

        //Get Items from localstorage to save new edited item
        if(state.prev !== state.update){
            let tweets = JSON.parse(localStorageProvider.getItems());
            let i = tweets.indexOf(state.prev)
            tweets[i] = state.update
            localStorageProvider.setLS(tweets)
            state.prev = '';
            state.update = '';

        }
        tweetEditElement.style.display = 'block'
    }
})


//Functions
function removeFromLocalStorage(message) {

    let tweets = JSON.parse(localStorageProvider.getItems())
    //encontrar index del string en el array
    let stringIndex = tweets.indexOf(message)
    tweets.splice(stringIndex, 1)
    localStorageProvider.setLS(tweets)
}
function saveInLocalStorage(message) {
    if(inputTweet !== ''){
        if (!localStorage.getItem('tweets')) {
            let tweets = [];
            tweets.push(message)
            localStorageProvider.setLS(tweets)
        } else {
            let tweets = JSON.parse(localStorageProvider.getItems());
            tweets.push(message)
            localStorageProvider.setLS(tweets)
        }
    }

}
function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
function tweetTime() {
    //Gets the current Time and display it in format HH:mm am/pm
    let dateTime = new Date();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let timeType = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = ('0' + minutes).slice(-2);
    let finalTime = `${hours}:${minutes}${timeType}`
    return finalTime
}

//LocalStorage
const localStorageProvider = {
    getItems: () => {
        return localStorage.getItem('tweets')
    },
    setLS: (items) => {
        return localStorage.setItem('tweets', JSON.stringify(items))
    }
}
