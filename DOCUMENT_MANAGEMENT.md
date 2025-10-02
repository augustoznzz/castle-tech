# Document Management System

Este sistema permite adicionar documentos como estoque de produto, incluindo arquivos .zip de até 2GB.

## Funcionalidades

### 1. Upload de Documentos

- **Tamanho máximo**: 2GB por arquivo
- **Tipos suportados**:
  - Arquivos ZIP (.zip)
  - Documentos PDF (.pdf)
  - Documentos Office (.doc, .docx, .xls, .xlsx, .ppt, .pptx)
  - Arquivos de texto (.txt, .csv, .json, .xml)
  - Imagens (.jpg, .jpeg, .png, .gif, .webp, .svg)

### 2. Gerenciamento de Estoque

- **Documentos de Estoque**: Marcados como parte do estoque do produto
- **Documentos Informativos**: Documentação adicional do produto
- **Modos de Estoque**:
  - **Keys**: Sistema de chaves individuais
  - **Infinite**: Estoque infinito
  - **None**: Apenas documentos, sem controle de estoque
- **Estoque Infinito Automático**: Arquivos ZIP marcados como estoque automaticamente configuram o produto para modo de estoque infinito (exceto se já estiver em modo 'none')
- **Controle de Acesso**: Apenas administradores podem gerenciar documentos

### 3. Interface de Usuário

#### Painel Administrativo (`/admin`)

- Upload de documentos com drag & drop
- Edição de descrições
- Remoção de documentos
- Visualização de estatísticas (total de documentos e arquivos de estoque)

#### Página do Produto (`/shop/[slug]`)

- Lista de documentos disponíveis
- Download direto dos arquivos
- Indicação visual de arquivos de estoque
- Informações de tamanho e data de upload

#### Cards de Produto

- Indicador de documentos disponíveis
- Contador de arquivos de estoque

## Estrutura de Dados

### ProductDocument Interface

```typescript
interface ProductDocument {
  id: string;
  name: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  description?: string;
  isStock?: boolean; // Se true, é parte do estoque do produto
}
```

## APIs

### Upload de Arquivo

- **Endpoint**: `POST /api/upload`
- **Body**: FormData com arquivo, productId, description, isStock
- **Resposta**: Documento criado

### Gerenciamento de Documentos

- **GET** `/api/products/[id]/documents` - Listar documentos
- **POST** `/api/products/[id]/documents` - Adicionar documento
- **PUT** `/api/products/[id]/documents` - Atualizar documento
- **DELETE** `/api/products/[id]/documents?documentId=xxx` - Remover documento

## Configuração

### Limites de Upload

- Configurado no `next.config.js` para 2GB
- Validação de tipo de arquivo no servidor
- Validação de tamanho no cliente e servidor

### Armazenamento

- Arquivos salvos em `public/uploads/`
- Nomes únicos gerados com UUID
- Diretório ignorado pelo Git

## Componentes

### FileUpload

- Interface de upload com drag & drop
- Validação de arquivo no cliente
- Feedback visual de status

### DocumentList

- Lista de documentos com ações
- Edição inline de descrições
- Botões de download e remoção

## Segurança

- Validação de tipos de arquivo
- Limite de tamanho rigoroso
- Nomes de arquivo sanitizados
- Upload apenas para administradores autenticados

## Uso

1. **Acesse o painel administrativo** (`/admin`)
2. **Selecione um produto** na lista
3. **Faça upload de documentos** usando a interface de drag & drop
4. **Marque como estoque** se necessário
   - **Arquivos ZIP**: Quando marcados como estoque, automaticamente configuram o produto para modo de estoque infinito
   - **Outros arquivos**: Funcionam como documentos de estoque normais
5. **Adicione descrições** para melhor organização
6. **Os documentos aparecerão** na página do produto para os clientes

### Comportamento Especial para Arquivos ZIP

- **Detecção Automática**: O sistema detecta automaticamente arquivos ZIP
- **Modo Infinito**: ZIPs marcados como estoque configuram o produto para estoque infinito (exceto se já estiver em modo 'none')
- **Notificação**: O usuário é notificado quando isso acontece
- **Reversão Automática**: Se todos os ZIPs de estoque forem removidos, o produto volta ao modo de chaves

### Modo "None" (Apenas Documentos)

- **Sem Controle de Estoque**: Produtos em modo 'none' não precisam de sistema de chaves
- **Apenas Documentos**: Foco total em fornecer arquivos aos clientes
- **Ideal Para**: Produtos digitais que são entregues via documentos
- **Interface Simplificada**: Não mostra seção de gerenciamento de chaves

## Limitações

- Máximo de 2GB por arquivo
- Apenas tipos de arquivo específicos permitidos
- Armazenamento local (não recomendado para produção)
- Sem compressão automática de imagens
