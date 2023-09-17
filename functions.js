function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}
function calculateBearing(lat1, lon1, lat2, lon2) {
    const latRad1 = degToRad(lat1);
    const lonRad1 = degToRad(lon1);
    const latRad2 = degToRad(lat2);
    const lonRad2 = degToRad(lon2);

    const lonDiff = lonRad2 - lonRad1;

    const y = Math.sin(lonDiff) * Math.cos(latRad2);
    const x = Math.cos(latRad1) * Math.sin(latRad2) - Math.sin(latRad1) * Math.cos(latRad2) * Math.cos(lonDiff);

    const bearingRad = Math.atan2(y, x);
    const bearingDeg = radToDeg(bearingRad);

    return (bearingDeg + 360) % 360;
}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    const latRad1 = degToRad(lat1);
    const lonRad1 = degToRad(lon1);
    const latRad2 = degToRad(lat2);
    const lonRad2 = degToRad(lon2);

    const latDiff = latRad2 - latRad1;
    const lonDiff = lonRad2 - lonRad1;

    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}
function calculateNewCoordinates(lat, lon, bearing, distance) {
    const earthRadius = 6371; // Earth's radius in kilometers

    // Convert distance from kilometers to radians
    const distanceRad = distance / earthRadius;

    // Convert latitude and longitude to radians
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;

    // Convert bearing from degrees to radians
    const bearingRad = (bearing * Math.PI) / 180;

    // Calculate the new latitude
    const newLat = Math.asin(
        Math.sin(latRad) * Math.cos(distanceRad) +
        Math.cos(latRad) * Math.sin(distanceRad) * Math.cos(bearingRad)
    );

    // Calculate the new longitude
    const newLon =
        lonRad +
        Math.atan2(
            Math.sin(bearingRad) * Math.sin(distanceRad) * Math.cos(latRad),
            Math.cos(distanceRad) - Math.sin(latRad) * Math.sin(newLat)
        );

    // Convert new latitude and longitude back to degrees
    const newLatDeg = (newLat * 180) / Math.PI;
    const newLonDeg = (newLon * 180) / Math.PI;

    // Return the new coordinates
    return [newLatDeg, newLonDeg];
}
function calculatePercentageRemaining(shipLat, shipLng, destination) {
    const shipLatRadians = shipLat * Math.PI / 180;
    const shipLngRadians = shipLng * Math.PI / 180;
    const destLatRadians = destination[0] * Math.PI / 180;
    const destLngRadians = destination[1] * Math.PI / 180;

    // Calculate the distance between the ship and destination using the haversine formula
    const earthRadius = 6371; // Earth's radius in kilometers
    const latDiff = destLatRadians - shipLatRadians;
    const lngDiff = destLngRadians - shipLngRadians;
    const a = Math.sin(latDiff / 2) ** 2 + Math.cos(shipLatRadians) * Math.cos(destLatRadians) * Math.sin(lngDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    // Calculate the percentage remaining
    const totalDistance = 100; // Assuming the total distance is 100 units (you can adjust this)
    const percentageRemaining = (totalDistance - distance) / totalDistance * 100;

    return percentageRemaining;
}
function calculateDestinationCoordinates(startLat, startLng, bearing, distance) { // Function to calculate the destination coordinates given a starting point, bearing, and distance
    const earthRadius = 6371; // Radius of the Earth in kilometers

    const angularDistance = distance / earthRadius;

    const startLatRad = (startLat * Math.PI) / 180;
    const startLngRad = (startLng * Math.PI) / 180;

    const destinationLat = Math.asin(Math.sin(startLatRad) * Math.cos(angularDistance) + Math.cos(startLatRad) * Math.sin(angularDistance) * Math.cos(bearing));
    const destinationLng = startLngRad + Math.atan2(Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(startLatRad), Math.cos(angularDistance) - Math.sin(startLatRad) * Math.sin(destinationLat));

    return [(destinationLat * 180) / Math.PI, (destinationLng * 180) / Math.PI]
}
function isObjectInRadar(ship1, ship2, radarCenterLat, radarCenterLng, radarRadius) {
    if (ship1 != null) {
        const distance = calculateDistance(ship1.lat, ship1.lon, radarCenterLat, radarCenterLng);
        if (distance <= radarRadius) { return ship1 }
    }
    if (ship2 != null) {
        const distance = calculateDistance(ship2.lat, ship2.lon, radarCenterLat, radarCenterLng);
        if (distance <= radarRadius) { return ship2 }
    }
    else { return false }

}
function decelerateShip(ship, targetSpeed, targetTime) {
    //console.log("Decrease per second: ", (ship.speed - targetSpeed) / targetTime)
    ship.speed = ship.speed - ((ship.speed - targetSpeed) / targetTime);
}
function accelerateShip(ship, targetSpeed, targetTime) {
    ship.speed = ship.speed + (Math.abs(targetSpeed - ship.speed) / targetTime)
}
function checkPositionRelativeToReference(lat, lng, referenceLat, referenceLng, type) {
    if (type == "lng") {
        if (Math.abs(lng) < Math.abs(referenceLng)) {
            return "pacific";
        }
        else {
            return "atlantic";
        }
    }
    else if (type == "lat") {
        if (Math.abs(lat) < Math.abs(referenceLat)) {
            return "pacific";
        } else {
            return "atlantic";
        }
    }
    else (console.log("ERROR, INVALID TYPE OF SEARCH FOR FUNCTION checkPositionRelativeToReference()"))
}
function fluctuateSpeed(ship) {
    var fluctuation = (Math.random() * 0.5) - 0.25; // Generate a random number between 0 and 2
    ship.speed = parseFloat(ship.speed) + fluctuation;
    console.log(ship.speed)
}
