package com.praestare.emprestimos.model.dto;

import com.praestare.emprestimos.model.UsuarioType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDto {

    @NotNull(message = "Necessário id não ser nulo")
    private Long id;
    private String name;
    private String email;
    private UsuarioType usuarioType;

}
