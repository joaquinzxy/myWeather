// `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`

const APIKEY = "8006a61b5a7dc0bcd14b80ea91e30cf0"
const COUNTRIES_JSON = "js/countries.json"
const CITIES_JSON = "js/cities.json"

const countrySearchInput = document.getElementById("inputCountry")
const citySearchInput = document.getElementById("inputCity")

const countryMatchList = document.getElementById("countryMatchList")
const cityMatchList = document.getElementById("cityMatchList")


let countries = []
let cities = []

async function getJSONData(url){
    return fetch(url)
    .then(promesa=>{
        return promesa.json()
        .then(data=>{
            console.log(data)
            return data
        })
    })
}

async function getInitData(){
    countries = await getJSONData(COUNTRIES_JSON)
    cities = await getJSONData(CITIES_JSON)
    cities = cities.Countries
}

getInitData()

function countrySearch(query){
    cityMatchList.innerHTML = ""
    citySearchInput.value = ""


    let matches = countries.filter(country => {
        const regex = new RegExp(`^${query}`, 'gi');
        return country.name.match(regex) || country.code.match(regex)
    })
    
    if(query.length===0){
        matches = []   
    }

    printCountries(matches)
}


function citySearch(query){
    let firstMatch = cities.filter(country => {
        const regex = new RegExp(`^${countrySearchInput.value}`, 'gi');
        return country.CountryName.match(regex)
    })
    firstMatch = firstMatch[0].States
    
    
    firstMatch = firstMatch.map(element=>{
        if(element.Cities.length>0){
            let citiesNest = element.Cities.map(e=>e)
            return citiesNest
        } else { return element.StateName}
    }).flat()
    
    
    let filterMatch = firstMatch.filter(city => {
        const regex = new RegExp(`^${query}`, 'gi');
        return city.match(regex)
    })
    
    if(query.length===0){
        filterMatch=[]
    }
    printCities(filterMatch)
}

function printCountries(matches){
    let htmlToAppend = matches.map(match=>`
    <div class="btn card card-body mb-1" onclick="selectedCountry('${match.name}')">
        <h6>${match.name} (${match.code}) </h6>
    </div>
    `).join("")
    countryMatchList.innerHTML = htmlToAppend
}

function printCities(matches){
    let htmlToAppend = matches.map(match=>`
    <div class="btn card card-body mb-1" onclick="selectedCity('${match}')">
        <h6>${match}</h6>
    </div>
    `).join("")
    cityMatchList.innerHTML = htmlToAppend
}


function selectedCountry(countryName){
    countryMatchList.innerHTML = ""
    countrySearchInput.value=countryName
    citySearch(countryName)
}

function selectedCity(cityName){
    cityMatchList.innerHTML = ""
    citySearchInput.value=cityName
    getWeatherData(cityName)
}

function getWeatherData(city){
    let openWeatherQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
    getJSONData(openWeatherQuery)
}

countrySearchInput.addEventListener("input", ()=>{
    countrySearch(countrySearchInput.value)

})

citySearchInput.addEventListener("input", ()=>{
    citySearch(citySearchInput.value)
})





