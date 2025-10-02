#!/usr/bin/env node

/**
 * Script para testar a configuração de e-mail
 * Execute com: node scripts/test-email-config.js
 */

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmailConfig() {
  console.log('🧪 Testando configuração de e-mail...\n');

  // Verificar variáveis de ambiente
  const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_PORT', 
    'SMTP_USER',
    'SMTP_PASS'
  ];

  console.log('📋 Verificando variáveis de ambiente:');
  let envVarsOk = true;
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: NÃO DEFINIDA`);
      envVarsOk = false;
    } else {
      // Mascarar senhas
      const displayValue = varName === 'SMTP_PASS' ? '***' : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  });

  if (!envVarsOk) {
    console.log('\n❌ Algumas variáveis de ambiente estão faltando!');
    console.log('Verifique o arquivo .env.local');
    return false;
  }

  console.log('\n📧 Testando conexão SMTP...');

  try {
    // Criar transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verificar conexão
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso!');

    // Teste de envio (opcional)
    const testEmail = process.argv[2];
    if (testEmail) {
      console.log(`\n📤 Enviando e-mail de teste para: ${testEmail}`);
      
      const mailOptions = {
        from: `"CastleTech Test" <${process.env.SMTP_USER}>`,
        to: testEmail,
        subject: 'Teste de Configuração - CastleTech',
        html: `
          <h2>✅ Configuração de E-mail Funcionando!</h2>
          <p>Este é um e-mail de teste da CastleTech.</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Remetente:</strong> ${process.env.SMTP_USER}</p>
          <hr>
          <p><em>Se você recebeu este e-mail, a configuração está correta!</em></p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ E-mail de teste enviado com sucesso!');
      console.log(`📧 Message ID: ${info.messageId}`);
    } else {
      console.log('\n💡 Para testar o envio de e-mail, execute:');
      console.log('   node scripts/test-email-config.js seu-email@exemplo.com');
    }

    return true;

  } catch (error) {
    console.log('❌ Erro na configuração SMTP:');
    console.log(`   ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Possíveis soluções:');
      console.log('   - Verifique se a senha de app está correta');
      console.log('   - Confirme se a verificação em duas etapas está ativada');
      console.log('   - Gere uma nova senha de app no Google');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Possíveis soluções:');
      console.log('   - Verifique se o SMTP_HOST está correto');
      console.log('   - Confirme se a porta está correta');
      console.log('   - Verifique sua conexão com a internet');
    }

    return false;
  }
}

// Executar teste
testEmailConfig()
  .then(success => {
    if (success) {
      console.log('\n🎉 Configuração de e-mail está funcionando!');
      process.exit(0);
    } else {
      console.log('\n💥 Configuração de e-mail precisa ser corrigida.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Erro inesperado:', error);
    process.exit(1);
  });
