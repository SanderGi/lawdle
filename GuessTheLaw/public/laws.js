// polyfill for Abort signal to abandon fetch requests after a certain time has elapsed. Use: fetch(url, { signal: AbortSignal.timeout(5000) })
AbortSignal.timeout ??= function timeout(ms) {
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort("took too long"), ms)
    return ctrl.signal
}

/// uses the GeoNames API to get the coordinates of a location by its name
export async function getCoordinate(locationName) {
    if (window.localStorage.getItem("coord-" + locationName.toLowerCase()) !== null) 
        return JSON.parse(window.localStorage.getItem("coord-" + locationName.toLowerCase())); // read local cache

    const username = 'sandergi';
    let response;
    let data;
    try {
        response = await fetch(`https://secure.geonames.org/searchJSON?q=${locationName}&maxRows=1&username=${username}`, { signal: AbortSignal.timeout(1500) });
        data = await response.json();
    } catch {
        console.log('falling back on axios');
        response = await axios.get(`http://api.geonames.org/searchJSON?q=${locationName}&maxRows=1&username=${username}`, { signal: AbortSignal.timeout(5000) });
        console.log(response);
        data = response.data;
    }
    const latitude = data.geonames[0].lat;
    const longitude = data.geonames[0].lng;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    window.localStorage.setItem("coord-" + locationName.toLowerCase(), JSON.stringify({lat: latitude, lng: longitude})); // save local cache
    return {lat: latitude, lng: longitude};
}

/// uses the Haversine formula to calculate the distance between the two locations in miles
export function getDistance(lat1, lon1, lat2, lon2) {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return -1;
    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
}

/// fetches a specific real law from the stupidlaws.txt file
export async function getRealLaw(id) {
    const response = await fetch('/stupidlaws.txt');
    const text = await response.text();
    const lines = text.split('\n');
    const ix = (3 * id) % lines.length;
    const source = lines[ix];
    const location = lines[ix + 1];
    const law = lines[ix + 2];
    console.log({source: source, location: location, law: law});
    return {source: source, location: location, law: law};
}

/// fetches a random real law from the stupidlaws.txt file
export async function getRandomLaw() {
    const response = await fetch('/stupidlaws.txt');
    const text = await response.text();
    const lines = text.split('\n');
    const ix = 3 * Math.floor(lines.length / 3 * Math.random());
    const source = lines[ix];
    const location = lines[ix + 1];
    const law = lines[ix + 2];
    console.log({source: source, location: location, law: law});
    return {source: source, location: location, law: law};
}

/// fetches a random fake law from the fakelaws.txt file
export async function getRandomFakeLaw() {
    const response = await fetch('/fakelaws.txt');
    const text = await response.text();
    const lines = text.split('\n');
    const ix = Math.floor(lines.length * Math.random());
    const law = lines[ix];

    const response2 = await fetch('/stupidlaws.txt');
    const text2 = await response2.text();
    const lines2 = text2.split('\n');
    const ix2 = 3 * Math.floor(lines2.length / 3 * Math.random());
    const location2 = lines2[ix2 + 1];

    console.log(location2 + " " + law);
    return {source: "ChatGPT", location: location2, law: law};
}

/// calculates the days from date_then to date_now
export function calcDaysSince(date_now=new Date(), date_then=new Date('2022/12/20')) {
    const difference = date_now.getTime() - date_then.getTime();
    const TotalDays = Math.floor(difference / (1000 * 3600 * 24));
    return TotalDays;
}

const locations = ['Alamosa', 'Galesburg', 'Berea', 'Kenosha', 'Winston-Salem', 'Hartford', 'Purdy', 'Mesa', 'Deming', 'Newcastle', 'Barre', 'Daytona Beach', 'Washington, DC', 'Brandon', 'Providence', 'Helena', 'Sheboygan', 'Sioux Falls', 'McDonald', 'Topeka', 'Wynona', 'Albuquerque', 'Cumberland', 'Borger', 'Marquette', 'Ottawa', 'Mount Vernon', 'Albany', 'Galveston', 'Centerville', 'Connellsville', 'Kirkland', 'Wisconsin', 'Prince William County', 'Sydney', 'Natchez', 'Everett', 'Halethrope', 'Trenton', 'Portola', 'Paris', 'North Carolina', 'Colorado', 'Fort Madison', 'Nicholas County', 'Thomasville', 'Canton', 'Fenwick Island', 'Bartlesville', 'Hazelhurst', 'El Monte', 'Oxford', 'Mooresville', 'Freeport', 'Arkansas', 'Reno', 'Frankfort', 'Willamantic', 'Minnesota', 'Melbourne', 'Ramat', 'Horner', 'Ottumwa', 'Pocatello', 'Ontario', 'Staten Island', 'Crystal Lake', 'Terre Haute', 'Guilford', 'Bell Buckle', 'England', 'Clemson', 'Long Beach', 'Lafayette', 'Jackson', 'Wyoming', 'Hallowell', 'Shasta Lake', 'Mobile', 'Pacific Grove', 'Fayetteville', 'Cripple Creek', 'University City', 'Derby', 'Woburn', 'Idaho', 'Waverly', 'Bahrain', 'Bremerton', 'Texarkana', 'Newport', 'Chillicothe', 'Cobourg', 'Marietta', 'Australia', 'Cape Coral', 'Lowell', 'Rumford', 'Beaumont', 'Fargo', 'Sweden', 'Rockville', 'Alexandria', 'Indianola', 'Montgomery', 'Missouri', 'Aberdeen', 'Hastings', 'Delaware', 'Denver', 'Fairbanks', 'Alderson', 'Marlboro', 'Thousand Oaks', 'Queensland', 'Greene', 'Belhaven', 'Key West', 'Montana', 'Augusta', 'Pueblo', 'Lang', 'Clinton', 'Wayland', 'Lebanon', 'Carbondale', 'Omaha', 'Connorsville', 'Arizona', 'Indianapolis', "Coeur d'Alene", 'Scituate', 'Ottowa', 'Philadelphia', 'Atlanta', 'Clark County', 'Oklahoma City', 'Ada', 'Los Angeles', 'West Warwick', 'Hazelton', 'Kaysville', 'Buffalo', 'China', 'Prescott', 'Lee County', 'Clarendon', 'New Britain', 'Indiana', 'Oakland', 'Wallace', 'Sarasota', 'West Virginia', 'San Antonio', 'Harker Heights', 'Isle of Jersey', 'Elkhart', 'Waldron Island', 'Indonesia', 'Chico', 'Montreal', 'Eugene', 'Murray', 'France', 'Temple', 'The Netherlands', 'Zebulon', 'Salem', 'Fayette County', 'Abilene', 'South Bethany', 'Wilbur', 'Kalispell', 'Quitman', 'Culpeper', 'Lewes', 'Vermont', 'Myrtle Creek', 'Bromide', 'New Jersey', 'Lima', 'Bernards Township', 'Hayden', 'International Falls', 'Quebec', 'Elon College', 'Nahant', 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch', 'Victoria', 'Clinton County', 'Dublin', 'Haines City', 'Chapel Hill', 'Marblehead', 'Chester', 'Greenville', 'Ridgeland', 'Longbern', 'Maine', 'Vail', 'Harper Woods', 'Hood River', 'Prunedale', 'Provo', 'Mole', 'Detroit', 'Lancaster County', 'Sag Harbor', 'Nashville', 'Tremonton', 'Elko', 'Port Arthur', 'Louisville', 'Stafford County', 'Greece', 'Palm Springs', 'Salt Lake County', 'Salina', 'Hollywood', 'Ventura County', 'Richardson', 'Mount Laurel', 'Waterbury', 'Akron', 'Cottage Grove', 'Cranford', 'Cicero', 'Rhode Island', 'Logan', 'Ireland', 'Wales', 'Hialeah', 'Russell', 'Saudi Arabia', 'Zion', 'Alberta', 'Etobicoke', 'Italy', 'Oklahoma', 'Kanata', 'Hawaii', 'Guadalajara', 'Tulsa', 'Morrisville', 'Miami', 'St. Cloud', 'Connecticut', 'Athens', 'Charleston', 'Newton', 'Electric City', 'Alamo', 'Dallas', 'Southbridge', 'Haines', 'Evansville', 'Moline', 'Guelph', 'Newark', 'Peachtree City', 'Brussels', 'Dubuque', 'Radford', 'Hopkinton', 'Norco', 'Haddon', 'Roswell', 'Texas', 'Soldotna', 'Tucson', 'Denmark', 'Paulding', 'Santa Cruz', 'Germany', 'Whitehall', 'Pennsylvania', 'Frederick', 'Sanford', 'Thailand', 'Morton Grove', 'Ellsworth', 'South Carolina', 'Perryville', 'Trout Creek', 'Norway', 'Massachusetts', 'Brainerd', 'Knoxville', 'Indian Wells', 'Longyearbyen', 'North Andover', 'São Luis', 'Alhambra', 'French Lick Springs', 'Cerritos', 'Destin', 'New Orleans', 'Olympia', 'Dyersburg', 'New Mexico', 'United Kingdom', 'Holyoke', 'Edgeworth', 'United States', 'Fairview Park', 'Auburn', 'St. Croix', 'Washington', 'Baltimore', 'Michigan', 'Switzerland', 'Bangladesh', 'Naples', 'Brewton', 'Seattle', 'Hong Kong', 'Lehigh', 'Ohio', 'Kansas City', 'Gary', 'Uxbridge', 'Cathedral City', 'Liberty', 'Belmont', 'Millville', 'North Dakota', 'Danville', 'South Africa', 'Argentina', 'Riverside', 'Hibbing', 'Arvada', 'Gainesville', 'Little Rock', 'Fresno', 'Beijing', 'Hingham', 'New Zealand', 'Kalamazoo', 'Florida', 'Belgium', 'Spartanburg', 'Brighton', 'Elizabeth', 'Conyers', 'Lubbock County', 'Scotland', 'Huntington', 'Norton', 'Haifa', 'Pinecrest', 'Tennessee', 'California', 'Oregon', 'Bensalem', 'Tryon', 'Sun Prairie', 'Columbus', 'Dunn', 'Devon', 'Port Allen', 'Pullman', 'Urbana', 'Nova Scotia', 'Walla Walla', 'Mexico', 'Dayton', 'Hudson', 'Broken Arrow', 'Wawa', 'Provincetown', "St. Mary's", 'Overland Park', 'Portland', 'Mesquite', 'Georgia', 'Cheyenne', 'Florence', 'Franklin', 'Uncategorized', 'Burlington', 'Hawthahorne', 'Kill Devil Hills', 'Walnut', 'Anniston', 'Nebraska', 'Manville', 'Tombstone', 'Springfield', 'Iceland', 'Colorado Springs', 'Spokane County', 'Houston', 'Morocco', 'Orland Park', 'Myrtle Beach', 'Natoma', 'Pensacola', 'Utah', 'Milford', 'Nyala', 'Christiansburg', 'Palm Bay', 'Coral Gables', 'Durango', 'Chicago', 'Ocean City', 'Collierville', 'Illinois', 'Champaign', 'London', 'Milwaukee', 'Ironton', 'Rehoboth Beach', 'Austin', 'Rocky Hill', 'Glendale', 'Jefferson Parish', 'Las Vegas', 'Horneytown', 'Nags Head', 'Kansas', 'Satellite Beach', 'Virginia', 'Biddeford', 'Tonawanda', 'New York City', 'Waterboro', 'Wausau', 'Belvedere', 'La Crosse', 'Globe', 'Lompoc', 'Memphis', 'Rochester', 'Fountain Inn', 'Carlisle', 'Jasper', 'New Hampshire', 'Philippines', 'Mexico City', 'El Paso', 'Aguascalientes', 'Carmel', 'Yukon', 'Glasgow', 'Bettendorf', 'Harrisburg', 'Marion', 'Duluth', 'Maryland', 'Alabama', 'Lowes Crossroads', 'Newtown', 'Asheville', 'Bexley', 'McKeesport', 'Brookfield', 'San Francisco', 'Mohave County', 'Blairstown', 'Forest City', 'York', 'Boston', 'Ogden', 'San Luis Obispo', 'Marceline', 'Cedar Rapids', 'Pasadena', 'Mount Pocono', 'Iowa', 'Richmond', 'Excelsior Springs', 'Corpus Christie', 'Canada', 'Juneau', 'Beaverton', 'Oblong', 'Willowdale', 'Caldwell', 'Temperance', 'Munich', 'Oshawa', 'Brooklyn', 'Crete', 'Israel', 'Hermosa Beach', 'Berkley Heights', 'Norfolk', 'Raleigh', 'Lawrence', 'Korea', 'Dana Point', 'Tampa', 'Merryville', 'Logan County', 'Swaziland', 'Schulter', 'Nevada', 'Japan', 'Allentown', 'Virginia Beach', 'San Jose', 'Eagle', 'Baldwin Park', 'Blythe', 'Joliet', 'Marysville', 'Boise', 'Klamath River', 'New York', 'Longmeadow', 'Brazil', 'Anchorage', 'Warsaw', 'News', 'Linden', 'Youngstown', 'Cambodia', 'South Dakota', 'Rome', 'Alaska', 'Antwerp', 'St. Louis', 'Evanston', 'LeFors', 'Dodge City', 'Boulder', 'Westport', 'Kingsville', 'Normal', 'Maricopa County', 'Carrizozo', 'Spokane', 'Finland', 'Pittsburgh', 'Beaconsfield', 'Owensboro', 'Jonesboro', 'Cambridge', 'Tempe', 'Sea Isle City', 'Des Plaines', 'Minnetonka', 'Stanfield', 'Louisiana', 'Yamhill', 'Singapore', 'Charlotte', 'Kentucky', 'Southern Shores', 'Blackpool', 'Sterling', 'Fort Thomas', 'Park Ridge', 'Wichita', 'Sulphur', 'Hilton Head', 'Russia', 'Eureka', 'Netherlands', 'Rio Claro', 'Winona', 'Columbia', 'Aspen', 'Mississippi', 'Waynesboro', 'Huntsville', 'Lexington', 'Cleveland', 'Cincinnati', 'Acworth', 'Wells', 'Toronto', 'Billings', 'Racine', 'Arad', 'Seaside', 'Turkey', 'Rockwell', 'Nome'];
/// checks if this is a valid location for the stupid laws
export function isLocation(loc) {
    return locations.some(element => {
        return element.toLowerCase() === loc.toLowerCase();
    });
}

/// gets a random location from the same values as the stupid laws
export function getRandLocation() {
    return locations[Math.floor(Math.random() * locations.length)];
}