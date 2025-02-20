import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sopa-letras',
  standalone: false,
  templateUrl: './sopa-letras.component.html',
  styleUrls: ['./sopa-letras.component.css']
})
export class SopaLetrasComponent implements OnInit {
  selectedLetters: { row: number, col: number }[] = [];
  soup: string[][] = [];
  words: string[] = ['angular', 'kirby', 'hueso'];
  square: number = 10;
  wordTrackers: { [word: string]: WordTracker } = {};
  correctPositions: Set<string> = new Set();
  foundWords: Set<string> = new Set(); // Añadir esta línea
  allWordsFound: boolean = false; // Añadir esta línea

  ngOnInit(): void {
    this.soup = this.createMatrix(this.square,this.square);  // insertar las letras aleatorias lo pedido es 30x30
    for (let i = 0; i < this.words.length; i++) {
      this.insertWord(this.words[i].toUpperCase());  // insertar las palabras una por una
      this.wordTrackers[this.words[i]] = new WordTracker(this.words[i].toUpperCase());
    }
  }

  createMatrix(rows: number, cols: number): string[][] {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const matrix: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < cols; j++) {
        const randomChar = letters.charAt(Math.floor(Math.random() * letters.length));  // elige una letra aleatoria de la constante letters
        row.push(randomChar);
      }
      matrix.push(row);
    }
    return matrix;
  }

  insertWord(word: string) {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * this.square);
      let column = Math.floor(Math.random() * this.square);
      let direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal

      if (direction === 0 && column + word.length <= this.square) {
        for (let i = 0; i < word.length; i++) { // escribe letra por letra en la dirección X ->
          this.soup[row][column + i] = word[i];
          placed = true;
        }
      } else if (direction === 1 && row + word.length <= this.square) { // si es 1 es en vertical y pero escribe en -y (de arriba a abajo)
        for (let i = 0; i < word.length; i++) {
          this.soup[row + i][column] = word[i];
          placed = true;
        }
      } else if (direction === 2 && row + word.length <= this.square && column + word.length <= this.square) { // si es 2 entonces escribirá en diagonal de arriba a abajo es decir x+1, y+1
        for (let i = 0; i < word.length; i++) {
          this.soup[row + i][column + i] = word[i];
          placed = true;
        }
      }
    }
  }

  onLetterClick(row: number, col: number): void {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell && cell.classList.contains('blocked')) {
      return; // Salir si la celda está bloqueada
    }

    const letter = this.soup[row][col];
    this.selectedLetters.push({ row, col });
    this.highlightLetter(row, col, 'yellow');
    console.log(`Letra clicada: ${letter}`);

    let wordFound = false;
    for (const word in this.wordTrackers) {
      const tracker = this.wordTrackers[word];
      if (tracker.checkLetter(letter, row, col)) {
        wordFound = true;
        if (tracker.isComplete()) {
          this.markCorrectPositions(tracker.getPositions());
          console.log(`Palabra encontrada: ${word}`);
          this.foundWords.add(word.toLowerCase()); // Añadir esta línea
          tracker.reset(); // Reiniciar el tracker para la siguiente palabra
          this.checkWinCondition(); // Añadir esta línea
        } else {
          this.resetHighlights(tracker.getPositions());
        }
      }
    }

    if (!wordFound) {
      this.highlights();
    }
  }

  highlightLetter(row: number, col: number, color: string): void {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.style.backgroundColor = color;
    }
  }

  highlights(): void {
    this.selectedLetters.forEach(({ row, col }) => {
      this.highlightLetter(row, col, 'yellow');
    });
    this.selectedLetters = [];
  }

  resetHighlights(positions: Set<string>): void {
    positions.forEach(pos => {
      const [row, col] = pos.split(',').map(Number);
      this.highlightLetter(row, col, 'white');
      !this.correctPositions.add(pos);
    });
    this.selectedLetters = [];
  }

  markCorrectPositions(positions: Set<string>): void {
    positions.forEach(pos => {
      const [row, col] = pos.split(',').map(Number);
      this.highlightLetter(row, col, 'green');
      this.correctPositions.add(pos);
      this.blockCell(row, col); // Añadir esta línea
    });
    this.selectedLetters = [];
  }

  blockCell(row: number, col: number): void {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.classList.add('blocked');
    }
  }

  checkWinCondition(): void { // Añadir esta función
    if (this.words.length === this.foundWords.size) {
      this.allWordsFound = true;
    }
  }
}

class WordTracker {
  private word: string;
  private currentIndex: number;
  private positions: Set<string>;

  constructor(word: string) {
    this.word = word;
    this.currentIndex = 0;
    this.positions = new Set();
  }

  public checkLetter(letter: string, row: number, col: number): boolean {
    if (this.word[this.currentIndex] === letter) {
      const position = `${row},${col}`;
      this.positions.add(position);
      this.currentIndex++;

      if (this.currentIndex === this.word.length) {
        return true; // La palabra completa ha sido encontrada
      }
    } else {
      this.reset(); // Reiniciar si la letra no coincide
    }

    return false;
  }

  public reset(): void {
    this.currentIndex = 0;
    this.positions.clear();
  }

  public getPositions(): Set<string> {
    return this.positions;
  }

  public isComplete(): boolean {
    return this.currentIndex === this.word.length;
  }
}
