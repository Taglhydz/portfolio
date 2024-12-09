document.addEventListener('DOMContentLoaded', () => {
    const matrix = document.getElementById('matrix');
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
    const name = '';
    const namePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const nameCharacters = name.split('');
    const columnWidth = 15; // Largeur de chaque colonne en pixels
    const maxColumns = Math.floor(window.innerWidth / columnWidth);
    const displayedColumns = Math.floor(maxColumns * 0.75);
    const centralColumns = 12;
    let animationRunning = true;
    let intervals = [];
    let newCharacterCreation = true;
    let centralCharacters = [];

    const centralColumnIndices = [
        Math.floor(maxColumns / 2) - 5,
        Math.floor(maxColumns / 2) - 4,
        Math.floor(maxColumns / 2) - 3,
        Math.floor(maxColumns / 2) - 2,
        Math.floor(maxColumns / 2) - 1,
        Math.floor(maxColumns / 2),    
        Math.floor(maxColumns / 2) + 1,
        Math.floor(maxColumns / 2) + 2,
        Math.floor(maxColumns / 2) + 3,
        Math.floor(maxColumns / 2) + 4,
        Math.floor(maxColumns / 2) + 5,
        Math.floor(maxColumns / 2) + 6 
    ];

    // génère un tab de col aléatoires sans les col du milieu
    function getRandomColumns() {
        const allColumns = Array.from({ length: maxColumns }, (_, i) => i);
        const availableColumns = allColumns.filter(col => !centralColumnIndices.includes(col));
        const randomColumns = new Set();

        while (randomColumns.size < displayedColumns - centralColumns) {
            const randomIndex = Math.floor(Math.random() * availableColumns.length);
            randomColumns.add(availableColumns[randomIndex]);
        }

        return [...randomColumns, ...centralColumnIndices].sort((a, b) => a - b);
    }

    const columnsToDisplay = getRandomColumns();

    function createCharacter(columnIndex) {
        const character = document.createElement('div');
        character.className = 'character';
        character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));

        const leftPosition = columnIndex * columnWidth;
        character.style.left = `${leftPosition}px`;
        character.style.top = '0';
        matrix.appendChild(character);

        const speed = Math.random() * 5 + 3;
        let top = 0;

        function animate() {
            top += speed;
            character.style.top = `${top}px`;

            if (top >= window.innerHeight) {
                matrix.removeChild(character);
                checkEndAnimation();
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function createCentralCharacter(columnIndex) {
        const character = document.createElement('div');
        character.className = 'character';
        character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));

        const leftPosition = columnIndex * columnWidth;
        character.style.left = `${leftPosition}px`;
        character.style.top = '0';
        matrix.appendChild(character);

        const speed = Math.random() * 5 + 3;
        let top = 0;

        function animate() {
            top += speed;
            character.style.top = `${top}px`;

            if (top >= namePosition.y) {
                character.style.top = `${namePosition.y}px`;
                centralCharacters.push(character);
                changeCentralCharacter(character);
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function changeCentralCharacter(character) {
        const changeInterval = setInterval(() => {
            character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
        }, 100);

        setTimeout(() => {
            clearInterval(changeInterval);
            character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
        }, 5000); // Changer les caractères pendant 5 secondes après l'arrêt de l'animation
    }

    function checkEndAnimation() {
        if (matrix.children.length === 0 && !newCharacterCreation) {
            stopAnimation();
        }
    }

    function stopAnimation() {
        newCharacterCreation = false;
        intervals.forEach(clearInterval);
    }

    function createNameCharacter(char, index) {
        const character = document.createElement('div');
        character.className = 'character';
        character.innerText = char;
        character.style.left = `${namePosition.x - (nameCharacters.length * 10) / 2 + index * 20}px`;
        character.style.top = `${namePosition.y}px`;
        matrix.appendChild(character);
    }

    // créer des caractères dans chaque col
    columnsToDisplay.forEach(columnIndex => {
        if (centralColumnIndices.includes(columnIndex)) {
            createCentralCharacter(columnIndex);
            setInterval(() => {
                if (newCharacterCreation) {
                    createCharacter(columnIndex);
                }
            }, 85);
        } else {
            setInterval(() => {
                if (newCharacterCreation) {
                    createCharacter(columnIndex);
                }
            }, 85);
        }
    });

    nameCharacters.forEach((char, index) => {
        createNameCharacter(char, index);
    });

    // arrete la creation de nouveaux caractères après 2.5 sec
    setTimeout(() => {
        newCharacterCreation = false;
    }, 2500);
});
