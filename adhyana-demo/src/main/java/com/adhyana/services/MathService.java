package com.adhyana.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import com.adhyana.utils.DatabaseConnection;

public class MathService {
    private final DatabaseConnection dbConnection;

    public MathService() {
        this.dbConnection = DatabaseConnection.getInstance();
    }

    public double calculate(double num1, double num2, String operation) throws Exception {
        double result;

        switch (operation.toUpperCase()) {
            case "ADD":
                result = num1 + num2;
                break;
            case "SUBTRACT":
                result = num1 - num2;
                break;
            case "MULTIPLY":
                result = num1 * num2;
                break;
            case "DIVIDE":
                if (num2 == 0) {
                    throw new ArithmeticException("Division by zero is not allowed");
                }
                result = num1 / num2;
                break;
            default:
                throw new IllegalArgumentException("Invalid operation: " + operation);
        }

        try {
            // Store calculation in database
            String query = "INSERT INTO calculations (first_number, second_number, result, operation_type) VALUES (?, ?, ?, ?)";

            try (Connection conn = dbConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {

                stmt.setDouble(1, num1);
                stmt.setDouble(2, num2);
                stmt.setDouble(3, result);
                stmt.setString(4, operation.toUpperCase());

                stmt.executeUpdate();
                System.out.println("Successfully stored calculation in database"); // Debug log
            }
        } catch (Exception e) {
            System.err.println("Database error: " + e.getMessage()); // Debug log
            e.printStackTrace(); // Debug log
            // Don't throw the exception - still return the result even if DB fails
        }

        return result;
    }
}