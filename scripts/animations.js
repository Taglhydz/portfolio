document.addEventListener('DOMContentLoaded', () => {
    const matrix = document.getElementById('matrix');
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
    const name = 'Tom Vaillant';
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

    function createCentralCharacter(columnIndex, centralIndex) {
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
                changeCentralCharacter(character, centralIndex);
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function changeCentralCharacter(character, index) {
        const changeInterval = setInterval(() => {
            character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
        }, 100);

        setTimeout(() => {
            clearInterval(changeInterval);
            character.innerText = nameCharacters[index % nameCharacters.length];
        }, 3500); // Changer les caractères pendant 4 secondes après l'arrêt de l'animation
    }

    function moveNameToTop() {
        centralCharacters.forEach((character, index) => {
            const leftPosition = (window.innerWidth / 2) - ((nameCharacters.length / 2) * columnWidth) + (index * columnWidth);
            character.style.transition = 'top 2s';
            character.style.left = `${leftPosition}px`;
            character.style.top = '10px';
        });
    }

    function checkEndAnimation() {
        if (matrix.children.length === 0 && !newCharacterCreation) {
            stopAnimation();
            moveNameToTop();
        }
    }

    function stopAnimation() {
        newCharacterCreation = false;
        intervals.forEach(clearInterval);
    }

    // créer des caractères dans chaque col
    columnsToDisplay.forEach((columnIndex, index) => {
        if (centralColumnIndices.includes(columnIndex)) {
            const centralIndex = centralColumnIndices.indexOf(columnIndex);
            createCentralCharacter(columnIndex, centralIndex);
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

    // arrete la creation de nouveaux caractères après 2.5 sec
    setTimeout(() => {
        newCharacterCreation = false;
    }, 2500);
});
