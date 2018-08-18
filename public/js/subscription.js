window.onload =function () {
    subscription();
}
function subscription() {
    const subscribeForm = document.getElementById('email_subscribe');
    
    //validate phone Number
    const validatePhone= function(number) {
        const phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
        return phoneRe.test(number);
    }   
    //validate  email
    const validateEmail =function(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    } 
    subscribeForm.onsubmit = function(event) {
             
        const phoneNumber =subscribeForm.elements[0];
        const email = subscribeForm.elements[1];
        var warning =document.createElement('p');
        warning.setAttribute('id','warning');
        
        
        subscribeForm.appendChild(warning);
        if (!validatePhone(phoneNumber.value)) {
        warning.innerText='Incorrect phone number. Please enter the correct format';
        event.preventDefault();  
        //console.log('Incorrect phone number');
          return false;
        }
      
        if (!validateEmail(email.value)) {
            warning.innerText= 'Incorrect email address. Please enter the correct format';
            //console.log('Incorrect Email');
            event.preventDefault();
          return false;
        }
       
         return true;
    
        
        }

}
