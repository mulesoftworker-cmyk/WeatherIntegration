import { LightningElement, track } from 'lwc';
import getWeatherData from '@salesforce/apex/WeatherService.getWeatherData';
import getCityList from '@salesforce/apex/WeatherService.getCityList';

export default class WeatherDisplay extends LightningElement {
    @track city = '';
    @track weatherData;
    @track cityOptions = [];
    @track isLoading = false; // Added loading state

    connectedCallback() {
        getCityList()
            .then(result => {
                this.cityOptions = result.map(cityName => ({
                    label: cityName,
                    value: cityName
                }));
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });
    }

    handleCityChange(event) {
        this.city = event.detail.value;
    }

    fetchWeather() {
        if (!this.city) return;

        this.isLoading = true; // Start loading
        this.weatherData = undefined; // Clear old data

        getWeatherData({ cityName: this.city })
            .then(result => {
                // Parse the JSON string
                const data = JSON.parse(result);
                // Assign to the tracked variable
                this.weatherData = data; 
                this.isLoading = false;
                console.log('Successfully loaded:', this.weatherData);
            })
            .catch(error => {
                this.isLoading = false;
                console.error('Error fetching weather:', error);
            });
    }
}