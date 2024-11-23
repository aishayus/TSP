//Problem Setup
//Genetic Algorithm
const cities = [
    { 
        name: 'Lagos', 
        lat: 6.45407, 
        lon: 3.39467 
    },
    { 
        name: 'Ikorodu', 
        lat: 6.5999976, 
        lon: 3.499998 
    },
    { 
        name: 'Ilorin', 
        lat: 8.49664, 
        lon: 4.54214 
    },
    { 
        name: 'Abuja', 
        lat: 9.05785, 
        lon: 7.49508 
    },
    { 
        name: 'Ile-ife', 
        lat: 7.4666648, 
        lon: 4.5666644 
    },
    { 
        name: 'Ilesa', 
        lat: 7.62789, 
        lon: 4.74161 
    },
    { 
        name: 'Iwo', 
        lat: 7.629209, 
        lon: 4.187218 
    },
    { 
        name: 'Osogbo', 
        lat: 7.7666636, 
        lon: 4.5666644 
    },
    { 
        name: 'Ila', 
        lat: 8.01667, 
        lon: 4.9 
    },
    { 
        name: 'Sagamu', 
        lat: 6.8485, 
        lon: 3.64633 
    },
    { 
        name: 'Ibadan', 
        lat: 7.37756, 
        lon: 3.90591 
    },
    { 
        name: 'Ogbomosho', 
        lat: 8.1333328, 
        lon: 4.249999 
    },
    { 
        name: 'Oyo', 
        lat: 7.85257, 
        lon: 3.93125 
    },
    { 
        name: 'Iseyin', 
        lat: 7.9666628, 
        lon: 3.5999976 
    },
    { 
        name: 'Shaki', 
        lat: 8.66762, 
        lon: 3.39393 
    },
];

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = radians(lat2 - lat1);
    const dLon = radians(lon2 - lon1);
    const a = sin(dLat / 2) * sin(dLat / 2) +
        cos(radians(lat1)) * cos(radians(lat2)) *
        sin(dLon / 2) * sin(dLon / 2);
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
}

function calculateDistanceMatrix() {
    const matrix = [];
    for (let i = 0; i < cities.length; i++) {
        const row = [];
        for (let j = 0; j < cities.length; j++) {
            const dist = haversineDistance(cities[i].lat, cities[i].lon, cities[j].lat, cities[j].lon);
            row.push(dist);
        }
        matrix.push(row);
    }
    return matrix;
}

let population = [];
let fitness = [];
let bestEver = [];
let bestDistance = Infinity;

function generateInitialPopulation(popSize = 100) {
    for (let i = 0; i < popSize; i++) {
        const route = shuffle([...Array(cities.length).keys()]);
        population.push(route);
    }
}

function calculateFitness() {
    for (let i = 0; i < population.length; i++) {
        const dist = calcDistance(cities, population[i]);
        fitness[i] = 1 / (dist + 1); // Minimize distance
        if (dist < bestDistance) {
            bestDistance = dist;
            bestEver = population[i].slice();
        }
    }
}

function normalizeFitness() {
    const sum = fitness.reduce((a, b) => a + b, 0);
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] /= sum;
    }
}

function calcDistance(cities, route) {
    let sum = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const cityA = cities[route[i]];
        const cityB = cities[route[i + 1]];
        sum += haversineDistance(cityA.lat, cityA.lon, cityB.lat, cityB.lon);
    }
    const lastCity = cities[route[route.length - 1]];
    const firstCity = cities[route[0]];
    sum += haversineDistance(lastCity.lat, lastCity.lon, firstCity.lat, firstCity.lon);
    return sum;
}

function nextGeneration() {
    const newPopulation = [];
    for (let i = 0; i < population.length; i++) {
        const parentA = selectOne(population, fitness);
        const parentB = selectOne(population, fitness);
        const child = crossover(parentA, parentB);
        mutate(child, 0.01);
        newPopulation.push(child);
    }
    population = newPopulation;
}

function selectOne(population, fitness) {
    let index = 0;
    let r = random(1);
    while (r > 0) {
        r -= fitness[index];
        index++;
    }
    index--;
    return population[index].slice();
}

function crossover(parentA, parentB) {
    const start = floor(random(parentA.length));
    const end = floor(random(start + 1, parentA.length));
    const child = parentA.slice(start, end);
    for (const gene of parentB) {
        if (!child.includes(gene)) {
            child.push(gene);
        }
    }
    return child;
}

function mutate(route, mutationRate) {
    for (let i = 0; i < route.length; i++) {
        if (random(1) < mutationRate) {
            const indexA = floor(random(route.length));
            const indexB = floor(random(route.length));
            [route[indexA], route[indexB]] = [route[indexB], route[indexA]];
        }
    }
}

function setup() {
    const canvas = createCanvas(800, 600);
    canvas.style('display', 'block');
    canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    generateInitialPopulation();

}

function draw() {
    background(220);

    calculateFitness();
    normalizeFitness();
    nextGeneration();

    drawCities();
    drawBestRoute();

}

function drawCities() {
    const latMin = 6;
    const latMax = 10;
    const lonMin = 3;
    const lonMax = 8;

    for (const city of cities) {
        const x = map(city.lon, lonMin, lonMax, 50, width - 50);
        const y = map(city.lat, latMin, latMax, height - 50, 50);

        fill('blue');
        ellipse(x, y, 10, 10);

        textAlign(CENTER);
        textSize(12);
        fill('black');
        text(city.name, x, y + 15);
    }
}

function drawBestRoute() {
    if (bestEver.length > 0) {
        noFill();
        beginShape();
        stroke('blue');
        strokeWeight(1);

        for (const index of bestEver) {
            const city = cities[index];
            const x = map(city.lon, 3, 8, 50, width - 50);
            const y = map(city.lat, 6, 10, height - 50, 50);
            vertex(x, y);
        }

        const firstCity = cities[bestEver[0]];
        const lastCity = cities[bestEver[bestEver.length - 1]];
        const x1 = map(firstCity.lon, 3, 8, 50, width - 50);
        const y1 = map(firstCity.lat, 6, 10, height - 50, 50);
        const x2 = map(lastCity.lon, 3, 8, 50, width - 50);
        const y2 = map(lastCity.lat, 6, 10, height - 50, 50);
        line(x2, y2, x1, y1);

        endShape();

        const bestDist = calcDistance(cities, bestEver);
        fill('black');
        textSize(16);
        textAlign(CENTER, TOP);
        text(`Best Distance: ${bestDist.toFixed(2)} km`, width / 2, 20);

        const pathText = bestEver.map(i => cities[i].name).join(' → ');
        const pathWords = pathText.split(' → ');
        fill(0);
        textSize(16);
        textAlign(CENTER, TOP);
        text("Best Path:", width / 2, 50);

        let lineHeight = 20;
        for (let i = 0; i < pathWords.length; i += 3) {
            const line = pathWords.slice(i, i + 3).join(' → ');
            text(line, width / 2, 70 + (i / 3) * lineHeight);
        }
    }
}
