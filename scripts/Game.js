import Board from "./Board.js";
//Debut du jeu en creant les joueurs et gerant les tours + fin du jeu
export default class Game {
  constructor() {
    if (sessionStorage.getItem("nbGames"))
      this._counter = sessionStorage.getItem("nbGames");
    else this._counter = 1;
  }

  updateTurns = () => {
    //liste des joueurs actifs
    let playing = this.getPlayersList("play"),
      //numero du joueur suivant
      nextPlayer;
    //si 1 ou 0 joueurs qui joue
    if (playing.length <= 1) {
      //si le dernier est retirer
      if (playing.length == 0) {
        //rajouter stop dans class joueur
        this._allPlayers.forEach((player) => {
          if (playing[0] == player.dataset.jsPlayer) {
            player.classList.add("stop");
            this.gameScore();
          }
        });
      }
      //si joueurs actifs 1 ou plus
    } else {
      //chercher numero joueur suivant
      for (let i = 0; i < playing.length; i++) {
        if (this._number == playing[i]) {
          //si dernier dans la liste le prochain est index 0
          if (i == playing.length - 1) {
            nextPlayer = playing[0];
          } else {
            nextPlayer = playing[i + 1];
          }
        }
      }

      //DEBUG ==============================
      console.log(`suivant: ${nextPlayer}`);
      console.log(playing);
      //fin DEBUG ===========================

      //activer suivant
      this._allPlayers.forEach((player) => {
        if (player.dataset.jsPlayer == nextPlayer) {
          player.classList.add("turn");
          player.querySelector("[data-js-bubble]").classList.toggle("hidden");
        }
      });
      //desactiver actuel
      this._el.classList.remove("turn");
      this.toggleBubble();
    }
  };
  //cherche les joueurs sur la table en fonction de leur etat si jouent encore ou arrété
  getPlayersList = (state) => {
    this._allPlayers = document.querySelectorAll("[data-js-player]");
    let listResult = [],
      stopList = [],
      playList = [];

    this._allPlayers.forEach((player) => {
      if (player.classList.contains("stop")) {
        stopList.push(player.dataset.jsPlayer);
      } else {
        playList.push(player.dataset.jsPlayer);
      }
    });

    if (state == "stop") listResult = stopList;
    else listResult = playList;

    return listResult;
  };

  //Calculer score de la partie
  gameScore = () => {
    this._winners = [];
    //boucle pour prendre les joueurs avec les meilleurs scores dans winners
    for (let i = 21; i > 0; i--) {
      if (this._winners.length == 0) {
        for (let k = 0, l = this._allPlayers.length; k < l; k++) {
          if (
            parseInt(
              this._allPlayers[k].querySelector("[data-js-score]")
                .firstElementChild.innerHTML
            ) == i &&
            !this._allPlayers[k].classList.contains("loser")
          ) {
            this._winners.push(this._allPlayers[k]);
          }
        }
      }
    }

    setTimeout(() => {
      //affiche l'image de winner
      this._winners.forEach((winner) => {
        winner.querySelector(
          "[data-js-state]"
        ).innerHTML = `<img src="./img/icon/winner.png" class="state-img" />`;
        winner
          .querySelector("[data-js-state]")
          .firstElementChild.classList.add("win-animation");
      });
    }, 800);

    //fin du jeu affiche le reset
    setTimeout(() => {
      this.displayReset();
    }, 2000);
  };

  displayReset = () => {
    this._gameBoard =
      document.querySelector("[data-js-game]").firstElementChild;

    this._gameBoard.insertAdjacentHTML("beforeend", this.createReset());
    this._reset = this._gameBoard.querySelector("[data-js-reset]");
    this._reset.addEventListener("click", () => {
      this.reset();
    });
  };

  createReset = () => {
    return ` <div class='reset-div'>
                <button class="reset" data-js-reset>Rejouer</button>
                <div data-js-counter>
                    <span>Partie No: ${this._counter}</span>
                </div>
            </div>`;
  };
  reset = () => {
    //incrementer le compteur de parties
    this._counter++;
    sessionStorage.setItem("nbGames", this._counter);
    //ralncer le jeu
    this._gameBoard.parentNode.remove();
    new Board(sessionStorage.getItem("nbPlayers"));
  };
}
