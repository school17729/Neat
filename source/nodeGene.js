class NodeGene extends Gene {
    constructor(innovationNumber) {
        assert(innovationNumber, "number");
        super(innovationNumber);

        this.x = 0;
        this.y = 0;
    }

    setX(value) {
        assert(value, "number");

        this.x = value;
    }

    setY(value) {
        assert(value, "number");

        this.y = value;
    }

    equals(nodeGene) {
        assertObject(nodeGene, NodeGene);

        return this.innovationNumber === nodeGene.innovationNumber;
    }

    hashcode() {
        return this.innovationNumber;
    }
}