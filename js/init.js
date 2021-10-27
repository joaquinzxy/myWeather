// `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`

const APIKEY = "8006a61b5a7dc0bcd14b80ea91e30cf0"
const COUNTRIES_JSON = "js/countries.json"
const CITIES_JSON = "js/cities.json"
let selectedLocation = {}

const countrySearchInput = document.getElementById("inputCountry")
const citySearchInput = document.getElementById("inputCity")
const inputFlag = document.getElementById("inputFlag")

const countryMatchList = document.getElementById("countryMatchList")
const cityMatchList = document.getElementById("cityMatchList")
const dataContainer = document.getElementById("dataContainer")


let countries = []
let cities = []

async function getJSONData(url) {
    return fetch(url)
        .then(promesa => {
            return promesa.json()
                .then(data => {
                    return data
                })
        })
}

async function getInitData() {
    countries = await getJSONData(COUNTRIES_JSON)
    cities = await getJSONData(CITIES_JSON)
    cities = cities.Countries
}

getInitData()

function countrySearch(query) {
    cityMatchList.innerHTML = ""
    citySearchInput.value = ""
    citySearchInput.setAttribute("disabled", "")

    let matches = countries.filter(country => {
        const regex = new RegExp(`^${query}`, 'gi');
        return country.name.match(regex) || country.code.match(regex)
    })

    if (query.length === 0) {
        matches = []
    }

    printCountries(matches)
}


function citySearch(query) {
    let firstMatch = cities.filter(country => {
        const regex = new RegExp(`^${countrySearchInput.value}`, 'gi');
        return country.CountryName.match(regex)
    })
    firstMatch = firstMatch[0].States


    firstMatch = firstMatch.map(element => {
        if (element.Cities.length > 0) {
            let citiesNest = element.Cities.map(e => e)
            return citiesNest
        } else { return element.StateName }
    }).flat()


    let filterMatch = firstMatch.filter(city => {
        const regex = new RegExp(`^${query}`, 'gi');
        return city.match(regex)
    })

    if (query.length === 0) {
        filterMatch = []
    }
    printCities(filterMatch)
}

function printCountries(matches) {
    let htmlToAppend = matches.map(match => `
    <div class="btn card card-body mb-1" onclick="selectedCountry('${match.name}','${match.code}')">
        <h6><span class="flag-icon flag-icon-${match.code.toLowerCase()}"></span> ${match.name} (${match.code}) </h6>
    </div>
    `).join("")
    countryMatchList.innerHTML = htmlToAppend
}

function printCities(matches) {
    let htmlToAppend = matches.map(match => `
    <div class="btn card card-body mb-1" onclick="selectedCity('${match}')">
        <h6>${match}</h6>
    </div>
    `).join("")
    cityMatchList.innerHTML = htmlToAppend
}

function selectedCountry(countryName, countryCode) {
    countryMatchList.innerHTML = ""
    countrySearchInput.value = countryName
    inputFlag.innerHTML = `<span class="flag-icon flag-icon-${countryCode.toLowerCase()}"></span>`
    citySearchInput.removeAttribute("disabled")
    selectedLocation.country = {name: countryName, code: countryCode}
    citySearch(countryName)
}

function selectedCity(cityName) {
    cityMatchList.innerHTML = ""
    citySearchInput.value = cityName
    selectedLocation.city=cityName
    getWeatherData(cityName)
}

async function getWeatherData(city) {
    let openWeatherQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`
    getJSONData(openWeatherQuery)
        .then(data => {
            if (data.cod === 200) {
                console.log("Exito!")
                showWeatherData(data)
            } else {
                console.log("Error al realizar la petición"+"("+data.cod+")")
                showWeatherData(data, city)
            }
        })
}

function showWeatherData(data) {
    console.log(data)
    let weather={
        country: selectedLocation.country,
        city: selectedLocation.city,
        temp: data.main.temp,
        status: data.weather[0].main,
        desc: data.weather[0].description,
        wind: data.wind.speed,
        humidity: data.main.humidity
    }
    dataContainer.innerHTML=`
            <div class="col-12 flex-column">
                <img class="img-fluid" src="img/icons/27.png">
                <p class="h1">${weather.temp}°</p>
                <h4>${weather.city}</h4>
                <div class="row">
                    <div class="col-4 flex-column">
                        <h6>Wind now</h6>
                        <p class="h4">${weather.temp}°</p>
                    </div>
                    <div class="col-4 flex-column">
                        <h6>Humidity</h6>
                        <p class="h4">${weather.humidity}%</p>
                    </div>
                    <div class="col-4 flex-column">
                       <h6>Precipitation</h6>
                       <p class="h4">${weather.temp}%</p>
                    </div>
                </div>
            </div>
    `
}

countrySearchInput.addEventListener("input", () => {
    countrySearch(countrySearchInput.value)

})

citySearchInput.addEventListener("input", () => {
    citySearch(citySearchInput.value)
})





