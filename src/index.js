const quoteListUl = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
function fetchQuotesWithLikes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quoteObjects => {
        quoteObjects.forEach(renderQuotes)
    })
}

const renderQuotes = (quoteObject) => { 
    const li = document.createElement("li")
    const blockquote = document.createElement('blockquote')
    const p = document.createElement('p')
    const footer = document.createElement('footer')
    const br = document.createElement('br')
    const likesBtn = document.createElement('button')
    const likesSpan = document.createElement('span')
    const deleteBtn = document.createElement('button')
    const editBtn = document.createElement('button')

    li.className = 'quote-card'
    li.dataset.objId = quoteObject.id
    blockquote.className = 'blockquote'

    p.className = 'mb-0'
    p.textContent = quoteObject.quote

    footer.textContent = quoteObject.author

    editBtn.textContent = "Edit Quote"
    editBtn.className = 'btn-success'
    editBtn.addEventListener('click', editEvent)

    likesBtn.className = 'btn-success'
    likesBtn.textContent = "Likes:"
    likesBtn.addEventListener('click', likesBtnEvent)
    likesBtn.addEventListener('mouseenter', pointerCursor)

    likesSpan.textContent = quoteObject.likes.length 

    deleteBtn.className = 'btn-danger';
    deleteBtn.textContent = "Delete"
    deleteBtn.addEventListener('click', deleteBtnEvent)
    deleteBtn.addEventListener('mouseenter', pointerCursor)
    likesBtn.append(likesSpan)
    blockquote.append(p, footer, br, likesBtn, deleteBtn, editBtn)
    li.append(blockquote)
    quoteListUl.append(li)
}
// changing cursor pointers event
const pointerCursor = (event) => {
    event.target.style.cursor = "pointer"
}
// Editing Quote 

const editEvent = (event) => {
    fetch("http://localhost:3000/quotes", {
        method: "PATCH",
        headers: {
            
        }
    })
}
// Liking Quote

const likesBtnEvent = (event) => {
    let likesSpan = event.target.querySelector('span')
    let updatedLikes = parseInt(likesSpan.textContent, 10) + 1
    fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(currentQuoteId, 10),
        })
    })
    .then(likesSpan.textContent = updatedLikes)
}

// Deleting Quote

const deleteBtnEvent = (event) => {
    const currentQuote = event.target.closest(".quote-card")
    const currentQuoteId = event.target.closest(".quote-card").dataset.objId
    fetch(`http://localhost:3000/quotes/${currentQuoteId}`, {
        method: "DELETE"
    })
    .then(currentQuote.remove())
}

// Submitting New Quote
const newQuoteEvent = (event)=> {
    event.preventDefault()
    const newQuoteFormData = {
        quote: event.target.quote.value,
        author: event.target.author.value,
        likes: []
    }
    postNewQuote(newQuoteFormData)
    event.target.reset()
}

const postNewQuote = (newQuote) => {
    const uploadJson = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newQuote)
    }

    fetch("http://localhost:3000/quotes", uploadJson)
        .then(response => response.json())
        .then(quotesObj => renderQuotes(quotesObj))
}


newQuoteForm.addEventListener('submit', newQuoteEvent)

// initialize fetch
fetchQuotesWithLikes()