const API_KEY = 'AIzaSyDQFs7fryLROnupgmBSO-vX4PL23jcj8yM'
const searchBtn = document.getElementById('searchBtn')
const searchInput = document.getElementById('search')
const output = document.getElementById('output')
const form = document.getElementById('form')

form.addEventListener('submit', (event) => {
    event.preventDefault()
})

searchBtn.addEventListener('click', (event) => {
    document.getElementById('container').style.marginTop = 0
    var searching = searchInput.value
    videoSearch(API_KEY, 10, searching)
    output.innerHTML = ''
})

function videoSearch(key, maxResults, search) {
    const promise = new Promise((resolve, reject) => {
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
    })

    promise.then(data => {
        output.innerHTML = `<p class="result">Результат поиска по запросу: <b><span id="resultWord">${searchInput.value}</span></b></p>`

        data.items.forEach(video => {
            let videoTitle = video.snippet.title
            let videoDesc = video.snippet.description
            let videoDate = video.snippet.publishedAt
            let author = video.snippet.channelTitle
            let x = 0

            let element = `
                <div class="element">
                    <div class="elementInner">
                        <img src="${video.snippet.thumbnails.medium.url}" alt="preview" class="preview">
                        <div class="elementDesc">
                            <h1 class="videoTitle">${(videoTitle.length > 60) ? videoTitle.slice(0, 60) + '...' : videoTitle}</h1>
                            <p class="videoDesc">${videoDesc}</p>
                        </div>
                        <div class="videoInfo">
                            <p id="videoDate">${videoDate}</p>
                            <p id="author">${(author.length > 20) ? author.slice(0, 20) + '...' : author}</p>
                        </div>
                    </div>

                    <div class="videoPlayer hidden">
                        <iframe id="ytplayer" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
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
                    
                    elements[i].querySelector('.videoPlayer').classList.toggle('hidden')
                })
            }
        }) 
    }) 
}