let startGame = false; // флаг начала игры, устанавливается при play, запрещает перетаскивание кораблей

let  isHandlerPlacement = false; // ручное расположение кораблей;

let isHandlerController = false; // флаг установки обработчиков событий ведения морского боя;

let compShot = false; // флаг, блокирующий действия игрока во время выстрела компьютера;

// получаем объект элемента DOM по его ID
const getCoordinates  = el => {
    const coords = el.getBoundingClientRect();

    return {
        left: coords.left + window.scrollX,
        right: coords.right + window.scrollX,
        top: coords.right + window.scrollY,
        bottom: coords.bottom + window.scrollY
    };
};

// игровое поле игрока
const humanField = document.getElementById('field_human');
// игровое поле компьютера
const computerField = document.getElementById('field_computer');

class Field {
    // размер стороны игрового поля в px
    static FIELD_SIDE = 330;
    // размер палубы корабля в px
    static SHIP_SIDE = 33;
    // объект с данными кораблей
    // ключом будет являться тип корабля, а значением - массив,
    // первый элемент которого указывает кол-во кораблей данного типа,
    // второй элемент указывает кол-во палуб у корабля данного типа
    static SHIP_DATA = {
        fourDeck: [1, 4],
        tripleDeck: [2, 3],
        doubleDeck: [3, 2],
        singleDeck: [4, 1]
    };

    constructor(field) {
        // объект игрового поля, полученный в качестве аргумента
        this.field = field;
        // создаём пустой объект, куда будем заносить данные по каждому созданному кораблю
        // эскадры, подробно эти данные рассмотрим при создании объектов кораблей
        this.squadron = {};
        // двумерный массив, в который заносятся координаты кораблей, а в ходе морского
        // боя, координаты попаданий, промахов и заведомо пустых клеток
        this.matrix = [];
        // получаем координаты всех четырёх сторон рамки игрового поля относительно начала
        // document, с учётом возможной прокрутки по вертикали
        let { left, right, top, bottom } = getCoordinates(this.field);
        this.fieldLeft = left;
        this.fieldRight = right;
        this.fieldTop = top;
        this.fieldBottom = bottom;
    }

    // формирует двумерный массив и заполняет его нулями
    static createMatrix() {
        return [...Array(10)].map(() => Array(10).fill(0));
    }
    // n - максимальное значение, которое хотим получить
    static getRandom = n => Math.floor(Math.random() * (n + 1));

    cleanField() {
        while (this.field.firstChild) {
            this.field.removeChild(this.field.firstChild);
        }
        this.squadron = {};

        this.matrix = Field.createMatrix();
    }

    randomLocationShips() {
        for (let type in Field.SHIP_DATA) {
            // кол-во кораблей данного типа
            let count = Field.SHIP_DATA[type][0];
            // кол-во палуб у корабля данного типа
            let decks = Field.SHIP_DATA[type][1];
            // прокручиваем кол-во кораблей
            for (let i = 0; i < count; i++) {
                // получаем координаты первой палубы и направление расположения палуб
                let options = this.getCoordsDecks(decks);
                // кол-во палуб
                options.decks = decks;
                // имя корабля, понадобится в дальнейшем для его идентификации
                options.shipname = type + String(i + 1);
                // создаём экземпляр корабля со свойствами, указанными в
                // объекте options
                const ship = new Ships(this, options);
                ship.createShip();
            }
        }
    }


}
// родительский контейнер с инструкцией
const instruction = document.getElementById('instruction');
// контейнер, в котором будут размещаться корабли, предназначенные для перетаскивания
// на игровое поле
const shipsCollection = document.getElementById('ships_collection');
// контейнер с набором кораблей, предназначенных для перетаскивания
// на игровое поле
const initialShips = document.querySelector('.wrap + .initial-ships');
// контейнер с заголовком
const topText = document.getElementById('text_top');
// кнопка начала игры
const buttonPlay = document.getElementById('play');
// кнопка перезапуска игры
const buttonNewGame = document.getElementById('newgame');
// получаем экземпляр игрового поля игрока

const human = new Field(humanField);

let computer = {};

const typePlacement = document.getElementById('type_placement');
typePlacement.addEventListener('click', function (e) {
    if(e.target.tagName !== 'SPAN') {
        return;
    }

    buttonPlay.hidden = true;

    human.cleanField();

    const type = e.target.dataset.target;
    // создаём литеральный объект typeGeneration
    // каждому свойству литерального объекта соответствует функция
    // в которой вызывается рандомная или ручная расстановка кораблей

    const typeGeneration = {
        random() {
            // скрываем контейнер с кораблями, предназначенными для перетаскивания
            // на игровое поле
            shipsCollection.hidden = true;
            // вызов ф-ии рандомно расставляющей корабли для экземпляра игрока
            human.randomLocationShips();
        },

        manually() {

        }
    };
    typeGeneration[type] ();



});
