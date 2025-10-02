# Configuração de E-mail - CastleTech Commerce

## Configuração Necessária

Para que o sistema envie e-mails com as chaves dos produtos após a compra, você precisa configurar as seguintes variáveis de ambiente:

### 1. Variáveis de Ambiente

Adicione estas variáveis ao seu arquivo `.env.local`:

```env
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=castletechzzz@gmail.com
SMTP_PASS=SUA_NOVA_SENHA_DE_APP_AQUI

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

### 2. Configuração do Gmail (castletechzzz@gmail.com)

1. **Faça login** na conta `castletechzzz@gmail.com`
2. **Ative a verificação em duas etapas** na sua conta Google:
   - Vá para [myaccount.google.com](https://myaccount.google.com)
   - Segurança → Verificação em duas etapas → Ativar
3. **Gere uma senha de app**:
   - Vá para [myaccount.google.com](https://myaccount.google.com)
   - Segurança → Verificação em duas etapas → Senhas de app
   - Gere uma nova senha de app para "Mail"
   - **IMPORTANTE**: Use esta senha no `SMTP_PASS` (não use sua senha normal)

### 3. Outras Opções de SMTP

#### Outlook/Hotmail:

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo:

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Servidor SMTP Personalizado:

```env
SMTP_HOST=seu-servidor-smtp.com
SMTP_PORT=587
SMTP_SECURE=false
```

### 4. Testando a Configuração

Após configurar as variáveis de ambiente:

1. Reinicie o servidor de desenvolvimento
2. Faça uma compra de teste
3. Verifique se o e-mail foi enviado com as chaves do produto

### 5. Funcionalidades Implementadas

✅ **Envio automático de e-mails** após pagamento confirmado
✅ **Template de e-mail profissional** com as chaves do produto
✅ **Remoção automática de chaves** do estoque após compra
✅ **Visualização de chaves ativas** no painel admin
✅ **Gerenciamento individual de chaves** (adicionar/remover)
✅ **Persistência das chaves** mesmo após fechar o site

### 6. Estrutura do E-mail

O e-mail enviado inclui:

- Cabeçalho com logo da CastleTech
- Detalhes da compra (ID do pedido, total pago)
- Lista das chaves de produto compradas
- Instruções importantes para o cliente
- Design responsivo e profissional

### 7. Configuração Específica - castletechzzz@gmail.com

**IMPORTANTE**: Os e-mails serão enviados **DE** `castletechzzz@gmail.com` **PARA** os clientes.

**Configuração necessária:**

1. Acesse `castletechzzz@gmail.com`
2. Configure a autenticação em duas etapas
3. Gere uma senha de app específica
4. Use esta configuração no `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=castletechzzz@gmail.com
SMTP_PASS=SUA_NOVA_SENHA_DE_APP_AQUI
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

### 8. Solução de Problemas

**E-mail não enviado:**

- Verifique se a conta `castletechzzz@gmail.com` tem verificação em duas etapas ativada
- Confirme se a senha de app está correta (não use a senha normal da conta)
- Verifique se a conta não está bloqueada ou suspensa

**Erro de autenticação:**

- Gere uma nova senha de app se necessário
- Confirme se `SMTP_USER=castletechzzz@gmail.com` está correto

**Chaves não removidas do estoque:**

- Confirme se o webhook do Stripe está configurado
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto

**Admin não vê as chaves:**

- As chaves são salvas automaticamente no localStorage e no servidor
- Recarregue a página do admin se necessário
