var colors = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];
var mouseX = 0;
var mouseY = 0;
var press = false;
var pullTime = 0;

document.getElementById("canvas").onmousedown = function(event) {
    clickControl(event);
}


document.getElementById("canvas").onmousemove = function(event) {
    clickControl(event);
};

function clickControl(event) {

    mouseX = event.layerX;
    mouseY = event.layerY;
    if (event.buttons == 1 || event.buttons == 2)
        press = true;
    else
        press = false;
}

var pixelArray = [];
var RANGE2;
var w = $("body").width();
var h = $("body").height();
var SPH = {
    GRAVITY: 0.0,
    RANGE: 32,
    PRESSURE: 1,
    VISCOSITY: 0.05
};
var blur = false;
var white = true;
var currentCenter;

function tblur() {
    blur = ((blur == false) ? true : false)
}

function twhite() {
    white = ((white == false) ? true : false)
}
var initialize = (function() {
    var col = 0;
    $("#canvas").attr("width", $("body").width());
    $("#canvas").attr("height", $("body").height());

    RANGE2 = SPH.RANGE * SPH.RANGE;
    var DENSITY = 0.9;
    var NUM_GRIDSX = Math.floor(w / 5);
    var NUM_GRIDSY = Math.floor(h / 5);
    var INV_GRID_SIZEX = 1 / (w / NUM_GRIDSX);
    var INV_GRID_SIZEY = 1 / (h / NUM_GRIDSY);
    var canvas2 = document.getElementById('canvas');
    var ctx2 = canvas2.getContext('2d');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = $("body").width();
    canvas.height = $("body").height();
    var particles = [];
    var numParticles = 0;
    var neighbors = [];
    var numNeighbors = 0;
    var count = 0;

    var grids = [];
    var delta = 0;

    function tick() {
        delta++;
    }

    function frame(e) {
        var tempDelta = delta + 0;
        delta = 0;
        //calc();
        if (blur === false) {
            ctx.clearRect(0, 0, w, h);
        } else {
            white === false ? ctx.fillStyle = "rgba(0,0,0,.1)" : ctx.fillStyle = "rgba(255,255,255,.1)";
            ctx.fillRect(0, 0, w, h);
        }
        draw();
        ctx2.clearRect(0, 0, w, h);
        $("#canvas").attr("width", $("body").width());
        $("#canvas").attr("height", $("body").height());
        w = $("body").width();
        h = $("body").height();
        ctx2.drawImage(canvas, 0, 0);
        ctx2.fill();

        ctx.font = "30px Arial";
        ctx.fillText("" + SPH.RANGE, 10, 30);
    }

    function draw() {
        ctx.globalCompositeOperation = 'normal';

        blur === true ? white === false ? ctx.fillStyle = "rgba(0,0,0,.1)" : ctx.fillStyle = "rgba(255,255,255,.1)" : white === false ? ctx.fillStyle = "rgb(0,0,0)" : ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, w, h);
        var brightness = 128 + (white ? 100 : -60);
        ctx.strokeStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
        ctx.lineWidth = 1;
        for (var j = 10; j < w + 10; j += 20) {
            ctx.beginPath();
            ctx.moveTo(j + 0.5, 10);
            ctx.lineTo(j + 0.5, Math.round(h / 20) * 20 - 10);
            ctx.stroke();
        }
        for (var j = 10; j < h + 10; j += 20) {
            ctx.beginPath();
            ctx.moveTo(10, j + 0.5);
            ctx.lineTo(w - 10, j + 0.5);
            ctx.stroke();
        }
        for (var i = 0; i < numParticles; i++) {
            var p = particles[i];

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 4, 0, 2 * Math.PI, false);

            ctx.fillStyle = colors[i % 4];
            ctx.fill();
            currentCenter = p;
            var dist = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        }

        ctx.globalCompositeOperation = 'normal';


    }

    function calc() {

        updateGrids();
        findNeighbors();
        //calcPressure();
        calcForce();
        move(0.5);

    }

    function move(d) {
        pullTime++;
        count++;
        for (var i = 0; i < numParticles; i++) {
            var p = particles[i];
            for (var j = 0; j < d; j++) {
                p.move(i);
            }
        }
    }

    function attract() {
        count++;
        for (var i = 0; i < numParticles; i++) {
            var p = particles[i];
            for (var j = 0; j < 1; j++) {
                p.attract(1);
            }
        }
    }

    function updateGrids() {
        var i;
        var j;
        for (i = 0; i < NUM_GRIDSX; i++)
            for (j = 0; j < NUM_GRIDSY; j++)
                grids[i][j].clear();
        for (i = 0; i < numParticles; i++) {
            var p = particles[i];
            p.fx = p.fy = p.density = 0;
            p.gx = Math.floor(p.x * INV_GRID_SIZEX);
            p.gy = Math.floor(p.y * INV_GRID_SIZEY);
            if (p.gx < 0)
                p.gx = 0;
            if (p.gy < 0)
                p.gy = 0;
            if (p.gx > NUM_GRIDSX - 1)
                p.gx = NUM_GRIDSX - 1;
            if (p.gy > NUM_GRIDSY - 1)
                p.gy = NUM_GRIDSY - 1;
            grids[p.gx][p.gy].add(p);
        }
    }

    function findNeighbors() {
        numNeighbors = 0;
        for (var i = 0; i < numParticles; i++) {
            var p = particles[i];
            var xMin = p.gx !== 0;
            var xMax = p.gx != NUM_GRIDSX - 1;
            var yMin = p.gy !== 0;
            var yMax = p.gy != NUM_GRIDSY - 1;
            findNeighborsInGrid(p, grids[p.gx][p.gy]);
            if (xMin) findNeighborsInGrid(p, grids[p.gx - 1][p.gy]);
            if (xMax) findNeighborsInGrid(p, grids[p.gx + 1][p.gy]);
            if (yMin) findNeighborsInGrid(p, grids[p.gx][p.gy - 1]);
            if (yMax) findNeighborsInGrid(p, grids[p.gx][p.gy + 1]);
            if (xMin && yMin) findNeighborsInGrid(p, grids[p.gx - 1][p.gy - 1]);
            if (xMin && yMax) findNeighborsInGrid(p, grids[p.gx - 1][p.gy + 1]);
            if (xMax && yMin) findNeighborsInGrid(p, grids[p.gx + 1][p.gy - 1]);
            if (xMax && yMax) findNeighborsInGrid(p, grids[p.gx + 1][p.gy + 1]);
        }
    }

    function findPaintNeighbors(p) {
        var negs = [];
        var xMin = p.gx !== 0;
        var xMax = p.gx != NUM_GRIDSX - 1;
        var yMin = p.gy !== 0;
        var yMax = p.gy != NUM_GRIDSY - 1;
        findPaintNeighborsInGrid(p, grids[p.gx][p.gy], negs);
        if (xMin) findPaintNeighborsInGrid(p, grids[p.gx - 1][p.gy], negs);
        if (xMax) findPaintNeighborsInGrid(p, grids[p.gx + 1][p.gy], negs);
        if (yMin) findPaintNeighborsInGrid(p, grids[p.gx][p.gy - 1], negs);
        if (yMax) findPaintNeighborsInGrid(p, grids[p.gx][p.gy + 1], negs);
        if (xMin && yMin) findPaintNeighborsInGrid(p, grids[p.gx - 1][p.gy - 1], negs);
        if (xMin && yMax) findPaintNeighborsInGrid(p, grids[p.gx - 1][p.gy + 1], negs);
        if (xMax && yMin) findPaintNeighborsInGrid(p, grids[p.gx + 1][p.gy - 1], negs);
        if (xMax && yMax) findPaintNeighborsInGrid(p, grids[p.gx + 1][p.gy + 1], negs);
        return negs;
    }

    function findPaintNeighborsInGrid(pi, g, negs) {
        //var neigs=[];
        for (var j = 0; j < g.numParticles; j++) {
            var pj = g.particles[j];
            if (pi == pj)
                continue;
            var distance = (pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y);
            if (distance < (pi.size / 1.5 + pj.size / 1.5) * (pi.size / 1.5 + pj.size / 1.5)) {
                negs.push(pj);
            }
        }
    }

    function findNeighborsInGrid(pi, g) {
        for (var j = 0; j < g.numParticles; j++) {
            var pj = g.particles[j];
            if (pi == pj)
                continue;
            var distance = (pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y);
            if (distance < (pi.size / 1.5 + pj.size / 1.5) * (pi.size / 1.5 + pj.size / 1.5)) {
                if (neighbors.length == numNeighbors)
                    neighbors[numNeighbors] = new Neighbor();
                neighbors[numNeighbors++].setParticle(pi, pj);
            }
        }
    }

    function calcPressure() {
        for (var i = 0; i < numParticles; i++) {
            var p = particles[i];
            if (p.density < DENSITY)
                p.density = DENSITY;
            p.pressure = p.density - DENSITY;
        }
    }

    function calcForce() {
        for (var i = 0; i < numNeighbors; i++) {
            var n = neighbors[i];
            n.calcForce();
        }
    }
    return function() {
        for (var i = 0; i < NUM_GRIDSX; i++) {
            grids[i] = new Array(NUM_GRIDSY);
            for (var j = 0; j < NUM_GRIDSY; j++)
                grids[i][j] = new Grid();
        }
        for (var x = 0; x < w; x++) {
            var col = [];
            for (var y = 0; y < h; y++) {
                col[y] = 0;
            }
            pixelArray[x] = col;
        }
        for (var y = 0; y < h / 2; y += 20) {
            for (var x = 0; x < w / 2; x += 20) {
                var p = new Particle(Math.random() * w, Math.random() * h);
                p.vy = 0;
                particles[numParticles++] = p;
            }
        }
        window.addEventListener('mouseup', function(e) {
            press = false;
        }, false);
        window.setInterval(frame, 100);
        //window.setInterval(tick, 1);
        window.setInterval(calc, 1);
        window.setInterval(attract, 5);
    };
})();

var Particle = function(x, y) {
    this.x = x;
    this.y = y;
    this.gx = 0;
    this.gy = 0;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
    this.density = 0;
    this.pressure = 0;
    this.size = SPH.RANGE;

};
Particle.prototype = {
    move: function(i) {
        var _y1 = 0;
        var _x1 = 0;
        var _d = 0;
        _x1 = mouseX - this.x;
        _y1 = mouseY - this.y;
        if (Math.random() < 0.0005) {
            if (Math.random() < 0.5) {
                this.vx += Math.random() < 0.5 ? 1 : -1;
            } else {
                this.vy += Math.random() < 0.5 ? 1 : -1;
            }
        }

        this.vy += SPH.GRAVITY;
        this.x += this.fx //+Math.random()*0.1-0.05;
        this.y += this.fy //+Math.random()*0.1-0.05;
        this.x += this.vx;
        this.y += this.vy;
        this.vx = this.vx * 0.96;
        this.vy = this.vy * 0.96;
        if (this.x < 20)
            this.vx += (20 - this.x) * 0.5 - this.vx * 0.5;
        if (this.y < 20)
            this.vy += (20 - this.y) * 0.5 - this.vy * 0.5;
        if (this.x > w - 20)
            this.vx += ((w - 20) - this.x) * 0.5 - this.vx * 0.5;
        if (this.y > h - 20)
            this.vy += ((h - 20) - this.y) * 0.5 - this.vy * 0.5;
        this.x = this.x / 20 * 19.5 + Math.round(this.x / 20) / 2;
        this.y = this.y / 20 * 19.5 + Math.round(this.y / 20) / 2;
    },
    attract: function(i) {
        var _y1 = 0;
        var _x1 = 0;
        var _d = 0;
        _x1 = mouseX - this.x;
        _y1 = mouseY - this.y;
        _d = $("#slider")[0].value / ((_x1 * _x1 + _y1 * _y1));
        if (press) {
            if ((_x1 * _x1 + _y1 * _y1) < (1000 * 1000)) {
                this.vx += _x1 * _d;
                this.vy += _y1 * _d;
            }
        } else {
            _d = -1 / ((_x1 * _x1 + _y1 * _y1));
            if ((_x1 * _x1 + _y1 * _y1) < (10 * 10)) {
                this.vx += _x1 * _d;
                this.vy += _y1 * _d;
            }
        }


    }
};

var Neighbor = function() {
    this.p1 = null;
    this.p2 = null;
    this.distance = 0;
    this.nx = 0;
    this.ny = 0;
    this.weight = 0;
};
Neighbor.prototype = {
    setParticle: function(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.nx = p1.x - p2.x;
        this.ny = p1.y - p2.y;
        this.distance = Math.sqrt(this.nx * this.nx + this.ny * this.ny);
    },
    calcForce: function() {
        var p1 = this.p1;
        var p2 = this.p2;
        if (this.distance < this.p1.size / 2 + this.p2.size / 2 + 4) {
            var pressureWeight = (this.p1.size / 2 + this.p2.size / 2 + 4 - this.distance) / (this.distance + 10) * 0.5;

            p1.fx += this.nx * pressureWeight;
            p1.fy += this.ny * pressureWeight;
            p2.fx -= this.nx * pressureWeight;
            p2.fy -= this.ny * pressureWeight;

        }
    },
};

var Grid = function() {
    this.particles = [];
    this.numParticles = 0;
};
Grid.prototype = {
    clear: function() {
        this.numParticles = 0;
    },
    add: function(p) {
        this.particles[this.numParticles++] = p;
    }
};
document.getElementById("canvas").onwheel = function(e) {
    e.preventDefault();
    var event = window.event || e;
    var delta = 0;
    e.preventDefault();
    if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
        delta = -e.deltaY;
    } else if (e.wheelDelta) {
        delta = e.wheelDelta || -e.detail;
    }
    delta = Math.max(-1, Math.min(1, (delta)));
    slider.value -= (delta);
};
initialize();
