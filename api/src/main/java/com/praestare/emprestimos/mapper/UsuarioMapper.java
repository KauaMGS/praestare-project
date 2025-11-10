package com.praestare.emprestimos.mapper;

import org.springframework.stereotype.Component;

import com.praestare.emprestimos.model.Usuario;
import com.praestare.emprestimos.model.dto.UsuarioDto;
import com.praestare.emprestimos.model.dto.UsuarioResponseDto;

@Component
public class UsuarioMapper {

    public static UsuarioResponseDto toDTO(Usuario usuario) {
        if (usuario == null) return null;

        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(usuario.getId());
        dto.setName(usuario.getName());
        dto.setEmail(usuario.getEmail());
        dto.setUsuarioType(usuario.getUsuarioType());
        return dto;
    }

    public static Usuario toEntity(UsuarioDto dto) {
        Usuario usuario = new Usuario();
        usuario.setName(dto.getName());
        usuario.setEmail(dto.getEmail());
        usuario.setUsuarioType(dto.getUsuarioType());
        return usuario;
    }
}