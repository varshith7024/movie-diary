async function addExisting() {
    let res = await fetch('/api/get-movies');
    let body = await res.json();

    for (let i = 0; i < body.length; i++) {
        let url = `/api/add-image?url=${encodeURIComponent(body[i].poster)}`;
        let res2 = await fetch(url);

        console.log(await res2.text());
    }
}

async function deleteExisting() {
    let res = await fetch('/api/get-movies');
    let body = await res.json();

    for (let i = 0; i < body.length; i++) {
        let url = `/api/delete-image?url=${encodeURIComponent(body[i].poster)}`;
        let res2 = await fetch(url);

        console.log(await res2.text());
    }
}

async function addNew() {
    let title = document.getElementById('title').value;
    let rating = document.getElementById('rating').value;
    let review = document.getElementById('review').value;
    let poster = document.getElementById('poster').value;

    let posterUrl = `/api/add-image?url=${encodeURIComponent(poster)}`;
    let posterRes = await fetch(posterUrl);

    console.log(await posterRes.text());

    let url = `/api/add-movie?poster=${encodeURIComponent(poster)}&rating=${rating}&review=${review}&title=${title}`;
    let res = await fetch(url);

    console.log(await res.text());
}

let addButton = document.getElementById('add');
addButton.addEventListener('click', addNew);

let aaepButton = document.getElementById('aaep');
aaepButton.addEventListener('click', addExisting);

let daepButton = document.getElementById('daep');
daepButton.addEventListener('click', deleteExisting);
