package com.praestare.emprestimos.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateStatusDto {

    @NotBlank(message = "O status não pode ser nulo ou vazio")
    private String status;
}
