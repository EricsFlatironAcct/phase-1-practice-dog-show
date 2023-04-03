document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form')//inputs: name, breed, sex, submit button
    const nameField = dogForm.querySelectorAll('input')[0]
    const breedField = dogForm.querySelectorAll('input')[1]
    const sexField = dogForm.querySelectorAll('input')[2]
    const submitButton = dogForm.querySelectorAll('input')[3]
    submitButton.setAttribute('dogSelected', '') //used for finding which dog to edit
    const tableBody = document.getElementById('table-body')//td's: name/breed/sex/'Edit Dog' button
    const dogLib = []
    const fetchURL = 'http://localhost:3000/dogs'
    //fetch dogs from API and add them to the library
    fetch(fetchURL).then(resp=>resp.json()).then(dogs=>{
        for (const dog of dogs)  dogLib.push(dog) //add dog to the dogLib
        displayRegisteredDogs()
    })
    //displays current list of registered dogs
    function displayRegisteredDogs(){
        while(tableBody.rows.length>0) tableBody.removeChild(tableBody.firstChild)//clear current registered dogs
        dogLib.forEach(dog => {
            const row = document.createElement('tr')
            const name = document.createElement('td')
            name.innerHTML = dog.name
            const breed = document.createElement('td')
            breed.innerHTML = dog.breed
            const sex = document.createElement('td')
            sex.innerHTML = dog.sex
            const editButton = document.createElement('button')
            editButton.id = dog.id
            editButton.innerHTML = 'Edit Dog'
            //set-up edit dog button to edit existing dog
            editButton.addEventListener('click', (event)=>{
                nameField.value = dog.name
                breedField.value = dog.breed
                sexField.value = dog.sex
                submitButton.setAttribute('dogSelected', `${dog.id}`)

            })
            row.append(name, breed, sex, editButton)
            tableBody.append(row)
        });
    }
    submitButton.addEventListener('click', (event)=>{
        event.preventDefault()
        selectedDog = event.target.getAttribute('dogSelected')
        if (selectedDog.length>0) {
            dogLib[selectedDog-1].name = nameField.value
            dogLib[selectedDog-1].breed = breedField.value
            dogLib[selectedDog-1].sex = sexField.value
            const patchObj = {
                'method': 'PATCH',
                'headers': {'Content-Type':'application/json', 'Accept': 'application/json'},
                'body' : JSON.stringify(dogLib[selectedDog-1])
            }
            fetch(fetchURL+`/${selectedDog}`, patchObj).then(resp=>resp.json()).then(dog=>{
                displayRegisteredDogs()
            })
        }
    })
})
/*dog object format
{
    "id": 1,
    "name": "Baby",
    "breed": "Scottish Deerhound",
    "sex": "male"
}
*/