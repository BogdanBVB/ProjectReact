package org.example.projectreact.services;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExchangeService {

    @Value("${freecurrencyapi.key}")
    private String apiKey; // API key is securely injected from application.properties

    @Value("${api.currency.baseurl}")
    private String baseUrl;
    public Map<String, Double> fetchExchangeRates(String base, HttpSession session) {

        // Step 1: Construct the API URL with the necessary parameters.
        String url = buildUrl(base, "EUR,USD,GBP,HUF");

        // Step 2: Create an instance of RestTemplate to make HTTP requests.
        RestTemplate restTemplate = new RestTemplate();

        // Step 3: Execute the HTTP GET request and capture the response.
        ResponseEntity<Map<String, Object>> response = makeHttpRequest(restTemplate, url);

        //Storing the fx rates
        Map<String, Object> rates = response.getBody();
        session.setAttribute("rates",rates);



        // Step 4: Extract and return the currency rates from the response.
        return extractRates(response);
    }
    private String buildUrl(String base, String symbols) {
        return UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("apikey", apiKey)
                .queryParam("base_currency", base)
                .queryParam("currencies", symbols)
                .toUriString();
    }

    // Helper method to execute the HTTP GET request.
    private ResponseEntity<Map<String, Object>> makeHttpRequest(RestTemplate restTemplate, String url) {
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
    }

    // Helper method to extract currency rates from the API response.
    private Map<String, Double> extractRates(ResponseEntity<Map<String, Object>> response) {
        Map<String, Object> responseBody = response.getBody();
        Map<String, Double> rates = new HashMap<>();
        if (responseBody != null && responseBody.containsKey("data")) {
            Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                Object value = entry.getValue();
                if (value instanceof Number) {
                    rates.put(entry.getKey(), ((Number) value).doubleValue());
                }
            }
            return rates;
        }
        throw new IllegalStateException("Failed to retrieve data from the API");
    }

    public double fxBetweenAccounts(String dAccountCurrency, String cAccountCurrency, HttpSession session) {
        if (dAccountCurrency.equals(cAccountCurrency)) {
            return 1.0;
        }

        Map<String, Object> outerMap = (Map<String, Object>) session.getAttribute("rates");

        if (outerMap == null) {
            throw new IllegalStateException("Exchange rates for " + dAccountCurrency + " are not available");
        }


        Map<String, Double> rates = (Map<String, Double>) outerMap.get("data");
        rates.put("RON",1.00);

        Double eurRate = rates.get("EUR");
        Double gbpRate = rates.get("GBP");
        Double usdRate = rates.get("USD");
        Double hufRate = rates.get("HUF");

        Double fromRate = rates.get(dAccountCurrency);

        Double toRate = rates.get(cAccountCurrency);


        if (fromRate == null || toRate == null) {
            throw new IllegalArgumentException("Exchange rate not available for given currencies.");
        }

        return toRate / fromRate;

    }


}
