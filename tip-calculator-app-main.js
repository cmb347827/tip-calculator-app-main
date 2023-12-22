'use strict'; 


const colors ={
	'Almost White': 'hsl(0, 0%, 98%)',
	'Lighter Gray': 'hsl(11, 2%, 95%)',
	'Overlay': 'hsla(8, 24%, 2%, 0.5)',
};

$(window).resize(function(){
	location.reload();
});
const onClick = (selector, handler) => {
  document.querySelector(selector).addEventListener('click', handler);
};
const vars ={
	timer:'',
	timeoutVal:3000,
	amountErr:document.querySelector('#amount-error'),
	peopleErr:document.querySelector('#people-error'),
	customErr: document.querySelector('#custom-error'),
	people:document.querySelector('#people'),
	amount : document.querySelector('#amount'),
	five:document.querySelector('#five'),
	ten: document.querySelector('#ten'),
	fifteen:document.querySelector('#fifteen'),
	twentyfive:document.querySelector('#twentyfive'),
	fifty:document.querySelector('#fifty'),
	custom:document.querySelector('#custom'),
	tip:'0',
	tipPerson:document.querySelector('#tipPerPerson'),
	totalPerson:document.querySelector('#totalPerPerson'),
	resetbtn:document.querySelector('#reset'),
	tipform:document.querySelector('#form'),
};
 
const error = ()=>{
	console.log('tip',vars.tip);
    //Determine if number of people entered or amount entered are zero.
	//people: Can't be zero people,only numbers,and not start with zero
	const peopleRegex = /^[1-9][0-9]*$/;
	const peoplePass = peopleRegex.test(vars.people.value);
	//Amount and custom tip: Can't be zero dollars, only numbers,and at most one decimal point
	const moneyRegex=/^[1-9]+$|^\.{1}[0-9]+|^[1-9]+\.{1}[0-9]+|0\.[0-9]+$/;
	const moneyPass = moneyRegex.test(vars.amount.value);
	
    if(vars.amount.value==='0' || vars.amount.value==='0.00' || vars.amount.value==='' || !moneyPass){
       //display error message if amount entered is still zero
	   $(vars.amountErr).css({'display':'block','color':'red'});
	   $(vars.amount).css('border','2px solid red');
    }else{
	   //else remove any latent message
	   $(vars.amountErr).css('display','none');
	   $(vars.amount).css('border','2px solid gray');
	}
    if(vars.people.value==='0' || vars.people.value==='' || !peoplePass){
	   $(vars.peopleErr).css({'display':'block','color':'red'});
	   $(vars.people).css('border','2px solid red');
    }else{
       $(vars.peopleErr).css('display','none');
	   $(vars.people).css('border','2px solid gray');
	}
	const customtipRegex=/^[1-9]+$|^\.{1}[0-9]+$|^[0-9]+\.{1}[0-9]+$|^[^0][0-9]+$|^0$|0.00|Custom|/;
	let tipPass = customtipRegex.test(vars.tip);
	if(vars.tip===''){
		tipPass=true;
	}
	if(tipPass){
	   $(vars.customErr).css('display','none');
	   $(vars.custom).css('border','2px solid gray');
	}else{
	   $(vars.customErr).css({'display':'block','color':'red'});
	   $(vars.custom).css('border','2px solid red');
	}
	if( peoplePass && moneyPass && tipPass){
	   calcTip();
	}
}
function toFix(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}
const calcTip =()=>{
    //display tip amount tip/person
	let amountInCents= Number(vars.amount.value) * 100;
	let people = Number(vars.people.value);
	let tipPerPerson='';
	let tipInCents='';
	//reset 
	//test cases
    tipInCents= amountInCents * (Number(vars.tip)/100);
	tipPerPerson = tipInCents /people;
	tipPerPerson= (tipPerPerson/100);
	vars.tipPerson.textContent= tipPerPerson.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits: 2});
	//vars.tipPerson.textContent = toFix(tipPerPerson,2);
	
	let totalPerPerson = ((amountInCents+ tipInCents)/100/people);
	//totalPerPerson = totalPerPerson.toFixed(2);
	vars.totalPerson.textContent=totalPerPerson.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits: 2});
}

const fromStart=(element)=>{
	element.focus();
    element.select();
}
const keyUp =()=>{
	window.clearTimeout(vars.timer); // prevent errant multiple timeouts from being generated
    vars.timer = window.setTimeout(() => {
	   //check to see if number of people and amount entered are more than zero
	   error();
	}, vars.timeoutVal);
}
$(window).on('load',function(){
	
	 [...document.querySelectorAll('input')].forEach(function(item){item.addEventListener('focus',function(){
	     //Will select each input selector to highlight value on focus.
		 fromStart(item);
		 });
	 },false);
	 [...document.querySelectorAll('input')].forEach(function(item){item.addEventListener('keydown',function(){
	     //Will select each input selector to highlight value on backspace
		 const key = event.key; // const {key} = event; ES6+
         if (key === "Backspace" || key === "Delete") {
		   //console.log('backspace item',item,' item value',item.value);
           fromStart(item);
         }
		 });
	 },false);
	 /*document.querySelector('#custom').addEventListener('blur',function(){
		 console.log('blur');
	    [...document.querySelectorAll('.tip')].forEach(function(item) {
			if(item===document.activeElement){
				console.log('light colored, make light');
				item.style.backgroundColor='Cyan';
			}else{
				console.log('dark colored,do nothing');
			}
		});
	 });*/
	 ["focus","change","keyup"].forEach((event) => {
		document.querySelector('#custom').addEventListener(event,function(){
		 if(this.value<'0'){
			   //this.value='';
		 }
		 //forEach focus event is so when user selects custom for it to be zero again.
		 //this.focus() Prevents custom tip losing focus when user clicks anywhere outside of custom input field and so the focus wont be back on the pre-selected tips that they have a light color.
		 this.focus();
		 
		 vars.tip = this.value;
		 keyUp();
		   
	    });
	 },false);	
	 ["change","keyup"].forEach((event) => {
        document.querySelector('#amount').addEventListener(event, function(){
		   if(this.value<'0'){
			   //this.value='';
		   }
		   vars.amount= this;
		   keyUp();
	    },false);
		document.querySelector('#people').addEventListener(event,function(){
		   if(this.value<'0'){
			   //this.value='';
		   }
		   vars.people = this;
		   keyUp();
	    },false);
     },false);
	 
	 
     [...document.querySelectorAll('.tip')].forEach(function(item) {
		    item.addEventListener('click',function() {
	           if(item ===vars.five || item===vars.ten || item===vars.fifteen || item===vars.twentyfive || item===vars.fifty){
		         //user selects a predefined tip after having selected a custom tip , earlier.
			     //sets custom tip value back to zero.
			     if(item.checked){
				   vars.custom.value='0';
				   vars.tip= item.value;
				   keyUp();
			     }
	           }
            },false);
			item.addEventListener('change',function() {
	           if(item ===vars.five || item===vars.ten || item===vars.fifteen || item===vars.twentyfive || item===vars.fifty){
		         //user selects a predefined tip after having selected a custom tip , earlier.
			     //sets custom tip value back to zero.
			     if(item.checked){
				   vars.custom.value='0';
				   vars.tip= item.value;
				   keyUp();
			     }
	           }
            },false);
	 },false);
	 (vars.resetbtn).addEventListener('click',function(){
		 console.log('in reset');
		 //(vars.tipform).reset();
     });
});