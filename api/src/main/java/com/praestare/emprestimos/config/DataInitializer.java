package com.praestare.emprestimos.config;

import com.praestare.emprestimos.model.Usuario;
import com.praestare.emprestimos.model.UsuarioType;
import com.praestare.emprestimos.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private UsuarioRepository usuarioRepository;
    private PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        var result = usuarioRepository.findByEmail("admin@gmail.com");
        Boolean existe_admin = result != null;

        if (!existe_admin) {
           Usuario admin = new Usuario();
           admin.setName("Admin");
           admin.setEmail("admin@gmail.com");
           admin.setPassword(passwordEncoder.encode("admin123"));
           admin.setUsuarioType(UsuarioType.ADMIN);
           usuarioRepository.save(admin);
           System.out.println("Usuário admin criado com sucesso!");
       } else {
            System.out.println("Usuário admin já existe no banco de dados.");
        }
    }

}
