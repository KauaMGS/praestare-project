package com.praestare.emprestimos.model.dto;

import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class AnaliseEmprestimoDto {

    @NotBlank(message = "O nome da instituição é obrigatório.")
    private String instituicao;

    @NotBlank(message = "O tipo de empréstimo é obrigatório.")
    private String tipoEmprestimo; // Ex: pessoal, consignado, veicular

    @Min(value = 0, message = "O score deve ser maior ou igual a 0.")
    @Max(value = 1000, message = "O score deve ser menor ou igual a 1000.")
    private int scoreSerasa;

    @Positive(message = "O valor do empréstimo deve ser positivo.")
    private double valorEmprestimo;

    @Positive(message = "A taxa de juros deve ser positiva.")
    private double taxaJuros;

    @Positive(message = "O prazo deve ser positivo.")
    private int prazoMeses;

    private boolean solicitacaoOnline;
}