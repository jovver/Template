class Person {
    constructor(firstName, lastName, gender, age){
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
    }
}

//Updates a the existing set of Persons in the localstorage and returns the updated list.
//Parameter - persons => Array
const setPersons = (persons) => {
    localStorage.setItem("persons", JSON.stringify(persons));
    return getPersons();
}

//Returns an array of Persons from localstorage of browser
const getPersons = () => {
    return JSON.parse(localStorage.getItem("persons"));
}

const addPerson = (firstName, lastName, gender, age) => {
    let persons = getPersons();

    if (persons){
        persons.push(new Person(firstName, lastName, gender, age));
        setPersons(persons);
    } else {
        let persons = [];
        persons.push(new Person(firstName, lastName, gender, age));
        setPersons(persons);
    }
}

const deletePerson = personIndex => {
    let persons = getPersons();
    
    if (persons.length > personIndex){
        persons.splice(personIndex, 1);
        setPersons(persons);
    }
}

const generatePersonsTable = () => {
    let personsTableBody = document.getElementsByClassName("persons-table")[0].tBodies[0];
    personsTableBody.innerHTML = "";

    let personIndex = 0,
        persons = getPersons();

    persons.forEach(person => {
        let row = personsTableBody.insertRow(-1);

        let firstNameCell = row.insertCell(0);
        let lastNameCell = row.insertCell(1);
        let genderCell = row.insertCell(2);
        let ageCell = row.insertCell(3);
        let actionCell = row.insertCell(4);

        firstNameCell.innerHTML = person.firstName;
        lastNameCell.innerHTML = person.lastName;
        genderCell.innerHTML = person.gender;
        ageCell.innerHTML = person.age;
        actionCell.innerHTML = `<button type="submit" onclick="onDeletePerson(${personIndex})" class="btn btn-danger btn-sm">Delete</button>`;

        personIndex += 1;
    });
}

//Event Listener Methods
const onLoadDefaults = () => {
    setPersons([]);

    addPerson("Arci", "Munoz", "Female", 28);
    addPerson("Eduard", "Lu", "Male", 28);
    addPerson("Angelo", "Manalili", "Male", 28);
    addPerson("Mia", "Gallano", "Female", 28);

    generatePersonsTable();
} 

const onAddPerson = () => {
    let firstName = document.getElementById("inputFirstName").value;
    let lastName = document.getElementById("inputLastName").value;
    let gender = document.getElementById("inputGender").value;
    let age = document.getElementById("inputAge").value;

    addPerson(firstName, lastName, gender, age);
    alert(`Successfully added ${firstName} ${lastName}`);
    generatePersonsTable();
}


const onDeletePerson = personIndex => {
    let persons = getPersons();
    let personToBeDeleted = persons[personIndex];

    deletePerson(personIndex);
    alert(`Successfully deleted ${personToBeDeleted.firstName} ${personToBeDeleted.lastName}`);
    generatePersonsTable();
}

const onCancel = () => {
    document.getElementById("inputFirstName").value = "";
    document.getElementById("inputLastName").value = "";
    document.getElementById("inputGender").value = "";
    document.getElementById("inputAge").value = "";
}