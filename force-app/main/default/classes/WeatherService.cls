public with sharing class WeatherService {
    
    // Method 1: The API Bridge
@AuraEnabled(cacheable=true)
    public static String getWeatherData(String cityName) {
        String encodedCity = EncodingUtil.urlEncode(cityName, 'UTF-8');
        // Fetch the key safely from your Custom Label
        String apiKey = System.Label.WeatherStackAPIKey; 
        
        HttpRequest req = new HttpRequest();
        // Added &units=f for Fahrenheit
        req.setEndpoint('https://api.weatherstack.com/current?access_key=' + apiKey + '&query=' + encodedCity + '&units=f');
        req.setMethod('GET');
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        
        return res.getBody();
    }

    // Method 2: The Data Query Bridge
    @AuraEnabled(cacheable=true)
    public static List<String> getCityList() {
        List<WeatherReport__c> reports = [SELECT City_Name__c FROM WeatherReport__c];
        List<String> cities = new List<String>();
        for(WeatherReport__c r : reports) {
            if(r.City_Name__c != null) {
                cities.add(r.City_Name__c);
            }
        }
        return cities;
    }
}