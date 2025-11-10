package com.praestare.emprestimos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.praestare.emprestimos.model.dto.AnaliseEmprestimoDto;
import com.praestare.emprestimos.model.dto.AnaliseEmprestimoResponseDto;
import com.praestare.emprestimos.service.AnaliseEmprestimoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/analise-emprestimo")
public class AnaliseEmprestimoController {

    @Autowired
    private AnaliseEmprestimoService analiseEmprestimoService;

    @PostMapping
    public ResponseEntity<AnaliseEmprestimoResponseDto> analisar(@RequestBody @Valid AnaliseEmprestimoDto dto) {
        AnaliseEmprestimoResponseDto resposta = analiseEmprestimoService.avaliarEmprestimo(dto);
        return ResponseEntity.ok(resposta);
    }
}
