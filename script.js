function startTheGame(n) {

    const grid = document.querySelector('.grid');
    const penalty = document.querySelector('#penalty');
    const message = document.querySelector('h1');
    const moveSound = new Audio('move.mp3');
    // const n = 5;
    grid.innerHTML = '';
    let score = 0;
    const puzzle = [];
    let currentState = [];
    const targetArray = [];
    let isGameOver = false;

    // the four adjacent directions
    const dx = [-1, 0, 1, 0];
    const dy = [0, 1, 0, -1];

    function createDivSlowly(i) {
        setTimeout(() => {
            if (currentState[i] != 0)
                puzzle[i].style.visibility = 'visible';
            if (i + 1 < n * n)
                createDivSlowly(i + 1);
        }, 50)
    }

    function swapAdjacent(index) {
        if (isGameOver) return;
        let x = Math.floor(index / n);
        let y = index % n;
        for (let k = 0; k < 4; k++) {
            let i = x + dx[k], j = y + dy[k];
            if (i < 0 || i >= n || j < 0 || j >= n) {
                continue;
            }
            let ind = i * n + j;
            if (currentState[ind] != 0) continue;
            moveSound.play();
            let newValue = currentState[index];
            puzzle[index].style.visibility = 'hidden';
            currentState[index] = 0;
            currentState[ind] = newValue;
            puzzle[ind].style.visibility = 'visible';
            puzzle[ind].innerHTML = newValue;
            score++;
        }
    }

    function checkForWin() {
        let ok = true;
        for (let i = 0; i < n * n; i++) {
            if (currentState[i] != targetArray[i])
                ok = false;
        }
        if (ok) {
            isGameOver = true;
            message.innerHTML = "<span style='color: rgb(0, 255, 85); marginLeft: 0vmin'>Wow! You Won.</span>";
        }
    }

    // it will create the required matrix of size n * n
    function createTheMatrix() {
        penalty.innerHTML = "Penalty: " + score;
        const numsArray = Array(n * n).fill(0);
        for (let i = 0; i < n * n; i++) {
            numsArray[i] = i.toString();
            targetArray[i] = (i + 1) % (n * n);
        }
        currentState = numsArray.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < n * n; i++) {
            const square = document.createElement('div');
            if (n === 3) {
                square.classList.add('easyCell');
            } else if (n === 4) {
                square.classList.add('mediumCell');
            } else {
                square.classList.add('hardCell');
            }
            if (currentState[i] != 0) {
                square.innerHTML = currentState[i];
            }
            square.style.visibility = "hidden";
            grid.appendChild(square);
            puzzle.push(square);

            // detecting left click
            square.addEventListener('click', function(e) {
                swapAdjacent(i);
                penalty.innerHTML = "Penalty: " + score;
                checkForWin();
            })

            // right click
            square.oncontextmenu = function(e) {
                e.preventDefault();
            }
        }
        createDivSlowly(0);
    }
    createTheMatrix();
}


// for toggling hint spoiler button
function toggleHint() {
    let para = document.getElementById('para');
    if (para.style.display != 'none') {
        para.style.display = 'none';
    } else {
        para.style.display = 'block';
    }
}

function toggleRules() {
    let rules = "- Sort the squares.\n- Click a square to swap it with an adjacent empty square.\n- Try to do it in minimum possible move";
    let extraRules = "There might be some cases for which the puzzle is impossible to solve. I will fix this in the next update. Sorry for the inconvenience";
    alert(rules);
    alert(extraRules);
}