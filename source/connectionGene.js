class ConnectionGene extends Gene {
    constructor(from, to) {
        assertObject(from, NodeGene);
        assertObject(to, NodeGene);

        super();

        this.from = from;
        this.to = to;
        this.weight = 0;
        this.enabled = true;
    }

    setFrom(from) {
        assertObject(from, NodeGene);

        this.from = from;
    }

    setTo(to) {
        assertObject(to, NodeGene);

        this.to = to;
    }

    setWeight(value) {
        assert(value, "number");

        this.weight = value;
    }

    setEnabled(value) {
        assert(value, "boolean");

        this.enabled = value;
    }

    equals(connectionGene) {
        assertObject(connectionGene, ConnectionGene);

        return this.from.equals(connectionGene.from) && this.to.equals(connectionGene.to);
    }

    hashCode() {
        return this.from.innovationNumber * Neat.maxNodes + this.to.innovationNumber;
    }
}