var w = window.innerWidth,
    h = window.innerHeight;
    
var slider = document.getElementById("slider");
var pull = false;
var blur = false;
var white = true;
var nodes = d3.range((w / 20) * (h / 20) / 4).map(function() {
    return {
        radius: 10 + Math.random() * 2.5
    };
});
var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
var force = d3.layout.force()
    .gravity(0)
    .charge(function(d, i) {
        return i ? 0 : 0;
    })
    .nodes(nodes)
    .size([w, h]);
var root = nodes[0];
root.radius = 0;
root.fixed = true;
force.start();
var canvas = d3.select("body")
    .append("canvas")
    .attr("width", w)
    .attr("height", h)
    .attr("position", "absolute")
    .attr("id", "canvas");
var context = canvas.node().getContext("2d");
force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
        i, d, n = nodes.length;
    for (i = 1; i < n;
        ++i) q.visit(collide(nodes[i]));
    blur === true ? white === false ? context.fillStyle = "rgba(0,0,0,.1)" : context.fillStyle = "rgba(255,255,255,.1)" : white === false ? context.fillStyle = "rgb(0,0,0)" : context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0, 0, w, h);
    var brightness = 128 + (white ? 100 : -60);
    context.strokeStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
    context.lineWidth = 1;
    for (var j = 10; j < w + 10; j += 20) {
        context.beginPath();
        context.moveTo(j + 0.5, 10);
        context.lineTo(j + 0.5, Math.round(h / 20) * 20 - 10);
        context.stroke();
    }
    for (var j = 10; j < h + 10; j += 20) {
        context.beginPath();
        context.moveTo(10, j + 0.5);
        context.lineTo(w - 10, j + 0.5);
        context.stroke();
    }
    for (i = 1; i < n; ++i) {
        d = nodes[i];
        nodes[i].color = colors[i % 6];
        context.beginPath();
        context.fillStyle = nodes[i].color;
        context.moveTo(d.x, d.y);
        context.arc(d.x, d.y, d.radius - 2, 0, 2 * Math.PI);
        context.fill();
    }
});

function brownian() {
    var i = 0,
        n = nodes.length;

    while (++i < n) {
        nodes[i].x = Math.max(Math.min(nodes[i].x, w - 10), 10);
        nodes[i].y = Math.max(Math.min(nodes[i].y, h - 10), 10);
        nodes[i].x = nodes[i].x / 100 * 95 + (Math.round(nodes[i].x / 20 + 0.5) * 20 - 10) / 100 * 5;
        nodes[i].y = nodes[i].y / 100 * 95 + (Math.round(nodes[i].y / 20 + 0.5) * 20 - 10) / 100 * 5;
        if (Math.random() < 0.001) {
            nodes[i].vx = Math.random() < 0.5 ? 1 : -1;
        }
        if (Math.random() < 0.001) {
            nodes[i].vy = Math.random() < 0.5 ? 1 : -1;
        }
        if (nodes[i].vx) {
            nodes[i].x = nodes[i].x + nodes[i].vx;
            nodes[i].vx = nodes[i].vx * 0.9;
        }
        if (nodes[i].vy) {
            nodes[i].y = nodes[i].y + nodes[i].vy;
            nodes[i].vy = nodes[i].vy * 0.9;
        }
    }
    force.resume();
}
canvas.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    if (pull === false) {
        force = force.charge(function(d, i) {
            return i ? 0 : 0;
        });
    } else {
        force = force.charge(function(d, i) {
            return i ? 0 : slider.value;
        });
    }
    force.start();
    force.resume();
});
canvas.on("mousedown", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    pull = true;
    force = force.charge(function(d, i) {
        return i ? 0 : slider.value;
    });
    force.start();
    force.resume();
});
canvas.on("mouseup", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    pull = false;
    force = force.charge(function(d, i) {
        return i ? 0 : 0;
    });
    force.start();
    force.resume();
});
canvas.on("mouseleave", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    pull = false;
    force = force.charge(function(d, i) {
        return i ? 0 : 0;
    });
    force.start();
    force.resume();
});
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
    slider.value -= (delta * 500);
    console.log(delta);
};

function tblur() {
    blur = ((blur == false) ? true : false)
}

function twhite() {
    white = ((white == false) ? true : false)
}

function collide(node) {
    var r = node.radius,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * 0.5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}
window.setInterval(brownian, 10);
