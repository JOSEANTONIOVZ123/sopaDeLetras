import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sopa-letras',
  standalone: false,
  templateUrl: './sopa-letras.component.html',
  styleUrl: './sopa-letras.component.css'
})
export class SopaLetrasComponent implements OnInit{

  square:number= 30 // para hacer la sopa de letras 30X30
  letters =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  words:string[] = ['ANGULAR', 'TYPESCRIPT', 'HTML', 'CSS', 'JAVASCRIPT'];
  soup: string[][] = [];

  ngOnInit(): void {
    this.newSoup();
  }
  random = Math.random();

  //función para la sopita de letras que tengo hambre
  newSoup(){
    this.soup = Array.from({length: this.square},() =>
    Array.from({length: this.square},() =>
    this.letters.charAt(Math.random()*this.letters.length)));
    // console.log(this.soup)

    //insertar palabras
    this.words.forEach(element => { this.insertWord(this.words[1])});


  }


  insertWord(word: string) {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random()*this.square);
      let column = Math.floor(Math.random()*this.square);
      let direction = Math.floor(Math.random()*2) // 0: horizontal, 1:vertical
      console.log(row)
      console.log(column)
      console.log(direction)

      if (direction === 0 && column + word.length <= this.square) {
        for (let i = 0; i < word.length; i++) {
          this.soup[row][column+i]= word[i];
          console.log(this.soup[row][column+i]= word[i])
        }
        placed=true;
      }else if (direction === 1 && row + word.length <= this.square) {
        for (let i = 0; i < word.length; i++) {
          this.soup[row+i][column]= word[i];
        }
        placed=true;
      }
    }
  }
}

