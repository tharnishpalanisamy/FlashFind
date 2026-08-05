import { Trie } from "./trie.js";  
import { words , sites } from "./data.js";
const data = JSON.parse(localStorage.getItem('data')) || [...words] 

const trie = new Trie()  
for (let word of data) {
    trie.insert(word)
}


//values 
const MAX_HISTORY = 10;
const history = JSON.parse(localStorage.getItem('history')) ||  [] 
let suggestions = [] 


const searchBar = document.querySelector(".search-bar");
const historyContainer = document.querySelector(".search-history");
const searchContainer = document.querySelector(".search-container"); 
const searchBtn = document.querySelector('.search-btn') 

loadHistory(history);

//icons
const deletIcons = document.querySelectorAll('.history-delete-btn')
//showing history
searchBar.addEventListener("focus", () => {
    historyContainer.classList.remove("d-none");
});

//removing the history 
document.addEventListener("click", (event) => {
    if (!searchContainer.contains(event.target)) {
        deletIcons.forEach(btn=> btn.classList.add('d-none')) 
        loadHistory(history)
        historyContainer.classList.add("d-none");
    }
    else if(event.target.closest('.history-delete-btn')) { 
        event.target.closest('.history-item').remove() 
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

            <button class="history-delete-btn d-none">
                <i class="fa-solid fa-xmark history-delete-icon"></i>
            </button>
        </div>
        `
    })
    
}

searchBar.addEventListener('input' , function(){ 
    
    const searchValue = searchBar.value.trim().toLowerCase()  
    if(searchValue.length ==0) { 
        loadHistory(history) 
        return 
    }
    suggestions = trie.suggest(searchValue) 
    loadHistory(suggestions)
    console.log(suggestions);
    
})


//search button 

searchBtn.addEventListener('click' , function(){
    let searchValue = searchBar.value.trim()  

    if(!searchValue) { 

        return 
    }

    const index = history.indexOf(searchValue);

    if (index !== -1) {
        history.splice(index, 1);
    }

    history.unshift(searchValue);

    if (history.length > MAX_HISTORY) {
        history.pop();
    }

    trie.insert(searchValue) 
    data.push(searchValue) 
    localStorage.setItem('data' , JSON.stringify(data) )
    console.log(history);  
    localStorage.setItem('history' , JSON.stringify(history)) 
    loadHistory(suggestions)


    //opening the search result   
    const keywords = searchValue.toLowerCase().split(" ");

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

    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchValue)}`);
        
})


document.addEventListener('click' , function(event){
    if(event.target.closest('.history-item')) { 

        if(event.target.closest('.history-delete-btn')){
            console.log('hi') ; 
            return 
            
        }
        let value = event.target.closest('.history-item').querySelector('.history-text').textContent.trim()
        
        const index = history.indexOf(value);

        if (index !== -1) {
            history.splice(index, 1);
        }

        history.unshift(value);

        if (history.length > MAX_HISTORY) {
            history.pop();
        } 

        trie.insert(value)
        // console.log(history);  
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
})