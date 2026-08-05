const searchBar = document.querySelector(".search-bar");
const historyContainer = document.querySelector(".search-history");
const searchContainer = document.querySelector(".search-container");

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
        historyContainer.classList.add("d-none");
    }
    else if(event.target.closest('.history-delete-btn')) {
        event.target.closest('.history-item').remove() 
    }
});

//showing delete button

historyContainer.addEventListener('mouseover' , function(event){ 
    
    if(event.target.classList.contains('history-item')) {
        deletIcons.forEach(btn => btn.classList.add('d-none'))
        event.target.querySelector('.history-delete-btn').classList.remove('d-none')
    }

    
})