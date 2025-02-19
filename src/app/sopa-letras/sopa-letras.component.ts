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
  words: string[] = ['angular', 'kirby'];
  square: number = 10;
  wordTrackers: { [word: string]: WordTracker } = {};
  correctPositions: Set<string> = new Set();

  ngOnInit(): void {
    this.soup = this.createMatrix(this.square, this.square);
    for (let i = 0; i < this.words.length; i++) {
      this.insertWord(this.words[i].toUpperCase());
      this.wordTrackers[this.words[i]] = new WordTracker(this.words[i].toUpperCase());
    }
  }

  createMatrix(rows: number, cols: number): string[][] {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const matrix: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < cols; j++) {
        const randomChar = letters.charAt(Math.floor(Math.random() * letters.length));
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
        for (let i = 0; i < word.length; i++) {
          this.soup[row][column + i] = word[i];
        }
        placed = true;
      } else if (direction === 1 && row + word.length <= this.square) {
        for (let i = 0; i < word.length; i++) {
          this.soup[row + i][column] = word[i];
        }
        placed = true;
      } else if (direction === 2 && row + word.length <= this.square && column + word.length <= this.square) {
        for (let i = 0; i < word.length; i++) {
          this.soup[row + i][column + i] = word[i];
        }
        placed = true;
      }
    }
  }

  onLetterClick(row: number, col: number): void {
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
          tracker.reset(); // Reiniciar el tracker para la siguiente palabra
        }
      }
    }

    if (!wordFound) {
      this.resetHighlights();
    }
  }

  highlightLetter(row: number, col: number, color: string): void {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.style.backgroundColor = color;
    }
  }

  resetHighlights(): void {
    this.selectedLetters.forEach(({ row, col }) => {
      this.highlightLetter(row, col, 'white');
    });
    this.selectedLetters = [];
  }

  markCorrectPositions(positions: Set<string>): void {
    positions.forEach(pos => {
      const [row, col] = pos.split(',').map(Number);
      this.highlightLetter(row, col, 'green');
      this.correctPositions.add(pos);
    });
    this.selectedLetters = [];
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
