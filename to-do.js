class ToDo {
    constructor(personIndex, item, status) {
        this.personIndex = personIndex;
        this.item = item;
        this.status = status;
    }
}

//Returns an array of Person from localstorage of browser
const getPersons = () => {
    return JSON.parse(localStorage.getItem("persons"));
}

//Updates a the existing set of To Do Items in the localstorage and returns the updated list.
//Parameter - toDoItems => Array
const setToDoItems = (toDoItems) => {
    localStorage.setItem("toDoItems", JSON.stringify(toDoItems));
    return getToDoItems();
}

//Returns an array of To Do Items from localstorage of browser
const getToDoItems = () => {
    let toDoItems = JSON.parse(localStorage.getItem("toDoItems"));

    if (!toDoItems) {
        toDoItems = [];
        setToDoItems(toDoItems);
        return toDoItems;
    }

    return toDoItems;
}

//Creates the persons dropdown object in the browser
function personsDropdown() {
    var personSelect = document.querySelector('.person-select')
    var persons = getPersons()

    personSelect.innerHTML = '<select style="width:100%">\
    <option value = "none" selected disabled hidden>--Select a Person--</option>\
    </select>'
    personSelect = personSelect.querySelector("select")

    persons.forEach(person => {
        personSelect.add(new Option(person.firstName + " " + person.lastName, person.firstName.toLowerCase()))
    })
}

// Updates the todoTable when a person is selected
function toDoTableUpdate() {
    var toDoArray = getToDoItems()
    var toDoTableBody = document.querySelector(".todo-items-table tbody")
    toDoTableBody.innerHTML = ""

    var personDropdown = document.querySelector('.person-select select')
    var personDropdownIndex = personDropdown.selectedIndex

    if (toDoArray.length >= 1) {
        toDoArray.forEach(item => {
            if (item.personIndex == personDropdownIndex) {
                var row = toDoTableBody.insertRow()
                for (i = 0; i <= 4; i++) {
                    let rowCell = row.insertCell(i)
                    switch (i) {
                        case 0:
                            rowCell.innerText = item.item
                            break
                        case 1:
                            rowCell.innerHTML = '<input type="radio" name="todo-item-status_' + item.item + '" id="todoChoice1" value="notyetstarted"></input>'
                            break
                        case 2:
                            rowCell.innerHTML = '<input type="radio" name="todo-item-status_' + item.item + '" id="todoChoice2" value="ongoing"></input>'
                            break
                        case 3:
                            rowCell.innerHTML = '<input type="radio" name="todo-item-status_' + item.item + '" id="todoChoice3" value="done"></input>'
                            break
                        default:
                            // Add onclick
                            rowCell.innerHTML = '<button type="button" style="background-color:lightblue" onclick="toDoSaveButton(this)">Save</button>\
                            <button type="button" style="background-color: red" onclick="toDoDeleteButton(this)">Delete</button>'
                            break
                    }
                }
                setCheckedRadioButton(row, item.status)
            }
        })
    }
}

// Creates the todoForm
function toDoForm() {
    var todoFormContainer = document.querySelector('.form-container')
    todoFormContainer.innerHTML = '<input placeholder="To Do Item Name"></input>\
    <select><option value="none" selected disabled hidden>--Select a Status--</option>\
    <option value="notyetstarted">Not Yet Started</option>\
    <option value="ongoing">On-going</option>\
    <option value="done">Done</option></select>\
    <button onclick="saveButton()" style="background-color:blue">Save</button>\
    <button onclick="cancelButton()" style="background-color:yellow">Cancel</button>'
}

// Cancel button for the todoForm
function cancelButton() {
    var todoFormContainer = document.querySelector('.form-container')

    var personSelectDropdown = document.querySelector('.person-select select')
    personSelectDropdown.selectedIndex = 0

    var todoFormInput = todoFormContainer.querySelector('input')
    todoFormInput.value = ""

    var todoFormSelect = todoFormContainer.querySelector('select')
    todoFormSelect.selectedIndex = 0
}

// Save button for the todoForm
function saveButton() {
    var personDropdown = document.querySelector('.person-select select')
    var personDropdownIndex = personDropdown.selectedIndex

    var todoFormInput = document.querySelector('.form-container input')
    var todoFormInputValue = todoFormInput.value

    var todoFormSelect = document.querySelector('.form-container select')
    var todoFormSelectIndex = todoFormSelect.selectedIndex
    var todoFormSelectedValue = todoFormSelect.value

    if (personDropdownIndex == 0) {
        alert("There is no selected person!")
    }
    else if (todoFormInputValue == "") {
        alert("There is no specified name!")
    }
    else if (todoFormSelectIndex == 0) {
        alert("There is no selected status!")
    }
    else {
        alert("Successfully saved To Do Item " + todoFormInputValue + ".")
        todoFormInput.value = ""
        todoFormSelect.selectedIndex = 0

        var toDoItem = new ToDo(personDropdownIndex, todoFormInputValue, todoFormSelectedValue)
        var toDo = getToDoItems()

        if (!toDo) {
            setToDoItems(toDoItem)
        }
        else {
            toDo.push(toDoItem)
            setToDoItems(toDo)
        }

        toDoTableUpdate()
    }

}

// Supplementary function to set the checked radio button for the todoTableUpdate
function setCheckedRadioButton(row, statusValue) {
    switch (statusValue) {
        case "notyetstarted":
            var cellToSet = row.querySelector("#todoChoice1")
            cellToSet.setAttribute("checked", true)
            break
        case "ongoing":
            var cellToSet = row.querySelector("#todoChoice2")
            cellToSet.setAttribute("checked", true)
            break
        default:
            var cellToSet = row.querySelector("#todoChoice3")
            cellToSet.setAttribute("checked", true)
            break
    }

}

// save button for the toDoTable
function toDoSaveButton(element) {
    var personDropdown = document.querySelector('.person-select select')
    var personDropdownIndex = personDropdown.selectedIndex

    var rowElement = element.closest('tr')
    var rowItem = rowElement.firstElementChild
    var rowItemValue = rowItem.innerText

    var currentTable = document.querySelector('.todo-items-table tbody')
    var currentTableRowsArray = Array.from(currentTable.rows)

    var currentToDoArray = getToDoItems()
    var toBeArray = []

    currentToDoArray.forEach(item => {
        if (item.personIndex == personDropdownIndex) {
            delete item
        }
        else {
            toBeArray.push(item)
        }
    })

    currentTableRowsArray.forEach(row => {
        let toDoItem = new ToDo(personDropdownIndex, row.firstElementChild.innerText, row.querySelector('input:checked').value)
        toBeArray.push(toDoItem)
    })

    setToDoItems(toBeArray)
    alert('Successfully updated To Do Item ' + rowItemValue + '.')

    toDoTableUpdate()
}

// Delete button for the toDoTable
function toDoDeleteButton(element){
    var personDropdown = document.querySelector('.person-select select')
    var personDropdownIndex = personDropdown.selectedIndex

    var rowElement = element.closest('tr')
    var rowItem = rowElement.firstElementChild
    var rowItemValue = rowItem.innerText

    var currentTable = document.querySelector('.todo-items-table tbody')
    var currentTableRowsArray = Array.from(currentTable.rows)

    var currentToDoArray = getToDoItems()
    var toBeArray = []

    currentToDoArray.forEach(item => {
        if (item.personIndex == personDropdownIndex) {
            delete item
        }
        else {
            toBeArray.push(item)
        }
    })

    currentTableRowsArray.forEach(row => {
        var rowInnerTextValue = row.querySelector('td').innerText
        if(rowInnerTextValue == rowItemValue){
            delete row
        }
        else{
            let toDoItem = new ToDo(personDropdownIndex, row.firstElementChild.innerText, row.querySelector('input:checked').value)
            toBeArray.push(toDoItem)
        }
    })

    setToDoItems(toBeArray)
    alert('Successfully deleted To Do Item ' + rowItemValue + '.')

    toDoTableUpdate()
}