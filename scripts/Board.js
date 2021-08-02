import Player from "./Player.js";
import Deck from "./Deck.js";

//creation table et lancement jeux
export default class Board {
  constructor(nb) {
    this._nbPlayers = parseInt(nb);
    //un seul jeu de cartes par jeu
    this._deck = new Deck();
    this._audio = document.querySelector("[data-js-shuffle]");
    this._music = document.querySelector("[data-js-music]");

    this.init();
  }

  init = () => {
    this.closeStart();
    this.createBoard();
    this.createPlayers();
    sessionStorage.setItem("nbPlayers", this._nbPlayers);
    this.playMusic();
  };

  //cache menu selection joueurs
  closeStart = () => {
    document.querySelector("form").classList.add("hidden");
  };
  //creer la table
  createBoard = () => {
    let contentDiv = document.querySelector(".content");
    contentDiv.insertAdjacentHTML(
      "beforeend",
      `<div class='game' data-js-game>
            <div data-js-board>
                <div data-js-players></div>
            </div>
        </div>`
    );
    this._playersDiv = document.querySelector("[data-js-players]");
  };
  //creer les joueurs (la banque est le joueur 0)
  createPlayers = () => {
    for (let i = 1; i < this._nbPlayers + 1; i++) {
      this._playersDiv.insertAdjacentHTML("beforeend", this.createPlayerUI(i));
      new Player(this._playersDiv.lastElementChild, this._deck);
    }
  };
  //creation element du joueur
  createPlayerUI = (i) => {
    let div = ` <div class='player player${i}' data-js-player = ${i}>
                    <div class="hand flex" data-js-hand>
                    </div>
                    <div class="player-ui center">
                        <div class="action flex">
                            <button class="play btn-green" data-js-play>Jouer</button>
                            <button class="stop btn-red" data-js-stop>Arrêter</button>
                        </div>
                        <div class="profile">
                            <span class='player-name'>Joueur${i}</span>
                            <img src="" class="profile" data-js-avatar/>
                            <div class='hidden' data-js-bubble>
                              <p></p>
                            </div>
                            <div data-js-score>                              
                                <span>0</span>                             
                            </div>
                        </div>
                    </div>
                    <div data-js-state></div>
                </div>`;
    return div;
  };

  playMusic = () => {
    this._audio.volume = 0.1;
    this._audio.play();
    this._music.loop = true; //https://www.w3schools.com/jsref/prop_audio_loop.asp
    this._music.volume = 0.05;
    this._music.play();
  };
}
