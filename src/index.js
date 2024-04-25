document.addEventListener('DOMContentLoaded', () => {
    getRegisteredDogs()
})

let currentDog = {};

function getRegisteredDogs () {
    const tableBody = document.getElementById("table-body")
    fetch("http://localhost:3000/dogs")
    .then(response => response.json())
    .then(dogs => {
        for (let dog of dogs) {
            let row = document.createElement("tr")
            row.innerHTML=
                `<td>${dog.name}</td>
                <td>${dog.breed}</td>
                <td>${dog.sex}</td>
                <td>
                    <button class="edit-dog" id="${dog.id}">
                        Edit dog
                    </button>
                </td>`
            tableBody.append(row)
            let button = document.getElementById(dog.id)
            button.addEventListener("click", e => editDog(e.target.id))
        }
    })
}

function editDog (id) {
    fetch(`http://localhost:3000/dogs/${id}`)
    .then(response => response.json())
    .then(json => populateDogForm(json))
}

function populateDogForm (dog) {
    currentDog = dog;
    const children = document.getElementById("dog-form").children;
    let name = children[0]
    name.value=dog.name;
    name.addEventListener("change", e=> handleChange(e.target, "name"))
    let breed = children[1]
    breed.value=dog.breed;
    breed.addEventListener("change", e=> handleChange(e.target, "breed"))
    let sex = children[2]
    sex.value=dog.sex;
    sex.addEventListener("change", e=> handleChange(e.target, "sex"))
    children[3].addEventListener("click", e => submitForm(e, currentDog))
}

function handleChange (target, item) {
    currentDog[item] = target.value;
    return currentDog
}

function submitForm (e, dog) {
    e.preventDefault()
    fetch(`http://localhost:3000/dogs/${dog.id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(currentDog)
    })
    .then(response => response.json())
    .then(json => console.log(json))
}