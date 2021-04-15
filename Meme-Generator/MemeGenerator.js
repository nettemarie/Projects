const newMemes = document.querySelector("body")
const form = document.getElementById("generator")


form.addEventListener("submit", function(event){
    event.preventDefault();


    let inputImage = document.getElementById("imageURL").value
    let inputTopText = document.getElementById("TopTextInput").value
    let inputBottomText = document.getElementById("BottomTextInput").value
    let newDiv= document.createElement("div")
    let img = document.createElement("img")
    let newTopTextDiv = document.createElement("div")
    let newBottomTextDiv = document.createElement("div")

    let removeBtn = document.createElement('button');
    removeBtn.classList.add("remove")
removeBtn.innerText = 'X';
removeBtn.style.margin ='5px';

newDiv.appendChild(removeBtn)


    newDiv.classList.add("Memes")
    img.classList.add("image")

if (inputImage !== ""){  

    img.src = inputImage

    newMemes.appendChild(newDiv)
    newDiv.appendChild(img)
}

if(inputTopText !== ""){
    
    newTopTextDiv.classList.add("TopText")
    newTopTextDiv.innerText = inputTopText
    newDiv.appendChild(newTopTextDiv)
}
if(inputBottomText !== ""){
    
    newBottomTextDiv.classList.add("BottomText")
    newBottomTextDiv.innerText = inputBottomText
    newDiv.appendChild(newBottomTextDiv)
}
})

newMemes.addEventListener("click", function(e){

    if (e.target.tagName === 'BUTTON'){
        e.target.parentElement.remove();
    }
}
)




