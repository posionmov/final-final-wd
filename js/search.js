let selectedCityFrom = ''
let selectedCityTo = ''

const cityFromDropdown = document.getElementById('city_from_id_dropdown')
const cityToDropdown = document.getElementById('city_to_id_dropdown')

const cityFromInput = document.getElementById('city_from_id')
const cityToInput = document.getElementById('city_to_id')

const searchForm = document.getElementById('search-form')

// global event listener
document.addEventListener('click', (event) => handleClick(event.target));

// input listeners
cityFromInput.addEventListener(
    'input',
    e => changeDropDown(
        cityFromInput,
        cityFromDropdown,
        e.target.value,
        selected => selectedCityFrom = selected)
)

cityToInput.addEventListener(
    'input',
    e => changeDropDown(
        cityToInput,
        cityToDropdown,
        e.target.value,
        selected => selectedCityTo = selected)
)


// FORM
// search submit listener
searchForm.addEventListener('submit', event => {
    event.preventDefault()
    validateInputs()
})

const validateInputs = () => {
    const textInputValidators = {
        'from': selectedCityFrom,
        'to': selectedCityTo
    }

    const inputs = searchForm.querySelectorAll('.form-control');
    let valid = true;
    inputs.forEach(input => {
        clearValidationErrors(input)

        const type = input.type;
        const dataName = input.getAttribute('data-name')
        const value = input.value

        switch (type) {
            case 'text':
                const textElementValidation = value.length > 0 && textInputValidators[dataName] === value
                valid = valid && textElementValidation;
                if (!textElementValidation) addErrorValidation(input)
                break;
            case 'date':
                const dateElementValidation = value.length > 0
                valid = valid && dateElementValidation;
                if (!dateElementValidation) addErrorValidation(input)
                break;
            case 'number':
                const numberElementValidation = value > 0
                valid = valid && numberElementValidation;
                if (!numberElementValidation) addErrorValidation(input)
                break;
            default:
                valid = false
                break;
        }
    })
    valid && renderSearchResult()
}

const clearValidationErrors = (element) => {
    const children = element.parentElement.children
    for (let child in children) {
        const className = children[child].className
        if (className === 'validation-error') {
            element.parentElement.removeChild(children[child])
        }
    }
}

const addErrorValidation = (element) => {
    const parentToAdd = element.parentElement
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error'
    errorElement.innerText = 'Invalid input'
    parentToAdd.appendChild(errorElement)
}

// GLOBAL
// click outside
const handleClick = (eventTarget) => {
    if (!cityFromDropdown.contains(eventTarget)) {
        cityFromDropdown.innerHTML = ''
    }

    if (!cityToDropdown.contains(eventTarget)) {
        cityToDropdown.innerHTML = ''
    }
}


// dropdown adding/removing
const changeDropDown = (valueTargetElement, dropDownElement, newValue, selectionCallBack) => {
    clearDropdown(dropDownElement)
    const searchTerm = newValue?.toLowerCase();
    if (!searchTerm || searchTerm.length < 3) {
        return
    }

    fetch(`https://restcountries.com/v3.1/capital/${searchTerm}`)
        .then(res => res.json())
        .then(json => json.map((element, index) => {
            return {id: index, text: element.capital[0]}
        }))
        .then(foundedCities => {
            if (foundedCities && foundedCities.length > 0) {
                addDropdownValues(valueTargetElement, dropDownElement, foundedCities, selectionCallBack)
            } else {
                clearDropdown(dropDownElement)
            }
        })
}

const clearDropdown = (dropdownElement) => {
    dropdownElement.innerHTML = null
    dropdownElement.style.display = 'none'
}

const addDropdownValues = (valueTargetElement, dropdownElement, values, selectionCallBack) => {
    dropdownElement.style.display = 'block';
    values.forEach(value => {
        const newChild = createDropdownChildElement(valueTargetElement, dropdownElement, value, selectionCallBack)
        dropdownElement.appendChild(newChild);
    })
}

const createDropdownChildElement = (valueTargetElement, dropdownElement, value, selectionCallBack) => {
    const newChild = document.createElement('div');
    newChild.className = "dropdown-element";
    newChild.id = value.id;
    newChild.innerText = value.text;

    newChild.addEventListener('click', () => {
        valueTargetElement.value = value.text;
        selectionCallBack(value.text)
        clearDropdown(dropdownElement)
    });
    return newChild
}


// SEARCH RESULTS
const searchResults = [
    {
        id: 1,
        title: "Belgrade",
        description: 'Belgrade, the capital of Serbia, is a vibrant city known for its rich history, lively nightlife, and diverse cultural heritage.',
        availableFrom: '12-12-2023',
        availableTo: '31-12-2023',
        imageSrc: 'assets/bg.jpeg'
    },
    {
        id: 2,
        title: "New Delhi",
        description: 'New Delhi, the capital of India, is a bustling metropolis renowned for its historic landmarks, diverse cuisine, and vibrant street markets.',
        availableFrom: '01-01-2024',
        availableTo: '10-01-2024',
        imageSrc: 'assets/nd.jpg'
    },
    {
        id: 3,
        title: "Santiago",
        description: 'Santiago, the capital of Chile, is a dynamic city nestled in the Andes, celebrated for its stunning architecture, thriving arts scene, and scenic mountain views.',
        availableFrom: '01-03-2024',
        availableTo: '01-04-2024',
        imageSrc: 'assets/sa.jpg'
    },
    {
        id: 4,
        title: "Jamestown",
        description: 'Jamestown, the historic town in Virginia, holds the distinction of being the first permanent English settlement in America, making it a cornerstone of early American history.',
        availableFrom: '01-05-2024',
        availableTo: '01-03-2025',
        imageSrc: 'assets/jam.jpg'
    },
]

const searchResultsElement = document.getElementById('search-results');

const renderSearchResult = () => {
    searchResultsElement.innerHTML = ''
    searchResults.forEach(searchResult => {
        const result = document.createElement('div');
        result.id = searchResult.id
        result.classList.add('panel', 'blue-background', 'search-result-panel')

        const leftPart = document.createElement('div');
        leftPart.className = 'left-part';
        leftPart.appendChild(createTextElement('h2', searchResult.title))
        leftPart.appendChild(createTextElement('p', searchResult.description))
        leftPart.appendChild(createTextElement('p', `Available from: ${searchResult.availableFrom}`))
        leftPart.appendChild(createTextElement('p', `Available to: ${searchResult.availableTo}`))
        leftPart.appendChild(createButton('Book now', () => window.location.href = 'contact_us.html'))
        result.appendChild(leftPart)

        const rightPart = document.createElement('div');
        rightPart.className = 'right-part';
        rightPart.appendChild(createImage(searchResult.id, searchResult.imageSrc))
        result.appendChild(rightPart)

        searchResultsElement.appendChild(result)
    })
}

const createTextElement = (type, text) => {
    const elm = document.createElement(type);
    elm.innerText = text
    return elm
}

const createImage = (id, src) => {
    const img = document.createElement('img');
    img.src = src
    img.alt = `Image ${id}`
    return img
}

const createButton = (text, callback) => {
    const btn = document.createElement('button');
    btn.innerText = text
    btn.addEventListener('click', () => {
        callback()
    });
    return btn
}