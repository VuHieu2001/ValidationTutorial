function Validator(options){

    function getParent(element , selector){

        while(element.parentElement){
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element =element.parentElement;
        }
    }

    const selectorRules ={}

    function validate(inputElement,rule){
             // lấy giá trị người dùng nhập inputElement.value
           // test func :  rule.test
            var errorMessage ;
             const errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
            //  lấy các rules của selector
             const rules = selectorRules[rule.selector];
            //  console.log(rules)
            // ?lặp trùng rules để kiểm tra
                for(var i=0 ;i < rules.length ;i++){
                    switch(inputElement.type) {
                        case 'radio':
                        case 'checkbox':
                            errorMessage= rules[i](
                                formElement.querySelector(rule.selector + ':checked')
                            );
                            break;
                        default:
                            errorMessage= rules[i](inputElement.value);
                    }
                    
                    if(errorMessage) break;
                }

                if(errorMessage){
                    errorElement.innerHTML =errorMessage
                    getParent(inputElement,options.formGroupSelector).classList.add('invalid')
                }
                 else{
                    errorElement.innerHTML=''
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                 }
                return !errorMessage;
    }
    const formElement = document.querySelector(options.form)

    if(formElement){
        // khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(rule=> {
                const inputElement = formElement.querySelector(rule.selector)
                var isValid= validate(inputElement,rule);
                    if(!isValid){
                        isFormValid =false;
                    }
            });
           
            if(isFormValid){
                    if(typeof options.onSubmit === 'function'){

                        var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
               
            
                        var formValues = Array.from(enableInputs).reduce(function(values , input) {
                            values[input.name] =input.value
                            return  values;
                        }, {} );

                        options.onSubmit(formValues);
                    }
                    // submit với hành vi mặc đinh
                    else{
                        formElement.submit();
                    }
            }
            
        }
        // lặp qua mỗi rules để xử lý
        options.rules.forEach(rule=> {
            // lưu các Rules
            // selectorRules[rule.selector] = rule.test
            if(Array.isArray(selectorRules[rule.selector] )){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            const inputElement = formElement.querySelector(rule.selector)
            
            // console.log(inputElement)
            if(inputElement){
                // xử lý blur khỏi input
                inputElement.onblur = function(){
                   validate(inputElement ,rule)
                }
                // xử lý khi người dung nhập vào input
                inputElement.oninput =function(){
                    const errorElement = getParent(inputElement,options.formGroupSelector).querySelector('.form-message')
                    errorElement.innerHTML=''
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                }
            }
        });
        // console.log(selectorRules)
    }
   
}

Validator.isRequired = function(selector,message){
    return {
        selector:selector,
        test:function(value){
                return value ? undefined : message||'Vui Lòng nhập trường này'
        }
    }
}
Validator.isEmail = function(selector,message){
    return {
        selector:selector,
        test:function(value){
                var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                return  value.match(regex) ? undefined : message||'Trường này phải là Email'
        }
    }
}
Validator.minLength = function(selector,min,message){
    return {
        selector:selector,
        test:function(value){
                
                return  value.trim().length >= min ? undefined : message||`Vui lòng nhập tối thiểu ${min} ký tự `
        }
    }
}
Validator.isConfirmation = function (selector,getConfirmvalue ,message){
    return{
        selector:selector,
        test:function(value){
                return value === getConfirmvalue() ? undefined : message||'Giá trị nhập vào không trùng khớp'
        }
    }
}