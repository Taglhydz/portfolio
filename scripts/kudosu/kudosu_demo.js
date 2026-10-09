// Démo Kudosu : le solveur Java original compilé en JavaScript avec TeaVM
import { solve, runTerminal } from './kudosu_solver.js';

const EXAMPLES = [
	'690170003802000700050240000060451000001730002000902506000504030030027948046003275',
	'530700904000400003040300007900045000180000000000098561406000002008900740000020096',
	'427319008000080000080402000130070065004005029008261300871500000006098703340620000',
	'040027000800640000070030908410900000003005002008000016084000000096000700150490820',
	'000340001050026000000000200005000102004062598000500004068010000302080910097000603',
	'600030750020040016000072000000010003180060024000900065700004001000000040400157038',
	'030000000500074100002800704701000003200006015060309007609040001058027000000190000',
	'000300900020001007000000150157000400090040000000106030030207000509000800600004500',
	'801000045000000706056000800090700100000080000000200538000040080427000010000090004',
	'000580470600000950200000000004002000702800004000030265000050000020703000080090006',
	'004300080000600009061900000020490000503000900000062003300004568780000040000000000',
	'050000000469000005000009300000507200100030000000000010600000007704200100800600042',
	'000070045400000800801000000080002000000590060210004000500400003002000007000600054',
	'050090010000000700000050406908002000070800000600540020000000062000703100506000000'
];

let lastExample = -1;
function randomExample() {
	let index;
	do {
		index = Math.floor(Math.random() * EXAMPLES.length);
	} while (index === lastExample);
	lastExample = index;
	return EXAMPLES[index];
}

/***** ONGLETS *****/
const tabs = document.querySelectorAll('.demo-tab');
tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		tabs.forEach(other => {
			const selected = other === tab;
			other.classList.toggle('active', selected);
			other.setAttribute('aria-selected', selected);
			document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
		});
		if (tab.id === 'tab-terminal') {
			terminalInput.focus();
			armIdleHint();
		} else {
			clearTimeout(idleTimer);
		}
	});
});

/***** INTERFACE *****/
const grid = document.getElementById('sudoku-grid');
const status = document.getElementById('demo-status');
const cells = [];

for (let i = 0; i < 81; i++) {
	const cell = document.createElement('input');
	const row = Math.floor(i / 9);
	const col = i % 9;
	cell.type = 'text';
	cell.inputMode = 'numeric';
	cell.maxLength = 1;
	cell.autocomplete = 'off';
	cell.className = 'sudoku-cell';
	cell.setAttribute('aria-label', `Ligne ${row + 1}, colonne ${col + 1}`);
	if (col === 2 || col === 5) cell.classList.add('box-right');
	if (row === 2 || row === 5) cell.classList.add('box-bottom');

	cell.addEventListener('keydown', event => {
		const moves = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 };
		if (event.key in moves) {
			event.preventDefault();
			cells[(i + moves[event.key] + 81) % 81].focus();
		}
	});

	cell.addEventListener('input', () => {
		// garde uniquement le dernier chiffre de 1 à 9 tapé
		const digits = cell.value.replace(/[^1-9]/g, '');
		cell.value = digits.slice(-1);
		cell.classList.toggle('given', cell.value !== '');
		clearSolution();
	});

	cell.addEventListener('focus', () => cell.select());

	cells.push(cell);
	grid.appendChild(cell);
}

function setStatus(message, type = '') {
	status.textContent = message;
	status.className = 'demo-status ' + type;
}

function clearSolution() {
	cells.forEach(cell => {
		if (cell.classList.contains('solved')) cell.value = '';
		cell.classList.remove('solved', 'conflict');
		cell.style.animationDelay = '';
	});
	setStatus('');
}

function loadGrid(sudokuString) {
	cells.forEach((cell, i) => {
		const value = sudokuString[i];
		cell.value = value === '0' ? '' : value;
		cell.className = cell.className.replace(/\b(given|solved|conflict)\b/g, '').trim();
		if (value !== '0') cell.classList.add('given');
	});
	setStatus('');
}

function readGrid() {
	return cells.map(cell => cell.value || '0').join('');
}

// renvoie les indices des cases en doublon (ligne, colonne ou carré)
function findConflicts(sudokuString) {
	const conflicts = new Set();
	for (let a = 0; a < 81; a++) {
		if (sudokuString[a] === '0') continue;
		for (let b = a + 1; b < 81; b++) {
			if (sudokuString[a] !== sudokuString[b]) continue;
			const sameRow = Math.floor(a / 9) === Math.floor(b / 9);
			const sameCol = a % 9 === b % 9;
			const sameBox = Math.floor(a / 27) === Math.floor(b / 27)
				&& Math.floor((a % 9) / 3) === Math.floor((b % 9) / 3);
			if (sameRow || sameCol || sameBox) {
				conflicts.add(a);
				conflicts.add(b);
			}
		}
	}
	return conflicts;
}

document.getElementById('btn-example').addEventListener('click', () => loadGrid(randomExample()));

document.getElementById('btn-clear').addEventListener('click', () => loadGrid('0'.repeat(81)));

document.getElementById('btn-solve').addEventListener('click', () => {
	clearSolution();
	const sudokuString = readGrid();

	if (!/[1-9]/.test(sudokuString)) {
		setStatus('Remplissez quelques cases ou chargez un exemple.', 'error');
		return;
	}

	const conflicts = findConflicts(sudokuString);
	if (conflicts.size > 0) {
		conflicts.forEach(i => cells[i].classList.add('conflict'));
		setStatus('La grille contient des doublons.', 'error');
		return;
	}

	const start = performance.now();
	const solution = solve(sudokuString);
	const elapsed = performance.now() - start;

	if (!solution) {
		setStatus('Aucune solution trouvée pour cette grille.', 'error');
		return;
	}

	cells.forEach((cell, i) => {
		if (cell.value === '') {
			cell.value = solution[i];
			cell.classList.add('solved');
			cell.style.animationDelay = `${i * 8}ms`;
		}
	});
	setStatus(`Grille résolue en ${elapsed.toFixed(1)} ms`, 'success');
});

/***** TERMINAL *****/
const terminalBody = document.getElementById('terminal-body');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalPanel = document.getElementById('demo-terminal');
const MAX_LINES = 3000;
let lineCount = 0;
let running = false;
let skipAnimation = false;

const ANSI_CLASSES = { 1: 'ansi-bold', 31: 'ansi-red', 36: 'ansi-cyan' };

function escapeHtml(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// convertit les codes couleur ANSI du SudokuDisplayer en HTML
function ansiToHtml(text) {
	let classes = [];
	let html = '';
	// le split alterne texte (indices pairs) et codes couleur (indices impairs)
	text.split(/\x1b\[([\d;]*)m/).forEach((part, i) => {
		if (i % 2 === 1) {
			for (const code of part.split(';')) {
				if (code === '0' || code === '') classes = [];
				else if (code in ANSI_CLASSES) classes.push(ANSI_CLASSES[code]);
			}
		} else if (part !== '') {
			html += classes.length ? `<span class="${classes.join(' ')}">${escapeHtml(part)}</span>` : escapeHtml(part);
		}
	});
	return html;
}

function print(html, lines) {
	const block = document.createElement('span');
	block.innerHTML = html;
	block.dataset.lines = lines;
	terminalOutput.appendChild(block);
	lineCount += lines;

	// limite la taille du DOM sur les grosses sorties
	while (lineCount > MAX_LINES && terminalOutput.firstChild) {
		lineCount -= Number(terminalOutput.firstChild.dataset.lines);
		terminalOutput.firstChild.remove();
	}
	terminalBody.scrollTop = terminalBody.scrollHeight;
}

function printLine(html = '') {
	print(html + '\n', 1);
}

function promptSudoku(focus = true) {
	printLine('<span class="term-prompt">tom@portfolio</span>:<span class="term-path">~/Kudosu/src</span>$ java Kudosu');
	printLine('Enter the sudoku to resolve :');
	running = false;
	terminalInput.disabled = false;
	if (focus) terminalInput.focus({ preventScroll: true });
	armIdleHint();
}

// affiche la sortie progressivement, comme dans un vrai terminal
function streamOutput(text) {
	const lines = text.split(/\r?\n/);
	const perFrame = Math.max(10, Math.ceil(lines.length / 150));
	let index = 0;

	return new Promise(resolve => {
		function frame() {
			const end = skipAnimation ? lines.length : Math.min(index + perFrame, lines.length);
			const chunk = lines.slice(index, end);
			print(ansiToHtml(chunk.join('\n') + '\n'), chunk.length);
			index = end;
			if (index < lines.length) requestAnimationFrame(frame);
			else resolve();
		}
		frame();
	});
}

async function runSudoku(input) {
	printLine(escapeHtml(input));
	const sudokuString = input.replace(/\s/g, '');

	if (!/^\d{81}$/.test(sudokuString)) {
		printLine(`<span class="ansi-red">Erreur : la grille doit contenir exactement 81 chiffres (0 pour les cases vides), ${sudokuString.length} caractère(s) reçu(s).</span>`);
		printLine();
		promptSudoku();
		hintExample();
		return;
	}

	running = true;
	skipAnimation = false;
	clearTimeout(idleTimer);
	terminalInput.disabled = true;
	// laisse le navigateur afficher la saisie avant le calcul
	await new Promise(resolve => setTimeout(resolve, 30));
	await streamOutput(runTerminal(sudokuString));
	promptSudoku();
}

terminalInput.addEventListener('keydown', event => {
	if (event.key === 'Enter' && !running) {
		const input = terminalInput.value;
		terminalInput.value = '';
		runSudoku(input);
	}
});

document.addEventListener('keydown', event => {
	if (running && (event.key === 'Escape' || (event.ctrlKey && event.key === 'c'))) {
		skipAnimation = true;
	}
});

terminalBody.addEventListener('click', () => {
	if (!window.getSelection().toString()) terminalInput.focus({ preventScroll: true });
});

terminalInput.addEventListener('input', armIdleHint);

/***** INDICE : FAIT CLIGNOTER « COLLER UN EXEMPLE » *****/
const exampleButton = document.getElementById('btn-term-example');
const IDLE_DELAY = 3000;
let idleTimer = null;
let terminalOnScreen = false;

function hintExample() {
	if (running) return;
	exampleButton.classList.remove('hint');
	void exampleButton.offsetWidth; // force le navigateur à relancer l'animation
	exampleButton.classList.add('hint');
}

// relance le compte à rebours d'inactivité, uniquement si le terminal est visible à l'écran
function armIdleHint() {
	clearTimeout(idleTimer);
	if (!terminalOnScreen || terminalPanel.hidden || running) return;
	idleTimer = setTimeout(() => {
		if (terminalInput.value === '') hintExample();
	}, IDLE_DELAY);
}

exampleButton.addEventListener('animationend', () => exampleButton.classList.remove('hint'));

new IntersectionObserver(([entry]) => {
	terminalOnScreen = entry.isIntersecting;
	if (terminalOnScreen) armIdleHint();
	else clearTimeout(idleTimer);
}, { threshold: 0.6 }).observe(document.querySelector('.terminal'));

exampleButton.addEventListener('click', () => {
	clearTimeout(idleTimer);
	exampleButton.classList.remove('hint');
	if (running) return;
	terminalInput.value = randomExample();
	terminalInput.focus();
});

printLine('<span class="term-comment"># Collez une grille de 81 chiffres (ligne par ligne, 0 = case vide) puis appuyez sur Entrée.</span>');
printLine('<span class="term-comment"># Échap pour passer l\'animation.</span>');
printLine();
promptSudoku(false);
loadGrid(randomExample());
