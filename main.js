class Wallet {
    constructor(money) {
        let _money = money;
        this.getValue = () => _money;
        this.canPlay = bet => {
            if (_money >= bet) return true;
            return false;
        }
        this.change = (bet, type = '+') => {
            if (typeof bet === 'number' || !isNaN(bet)) {
                if (type === '+') {
                    return _money += bet;
                } else if (type === '-') {
                    return _money -= bet;
                } else {
                    throw new Error('Equation error')
                }
            } else {
                console.log(typeof bet);
                throw new Error('Invalid number')
            }
        }
    }
}
class Stats {
    constructor() {
        this.results = [{ win: true, bet: 5 }, { win: false, bet: 5 }];
    }
    add(win, bet) {
        let result = { win, bet }
        this.results.push(result)
    }
    show() {
        let games = this.results.length;
        let wins = this.results.filter(result =>
            result.win
        ).length;
        let losses = this.results.filter(result =>
            !result.win
        ).length;
        return [games, wins, losses]
    }
}
class Roll {
    constructor() {
        this.options = ['red', 'green', 'blue'];
        let _result = this.result();
        this.getResult = () => _result;
    }
    result() {
        let colors = []; for (let i = 0; i < this.options.length; i++) {
            const index = Math.floor(Math.random() * this.options.length);
            const color = this.options[index];
            colors.push(color)
        } return colors
    }
}
const roll = new Roll()

class Rules {
    static prize(result, bet) {
        if (result) return 3 * bet;
        else return 0;
    }

    static checkWinner(roll) {
        if (roll[0] === roll[1] && roll[1] === roll[2]) {
            return true;
        } else return false
    }
}

class Game {
    constructor(money) {
        this.stats = new Stats();
        this.wallet = new Wallet(money);
        document.getElementById('start').addEventListener('click', this.start.bind(this));
        this.money = document.querySelector('.money');
        this.reels = document.querySelectorAll('.reel');
        this.inputBet = document.querySelector('.bet-input');
        this.message = document.querySelector('.message');
        this.games = document.querySelectorAll('.games');
        this.wins = document.querySelectorAll('.wins');
        this.losses = document.querySelectorAll('.losses');
        this.render();
    }
    render(colors = ['#111', '#111', '#111'], money = this.wallet.getValue(), message = 'Place your bet', stats = [0, 0, 0], bet = 0, prize = 0) {
        this.reels.forEach((reel, i) => {
            reel.style.backgroundColor = colors[i];
        })

        this.money.textContent = money;

        if (message) {
            message = `You won ${prize}!`;
        } else if (!message && message !== "") {
            message = `You lost ${bet}`;
        }
        this.message.textContent = message;
        this.games.textContent = stats[0];
        this.wins.textContent = stats[1];
        this.losses.textContent = stats[2];


    }
    start() {
        if (this.inputBet.value < 1) {
            return alert('Your bid is too low')
        }
        const bet = Math.floor(this.inputBet.value)
        if (!this.wallet.canPlay(bet)) {
            return alert('Not enough money')
        }
        this.wallet.change(bet, '-');
        this.roll = new Roll();
        const colors = this.roll.result();
        const walletValue = this.wallet.getValue();
        const win = Rules.checkWinner(colors);
        const prize = Rules.prize(win, bet);
        const currentStats = this.stats.show();
        this.wallet.change(prize);
        this.stats.add(win, bet);
        console.log(win)
        console.log(currentStats)
        console.log(bet)

        this.render(colors, walletValue, win, currentStats, bet, prize)
    }
}

const game = new Game(100);