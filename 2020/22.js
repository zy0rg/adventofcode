import {performance} from 'perf_hooks';

const deckLength = 50;
const max = deckLength - 1;

const count = (winner) => winner.reduce((res, card, i) => res + card * (winner.length - i), 0);

const game = (player1, player2) => {
    while (player1.length !== 0 && player2.length !== 0) {
        const card1 = player1.shift();
        const card2 = player2.shift();
        if (card1 > card2) {
            player1.push(card1, card2);
        } else {
            player2.push(card2, card1);
        }
    }
    return player2.length === 0;
}

const recursiveGameA = (player1, player2) => {
    const happened = new Set();
    let id = `${player1.join(',')}|${player2.join(',')}`;

    do {
        // console.log(id);
        happened.add(id);

        const card1 = player1.shift();
        const card2 = player2.shift();

        if ((card1 <= player1.length && card2 <= player2.length)
            ? recursiveGameA(player1.slice(0, card1), player2.slice(0, card2))
            : card1 > card2) {
            player1.push(card1, card2);
            if (player2.length === 0) {
                return true;
            }
        } else {
            player2.push(card2, card1);
            if (player1.length === 0) {
                return false;
            }
        }

        id = `${player1.join(',')}|${player2.join(',')}`;
    } while (!happened.has(id));

    return true;
}

const recursiveGame = (player1, player2) => {
    const happened = new Set();
    let length1 = player1.length;
    let length2 = player2.length;
    let id = `${player1.join(',')}|${player2.join(',')}`;
    // console.log(id);

    do {
        happened.add(id);

        const card1 = player1[0];
        const card2 = player2[0];

        if ((card1 < length1 && card2 < length2)
            ? recursiveGame(player1.slice(1, card1 + 1), player2.slice(1, card2 + 1))
            : card1 > card2) {
            const array = new Int16Array(++length1);
            array.set(player1.subarray(1));
            array[length1 - 2] = card1;
            array[length1 - 1] = card2;
            player1 = array;
            player2 = player2.subarray(1);
            if (length2 === 1) {
                return true;
            }
            length2--;
        } else {
            const array = new Int16Array(++length2);
            array.set(player2.subarray(1));
            array[length2 - 2] = card2;
            array[length2 - 1] = card1;
            player2 = array;
            player1 = player1.subarray(1);
            if (length1 === 1) {
                return false;
            }
            length1--;
        }

        id = `${player1.join(',')}|${player2.join(',')}`;
        // console.log(id);
    } while (!happened.has(id));

    return true;
}

const deckToString = (deck, from, length) => {
    const to = from + length;
    return to > deckLength
        ? `${
            Array.prototype.join.call(deck.subarray(from), ',')
        },${
            Array.prototype.join.call(deck.subarray(0, to - deckLength), ',')
        }`
        : Array.prototype.join.call(deck.subarray(from, to), ',')
};

const decks = [];
let nextDeck = 0;

const getDeck = (deck, from, length) => {
    let result;
    if (nextDeck === decks.length) {
        result = decks[nextDeck] = new Int16Array(deckLength);
        // console.log(nextDeck);
    } else {
        result = decks[nextDeck];
    }
    nextDeck++;

    const to = from + length;
    if (to > deckLength) {
        let j = 0;
        for (let i = from; i < deckLength; i++, j++) {
            result[j] = deck[i];
        }
        for (let i = 0; j < length; i++, j++) {
            result[j] = deck[i];
        }
    } else {
        for (let i = from, j = 0; j < length; i++, j++) {
            result[j] = deck[i];
        }
    }

    return result;
};

const subGame = (deck1, from1, length1, card1, deck2, from2, length2, card2) => {
    const sub1 = getDeck(deck1, from1, length1);
    const sub2 = getDeck(deck2, from2, length2);
    const result = recursiveArray(sub1, 0, card1, sub2, 0, card2);
    nextDeck -= 2;
    return result;
}

const recursiveArray = (deck1, from1, length1, deck2, from2, length2) => {
    const happened = new Set();

    while (length1 !== 0 && length2 !== 0) {
        const id = `${deckToString(deck1, from1, length1)}|${deckToString(deck2, from2, length2)}`;
        // console.log(id);
        if (happened.has(id)) {
            return true;
        }
        happened.add(id);
        const card1 = deck1[from1];
        const card2 = deck2[from2];
        length1--;
        length2--;
        from1 = from1 === max
            ? 0
            : from1 + 1;
        from2 = from2 === max
            ? 0
            : from2 + 1;

        if ((card1 <= length1 && card2 <= length2)
            ? subGame(deck1, from1, length1, card1, deck2, from2, length2, card2)
            : card1 > card2) {
            const one = (from1 + length1) % deckLength;
            deck1[one] = card1;
            deck1[one === max ? 0 : one + 1] = card2;
            length1 += 2;
        } else {
            const one = (from2 + length2) % deckLength;
            deck2[one] = card2;
            deck2[one === max ? 0 : one + 1] = card1;
            length2 += 2;
        }
    }

    return length2 === 0;
};

const test = `Player 1:
9
2
16
3
1
12
11
15

Player 2:
5
8
4
7
10
6
14
13`;

export default (input) => {
    const [player1, player2] = input.split('\n\n').map((str) => str.split('\n').slice(1).map((str) => +str));
    const recurse1a = player1.slice();
    const recurse1 = new Uint16Array(deckLength);
    const length1 = player1.length;
    recurse1.set(player1);
    const recurse2a = player2.slice();
    const recurse2 = new Uint16Array(deckLength);
    const length2 = player2.length;
    recurse2.set(player2);

    const result1 = game(player1, player2);
    const start = performance.now();
    // const result2 = recursiveArray(recurse1, 0, length1, recurse2, 0, length2);
    const end = performance.now();
    const start2 = performance.now();
    const result2a = recursiveGameA(recurse1a, recurse2a);
    const end2 = performance.now();

    // console.log(end - start, end2 - start2)
    //
    // console.log(recurse1)
    // console.log(recurse1a)

    return [
        count(result1 ? player1 : player2),
        count(result2a ? recurse1a : recurse2a)
    ];
}
