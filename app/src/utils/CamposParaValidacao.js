export const CamposParaValidacao = {
    nome: [
        v => !!v || 'Nome é obrigatório',
        v => (v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres'
    ],
    email: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
    ],
    senha: [
        v => !!v || 'Senha é obrigatória',
        v => (v && v.length >= 8) || 'Senha deve ter pelo menos 8 caracteres'
    ],
    banco: [
        v => !!v || 'Banco (instituição) é obrigatório',
    ],
    descricao: [
        v => !!v || 'Descrição é obrigatória',
    ],
    valor: [
        v => !!v || 'Valor é obrigatório',
    ],
    prazo: [
        v => !!v || 'Prazo é obrigatório',
    ],
    taxa: [
        v => !!v || 'Taxa é obrigatória',
    ],
    confirmacaoSenha(senha) {
        return [
            v => !!v || 'Confirmação de senha é obrigatória',
            v => v === senha || 'As senhas não coincidem'
        ]
    }

}

export default CamposParaValidacao;