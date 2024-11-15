package com.adhyana.utils;

import com.adhyana.models.CalculationRequest;
import com.adhyana.models.AdditionResponse;

public class JsonUtils {
    public static String toJson(Object obj) {
        if (obj instanceof AdditionResponse) {
            AdditionResponse response = (AdditionResponse) obj;
            return String.format("{\"result\": %f}", response.getResult());
        }
        throw new IllegalArgumentException("Unsupported type for JSON conversion");
    }

    public static CalculationRequest parseCalculationRequest(String json) {
        json = json.replaceAll("\\s+", "")
                .replaceAll("[{}\"]", "");

        double firstNumber = 0;
        double secondNumber = 0;
        String operation = "ADD";

        String[] pairs = json.split(",");
        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "firstNumber":
                        firstNumber = Double.parseDouble(value);
                        break;
                    case "secondNumber":
                        secondNumber = Double.parseDouble(value);
                        break;
                    case "operation":
                        operation = value;
                        break;
                }
            }
        }

        return new CalculationRequest(firstNumber, secondNumber, operation);
    }
}