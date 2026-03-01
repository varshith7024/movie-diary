import { getMovies } from './data.js';

let movies = getMovies();

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let width = canvas.clientWidth;
let height = canvas.clientHeight;
canvas.width = width;
canvas.height = height;

function getSlice(items, index, sliceLength) {
    let arr = [];
    let count = 0;
    for (let i = index; i < sliceLength; i++) {
        arr.push(items[i]);
        count++;
    }

    if (count < sliceLength) {
        for (let i = 0; i < sliceLength - count; i++) {
            arr.push(items[i]);
        }
    }
    return arr;
}

async function prepareImages(items) {
    let arr = [];
    for (let i = 0; i < items.length; i++) {
        let img = new Image();
        img.src = items[i].imgSrc;
        await img.decode();
        arr.push(img);
    }
    return arr;
}

async function drawToCanvas(images) {
    let constants = [100, 125, 150, 175, 200];
    let bound = Math.floor(images.length / 2);

    let offset = 225;
    let offsetChangeFactor = 0;
    let horizontalGapFactor = 100;
    let verticalGapFactor = 60;

    for (let i = 0; i < bound; i++) {
        let left_img = images[i];
        let right_img = images[images.length - i - 1];

        let left_width = constants[i];
        let left_height = (left_width * left_img.height) / left_img.width;

        let right_width = constants[i];
        let right_height = (right_width * right_img.height) / right_img.width;

        ctx.drawImage(
            left_img,
            i * horizontalGapFactor + (offset + i * offsetChangeFactor),
            (bound - i) * verticalGapFactor,
            left_width,
            left_height,
        );

        ctx.drawImage(
            right_img,
            canvas.width -
                i * horizontalGapFactor -
                right_width -
                (offset + i * offsetChangeFactor),
            (bound - i) * verticalGapFactor,
            right_width,
            right_height,
        );
    }

    let center_img = images[bound];

    let center_width = constants[constants.length - 1];
    let center_height = (center_width * center_img.height) / center_img.width;

    let centerVerticalGap = 0;

    ctx.drawImage(
        center_img,
        canvas.width / 2 - center_width / 2,
        centerVerticalGap,
        center_width,
        center_height,
    );
}

async function modifyText(movie) {
    document.getElementById('title').innerHTML = movie.title;
    document.getElementById('review').innerHTML = movie.review;

    let stars = '';
    for (let i = 0; i < Math.floor(movie.rating); i++) {
        stars += '★';
    }
    if (Math.floor(movie.rating) - movie.rating != 0) {
        stars += '½';
    }
    document.getElementById('rating').innerHTML = stars;
}

let images = await prepareImages(movies);
console.log('loaded');

let index = 0;
let sliceLength = 9;
console.log(getSlice(images, index, sliceLength));
drawToCanvas(getSlice(images, index, sliceLength));
modifyText(getSlice(movies, index, sliceLength)[Math.floor(sliceLength / 2)]);

addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        index += 1;
        if (index == sliceLength) {
            index = 0;
        }
        drawToCanvas(getSlice(images, index, sliceLength));
        modifyText(
            getSlice(movies, index, sliceLength)[Math.floor(sliceLength / 2)],
        );
    }
    if (event.key === 'ArrowRight') {
        index -= 1;
        if (index < 0) {
            index = sliceLength - 1;
        }
        drawToCanvas(getSlice(images, index, sliceLength));
        modifyText(
            getSlice(movies, index, sliceLength)[Math.floor(sliceLength / 2)],
        );
    }
    console.log(index);
});
