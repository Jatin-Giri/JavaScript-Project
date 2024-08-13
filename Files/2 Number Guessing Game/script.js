// Declare Variables
let attempts = 0;
let randomNum = Math.floor(Math.random() * 100);

// console.log(randomNum);


const guess = document.getElementById("guess");
const submit = document.getElementById("submit");
const hint = document.getElementById("hint");
const attemptsText = document.getElementById("attempts");

// console.log(guess, submit, hint, attemptsText);

// Event Listeners
submit.addEventListener("click", checkGuess);

function checkGuess(){
    const userValue = Number(guess.value);
    attempts++;

    if(userValue === randomNum){
       hint.textContent = "✨ Congratulation,🤩😎🎉 you guessed it! 🥳🎊";
    }
    else if(userValue < randomNum){
        hint.textContent = "🙄🙄----Too low! Try again.----🙄🙄";
    }
    else{
        hint.textContent = "😏😏😏###___Too high! Try again.___###😏😏😏";
    }
    attemptsText.textContent = "Attempts : "+attempts;

}