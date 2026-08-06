import { Trie } from "./trie.js";  
import { words , sites } from "./data.js"; 
import { levenshtein } from "./utilities.js";  
let data = JSON.parse(localStorage.getItem('data')) || [...words] 

const trie = new Trie()  
for (let word of data) { 
    if(typeof word != 'string') {
        console.log('imp' , word); 
        continue 
        
    }
    trie.insert(word)
}


//values 
const MAX_HISTORY = 50;
let history = JSON.parse(localStorage.getItem('history')) ||  [] 
let suggestions = [] 
let prevSuggestions = []  
let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [] 


const searchBar = document.querySelector(".search-bar");
const historyContainer = document.querySelector(".search-history");
const searchContainer = document.querySelector(".search-container"); 
const searchBtn = document.querySelector('.search-btn') 

loadHistory(history);

//icons
const deletIcons = document.querySelectorAll('.history-delete-btn')



//removing the history 
document.addEventListener("click", (event) => {
    if (!searchContainer.contains(event.target)) {
        document.querySelectorAll('.history-delete-btn').forEach(btn => {
            btn.classList.add('d-none');
        });
        loadHistory(history)
        historyContainer.classList.add("d-none");
    }
    else if(event.target.closest('.history-delete-btn')) { 
        let value = event.target.closest('.history-item').querySelector('.history-text').textContent.trim() 
        history = history.filter(val => val != value)   
        event.target.closest('.history-item').remove()  
        localStorage.setItem('history' , JSON.stringify(history))  
        data = data.filter(val => val != value) 
        localStorage.setItem('data' , JSON.stringify(data))   
        loadHistory(history) 
        

    }
});

//showing delete button

historyContainer.addEventListener("mouseover", function (event) {
    const historyItem = event.target.closest(".history-item");
    if (!historyItem) return;
    document.querySelectorAll('.history-delete-btn').forEach(btn => btn.classList.add("d-none"));
    historyItem.querySelector(".history-delete-btn").classList.remove("d-none");
});

//creating the history 
function loadHistory(data){
    let create = data.slice(0,9) 
    historyContainer.innerHTML = '' 
    create.forEach(item=>{
        historyContainer.innerHTML += `
        <div class="history-item">
            <p class="history-text">
                <i class='bx ${history.includes(item) ? 'bx-history' : 'bx-search' }   history-icon'></i>
                ${item}
            </p>
            ${history.includes(item) ? `<button class="history-delete-btn d-none">
                                            <i class="fa-solid fa-xmark history-delete-icon"></i>
                                        </button> ` : ''   }
            
        </div>
        `
    })
    
}
function handleTypo(data) {
    let create = data.slice(0, 1); // Usually only the best match

    historyContainer.innerHTML = "";

    create.forEach(item => {
        historyContainer.innerHTML += `
            <div class="did-you-mean">
                <p class="did-you-mean-label">
                    Did you mean
                </p>

                <div class="history-item">
                    <p class="history-text">
                        <i class='bx bx-search history-icon'></i>
                        <span class="did-you-mean-word">${item}</span>
                    </p>
                </div>
            </div>
        `;
    });
}

searchBar.addEventListener('input' , function(){ 
    historyContainer.classList.remove('d-none')
    const searchValue = searchBar.value.trim().toLowerCase()  
    if(searchValue.length ==0) { 
        loadHistory(history) 
        return 
    }
     
    suggestions = trie.suggest(searchValue) 

    if(suggestions.length > 0) {
        loadHistory(suggestions) 
        prevSuggestions = suggestions
    } 
    else{
        let data = [] 
        for(let i = 0 ; i < prevSuggestions.length ; i++) {
            let word = prevSuggestions[i]  
            let value = levenshtein(searchValue , word) 
            if(value <= 3) {
                data.push(word)
            }
        }
        handleTypo(data)
    }
    console.log(suggestions);
    
})

//search function 
function search(value){
    const index = history.indexOf(value);

    if (index !== -1) {
        history.splice(index, 1);
    }

    history.unshift(value);

    if (history.length > MAX_HISTORY) {
        history.pop();
    }

    trie.insert(value) 
    data.push(value) 
    localStorage.setItem('data' , JSON.stringify(data) )
    console.log(history);  
    localStorage.setItem('history' , JSON.stringify(history)) 
    loadHistory(suggestions)


    //opening the search result   
    const keywords = value.toLowerCase().split(" ");

        for (let i = 0; i < keywords.length; i++) {
            const word = keywords[i];

            if (sites[word]) {
                let query = '' 
                for (let val of keywords) { 
                    if (val == word) {
                        continue 
                    }
                    else{
                    query += val + ' ' 
                    }
                }
                let url ; 
                if (query) {
                    url = sites[word].query + encodeURIComponent(query);
                }
                else{
                    url = sites[word].home 
                }

                window.open(url, "_blank");
                return;
            }
        }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(value)}`);
}

//search button 

searchBtn.addEventListener('click' , function(){
    let searchValue = searchBar.value.trim()  

    if(!searchValue) { 

        return 
    }
    search(searchValue) //search
    
        
})


document.addEventListener('click' , function(event){
    if(event.target.closest('.history-item')) { 

        if(event.target.closest('.history-delete-btn')){
            console.log('hi') ; 
            return 
            
        }
        let value = event.target.closest('.history-item').querySelector('.history-text').textContent.trim()
        
        search(value)
        
                
    }
})


//showing history and suggestion on clicking search bar and  after comming back from another page 
function showSuggestions() {
    historyContainer.classList.remove("d-none");

    if (searchBar.value.trim() === "") {
        loadHistory(history);
    } else {
        suggestions = trie.suggest(searchBar.value.trim().toLowerCase());
        loadHistory(suggestions);
    }
}

searchBar.addEventListener("focus", showSuggestions); 
searchBar.addEventListener("click", showSuggestions);



//voice search 
const voiceSearch = document.querySelector(".mic-icon");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Voice search is not supported in this browser.");
}

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let isListening = false;

// Fires when speech is recognized
recognition.addEventListener("result", (event) => {
    const text = event.results[0][0].transcript;

    searchBar.value = text;
    searchBar.dispatchEvent(new Event("input"));

    // Optional: automatically search
    // searchBtn.click();
});


// Browser actually started listening
recognition.addEventListener("start", () => {
    isListening = true;
    voiceSearch.classList.add("listening");
});

// Browser stopped listening
recognition.addEventListener("end", () => {
    isListening = false;
    voiceSearch.classList.remove("listening");
});

// Handle errors
recognition.addEventListener("error", (event) => {
    console.log(event.error);
    isListening = false;
    voiceSearch.classList.remove("listening");
});

// Toggle
voiceSearch.addEventListener("click", () => {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});



//add shortcut
const addShortcut = document.querySelector(".add-shortcut");
const modal = document.querySelector(".modal-overlay");

const cancelBtn = document.querySelector("#cancelBtn");
const saveBtn = document.querySelector("#saveBtn");

addShortcut.addEventListener("click", () => { 
    modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});
const name = document.getElementById('shortcutName')
const url = document.getElementById('shortcutUrl')

name.addEventListener('input' , function(){
    if(name.value && url.value) {
        saveBtn.classList.add('active-btn')
    }
    else{
        saveBtn.classList.remove('active-btn')
    }
})

url.addEventListener('input' , function(){
    if(name.value && url.value) {
        saveBtn.classList.add('active-btn')
    }
    else{
        saveBtn.classList.remove('active-btn')
    }
})

let shortcutContainer = document.querySelector('.shortcut-container') 

saveBtn.addEventListener("click", () => {

    let website = url.value.trim();
    let shortcutName = name.value.trim();

    if (!shortcutName || !website) {
        return;
    }

    // Add https:// if missing
    if (!/^https?:\/\//i.test(website)) {
        website = "https://" + website;
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(website);
    } catch {
        alert("Please enter a valid URL.");
        return;
    }

    // Basic domain validation
    const hostname = parsedUrl.hostname;

    if (
        hostname.length < 3 ||
        hostname.includes(" ") ||
        !hostname.includes(".")
    ) {
        alert("Please enter a valid website.");
        return;
    }

    shortcuts.push({
        name: shortcutName,
        url: parsedUrl.href
    });

    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));

    loadShortcuts();

    name.value = "";
    url.value = "";
    saveBtn.classList.remove("active-btn");
    modal.classList.add("hidden");
});


//load all short cuts 
function loadShortcuts(){

    if (shortcuts.length >= 10) {
        addShortcut.classList.add("d-none"); 
    } else {
        addShortcut.classList.remove("d-none");
    }
    console.log(shortcuts);
    

    shortcutContainer.innerHTML = '' 

    shortcuts.forEach(item =>{ 
        const favicon = `https://www.google.com/s2/favicons?domain=${item.url}&sz=64`;  

        
        shortcutContainer.innerHTML += `
            <div class="shortcut" data-url="${item.url}">
                <img src="${favicon}" class="shortcut-icon" alt="${item.name}">
                <span class="shortcut-text">${item.name}</span>
                <button class="menu-button">
                    <i class="fa-solid fa-ellipsis-vertical menu-icon"></i>
                </button> 

                <div class="shortcut-menu d-none ">
                    <button class="menu-item edit-btn">
                        Edit shortcut
                    </button>

                    <button class="menu-item delete-btn">
                        Remove
                    </button>
                </div>

            </div>
        `
    })
}

loadShortcuts()

function closeShortcutMenu(){
    let menu = document.querySelectorAll('.shortcut-menu') 
    menu.forEach(item=>{
        item.classList.add('d-none')
    })
}

let currentShortcut ; 
//menu button for shortcuts 
document.addEventListener('click' , function(event){ 
    closeShortcutMenu()
    if(event.target.classList.contains('menu-button') || event.target.classList.contains('menu-icon')) { 
        closeShortcutMenu() 
        let item = event.target.closest('.shortcut') 
        item.querySelector('.shortcut-menu').classList.remove('d-none')
    
    }
    else if(event.target.closest('.shortcut-menu')) { 
        currentShortcut = event.target.closest('.shortcut') 
        let data = shortcuts.filter(item => item.url == currentShortcut.dataset.url )  
        console.log('data' , data[0]);  
        
        if(event.target.classList.contains('edit-btn')) {
            modal.classList.remove('hidden') 
            name.value = data[0].name 
            url.value = data[0].url 
            
        }
        
    }
    else if(event.target.closest('.shortcut')){  
        if (event.target.closest('.add-shortcut')) {
            return 
        }
        let url = event.target.closest('.shortcut').dataset.url
        window.open(url, '_blank')
    }
})