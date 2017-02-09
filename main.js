$(document).ready(function() {
  const deck = [];
  let cardCounter = {};
  let points = 0;
  let livesLeft = 5;
  let pickedCard = {};
  let lastPickedCard = {};
  var lastScores = [];

  addToCardCounter = () => {
    for (i = 2; i <= 14; i++) {
      cardCounter[i] = 4;
    }
  }

  //formatera poäng
  formatPoints = (value) => {
    value = (value * 10).toFixed(0);
    return parseInt(value);
  }

  getLastScore = () => {
    if (localStorage.getItem('lastScores') === null) {
      $('#last-score-list').html('<li><span>Inga senaste poäng</span></li>');
    } else {
      let loadedLastScore = JSON.parse(localStorage.getItem('lastScores'));


      console.log(loadedLastScore);
      for (i = 0; i < loadedLastScore.length; i++) {

        lastScores.push(loadedLastScore[i]);
        console.log(lastScores);

        const scoreTemplate = `<li>
                                <span>Namn: ${loadedLastScore[i].name}</span>
                                <span>Poäng: ${loadedLastScore[i].score}</span>
                              </li>`;
        $('#last-scores-list').append(scoreTemplate);
        $('#last-scores').show();
      }
    }
  }

  setLastScore = (name, score) => {
    lastScores.push({name: name, score: score});
    console.log(lastScores);
    localStorage.setItem('lastScores', JSON.stringify(lastScores));
  }

  genDeck = () => {
    addToCardCounter();

    const suits = ['&clubs;', '&hearts;', '&diams;', '&spades;'];
    let color = 'black';
    for (i = 0, j = suits.length; i < j; i++) {
      for (k = 2; k <= 14; k++) {
        
        l = k
        if (l == 11) {l = 'Kn'}
        if (l == 12) {l = 'Q'}
        if (l == 13) {l = 'K'}
        if (l == 14) {l = 'A'}
        
        if (suits[i] == '&hearts;' || suits[i] == '&diams;') {
          color = 'red';
        }

        deck.push({
          suit: suits[i],
          value: k,
          name: l,
          color: color
        });
      }
    }
  }

  pickCard = () => {
    // slumpa position i kortlek
    const randm = Math.floor(Math.random()*deck.length);
    
    // ta bort kort från leken
    pickedCard = deck.splice(randm, 1);
    
    //skapa kort
    const card = `<div class="card">
                    <div class="front">
                      <span class="first-value" class="value">${pickedCard[0].name}</span>
                      <span class="suit ${pickedCard[0].color}">${pickedCard[0].suit}</span>
                      <span class="rotate" class="value">${pickedCard[0].name}</span>
                    </div>
                    <div class="back"></div>
                  </div>`;

    //visa kort för spelaren
    $('#played-cards').append(card);
    setTimeout(function() {
      $('.card').addClass('flipped');
    }, 200)
  }

  $('.points').text(points);
  $('#lives-left').text(livesLeft);
  //starta spelet
  $('.draw-card').on('click', function() {
    genDeck();
    pickCard();
    $('.welcome').hide();
    $('#reveal').show();
  });

  //starta om
  $('#restart').on('click', function() {
    const username = $('#username').val();
    
    setLastScore(username, points);

    location.reload();
  })

  //när spelaren trycker på en av knapparna
  $('.buttons').on('click', 'button', function() {
    if(deck.length === 0) {
      alert('Du vann. Grattis.')
      window.open('', '_self', ''); window.close();
    }

    //spara förra kortet för jämförelse
    lastPickedCard = pickedCard;

    //dra nytt kort
    pickCard();

    const pickedCardValue = pickedCard[0].value;
    const lastPickedCardValue = lastPickedCard[0].value;
    const pressedButtonValue = $(this).attr('data-name');

    //tar bort ett då det finns 1 mindre av det värdet i leken
    cardCounter[lastPickedCardValue] -= 1;

    var newPoint = 100 * (1/deck.length * 1/cardCounter[pickedCardValue]);

    //jämför om man tryckte rätt knapp
    if ((pickedCardValue > lastPickedCardValue && (pressedButtonValue == 'higher'))) {
      points += formatPoints(newPoint);
    } else if ((pickedCardValue == lastPickedCardValue && (pressedButtonValue == 'equal'))) {
      points += formatPoints(100 * ((1 / deck.length) * (1 / (deck.length - 1))));
    } else if ((pickedCardValue < lastPickedCardValue && (pressedButtonValue == 'lower'))) {
      points += formatPoints(newPoint);
    } else {
      livesLeft -= 1;
      
      //när spelaren inte har några försök kvar
      if (livesLeft === 0) {

        getLastScore();

        setTimeout(function() {
          $('.buttons button').attr("disabled" , 'disabled');
          $('.game-over').show();
        }, 1000);
      }
    }

    //för att inte avslöja om spelaren gissade rätt eller fel
    setTimeout(function() {
      $('.points').text(points);
      $('#lives-left').text(livesLeft);
    }, 1000);
  });

});