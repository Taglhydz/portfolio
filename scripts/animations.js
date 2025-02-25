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
    
    const fragment = document.createDocumentFragment();
    const characterPool = [];
    const POOL_SIZE = 100;

    for (let i = 0; i < POOL_SIZE; i++) {
        const char = document.createElement('div');
        char.className = 'character';
        characterPool.push({
            element: char,
            inUse: false
        });
    }

    function getCharacterFromPool() {
        const available = characterPool.find(char => !char.inUse);
        if (available) {
            available.inUse = true;
            return available.element;
        }
        const char = document.createElement('div');
        char.className = 'character';
        characterPool.push({ element: char, inUse: true });
        return char;
    }

    function returnToPool(element) {
        const poolChar = characterPool.find(char => char.element === element);
        if (poolChar) {
            poolChar.inUse = false;
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }

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
        const character = getCharacterFromPool();
        character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
        character.style.transform = `translateX(${columnIndex * columnWidth}px) translateY(0)`;
        character.style.willChange = 'transform';
        
        matrix.appendChild(character);

        const speed = Math.random() * 10 + 3;
        let y = 0;
        let lastTime = performance.now();

        function animate(currentTime) {
            if (!matrix.contains(character)) return;
            
            const deltaTime = Math.min(currentTime - lastTime, 32);
            lastTime = currentTime;
            
            y += speed * (deltaTime / 16.67);
            character.style.transform = `translateX(${columnIndex * columnWidth}px) translateY(${y}px) translateZ(0)`;

            if (y >= window.innerHeight + 20) {
                returnToPool(character);
                checkEndAnimation();
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function createCentralCharacter(columnIndex, centralIndex) {
        const character = getCharacterFromPool();
        character.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
        character.style.transform = `translateX(${columnIndex * columnWidth}px) translateY(0) translateZ(0)`;
        character.style.willChange = 'transform';
        
        matrix.appendChild(character);

        const speed = Math.random() * 5 + 3;
        let y = 0;
        let lastTime = performance.now();

        function animate(currentTime) {
            const deltaTime = Math.min(currentTime - lastTime, 32);
            lastTime = currentTime;
            
            y += speed * (deltaTime / 16.67);
            character.style.transform = `translateX(${columnIndex * columnWidth}px) translateY(${y}px) translateZ(0)`;

            if (y >= namePosition.y && !centralCharacters[centralIndex]) {
                const clone = getCharacterFromPool();
                clone.innerText = character.innerText;
                clone.style.transform = `translateX(${columnIndex * columnWidth}px) translateY(${namePosition.y}px) translateZ(0)`;
                clone.style.willChange = 'transform';
                matrix.appendChild(clone);
                centralCharacters[centralIndex] = clone;
                changeCentralCharacter(clone, centralIndex);
            }

            if (y >= window.innerHeight + 20) {
                returnToPool(character);
                checkEndAnimation();
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
                setTimeout(moveNameToTop, 1500);
            }
        }, 4500);
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
            character.style.transform = `translateX(${currentX}px) translateY(${namePosition.y}px) translateZ(0)`;
            currentX += characterWidths[index] + spacing;
        });
    }

    function moveNameToTop() {
        nameIsAtTop = true;
        centerName();
        
        centralCharacters.forEach((character, index) => {
            character.style.transition = 'all 0.5s ease';
            character.style.position = 'fixed';
            character.style.zIndex = '1000';
            const currentTransform = character.style.transform;
            const translateX = currentTransform.match(/translateX\((.*?)\)/)[1];
            character.style.transform = `translateX(${translateX}) translateY(20px) translateZ(0)`;
            
            setTimeout(() => {
                animatePopCharacter(character, index);
                resizeMatrix();
                showContent()
            }, 900);
        });
    }

    function showContent() {
        setTimeout(() => {
            
            const sections = document.querySelectorAll('main section');
            const footer = document.querySelector('footer');
            const header = document.querySelector('header');
            
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('visible');
                }, index * 200);
            });
    
            setTimeout(() => {
                footer.classList.add('visible');
                header.classList.add('visible');
            }, sections.length * 200);
        }, 1000);
    }
    

    function animatePopCharacter(character, index) {
        setTimeout(() => {
            const currentTransform = character.style.transform;
            const translateX = currentTransform.match(/translateX\((.*?)\)/)[1];
            const translateY = currentTransform.match(/translateY\((.*?)\)/)[1];
            
            character.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            character.style.transform = `translateX(${translateX}) translateY(${translateY}) scale(1.5) translateZ(0)`;
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

    function resizeMatrix() {
        matrix.style.height = '10vh';
        matrix.style.transition = 'opacity 0.5s ease';
    }

    window.addEventListener('resize', () => {
        centerName();
    });

    const columnsToDisplay = getRandomColumns();
    let lastSpawnTime = performance.now();
    
    function spawnCharacters(currentTime) {
        if (!newCharacterCreation) return;
        
        if (currentTime - lastSpawnTime >= 250) {
            columnsToDisplay.forEach((columnIndex) => {
                if (centralColumnIndices.includes(columnIndex)) {
                    const centralIndex = centralColumnIndices.indexOf(columnIndex);
                    if (!centralCharacters[centralIndex]) {
                        createCentralCharacter(columnIndex, centralIndex);
                    }
                } else {
                    createCharacter(columnIndex);
                }
            });
            lastSpawnTime = currentTime;
        }
        
        requestAnimationFrame(spawnCharacters);
    }

    requestAnimationFrame(spawnCharacters);

    setTimeout(() => {
        newCharacterCreation = false;
    }, 2500);
});