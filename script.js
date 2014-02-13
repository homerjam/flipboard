var b, tArr, lArr, cols, rows,
    s = 50,
    pad = 100,
    chars = (location.search !== '' ? decodeURIComponent(location.search).slice(1) : '☐⦿◉◎●○✪❏❐❑❒⧬⧭⧈⦾❥❡❁❈☂♁☯✇⚃⚒⚐⚑').split('');

var mouseMove = function(e) {
    var x = e.point.x - (b.position._x - (b.bounds.width / 2));
    var y = e.point.y - (b.position._y - (b.bounds.height / 2));

    var col = Math.floor(x / s);
    var row = Math.floor(y / s);

    // 1, 3, 4, 5, 9
    // var radius = 2;
    // var trimArr = [1, 2, 4, 5, 6, 10, 16, 20, 21, 22, 24, 25];

    // 1, 4, 5, 6, 11
    var radius = 3;
    var trimArr = [1, 2, 5, 6, 7, 12, 25, 30, 31, 32, 35, 36];
    var slowArr = [3, 4, 8, 11, 13, 18, 19, 24, 26, 29, 33, 34];
    var midArr = [9, 10, 16, 17, 20, 23, 27, 28];

    var count = 0;

    for (var i = 0; i < cols; i++) {

        for (var ii = 0; ii < rows; ii++) {

            var t = tArr[i][ii];

            if (i > col - radius && i < col + radius + 1 && ii > row - radius && ii < row + radius + 1) {
                count++;

                if (trimArr.indexOf(count) === -1) {

                    if (slowArr.indexOf(count) > -1) {
                        t.ticker.go(300);

                    } else if (midArr.indexOf(count) > -1) {
                        t.ticker.go(150);

                    } else {
                        t.ticker.go(50);
                    }
                    
                } else {
                    t.ticker.stop();
                }
                

            } else {

                t.ticker.stop();

            }

        }

    }

};

var ticker = function(t) {
    return {
        running: false,

        timeout: null,
        stopTimeout: null,

        rate: 100,

        go: function(rate) {
            var _this = this;

            if (rate !== undefined) this.rate = rate;

            if (!_this.running) {
                _this.running = true;

                _this.timeout = setTimeout(function() {
                    _this.running = false;

                    t.char = t.char === chars.length - 1 ? 0 : t.char + 1;
                    t.content = chars[t.char];

                    _this.go();
                }, _this.rate);
            }
        },

        stop: function() {
            var _this = this;
            // stopTimeout = setTimeout(function() {               
                if (_this.timeout) {
                    clearTimeout(_this.timeout);
                    _this.running = false;
                }
            // }, 500);
        }
    };
};

var drawGrid = function() {
    lArr = [];
    tArr = [];

    var w = window.innerWidth - pad;
    var h = window.innerHeight - pad;

    cols = Math.floor(w / s);
    rows = Math.floor(h / s);

    var rectangle = new Rectangle(new Point(-s / 2, -s / 2), new Size(w - s / 2, h - s / 2));
    var path = new Path.Rectangle(rectangle);
    path.fillColor = new Color(0, 0, 0, 0);

    lArr.push(path);

    for (i = 0; i < cols; i++) {
        var cArr = [];

        for (var ii = 0; ii < rows; ii++) {

            var t = new PointText();
            t.char = 0;
            t.content = chars[t.char];
            t.fontSize = 40;
            t.position = new Point(i * s, ii * s);
            t.ticker = new ticker(t);

            lArr.push(t);

            cArr.push(t);
        }

        tArr.push(cArr);
    }

    b = new Layer({
        children: lArr,
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
    view.draw();
}, 50);
