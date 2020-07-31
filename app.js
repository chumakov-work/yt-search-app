const API_KEY = 'AIzaSyDQFs7fryLROnupgmBSO-vX4PL23jcj8yM'
const searchBtn = document.getElementById('searchBtn')
const searchInput = document.getElementById('search')
const output = document.getElementById('output')

form.addEventListener('submit', (event) => {
    event.preventDefault()
})

searchBtn.addEventListener('click', (event) => {
    var searching = searchInput.value
    videoSearch(API_KEY, 10, searching)
    output.innerHTML = ''
})

function videoSearch(key, maxResults, search) {
    const promise = new Promise((resolve, reject) => {
        if (searchInput.value !== '') {
            let requestUrl = ('https://www.googleapis.com/youtube/v3/search?order=viewCount&part=snippet&key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search)
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
        output.innerHTML = `<p class="result">Результат поиска по запросу: <b><span id="resultWord">${searchInput.value}</span></b></p>`

        data.items.forEach(video => {
            let videoTitle = video.snippet.title
            let author = video.snippet.channelTitle

            let element = `
            <div class="element mb-3" style="background-color: #ededed">
                <div class="elementInner d-flex justify-content-start align-items-center">
                    <img src="${video.snippet.thumbnails.medium.url}" alt="preview" class="preview m-3" style="width: 160px">
                    <div class="elementDesc w-75">
                        <h3 class="videoTitle">${(videoTitle.length > 60) ? videoTitle.slice(0, 60) + '...' : videoTitle}</h3>
                        <p id="author">Автор: ${(author.length > 20) ? author.slice(0, 20) + '...' : author}</p>
                    </div>
                    <div class="videoInfo d-flex flex-column justify-content-center">
                        <p id="videoDate">Дата публикации:</p>
                        <p id="videoDate">${video.snippet.publishedAt}</p>
                    </div>
                </div>

                <div class="videoPlayer hidden w-100 m-3">
                    <iframe id="ytplayer" class="mx-auto" type="text/html" width="97.5%" height="600" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            ` 

            output.innerHTML += element
            searchInput.value = ''

            let title = document.querySelectorAll('.videoTitle')
            console.log(title)
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
        }) 
    }) 
}