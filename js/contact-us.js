const contactFormWrapper = document.getElementById('contact-form-wrapper')
const contactUsForm = document.getElementById('contact-us-form')

contactUsForm.addEventListener('submit', event => {
    event.preventDefault()
    validateSubmitForm()
})

const validateSubmitForm = () => {
    const inputs = contactUsForm.querySelectorAll('.form-control');
    let valid = true;
    inputs.forEach(input => {
        clearValidationErrors(input)

        const type = input.type;
        const validator = new RegExp(input.getAttribute('custom-validator'));
        const value = input.value

        switch (type) {
            case 'text':
                const textElementValidation = value.length > 0 && validator.test(value)
                valid = valid && textElementValidation;
                if (!textElementValidation) addErrorValidation(input)
                break;
            case 'email':
                const dateElementValidation = value.length > 0
                valid = valid && dateElementValidation;
                if (!dateElementValidation) addErrorValidation(input)
                break;
            default:
                valid = false
                break;
        }
    })
    valid && renderSuccess()
}

const renderSuccess = () => {
    contactFormWrapper.innerHTML = ''
    const successWrapperElement = document.createElement('div')
    successWrapperElement.className = 'success'
    successWrapperElement.appendChild(createTextElement('h2', 'Success!'))
    successWrapperElement.appendChild(createTextElement('p', 'We will call you as soon as possible'))
    contactFormWrapper.appendChild(successWrapperElement)
}

const createTextElement = (type, text) => {
    const elm = document.createElement(type);
    elm.innerText = text
    return elm
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