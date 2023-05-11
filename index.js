let interval
let lastJoke 
if (typeof localStorage.JokeList == 'undefined') {
    localStorage.setItem('JokeList', '{}') 
}

let intervalFun = function () {
    interval = setInterval(() => {
        dataPromise('https://api.chucknorris.io/jokes/random').then((data) => {
            lastJoke = data
            document.querySelector('#root').innerHTML = data.value
        })
    }, 3000)
}

const buttonList = document.querySelector('.list')
const button = document.getElementById('start-joke');
const jokeListBody = document.getElementById('joke-list-body');
const jokeListTable = document.getElementById('joke-list-table');
const showTableButton = document.getElementById('show-table');
const clearListButton = document.getElementById('clear-list');

showTableButton.addEventListener('click', () => {
    if (jokeListTable.style.display === "none") {
        jokeListTable.style.display = "block";
    } else {
        jokeListTable.style.display = "none";
    }
})
clearListButton.addEventListener('click', () => {
    localStorage.JokeList = '{}'
    renderList()
})
let dataPromise = (url) => {
    return new Promise((respons, reject) => {
        fetch(url).then((res) => {
            if (res.ok) {
                respons(res.json())
            } else {
                reject(new Error('my error'))
            }
        })
    })
}
button.addEventListener('click', () => {
    button.classList.toggle('stoped') //

    if (!button.classList.contains('stoped')) {
        intervalFun()
    } else {
        clearInterval(interval)
    }
})
function addOrRemoveJokeFromList(lastJoke) {
    if (lastJoke) {
        let JokeList = JSON.parse(localStorage.JokeList)
        if (JokeList[lastJoke.id]) {
            delete JokeList[lastJoke.id]
        } else {
            if (Object.keys(JokeList).length >= 10) {
                let lastElementId = Object.keys(JokeList)[Object.keys(JokeList).length - 1] 
                delete JokeList[lastElementId]
            }
            JokeList[lastJoke.id] = lastJoke.value// 
        }
        let JokeListToString = JSON.stringify(JokeList);
        localStorage.JokeList = JokeListToString;
        renderList()
    }
}
buttonList.addEventListener('click', () => {
    addOrRemoveJokeFromList(lastJoke)
})
renderList()
addEventListeners()

function removeJokeFromList(id) {
    let JokeList = JSON.parse(localStorage.JokeList)
    delete JokeList[id]
    let JokeListToString = JSON.stringify(JokeList);
    localStorage.JokeList = JokeListToString;
}

function renderList() {
    jokeListBody.innerHTML = '';
    let jokeList = JSON.parse(localStorage.JokeList)
    let count = 1;
    for (jokeId in jokeList) {
        let row = `<tr> <th scope="row">${count}</th><td>${jokeList[jokeId]}</td><td><button class="btn btn-outline-light remove-btn" data-id="${jokeId}">remove</button></td></tr>`
        jokeListBody.insertAdjacentHTML('beforeend', row);
        count++;
    }
    addEventListeners()
}

function addEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(item => {
        item.addEventListener('click', event => {
            let id = item.getAttribute('data-id');
            removeJokeFromList(id)
            renderList();
        })
    })
}