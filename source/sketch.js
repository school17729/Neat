let canvasWidth = 1920;
let canvasHeight = 969;

let neat = null;
let genome = null;

function setup() {
    setupDocument();
    setupCanvas();

    neat = new Neat(3, 3, 100);

    genome = neat.emptyGenome();
    console.log("genome.nodes: ", genome.nodes);
    console.log("genome.connections: ", genome.connections);
    for (let i = 0; i < 10; i++) {
        genome.mutateLink();
    }
    console.log("After genome.mutateLink():");
    console.log("genome.nodes: ", genome.nodes);
    console.log("genome.connections: ", genome.connections);
    genome.mutateNode();
    console.log("After genome.mutateNode():");
    console.log("genome.nodes: ", genome.nodes);
    console.log("genome.connections: ", genome.connections);
}

function draw() {
    noStroke();
    fill(0);
    rect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < genome.nodes.count(); i++) {
        drawNode(genome.nodes.get(i));
    }

    for (let i = 0; i < genome.connections.count(); i++) {
        drawConnection(genome.connections.get(i));
    }
}

function setupDocument() {
    let html = document.body.parentElement;
    let body = document.body;

    html.style.padding = "0px";
    html.style.margin = "0px";
    body.style.padding = "0px";
    body.style.margin = "0px";
}

function setupCanvas() {
    createCanvas(canvasWidth, canvasHeight);

    let canvases = document.querySelectorAll("canvas");
    for (let i = 0; i < canvases.length; i++) {
        canvases[i].style.display = "block";
    }

}

function drawNode(node) {
    assertObject(node, NodeGene);

    stroke(255);
    strokeWeight(3);
    noFill();
    ellipse(canvasWidth * node.x, canvasHeight * node.y, 30);
}

function drawConnection(connection) {
    assertObject(connection, ConnectionGene);

    let red = mapValue(connection.weight, -1, 1, 0, 255);
    let blue = 255 - red;
    stroke(red, 0, blue);

    if (!connection.enabled) {
        stroke(0, 255, 0);
    }

    strokeWeight(3);
    line(
        canvasWidth * connection.from.x,
        canvasHeight * connection.from.y,
        canvasWidth * connection.to.x,
        canvasHeight * connection.to.y
    );
}