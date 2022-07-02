const localStore = {
  country: "",
  city: "",
  saveDataToLocalStore() {
    localStorage.setItem("BD-Country", this.country);
    localStorage.setItem("BD-City", this.city);
  },
  getValueFromStorage() {
    const country = localStorage.getItem("BD-Country");
    const city = localStorage.getItem("BD-City");
    return {
      country,
      city,
    };
  },
};

const weatherData = {
  country: "",
  city: "",
  API_KEY: "139f539ca319fbf00cf6957bca58f49c",
  async getWeatherData() {
    try {
      const sentReq = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
      );

      const { name, main, weather } = await sentReq.json();
      return {
        name,
        main,
        weather,
      };
    } catch (err) {
      UI.showMessage("problem occurs in fetching data");
    }
  },
};

const UI = {
  allSelectors() {
    const cityElm = document.querySelector("#city");
    const cityInfoElm = document.querySelector("#w-city");
    const iconElm = document.querySelector("#w-icon");
    const temperatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector("#w-feel");
    const formElm = document.querySelector("#form");
    const countryElm = document.querySelector("#country");
    const messageElm = document.querySelector("#messageWrapper");
    return {
      cityInfoElm,
      cityElm,
      countryElm,
      iconElm,
      temperatureElm,
      pressureElm,
      feelElm,
      humidityElm,
      formElm,
      messageElm,
    };
  },
  hideMessage() {
    setTimeout(() => {
      document.querySelector("#message").remove();
    }, 2000);
  },
  showMessage(msg) {
    const { messageElm } = this.allSelectors();
    const elm = `<div class='alert alert-danger' id='message'>${msg}</div>`;
    messageElm.insertAdjacentHTML("afterbegin", elm);
    this.hideMessage();
  },
  validateInput(country, city) {
    if (country === "" || city === "") {
      this.showMessage("Please provides information of your desire");
      return true;
    } else {
      return false;
    }
  },
  getInputValue() {
    const { countryElm, cityElm } = this.allSelectors();
    const isInValid = this.validateInput(countryElm.value, cityElm.value);
    if (isInValid) return;
    return {
      country: countryElm.value,
      city: cityElm.value,
    };
  },
  async handleFetchedData() {
    const data = await weatherData.getWeatherData();
    return data;
  },
  getIcon(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  },
  showToUI(data) {
    const {
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      iconElm,
    } = this.allSelectors();
    const {
      name,
      main: { temp, pressure, humidity },
      weather,
    } = data;
    cityInfoElm.textContent = name;
    temperatureElm.textContent = `Temperature: ${temp}°C`;
    pressureElm.textContent = `Pressure: ${pressure}Kpa`;
    humidityElm.textContent = `Humidity ${humidity}`;
    feelElm.textContent = weather[0].description;
    iconElm.setAttribute("src", this.getIcon(weather[0].icon));
  },
  setToData(country, city) {
    weatherData.country = country;
    weatherData.city = city;
  },
  setDataToStore(country, city) {
    (localStore.country = country), (localStore.city = city);
  },
  resetInputs() {
    const { countryElm, cityElm } = this.allSelectors();
    countryElm.value = "";
    cityElm.value = "";
  },
  init() {
    const { formElm } = this.allSelectors();
    formElm.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      const { country, city } = this.getInputValue();
      this.setToData(country, city);
      this.setDataToStore(country, city);
      localStore.saveDataToLocalStore();

      //reset input
      this.resetInputs();

      //sent request to remote API
      const data = await this.handleFetchedData();
      console.log(data);
      // show to UI
      this.showToUI(data);
    });

    document.addEventListener("DOMContentLoaded", async () => {
      let { country, city } = localStore.getValueFromStorage();
      if (!country || !city) {
        (country = "BD"), (city = "Khulna");
      }
      this.setToData(country, city);
      //send data to API server
      const data = await this.handleFetchedData();

      // show  to UI
      this.showToUI(data);
    });
  },
};

UI.init();
