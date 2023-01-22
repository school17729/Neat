class Gene {
    constructor(innovationNumber) {
        if (typeof innovationNumber === "undefined") {
            // pass
        } else {
            assert(innovationNumber, "number");

            this.innovationNumber = innovationNumber;
        }
    }

    setInnovationNumber(value) {
        assert(value, "number");

        this.innovationNumber = value;
    }
}