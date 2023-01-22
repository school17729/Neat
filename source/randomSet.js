class RandomSet {
    constructor() {
        this.data = [];
    }

    contains(value) {
        assertObject(value, Object);

        if (value instanceof ConnectionGene) {
            let connection = value;
            assertObject(connection, ConnectionGene);

            let includes = false;
            for (let i = 0; i < this.data.length; i++) {
                assertObject(this.data[i], ConnectionGene);

                if (
                    this.data[i].from.innovationNumber === connection.from.innovationNumber &&
                    this.data[i].to.innovationNumber === connection.to.innovationNumber
                ) {
                    includes = true;
                }
            }

            return includes;
        }
        return this.data.includes(value);
    }

    count() {
        return this.data.length;
    }

    randomElement() {
        if (this.data.length > 0) {
            return this.data[Math.floor(Math.random() * this.count())];
        }
        return null;
    }

    add(value) {
        assertObject(value, Object);

        if (!this.contains(value)) {
            this.data.push(value);
        }
    }

    addSorted(value) {
        assertObject(value, Gene);

        for (let i = 0; i < this.count(); i++) {
            let innovation = this.data[i].innovationNumber;
            assert(innovation, "number");
            if (value.innovationNumber < innovation) {
                this.data.splice(i, 0, value);
                return;
            }
        }
        this.data.push(value);
    }

    get(indexOrValue) {
        if (typeof indexOrValue === "number") {
            let index = indexOrValue;

            assert(index, "number");

            if (index < 0 || index >= this.count()) {
                return null;
            }
            return this.data[index];
        } else {
            let value = indexOrValue;

            assertObject(value, Object);

            if (this.contains(value)) {
                return this.data[this.data.indexOf(value)];
            }
            return null;
        }
    }

    remove(indexOrValue) {
        if (typeof indexOrValue === "number") {
            let index = indexOrValue;

            assert(index, "number");

            if (index < 0 || index >= this.count()) {
                return;
            }
            this.data.splice(index, 1);
        } else {
            let value = indexOrValue;

            assertObject(value, Object);

            if (this.contains(value)) {
                this.data.splice(this.data.indexOf(value), 1);
            }
        }
    }
}