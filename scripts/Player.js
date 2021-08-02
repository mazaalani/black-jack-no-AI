import Card from "./Card.js";
import Game from "./Game.js";

export default class Player extends Game {
  constructor(el, deck) {
    super();
    this._deck = deck;
    this._el = el;
    this._number = this._el.dataset.jsPlayer;
    this._hand = this._el.querySelector("[data-js-hand]");
    this._stateDiv = this._el.querySelector("[data-js-state]");
    this._playBtn = this._el.querySelector("[data-js-play]");
    this._stopBtn = this._el.querySelector("[data-js-stop]");
    this._bubble = this._el.querySelector("[data-js-bubble]");
    this._scoreSpan =
      this._el.querySelector("[data-js-score]").firstElementChild;

    this._score = 0;

    this._avatar = this._el.querySelector("[data-js-avatar]");
    this._dialog = this._el.querySelector("[data-js-bubble]");
    this._audio = document.querySelector("[data-js-draw]");
    this.addAvatar();

    this.init();

    //DEBUG
    console.log(this);
  }

  init = () => {
    //DEBUT DE PARTIE: si premier joueur activer tour (delay à 1s)
    setTimeout(() => {
      if (this._number == 1) {
        this._el.classList.add("turn");
        this.toggleBubble();
      }
    }, 1000);
    //ecouteur au click sur le bouton jouer
    this._playBtn.addEventListener("click", () => {
      this.playTurn();
      this.updateTurns();
      this.checkPlayerScore();
    });
    //ecouteur au click sur le bouton arrêt
    this._stopBtn.addEventListener("click", () => {
      this.updateTurns();
      this.stopTurn();
    });
  };

  incrementScore = (score) => {
    this._score += score;
  };
  /* rajoute un avatar et un dialogue au hazard a chaque joueur */
  addAvatar = () => {
    this._avatar.src = `./img/icon/player${Math.floor(Math.random() * 7)}.png`;
    let dialogList = [
      "C'est mon tour!",
      "À moi!",
      "C'est à moi",
      "Mon tour",
      "Je joue",
    ];
    this._dialog.innerHTML =
      dialogList[Math.floor(Math.random() * (dialogList.length - 1))];
  };
  //actions au click sur jouer
  playTurn = () => {
    //creer la carte tirée
    let card = new Card(this._deck._cards.shift(), this);
    //MAJ score du joueur
    this.incrementScore(card._value);
    //joue effet sonore tirage carte
    this._audio.volume = 0.1;
    this._audio.play();
    //attendre fin animation de tirage de carte pour afficher score
    this._hand.addEventListener("animationend", () => {
      this._scoreSpan.innerHTML = this._score;
      this.stretchEffect();
    });
  };
  //effet sympa que j'ai trouver par hasard on jouant avec les prop dans .style de l'element
  stretchEffect = () => {
    this._scoreSpan.parentNode.style.width = "30px";
    setTimeout(() => {
      this._scoreSpan.parentNode.style.width = "";
    }, 50);
  };
  //retirer joueur des joueurs actifs
  stopTurn = () => {
    this._el.classList.add("stop");
    this._el.classList.remove("turn");
    this._bubble.classList.add("hidden");
    this.setState("stop");
    //si dernier joueur calculer score partie
    if (this.getPlayersList("actifs").length == 0) this.gameScore();
  };
  //verifier score du joueur et action si perdant
  checkPlayerScore = () => {
    if (this._score > 21) {
      this._el.classList.add("stop");
      this._el.classList.remove("turn");
      this._el.classList.add("loser");
      this._bubble.classList.add("hidden");
      //si dernier joueur calculer score partie
      if (this.getPlayersList("actifs").length == 0) this.gameScore();
      setTimeout(() => {
        this.setState("loser");
      }, 1000);
    }
  };
  //affiche et cache bulle dialogue
  toggleBubble = () => {
    this._bubble.classList.toggle("hidden");
  };
  //affiche Etat
  setState = (state) => {
    this._stateDiv.innerHTML = `<img src="./img/icon/${state}.png" class="state-img" />`;
  };
}
