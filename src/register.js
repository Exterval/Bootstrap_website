// register input validation
const emailInput = document.getElementById('exampleInputEmail1');
const passwordInput = document.getElementById('exampleInputPassword1');
const confirmPasswordInput = document.getElementById('exampleInputPassword2');

const submit = document.getElementById('submitButton');
const emailFeedback = document.getElementById('emailFeedback');
const passwordFeedback = document.getElementById('passwordFeedback');
const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');


submit.addEventListener('click', event=>{
    event.preventDefault();

    emailFeedback.classList.add('d-block');
    passwordFeedback.classList.add('d-block');
    confirmPasswordFeedback.classList.add('d-block');

    if(!emailInput.value || !passwordInput.value || !emailInput.value.includes('@') || passwordInput.value.length <= 8 || !/[^a-zA-Z0-9\s]/.test(passwordInput.value)
    || passwordInput.value !== confirmPasswordInput.value){ // input validation
        if(emailInput.value && emailInput.value.includes('@')){
            emailFeedback.classList.remove('invalid-feedback');
            emailFeedback.classList.add('valid-feedback');
            emailFeedback.textContent = 'Looks good!';
        }else{
            emailFeedback.classList.remove('valid-feedback');
            emailFeedback.classList.add('invalid-feedback');
            emailFeedback.textContent = 'Please input your email properly.';
        }

        if(passwordInput.value && passwordInput.value.length >= 8 && /[^a-zA-Z0-9\s]/.test(passwordInput.value)){
            passwordFeedback.classList.remove('invalid-feedback');
            passwordFeedback.classList.add('valid-feedback');
            passwordFeedback.textContent = 'Looks good!';
        }else{
            passwordFeedback.classList.remove('valid-feedback');
            passwordFeedback.classList.add('invalid-feedback');
            passwordFeedback.textContent = 'Please make sure your password has symbols and is at least 8 characters long.';
        }

        if(confirmPasswordInput.value === passwordFeedback.value){
            confirmPasswordFeedback.classList.remove('invalid-feedback');
            confirmPasswordFeedback.classList.add('valid-feedback');
            confirmPasswordFeedback.textContent = 'Looks good!';
        }else{
            confirmPasswordFeedback.classList.remove('valid-feedback');
            confirmPasswordFeedback.classList.add('invalid-feedback');
            confirmPasswordFeedback.textContent = 'Please make sure your this equals to your password.';
        }
        Swal.fire('Login Failed', 'Please properly input your email and password.', 'error')
    }else{
        emailFeedback.classList.remove('invalid-feedback');
        emailFeedback.classList.add('valid-feedback');
        emailFeedback.textContent = 'Looks good!';

        passwordFeedback.classList.remove('invalid-feedback');
        passwordFeedback.classList.add('valid-feedback');
        passwordFeedback.textContent = 'Looks good!';

        confirmPasswordFeedback.classList.remove('invalid-feedback');
        confirmPasswordFeedback.classList.add('valid-feedback');
        confirmPasswordFeedback.textContent = 'Looks good!';
        Swal.fire('Login Success', 'Login is successful!', 'success')
        console.log(`Email of user: ${emailInput.value}`);
        console.log(`Password of user: ${passwordInput.value}`);  
    }
});