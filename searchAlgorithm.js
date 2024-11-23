//Other Search Algorithm Implementation 
//Breadth First Search

const cities = [
    // { 
    //     name: 'Lagos', 
    //     lat: 6.45407, 
    //     lon: 3.39467 
    // },
    // { 
    //     name: 'Ikorodu', 
    //     lat: 6.5999976, 
    //     lon: 3.499998 
    // },
    // { 
    //     name: 'Ilorin', 
    //     lat: 8.49664, 
    //     lon: 4.54214 
    // },
    // { 
    //     name: 'Abuja', 
    //     lat: 9.05785, 
    //     lon: 7.49508 
    // },
    // { 
    //     name: 'Ile-ife', 
    //     lat: 7.4666648, 
    //     lon: 4.5666644 
    // },
    // { 
    //     name: 'Ilesa', 
    //     lat: 7.62789, 
    //     lon: 4.74161 
    // },
    // { 
    //     name: 'Iwo', 
    //     lat: 7.629209, 
    //     lon: 4.187218 
    // },
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

let bestRoute = null;
let bestDistance = Infinity;
let startCity = null;
let endCity = null;

// Graph of the Cities
function setup() {
    const canvas = createCanvas(800, 600);
    canvas.style('display', 'block');
    canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    background(220);

    shuffleStartAndEndCities();

    // Perform BFS
    bfsTSP();
}

// Shuffle start and end cities
function shuffleStartAndEndCities() {
    startCity = floor(random(cities.length));

    do {
        endCity = floor(random(cities.length));
    } while (startCity === endCity);
}

// BFS TSP Algorithm
function bfsTSP() {
    let initialRoute = [startCity];
    let visited = Array(cities.length).fill(false);
    visited[startCity] = true;

    // Initialize the queue with the first city
    let queue = [];
    queue.push({ route: initialRoute, visited });

    while (queue.length > 0) {
        let node = queue.shift();
        let { route, visited } = node;

        // Calculate cost when all cities have been visited
        if (route.length === cities.length) {
            let cost = calcRouteDistance(route);
            if (cost < bestDistance) {
                bestRoute = route;
                bestDistance = cost;
            }
            continue;
        }

        // Explore the next unvisited city and add to the queue
        for (let i = 0; i < cities.length; i++) {
            if (!visited[i]) {
                let newRoute = route.slice();
                newRoute.push(i);
                let newVisited = visited.slice();
                newVisited[i] = true;
                queue.push({ route: newRoute, visited: newVisited });
            }
        }
    }

    // Visualize the best route found
    drawCities();
    drawBestRoute();
}

// Calculate the total route distance
function calcRouteDistance(route) {
    let d = 0;
    for (let i = 0; i < route.length - 1; i++) {
        let cityA = cities[route[i]];
        let cityB = cities[route[i + 1]];
        d += calculateDistance(cityA.lat, cityA.lon, cityB.lat, cityB.lon);
    }
    // Include the distance from the last city to the end city
    let lastCity = cities[route[route.length - 1]];
    let finalCity = cities[endCity];
    d += calculateDistance(lastCity.lat, lastCity.lon, finalCity.lat, finalCity.lon);
    return d;
}

// Calculate the distance between two cities using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const r = 6371; 
    const dlat = deg2rad(lat2 - lat1);
    const dlon = deg2rad(lon2 - lon1);
    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return r * c;
}

// Convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Draw the cities on the canvas
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
        text(city.name, x, y + 20);
    }
}

// Draw the best route found
function drawBestRoute() {
    if (bestRoute) {
        noFill();
        beginShape();
        stroke('blue');
        strokeWeight(1);
        for (const index of bestRoute) {
            const city = cities[index];
            const x = map(city.lon, 3, 8, 50, width - 50);
            const y = map(city.lat, 6, 10, height - 50, 50);
            vertex(x, y);
        }

        const firstCity = cities[bestRoute[0]];
        const lastCity = cities[bestRoute[bestRoute.length - 1]];
        const x1 = map(firstCity.lon, 3, 8, 50, width - 50);
        const y1 = map(firstCity.lat, 6, 10, height - 50, 50);
        const x2 = map(lastCity.lon, 3, 8, 50, width - 50);
        const y2 = map(lastCity.lat, 6, 10, height - 50, 50);
        line(x2, y2, x1, y1); 

        endShape();
        fill('black');
        textSize(16);
        textAlign(CENTER, TOP);
        text(`Best Distance: ${bestDistance.toFixed(2)} km`, width / 2, 20);

        const pathText = bestRoute.map(i => cities[i].name).join(' → ');
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