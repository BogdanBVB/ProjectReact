package org.example.projectreact.DTO;

import lombok.Data;

import java.util.Map;


@Data
public class ExchangeRatesDTO {

    private Map<String, Double> rates;

}
