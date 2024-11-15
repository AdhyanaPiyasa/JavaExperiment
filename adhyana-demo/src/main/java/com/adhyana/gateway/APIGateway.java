package com.adhyana.gateway;

import java.io.IOException;
import java.io.BufferedReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.adhyana.utils.JsonUtils;
import com.adhyana.models.CalculationRequest;
import com.adhyana.models.AdditionResponse;
import com.adhyana.services.MathService;

@WebServlet("/api/math/calculate")
public class APIGateway extends HttpServlet {
    private final MathService mathService = new MathService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("Handling POST request");

        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8085");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

        try {
            // Read the request body
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            }

            System.out.println("Received request body: " + sb.toString());

            // Parse request
            CalculationRequest calcRequest = JsonUtils.parseCalculationRequest(sb.toString());
            System.out.println("Parsed request: " + calcRequest.getFirstNumber() + ", "
                    + calcRequest.getSecondNumber() + ", " + calcRequest.getOperation());

            // Process request
            double result = mathService.calculate(
                    calcRequest.getFirstNumber(),
                    calcRequest.getSecondNumber(),
                    calcRequest.getOperation()
            );

            System.out.println("Calculated result: " + result);

            // Send response
            response.setContentType("application/json");
            String jsonResponse = JsonUtils.toJson(new AdditionResponse(result));
            System.out.println("Sending response: " + jsonResponse);
            response.getWriter().write(jsonResponse);

        } catch (Exception e) {
            System.err.println("Error processing request: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8085");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}