class Genome {
    static crossOver(genome1, genome2) {
        assertObject(genome1, Genome);
        assertObject(genome2, Genome);

        let neat = genome1.neat;
        let genome = neat.emptyGenome();

        let genome1Index = 0;
        let genome2Index = 0;

        while(genome1Index < genome1.connections.count() && genome2Index < genome2.connections.count()) {
            let gene1 = genome1.connections.get(genome1Index);
            let gene2 = genome2.connections.get(genome2Index);

            let innovation1 = gene1.innovationNumber;
            let innovation2 = gene2.innovationNumber;

            if (innovation1 === innovation2) {
                if (Math.random() > 0.5) {
                    genome.connections.add(neat.getConnection(gene1));
                } else {
                    genome.connections.add(neat.getConnection(gene2));
                }
                genome1Index++;
                genome2Index++;
            } else if (innovation1 > innovation2) {
                // genome.connections.add(neat.getConnection(gene2));
                genome1Index++;
            } else {
                genome.connections.add(neat.getConnection(gene1));
                genome2Index++;
            }
        }

        while (genome1Index < genome1.connections.count()) {
            let gene1 = genome1.connections.get(genome1Index);
            genome.connections.add(neat.getConnection(gene1));
            genome1Index++;
        }

        for (let i = 0; i < genome.connections.count(); i++) {
            genome.nodes.add(genome.connections[i].from);
            genome.nodes.add(genome.connections[i].to);
        }

        return null;
    }

    constructor(neat) {
        assertObject(neat, Neat);

        this.connections = new RandomSet();
        this.nodes = new RandomSet();

        this.neat = null;
    }

    distance(genome) {
        assertObject(genome, Genome);

        let genome1 = this;
        let genome2 = genome;

        let disjoint = 0;
        let excess = 0;
        let similar = 0;
        let weightDifference = 0;

        let genome1HighestInnovation = genome1.connections.get(genome1.connections.count() - 1).innovationNumber;
        let genome2HighestInnovation = genome2.connections.get(genome2.connections.count() - 1).innovationNumber;

        if (genome1HighestInnovation < genome2HighestInnovation) {
            let tempGenome = genome1;
            genome1 = genome2;
            genome2 = tempGenome;
        }

        let genome1Index = 0;
        let genome2Index = 0;

        while(genome1Index < genome1.connections.count() && genome2Index < genome2.connections.count()) {
            let gene1 = genome1.connections.get(genome1Index);
            let gene2 = genome2.connections.get(genome2Index);

            let innovation1 = gene1.innovationNumber;
            let innovation2 = gene2.innovationNumber;

            if (innovation1 === innovation2) {
                genome1Index++;
                genome2Index++;
                similar++;
                weightDifference += Math.abs(gene1.weight - gene2.weight);
            } else if (innovation1 > innovation2) {
                genome1Index++;
                disjoint++;
            } else {
                genome2Index++;
                disjoint++;
            }
        }

        weightDifference /= similar;
        excess = genome1.connections.count() - genome1Index;

        let n = Math.max(genome1.connections.count(), genome2.connections.count());
        if (n < 20) {
            n = 1;
        }



        return neat.c1 * disjoint / n + neat.c2 * excess / n + neat.c3 * weightDifference;
    }

    mutate() {
        if (Neat.probabilityMutateLink > Math.random()) {
            this.mutateLink();
        }
        if (Neat.probabilityMutateNode > Math.random()) {
            this.mutateNode();
        }
        if (Neat.probabilityMutateWeightShift > Math.random()) {
            this.mutateWeightShift();
        }
        if (Neat.probabilityMutateWeightRandom > Math.random()) {
            this.mutateWeightRandom();
        }
        if (Neat.probabilityMutateToggleLink > Math.random()) {
            this.mutateLinkToggle();
        }
    }

    // Creates a connection between two nodes
    mutateLink() {
        // 100 is just there because a while loop might never terminate if all possible connections have been made, but
        // it is also hard to generate possible connections randomly
        // TODO: Make this method better i.e. don't use i < 100; use an actual possible combination
        for (let i = 0; i < 100; i++) {
            let nodeA = this.nodes.randomElement();
            let nodeB = this.nodes.randomElement();

            if (nodeA.x === nodeB.x) {
                continue;
            }

            let connection = null;
            if (nodeA.x < nodeB.x) {
                connection = new ConnectionGene(nodeA, nodeB);
            } else {
                connection = new ConnectionGene(nodeB, nodeA);
            }

            if (this.connections.contains(connection)) {
                continue;
            }

            connection = neat.getConnection(connection.from, connection.to);
            connection.setWeight((Math.random() * 2 - 1) * Neat.weightRandomStrength);

            this.connections.addSorted(connection);

            return;
        }
    }

    // Replaces a connection by a node in the middle and two connections on either side of the node
    mutateNode() {
        let connection = this.connections.randomElement();

        if (connection === null) {
            return;
        }

        let from = connection.from;
        let to = connection.to;

        let middle = neat.getNode();
        middle.setX((from.x + to.x) / 2);
        middle.setY(((from.y + to.y) / 2) + ((Math.random() * 2 - 1) * 0.1));

        let connection1 = neat.getConnection(from, middle);
        let connection2 = neat.getConnection(middle, to);

        connection1.setWeight(1);
        connection2.setWeight(connection.weight);
        connection2.setEnabled(connection.enabled);

        this.connections.remove(connection);
        this.connections.add(connection1);
        this.connections.add(connection2);

        this.nodes.add(middle);
    }

    mutateWeightShift() {
        let connection = this.connections.randomElement();

        if (connection !== null) {
            connection.setWeight(connection.weight + (Math.random() * 2 - 1) * Neat.weightShiftStrength);
        }
    }

    mutateWeightRandom() {
        let connection = this.connections.randomElement();

        if (connection !== null) {
            connection.setWeight((Math.random() * 2 - 1) * Neat.weightRandomStrength);
        }
    }

    mutateLinkToggle() {
        let connection = this.connections.randomElement();

        if (connection !== null) {
            connection.enabled = !connection.enabled;
        }
    }
}