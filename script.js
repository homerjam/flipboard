var b, textArr, layoutArr, tickerArr, cols, rows,
    radius = 4,
    rounding = 0.75,
    distanceRateMod = 2,
    spacing = 50,
    pad = 100,
    chars = (location.search !== '' ? decodeURIComponent(location.search).slice(1) : '•◎◉◎◉').split('');

var mouseMove = function(e) {
    var x = e.point.x - (b.position._x - (b.bounds.width / 2));
    var y = e.point.y - (b.position._y - (b.bounds.height / 2));

    var col = Math.floor(x / spacing);
    var row = Math.floor(y / spacing);

    for (var i = 0; i < cols; i++) {

        for (var ii = 0; ii < rows; ii++) {

            var t = textArr[i][ii];

            var distanceX = Math.abs(i - col);
            var distanceY = Math.abs(ii - row);

            var distance = distanceX + distanceY;

            if ((distanceX <= radius * rounding && distanceY <= radius * rounding) && distance <= radius) {
                t.ticker.rate = distance + distanceRateMod;

            } else {
                t.ticker.rate = t.ticker.count = 0;
            }

        }

    }

};

var ticker = function(t) {
    return {
        rate: 0,
        count: 0,

        tick: function() {
            this.count++;

            if (this.rate > 0 && this.count >= this.rate) {
                t.char = t.char === chars.length - 1 ? 1 : t.char + 1;
                t.content = chars[t.char];

                this.count = 0;

            } else if (this.rate === 0) {
                t.char = 0;
                t.content = chars[t.char];
            }

        }

    };
};

var drawGrid = function() {
    tickerArr = [];
    layoutArr = [];
    textArr = [];

    var w = window.innerWidth - pad;
    var h = window.innerHeight - pad;

    cols = Math.floor(w / spacing);
    rows = Math.floor(h / spacing);

    var rectangle = new Rectangle(new Point(-spacing / 2, -spacing / 2), new Size(w - spacing / 2, h - spacing / 2));
    var path = new Path.Rectangle(rectangle);
    path.fillColor = new Color(0, 0, 0, 0);

    layoutArr.push(path);

    for (i = 0; i < cols; i++) {
        var columnArr = [];

        for (var ii = 0; ii < rows; ii++) {
            var t = new PointText();
            t.char = 0;
            t.content = chars[t.char];
            t.fontSize = 40;
            t.position = new Point(i * spacing, ii * spacing);

            t.ticker = new ticker(t);

            tickerArr.push(t.ticker);

            layoutArr.push(t);

            columnArr.push(t);
        }

        textArr.push(columnArr);
    }

    b = new Layer({
        children: layoutArr,
        position: view.center
    });

    b.onMouseMove = mouseMove;
};

var onResize = function() {
    console.log('onResize');

    var w = window.innerWidth;
    var h = window.innerHeight;

    b.position = new Point(w / 2, h / 2);
};

drawGrid();

setInterval(function(){

    for (var i in tickerArr) {
        tickerArr[i].tick();
    }

    view.draw();

}, 50);
