var b, textArr, layoutArr, tickerArr, cols, rows,
    radius = 6,
    rounding = 0.75,
    distanceRateModifier = 2,
    distanceRateMultiplier = 1,
    fontSize = 50,
    spacingX = 50,
    spacingY = 50,
    pad = 100,
    chars = (location.search !== '' ? decodeURIComponent(location.search).slice(1) : '☁☼').split('');

var mouseMove = function(e) {
    var x = e.point.x - (b.position._x - (b.bounds.width / 2));
    var y = e.point.y - (b.position._y - (b.bounds.height / 2));

    var col = Math.floor(x / spacingX);
    var row = Math.floor(y / spacingY);

    for (var i = 0; i < cols; i++) {

        for (var ii = 0; ii < rows; ii++) {

            var t = textArr[i][ii];

            var distanceX = Math.abs(i - col);
            var distanceY = Math.abs(ii - row);

            var distance = distanceX + distanceY;

            if ((distanceX <= radius * rounding && distanceY <= radius * rounding) && distance <= radius) {
                t.ticker.rate = (distance + distanceRateModifier) * distanceRateMultiplier;

                // t.ticker.reset();
                // t.ticker.delayedReset(1000);
                t.ticker.delayedStop(500);

            } else {
                t.ticker.stop();
                // t.ticker.delayedStop(500);
            }

        }

    }

};

var ticker = function(t) {
    return {
        rate: 0,
        count: 0,
        resetTimeout: null,
        stopTimeout: null,

        init: function() {
            this.reset();
        },

        tick: function() {
            this.count++;

            if (this.rate > 0 && this.count >= this.rate) {
                this.count = 0;
                this.setChar(t.char === chars.length - 1 ? 1 : t.char + 1);

            } else if (this.rate === 0) {
                this.reset();
            }
        },

        delayedStop: function(delay) {
            delay = delay || 5000;

            if (this.resetTimeout !== null) { clearTimeout(this.resetTimeout); }

            if (this.stopTimeout === null) {
                var _this = this;

                this.stopTimeout = setTimeout(function(){
                    _this.stop();

                    _this.stopTimeout = null;
                }, delay);
            }
        },

        stop: function() {
            this.rate = 0;
            this.count = 0;
        },

        delayedReset: function(delay) {
            delay = delay || 1000;

            if (this.resetTimeout !== null) { clearTimeout(this.resetTimeout); }

            var _this = this;

            this.resetTimeout = setTimeout(function(){
                _this.reset(1);
            }, delay);
        },

        reset: function(i) {
            i = i || 0;

            this.count = i;
            this.setChar(i);
        },

        setChar: function(i) {
            t.char = i;
            t.content = chars[i];
        }

    };
};

var drawGrid = function() {
    tickerArr = [];
    layoutArr = [];
    textArr = [];

    var w = window.innerWidth - pad;
    var h = window.innerHeight - pad;

    cols = Math.floor(w / spacingX);
    rows = Math.floor(h / spacingY);

    var rectangle = new Rectangle(new Point(-spacingX / 2, -spacingY / 2), new Size(w - spacingX / 2, h - spacingY / 2));
    var path = new Path.Rectangle(rectangle);
    path.fillColor = new Color(0, 0, 0, 0);

    layoutArr.push(path);

    for (i = 0; i < cols; i++) {
        var columnArr = [];

        for (var ii = 0; ii < rows; ii++) {
            var t = new PointText();
            t.fontSize = fontSize;
            t.position = new Point(i * spacingX, ii * spacingY);

            t.ticker = new ticker(t);
            t.ticker.init();

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
