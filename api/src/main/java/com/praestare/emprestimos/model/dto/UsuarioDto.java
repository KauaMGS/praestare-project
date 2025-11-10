package com.praestare.emprestimos.model.dto;

import com.praestare.emprestimos.model.UsuarioType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
    
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDto {
    
    private Long id;

    @NotBlank(message = "Nome obrigatório")
    private String name;
    
    @NotBlank(message = "Obrigatório informar seu email")
    private String email;

    @NotBlank(message = "Uso de senha obrigatório")
    private String password;

    private UsuarioType usuarioType;
    
}

