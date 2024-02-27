document.addEventListener('DOMContentLoaded', () => {
    const deck = document.querySelector('.deck');
    const resetButton = document.querySelector('.reset-button');
    const peekButton = document.querySelector('.peek-button');
    const movesCounter = document.querySelector('.moves');
    const timerDisplay = document.querySelector('.timer');
    let moves = 0;
    let peekCount = 0;
    let matchCount = 0;
    let timer = null;
    let seconds = 0;
    let isGameStarted = false; 
    let cardsFlipped = [];

    const cardSymbols = shuffle([
        "✨", "✨", "🎈", "🎈", "🍰", "🍰", "🎁", "🎁", "🎉", "🎉",
        "🔔", "🔔", "🎄", "🎄", "🍬", "🍬", "🍭", "🍭", "🌟", "🌟",
        "🍓", "🍓", "🍎", "🍎", "🍒", "🍒", "🍇", "🍇", "🥥", "🥥"
    ]);

    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function createCardElement(symbol) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.symbol = symbol;
        cardElement.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${symbol}</div>`;
        cardElement.addEventListener('click', () => flipCard(cardElement));
        return cardElement;
    }

    function initializeDeck() {
        const shuffledSymbols = shuffle([...cardSymbols]);
        deck.innerHTML = '';
        shuffledSymbols.forEach(symbol => {
            const cardElement = createCardElement(symbol);
            deck.appendChild(cardElement);
        });
    }

    function startGame() {
        moves = 0;
        matchCount = 0;
        seconds = 0;
        peekCount = 0;
        isGameStarted = false; 
        cardsFlipped = [];
        initializeDeck();
        updateMoveCounter();
        resetTimer();
    }

    function flipCard(card) {
        if (card.classList.contains('flipped') || cardsFlipped.length === 2 || cardsFlipped.includes(card)) return;

        if (!isGameStarted) {
            isGameStarted = true;
            startTimer();
        }
        
        card.classList.add('flipped');
        cardsFlipped.push(card);

        if (cardsFlipped.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        moves++;
        updateMoveCounter();
    
        if (cardsFlipped[0].dataset.symbol === cardsFlipped[1].dataset.symbol) {
            matchCount++;
            cardsFlipped.forEach(card => card.classList.add('matched'));
            if (matchCount * 2 === cardSymbols.length) {
                setTimeout(gameOver, 500);
            }
            cardsFlipped = [];
        } else {
            setTimeout(() => {
                cardsFlipped.forEach(card => {
                    if (!card.classList.contains('matched')) {
                        card.classList.remove('flipped');
                    }
                });
                cardsFlipped = [];
            }, 1000);
        }
    }

    function updateMoveCounter() {
        movesCounter.textContent = `${moves} Moves`;
    }

    function startTimer() {
        if (timer === null) {
            timer = setInterval(() => {
                seconds++;
                timerDisplay.textContent = formatTime(seconds);
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        timerDisplay.textContent = formatTime(0);
    }

    function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function gameOver() {
        stopTimer();
        alert(`Congratulations! You've completed the game in ${formatTime(seconds)} with ${moves} moves and ${peekCount} peeks.`);
    }

    function peekAtCards() {
        if (!isGameStarted) {
            isGameStarted = true;
            startTimer();
        }

        document.querySelectorAll('.card:not(.matched)').forEach(card => card.classList.add('flipped'));

        setTimeout(() => {
            document.querySelectorAll('.card:not(.matched)').forEach(card => card.classList.remove('flipped'));
        }, 3000);

        peekCount++;

        if (peekCount > 1) {
            seconds += 5;
            timerDisplay.textContent = formatTime(seconds);
        }
    }

    peekButton.addEventListener('click', peekAtCards);
    resetButton.addEventListener('click', startGame);
    startGame(); 
});
