package com.adhyana.models;

public class CalculationRequest {
    private final double firstNumber;
    private final double secondNumber;
    private final String operation;

    public CalculationRequest(double firstNumber, double secondNumber, String operation) {
        this.firstNumber = firstNumber;
        this.secondNumber = secondNumber;
        this.operation = operation;
    }

    public double getFirstNumber() { return firstNumber; }
    public double getSecondNumber() { return secondNumber; }
    public String getOperation() { return operation; }
}