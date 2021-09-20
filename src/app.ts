/* function Logger(constructor: Function) {
  console.log('Loggin...') ;
  console.log(constructor);
}*/


function Logger(logString: string) {
    console.log('Logger factory')
    return function(constructor: Function) {
      console.log(logString) ;
      console.log(constructor);
    }    
}

function WithTemplate(template: string, hookId: string) {
    console.log('Template factory')
    return function<T extends {new(...args: any[]): {name: string}}>(originalConstructor: T) {
        
        return class extends originalConstructor {
            constructor(..._: any[]) {
                super();
                console.log('rendering template')
                const hookEl = document.getElementById(hookId);
                if (hookEl) {
                    hookEl.innerHTML = template;
                    hookEl.querySelector('h1')!.textContent = this.name;
                }

            }
        }
    }
}

@Logger('Logging')
@WithTemplate('<h1>One template</h1>','app') //this runs first
class Person {
    name = 'Max';

    constructor() {
        console.log('hola');
    }
}

const person = new Person();

console.log(person);


// decorator to parameter
function Log(target: any, propertyName: string | Symbol) {
    console.log('Property decorator');
    console.log(target, propertyName);
}

// decorator to accessor
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Accessor decorator');
    console.log(target)
    console.log(name)
    console.log(descriptor)

}

//decorator to function 
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor){
    console.log('Method decorator');
    console.log(target)
    console.log(name)
    console.log(descriptor)
}

function Log4(target: any, name: string | Symbol, position: number) {
    console.log('parameter decorator');
    console.log(target)
    console.log(name)
    console.log(position)
}


class Product {
    @Log
    title!: string;
    _price!: number;

    @Log2
    set price(val: number) {
        if (val > 0) {
            this._price = val;
        } else {
            throw new Error('cualquiera te mandaste')
        }
    }

    constructor(t:string, p:number){
        this.title = t;
        this._price = p;
    }
    
    @Log3
    getPriceWithTax(@Log4 tax: number){
        return this._price * (1 + tax);
    }
}

// DECORATORS are not executed in the instanciation of an object, instead they execute
// when a class is defined


function Autobind(_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }

    return adjDescriptor;
}


class Printer {
    message = 'Works!';

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);


///

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[]
    }
}

const registeredValidators: ValidatorConfig = {};
 
function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
    };
}
 
function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
    };
}

function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig){
        return true;
    }

    let isValid = true;

    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch(validator) {
                case 'required':
                    isValid = isValid && !!obj[prop];
                break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                break;
            }            
        }
    }
    return isValid;
}

class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const courseForm = document.querySelector('form');
courseForm?.addEventListener('submit', ()=>{
    event?.preventDefault();
    const titleEL = document.getElementById('title') as HTMLInputElement;
    const priceEL = document.getElementById('price') as HTMLInputElement;


    const title = titleEL.value;
    const price = +priceEL.value;

    const createdCourse = new Course(title, price);

    if (!validate(createdCourse)) {
        alert('invalid input, please try again')
        return;
    }

    console.log(createdCourse);






})






