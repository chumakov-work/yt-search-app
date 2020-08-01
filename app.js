//

const API_KEY = 'AIzaSyBvJF0nvvfSbKH1_6VdN08xNX-cFbhfzQ4'
const MAX_RESULTS = 10

const searchBtn = document.getElementById('searchBtn')
const searchInput = document.getElementById('search')
const output = document.getElementById('output')

searchBtn.addEventListener('click', () => {
    var searching = searchInput.value
    videoSearch(API_KEY, MAX_RESULTS, searching)
    output.innerHTML = ''
})

//получение списка самых новых видеороликов
function videoSearch(key, maxResults, search) {
    const promise = new Promise((resolve, reject) => {
        if (searchInput.value !== '') {
            let requestUrl = requestLink(key, maxResults, search)
            console.log('Запрос самых новых видеороликов...')
            const xhr = new XMLHttpRequest()
            xhr.open('GET', requestUrl, true)
            xhr.responseType = 'json'
            xhr.onload = () => {
                (xhr.status >= 400) ? console.error(xhr.response) : resolve(xhr.response)
            }
            xhr.onerror = () => {
                console.log(xhr.response)
            }
            xhr.send()
        }        
    })

    promise.then(data => {
        output.innerHTML = searchWord(searchInput.value)
        let index = 0
        let containers = new Array()
        let views = new Array()

        // получение количества просмотров для каждого видеоролика
        // Отображаются только заверщенные трансляции и премьеры
        data.items.forEach(video => {
            const promiseStats = new Promise((resolve, reject) => {
                let statUrl = statisticsLink(video.id.videoId)
                console.log('Получение количества просмотров для видео с id:', video.id.videoId)
                const xhrStats = new XMLHttpRequest()
                xhrStats.open('GET', statUrl, true)
                xhrStats.responseType = 'json'
                xhrStats.onload = () => {
                    (xhrStats.status >= 400) ? console.error(xhrStats.response) : resolve(xhrStats.response)
                }
                xhrStats.onerror = () => {
                    console.log(xhrStats.response)
                }
                xhrStats.send()
            })

            // сортировка самых новых видеороликов по кол-ву просмотров
            promiseStats.then(data => {
                index++
                let viewCount = data.items[0].statistics.viewCount
                
                containers.push({
                    videos: video,
                    viewCounts: viewCount
                })
                views.push(viewCount)
                
                if (index == maxResults) {
                    views.sort(compare)
                    for (let viewsCounter=0; viewsCounter<views.length; viewsCounter++) {
                        for (let containerCounter=0; containerCounter<containers.length; containerCounter++) {
                            if(containers[containerCounter].viewCounts == views[viewsCounter]) {
                                videoElement(containers[containerCounter].videos)
                                console.log('Добавлен новый элемент к списку видео с порядковым номером:', viewsCounter)
                            }
                        }
                    } 
                }
            })
        }) 
    }) 
}

function compare(a, b) {
    return b - a;
}

function videoElement (array) {
    let videoTitle = array.snippet.title
    let author = array.snippet.channelTitle

    let element = `
        <div class="element mb-3" style="background-color: #ededed">
            <div class="elementInner d-flex justify-content-start align-items-center">
                <img src="${array.snippet.thumbnails.medium.url}" alt="preview" class="preview m-3" style="width: 160px">
                <div class="elementDesc w-75">
                    <h3 class="videoTitle">${(videoTitle.length > 60) ? videoTitle.slice(0, 60) + '...' : videoTitle}</h3>
                    <p id="author">Автор: ${(author.length > 40) ? author.slice(0, 40) + '...' : author}</p>
                </div>
                <div class="videoInfo d-flex flex-column justify-content-center">
                    <p id="videoDate">Дата публикации:</p>
                    <p id="videoDate">${new Date(array.snippet.publishedAt)}</p>
                </div>
            </div>
            <div class="videoPlayer hidden w-100 m-3">
                <iframe id="ytplayer" class="mx-auto" type="text/html" width="97.5%" height="600" src="https://www.youtube.com/embed/${array.id.videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    ` 

    output.innerHTML += element
    searchInput.value = ''

    let title = document.querySelectorAll('.videoTitle')
    let elements = document.querySelectorAll('.element')

    for (let i=0; i<title.length; i++) {
        title[i].addEventListener('click', () => {
            for (let y=0; y<title.length; y++) {
                elements[y].querySelector('.videoPlayer').classList.add('hidden')
            }
            elements[i].querySelector('.videoPlayer').classList.toggle('hidden');
            title[i].addEventListener('click', () => {
                elements[i].querySelector('.videoPlayer').classList.toggle('hidden')
            })
        })
    }
}

function searchWord (search) {
    return `<p class="result">Результат поиска по запросу: <b><span id="resultWord">${search}</span></b></p>`
}

function requestLink (key, maxResults, search) {
    return ('https://www.googleapis.com/youtube/v3/search??eventType=completed&order=date&part=snippet&key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search)
}

function statisticsLink (videoId) {
    return (`https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${videoId}&fields=items%2Fstatistics(viewCount)&key=${API_KEY}`)
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
})