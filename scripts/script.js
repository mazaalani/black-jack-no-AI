import Board from "./Board.js";

(() => {
  let eForm = document.querySelector("form"),
    eBtn = eForm.querySelector("button"),
    audio = document.querySelector("[data-js-shuffle]");

  //clear la session storage
  window.addEventListener("load", () => {
    if (
      sessionStorage.getItem("nbGames") &&
      sessionStorage.getItem("nbPlayers")
    ) {
      sessionStorage.removeItem("nbGames");
      sessionStorage.removeItem("nbPlayers");
    }
  });

  eBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //creation de jeu au click sur jouer
    new Board(eForm.nbPlayers.value);
    //joue effet sonore melange du jeu de cartes
    audio.volume = 0.1;
    audio.play();
  });
})();
