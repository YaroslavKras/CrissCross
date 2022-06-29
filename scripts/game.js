const field = document.getElementById('gaming-field');

function play(className){
    let squareClicked = document.getElementsByClassName(className)[0];
    console.log(field);
    let img = document.createElement("img");
    img.src = "./images/x-mark.png";
    img.classList.add('move-image');
    console.log(squareClicked)
    squareClicked.classList.add('content');
    // squareClicked.textContent = "hello world";
    squareClicked.appendChild(img);

}