; (function () {

  angular.module('the-quest')
    .component('gameComponent', {
      template: `
      <h3>REMAINING BOOST: {{$ctrl.player.boost.gauge}}</h3>
      <div class="field" tabindex="0" ng-keyDown="$ctrl.movePlayer($event)">
        <div class="player" style="top: {{$ctrl.player.pos.y}}%; left: {{$ctrl.player.pos.x}}%;"></div>
        <div ng-repeat="p in $ctrl.game.powerUps" class="boostUp" style="top: {{p.pos.y}}%; left: {{p.pos.x}}%; width: {{p.size}}px; height: {{p.size}}px;"></div>
      </div>
      `,
      controller: GameController
    })

  function GameController($interval) {
    let $ctrl = this;
    let maxPowerUps = 5;
    let bounds = {
      x: {
        high: 99,
        low: 0
      },
      y: {
        high: 97,
        low: 0
      }
    }

    $interval(function () {
      drawPowerUps()
    }, 10000)

    function PowerUp() {
      this.pos = {
        x: Math.floor(Math.random() * bounds.x.high),
        y: Math.floor(Math.random() * bounds.y.high)
      }
      this.val = Math.floor(Math.random() * 100);
      this.size = this.val * .2;
    }

    $ctrl.game = {
      powerUps: []
    }

    function drawPowerUps() {
      $ctrl.game.powerUps = [];
      for (var i = 0; i < Math.floor(Math.random() * maxPowerUps) + 1; i++) {
        $ctrl.game.powerUps.push(new PowerUp())
      }
    }

    $ctrl.player = {
      pos: {
        x: 0,
        y: 0
      },
      speed: 1,
      boost: {
        mod: 2,
        gauge: 100
      }
    }

    var directions = {
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN'
    }

    function checkBounds(x, y) {
      var pos = Object.assign({}, $ctrl.player.pos);
      pos.x += x;
      pos.y += y;

      if (pos.x < bounds.x.low || pos.x > bounds.x.high) {
        return false;
      }
      if (pos.y < bounds.y.low || pos.y > bounds.y.high) {
        return false;
      }
      return true;
    }

    function move(x, y) {
      var okayToMove = checkBounds(x, y)
      if (okayToMove) {
        $ctrl.player.pos.x += x;
        $ctrl.player.pos.y += y;
        checkCoords();
      }
    }

    function checkCoords(){
      $ctrl.game.powerUps.forEach(function(p, i){
        if(p.pos.x === $ctrl.player.pos.x && p.pos.y === $ctrl.player.pos.y){
          $ctrl.player.boost.gauge += p.val;
          $ctrl.game.powerUps.splice(i, 1);
        }
      })
    }

    $ctrl.movePlayer = (e) => {
      var moveSpeed = $ctrl.player.speed;

      if (e.shiftKey && $ctrl.player.boost.gauge > 0) {
        console.log('running')
        moveSpeed *= $ctrl.player.boost.mod;
        $ctrl.player.boost.gauge -= 1;
      }
      switch (e.keyCode) {
        case 37:
          move(-moveSpeed, 0)
          break;
        case 38:
          move(0, -moveSpeed)
          break;
        case 39:
          move(moveSpeed, 0)
          break;
        case 40:
          move(0, moveSpeed)
          break;
        default:
          console.log('nuh-uh-uhn')
          break;
      }
    }

  }

} ());