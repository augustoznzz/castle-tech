# Guia Completo - Configuração de Webhook e E-mail do Stripe

## 📧 Configuração do Novo E-mail (castletechzzz@gmail.com)

### Passo 1: Configurar a Conta Gmail

1. **Faça login** na conta `castletechzzz@gmail.com`
2. **Ative a verificação em duas etapas**:

   - Acesse [myaccount.google.com](https://myaccount.google.com)
   - Vá em **Segurança** → **Verificação em duas etapas** → **Ativar**
   - Siga as instruções para configurar (geralmente com SMS ou app autenticador)

3. **Gere uma senha de app**:
   - Ainda em [myaccount.google.com](https://myaccount.google.com)
   - Vá em **Segurança** → **Verificação em duas etapas** → **Senhas de app**
   - Clique em **Gerar senha de app**
   - Escolha **Mail** como aplicativo
   - **COPIE A SENHA GERADA** (ela aparecerá apenas uma vez!)

### Passo 2: Atualizar o Arquivo .env.local

Crie ou atualize o arquivo `.env.local` na raiz do projeto:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (SMTP) - NOVA CONFIGURAÇÃO
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=castletechzzz@gmail.com
SMTP_PASS=SUA_NOVA_SENHA_DE_APP_AQUI

# Stripe Webhook Secret - SERÁ ATUALIZADO NO PASSO 3
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

**IMPORTANTE**: Substitua `SUA_NOVA_SENHA_DE_APP_AQUI` pela senha de app que você gerou no Passo 1.

---

## 🔗 Configuração do Webhook do Stripe

### Passo 3: Acessar o Dashboard do Stripe

1. **Faça login** no [Dashboard do Stripe](https://dashboard.stripe.com)
2. Certifique-se de estar no **modo de teste** (toggle no canto superior direito)

### Passo 4: Criar um Novo Webhook

1. No menu lateral, vá em **Desenvolvedores** → **Webhooks**
2. Clique em **Adicionar endpoint**
3. **URL do endpoint**: `https://seu-dominio.com/api/stripe/webhook`
   - Para desenvolvimento local: `https://seu-ngrok-url.ngrok.io/api/stripe/webhook`
   - Para produção: `https://seu-dominio.com/api/stripe/webhook`

### Passo 5: Configurar Eventos do Webhook

Selecione os seguintes eventos:

- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `charge.succeeded`

### Passo 6: Obter o Secret do Webhook

1. Após criar o webhook, clique nele para abrir os detalhes
2. Na seção **Assinatura**, copie o **Signing secret**
3. Ele começará com `whsec_...`

### Passo 7: Atualizar o .env.local com o Novo Secret

```env
# Stripe Webhook Secret - ATUALIZADO
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

---

## 🧪 Testando a Configuração

### Teste 1: Configuração de E-mail

1. **Reinicie o servidor**:

   ```bash
   npm run dev
   ```

2. **Teste o e-mail**:
   - Acesse: `http://localhost:3001/api/email-test`
   - Ou faça uma requisição POST para testar

### Teste 2: Webhook do Stripe

1. **Para desenvolvimento local**, use ngrok:

   ```bash
   # Instale o ngrok se não tiver
   npm install -g ngrok

   # Execute o ngrok
   ngrok http 3000
   ```

2. **Atualize a URL do webhook** no Stripe com a URL do ngrok

3. **Faça uma compra de teste** e verifique se:
   - O e-mail é enviado com as chaves
   - O webhook processa corretamente
   - As chaves são removidas do estoque

---

## 🚀 Deploy para Produção

### Passo 8: Configurar Variáveis de Ambiente no Deploy

**Para Netlify/Vercel/Outros**:

1. Acesse as configurações do seu serviço de deploy
2. Adicione as seguintes variáveis de ambiente:

```env
STRIPE_SECRET_KEY=YOUR_STRIPE_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_LIVE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=castletechzzz@gmail.com
SMTP_PASS=SUA_SENHA_DE_APP_DE_PRODUCAO
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

### Passo 9: Atualizar Webhook para Produção

1. No Stripe, **mude para modo Live**
2. Crie um novo webhook com a URL de produção
3. Configure os mesmos eventos
4. Copie o novo secret e atualize nas variáveis de ambiente

---

## 🔧 Solução de Problemas

### E-mail não enviado:

- ✅ Verifique se a verificação em duas etapas está ativada
- ✅ Confirme se está usando a senha de app (não a senha normal)
- ✅ Teste a configuração com o endpoint de teste

### Webhook não funciona:

- ✅ Verifique se a URL do webhook está correta
- ✅ Confirme se o secret está correto
- ✅ Verifique os logs do Stripe para erros
- ✅ Certifique-se de que os eventos estão selecionados

### Erro de autenticação:

- ✅ Gere uma nova senha de app se necessário
- ✅ Verifique se todas as variáveis de ambiente estão corretas
- ✅ Reinicie o servidor após mudanças

---

## 📝 Checklist Final

- [ ] Conta `castletechzzz@gmail.com` configurada
- [ ] Verificação em duas etapas ativada
- [ ] Senha de app gerada e copiada
- [ ] Arquivo `.env.local` atualizado
- [ ] Webhook criado no Stripe (modo teste)
- [ ] Eventos do webhook configurados
- [ ] Secret do webhook copiado
- [ ] Teste de e-mail realizado
- [ ] Teste de webhook realizado
- [ ] Deploy para produção (se aplicável)
- [ ] Webhook de produção configurado
- [ ] Variáveis de ambiente de produção configuradas

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. **Verifique os logs** do servidor para erros específicos
2. **Teste cada componente** separadamente (e-mail, webhook)
3. **Confirme as credenciais** uma por uma
4. **Use o modo de teste** do Stripe primeiro

**Lembre-se**: Sempre teste primeiro em ambiente de desenvolvimento antes de ir para produção!
