const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const sand = 5;
const matrix = 6;
const scattered = 0.9; //value between 0.1 and 0.9
let cols, rows, arr, direction = false, E = null, isMouseDown = false, hue = 0.1;

// This function creates 2D Array
const createArray = (rows, cols) => {
    let arr = [];
    for (let i = 0; i <= rows + 1; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    for (let i = 0; i < cols; i++) {
        arr[rows + 1][i] = 1;
    }
    return arr;
}

// This function gets exact coordinates of a single sand particle
const getCoordinates = (event) => {
    const rect = canvas.getBoundingClientRect();
    const type = event.type;
    let x, y;
    if (type === 'mousedown' || type === 'mousemove') {
        x = Math.floor((event.clientX - rect.left) / sand);
        y = Math.floor((event.clientY - rect.top) / sand);
    } else {
        x = Math.floor((event.touches[0].clientX - rect.left) / sand);
        y = Math.floor((event.touches[0].clientY - rect.top) / sand);
    }
    return { x, y };
}


// this function is used to move sand particle
const moveSand = (fromI, fromJ, toI, toJ) => {
    const [r, g, b, a] = ctx.getImageData(fromJ * sand, fromI * sand, 1, 1).data;
    ctx.fillStyle = `#fff`
    ctx.fillRect(fromJ * sand, fromI * sand, sand, sand);
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(toJ * sand, toI * sand, sand, sand)
    arr[fromI][fromJ] = 0;
    arr[toI][toJ] = 1;
}


// Drawing each sand particle
const drawSand = () => {
    if (!E || !isMouseDown) { return };

    // getting accurate coordinate
    const { x, y } = getCoordinates(E);

    // the coordenate should be in that canvas range
    if (x < 0 || x > cols || y < 0 || y > rows) { return };

    // checking if that postion already have an sand particle
    if (arr[y][x] === 1) { return };

    // drawing sand`s particle
    for (let i = x - matrix; i <= x + matrix; i++) {
        for (let j = y - matrix; j <= y + matrix; j++) {
            if (i >= 0 && i < cols && j >= 0 && j < rows) {
                if (Math.random() > scattered) {
                    ctx.fillStyle = `hsl(${hue},100%,50%)`
                    ctx.fillRect(i * sand, j * sand, sand, sand);
                    arr[j][i] = 1;
                    hue += 0.1;
                    hue >= 360 ? hue = 1 : hue;
                }
            }
        }
    }
}

// This is main game loop , that is each sand particles are moveing in this function
const mainSandLoop = () => {
    // chnging the direction for columns loop
    const dir = direction ? 1 : -1;
    const sta = direction ? 0 : cols - 1;
    const end = direction ? cols - 1 : 0;
    direction = !direction;

    for (let i = rows - 1; i >= 0; i--) {
        for (let j = sta; j != end; j += dir) {
            if (arr[i][j] == 1) {
                if (arr[i + 1][j] == 0) {
                    moveSand(i, j, (i + 1), j)
                } else if ((arr[i + 1][j - 1] === 0 && j > 0) && (arr[i + 1][j + 1] === 0 && j <= cols)) {
                    if (Math.random() > 0.5) {
                        moveSand(i, j, (i + 1), (j + 1));
                    } else {
                        moveSand(i, j, (i + 1), (j - 1));
                    }
                } else if (arr[i + 1][j - 1] == 0 && j > 0) {
                    moveSand(i, j, (i + 1), (j - 1));
                } else if (arr[i + 1][j + 1] == 0 && j < cols) {
                    moveSand(i, j, (i + 1), (j + 1))
                }
            }
        }
    }
    drawSand();
    requestAnimationFrame(mainSandLoop);
}

// main start function
const start = () => {
    rows = Math.round(canvas.height / sand);
    cols = Math.round(canvas.width / sand);
    arr = createArray(rows, cols);
    mainSandLoop();
    ctx.fillStyle = 'hsl(90,100%,50%)'
    ctx.fillRect(70 * sand, 80 * sand, sand, sand)
}


// for computer
document.onmousedown = (e) => {
    isMouseDown = true;
    E = e;
}
document.onmousemove = (e) => {
    E = e;
}
document.onmouseup = () => {
    isMouseDown = false;
}

// For mobile
document.ontouchstart = (e) => {
    isMouseDown = true;
    E = e;
}
document.ontouchmove = (e) => {
    E = e;
}
document.ontouchend = () => {
    isMouseDown = false;
}

// runss all the function when the code is fully loaded
window.onload = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    start();
}

window.onresize = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    start();
}