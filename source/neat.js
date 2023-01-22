class Neat {

    static maxNodes = Math.pow(2, 20);

    static weightShiftStrength = 0.3;
    static weightRandomStrength = 1;

    static probabilityMutateLink = 0.2;
    static probabilityMutateNode = 0.2;
    static probabilityMutateWeightShift = 0.2;
    static probabilityMutateWeightRandom = 0.2;
    static probabilityMutateToggleLink = 0.2;

    constructor(inputCount, outputCount, clientCount) {
        assert(inputCount, "number");
        assert(outputCount, "number");
        assert(clientCount, "number");

        this.inputCount = 0;
        this.outputCount = 0;
        this.maxClientCount = 0;

        this.allConnections = new Map();
        this.allNodes = [];

        this.c1 = 1;
        this.c2 = 2;
        this.c3 = 3;



        this.reset(inputCount, outputCount, clientCount);
    }

    emptyGenome() {
        let genome = new Genome(this);
        for (let i = 0; i < this.inputCount + this.outputCount; i++) {
            genome.nodes.add(this.getNode(i + 1));
        }

        return genome;
    }

    reset(inputCount, outputCount, clientCount) {
        assert(inputCount, "number");
        assert(outputCount, "number");
        assert(clientCount, "number");

        this.inputCount = inputCount;
        this.outputCount = outputCount;
        this.maxClientCount = clientCount;

        this.allConnections.clear();
        this.allNodes = [];

        for (let i = 0; i < this.inputCount; i++) {
            let nodeGene = this.getNode();
            nodeGene.setX(0.1);
            nodeGene.setY((i + 1) / (this.inputCount + 1));
        }

        for (let i = 0; i < this.outputCount; i++) {
            let nodeGene = this.getNode();
            nodeGene.setX(0.9);
            nodeGene.setY((i + 1) / (this.outputCount + 1));
        }
    }

    getConnection(node1OrConnectionGene, node2) {
        if (node1OrConnectionGene instanceof ConnectionGene) {
            let connectionGene = node1OrConnectionGene;

            assertObject(connectionGene, ConnectionGene);

            let newConnectionGene = new ConnectionGene(connectionGene.from, connectionGene.to);
            newConnectionGene.setWeight(connectionGene.weight);
            newConnectionGene.setEnabled(connectionGene.enabled);

            return newConnectionGene;
        } else {
            let node1 = node1OrConnectionGene;

            assertObject(node1, NodeGene);
            assertObject(node2, NodeGene);

            let connectionGene = new ConnectionGene(node1, node2);

            if (this.allConnections.has(connectionGene.hashCode())) {
                connectionGene.setInnovationNumber(this.allConnections.get(connectionGene.hashCode()).innovationNumber);
            } else {
                connectionGene.setInnovationNumber(this.allConnections.size + 1);
                this.allConnections.set(connectionGene.hashCode(), connectionGene);
            }

            return connectionGene;
        }
    }

    getNode(id) {
        if (id) {
            assert(id, "number");

            if (id <= this.allNodes.length) {
                return this.allNodes[id - 1];
            }
            return this.getNode();
        } else {
            let nodeGene = new NodeGene(this.allNodes.length + 1);
            this.allNodes.push(nodeGene);
            return nodeGene;
        }
    }
}