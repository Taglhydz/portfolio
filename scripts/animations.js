document.addEventListener('DOMContentLoaded', () => {
    const matrix = document.getElementById('matrix');
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
    const name = 'Tom Vaillant';
    const namePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const nameCharacters = name.split('');
    const columnWidth = 15;
    const maxColumns = Math.floor(window.innerWidth / columnWidth);
    const displayedColumns = Math.floor(maxColumns * 0.75);
    const centralColumns = 12;
    let animationRunning = true;
    let intervals = [];
    let newCharacterCreation = true;
    let centralCharacters = [];
    let nameIsAtTop = false;

    // Ajuster le nombre de colonnes centrales en fonction de la longueur du nom
    const centralColumnIndices = Array.from(
        { length: name.length },
        (_, i) => Math.floor(maxColumns / 2) - Math.floor(name.length / 2) + i
    );

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

    function createCharacter(columnIndex) {
        const character = document.createElement('div');
        character.className = 'character';
        character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));

        const leftPosition = columnIndex * columnWidth;
        character.style.left = `${leftPosition}px`;
        character.style.top = '0';
        matrix.appendChild(character);

        const speed = Math.random() * 10 + 3;
        let top = 0;

        function animate() {
            top += speed;
            character.style.top = `${top}px`;

            // Calculer la hauteur réelle du caractère
            const characterHeight = character.offsetHeight;
            
            // Ne supprimer le caractère que lorsqu'il est complètement sorti de la vue
            if (top >= window.innerHeight + characterHeight) {
                if (matrix.contains(character)) {
                    matrix.removeChild(character);
                    checkEndAnimation();
                }
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
                centralCharacters[centralIndex] = character;
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
            character.innerText = nameCharacters[index];
            if (centralCharacters.filter(Boolean).length === nameCharacters.length) {
                setTimeout(moveNameToTop, 1000);
            }
        }, 3500);
    }

    function centerName() {
        if (!nameIsAtTop) return;

        const container = document.createElement('div');
        container.style.visibility = 'hidden';
        container.style.position = 'absolute';
        container.style.whiteSpace = 'nowrap';
        container.style.fontFamily = "'../ui/fonts/Montserrat-Black.ttf', sans-serif";
        container.style.fontSize = '15px';
        container.style.transform = 'scale(1.5)';
        
        const characterWidths = nameCharacters.map(char => {
            container.textContent = char;
            document.body.appendChild(container);
            const width = container.offsetWidth;
            document.body.removeChild(container);
            return width;
        });

        const spacing = 8;
        const totalWidth = characterWidths.reduce((sum, width) => sum + width, 0) + 
                          (spacing * (nameCharacters.length - 1));
        
        const startX = (window.innerWidth - totalWidth) / 2;
        
        let currentX = startX;
        centralCharacters.forEach((character, index) => {
            character.style.transition = 'all 0.5s ease';
            character.style.left = `${currentX}px`;
            currentX += characterWidths[index] + spacing;
        });
    }

    function moveNameToTop() {
        nameIsAtTop = true;
        centerName();
        
        centralCharacters.forEach((character, index) => {
            character.style.transition = 'all 0.5s ease';
            character.style.top = '20px';
            
            setTimeout(() => {
                animatePopCharacter(character, index);
            }, 1000);
        });
    }

    function animatePopCharacter(character, index) {
        setTimeout(() => {
            character.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            character.style.transform = 'scale(1.5)';
            character.style.fontFamily = "'../ui/fonts/Montserrat-Black.ttf', sans-serif";
            character.style.color = '#ffffff';
            character.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
            character.style.letterSpacing = 'normal';
        }, index * 100);
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

    window.addEventListener('resize', () => {
        centerName();
    });

    const columnsToDisplay = getRandomColumns();
    columnsToDisplay.forEach((columnIndex, index) => {
        if (centralColumnIndices.includes(columnIndex)) {
            const centralIndex = centralColumnIndices.indexOf(columnIndex);
            createCentralCharacter(columnIndex, centralIndex);
            const interval = setInterval(() => {
                if (newCharacterCreation) {
                    createCharacter(columnIndex);
                }
            }, 180);
            intervals.push(interval);
        } else {
            const interval = setInterval(() => {
                if (newCharacterCreation) {
                    createCharacter(columnIndex);
                }
            }, 180);
            intervals.push(interval);
        }
    });

    setTimeout(() => {
        newCharacterCreation = false;
    }, 2500);
});