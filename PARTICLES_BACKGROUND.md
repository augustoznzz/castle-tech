# Sistema de Partículas - Background Dinâmico

## Visão Geral

O novo sistema de partículas substitui o grid estático anterior por um background animado, leve e responsivo que adiciona dinamismo visual à interface sem comprometer a performance ou acessibilidade.

## Características Principais

### 🎨 Visual

- **Partículas suaves e translúcidas** na cor do tema (#22D3EE - azul accent)
- **Conexões dinâmicas** entre partículas próximas (apenas em desktop)
- **Movimento contínuo** com direções aleatórias
- **Opacidade variável** para criar profundidade

### ⚡ Performance

- **60 FPS otimizado** com throttling de frame rate
- **Canvas API** para renderização eficiente
- **Densidade adaptativa** baseada no tipo de dispositivo
- **Pausa automática** quando a aba não está visível
- **Device Pixel Ratio** ajustado para renderização nítida

### 📱 Responsividade

- **Mobile**: 40% menos partículas, sem conexões entre elas
- **Desktop**: Densidade completa com conexões visuais
- **Tablet**: Comportamento intermediário otimizado

### ♿ Acessibilidade

- **Suporte a `prefers-reduced-motion`**: Reduz movimento em 90% para usuários com sensibilidade
- **Opacidade controlada**: Não interfere com leitura de texto
- **Contraste mantido**: Background respeitando WCAG

## Configuração

### Uso no Layout Global

```tsx
import { ParticlesBackground } from "@/components/ui/particles-background";
import { ClientOnly } from "@/components/client-only";

<div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
  <ClientOnly>
    <ParticlesBackground particleColor="#22D3EE" density="medium" speed={0.5} />
  </ClientOnly>
</div>;
```

### Props Disponíveis

| Prop            | Tipo                          | Padrão    | Descrição                |
| --------------- | ----------------------------- | --------- | ------------------------ |
| `particleColor` | `string`                      | `#22D3EE` | Cor das partículas (hex) |
| `density`       | `'low' \| 'medium' \| 'high'` | `medium`  | Densidade de partículas  |
| `speed`         | `number`                      | `0.5`     | Velocidade de movimento  |
| `className`     | `string`                      | `''`      | Classes CSS adicionais   |

### Densidade de Partículas

- **Low**: 30 partículas (12 em mobile)
- **Medium**: 50 partículas (20 em mobile)
- **High**: 80 partículas (32 em mobile)

## Otimizações Implementadas

### 1. Throttling de FPS

```typescript
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;
```

### 2. Detecção de Dispositivo

```typescript
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? baseCount * 0.4 : baseCount;
```

### 3. Pausa em Background

```typescript
document.addEventListener("visibilitychange", handleVisibilityChange);
```

### 4. Device Pixel Ratio

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

## Comparação com Grid Anterior

| Aspecto                 | Grid Anterior      | Partículas Atual          |
| ----------------------- | ------------------ | ------------------------- |
| **Tipo**                | Estático           | Dinâmico                  |
| **Performance**         | Canvas com padrões | Canvas otimizado          |
| **Responsividade**      | Básica             | Avançada                  |
| **Acessibilidade**      | Limitada           | Completa (reduced motion) |
| **Densidade Mobile**    | Igual desktop      | 60% reduzida              |
| **Conexões Visuais**    | Não                | Sim (desktop only)        |
| **Pausa em Background** | Não                | Sim                       |

## Compatibilidade

### Navegadores Suportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Frameworks

- ✅ Next.js 13+ (App Router)
- ✅ React 18+
- ✅ TypeScript 5+

## Impacto na Performance

### Métricas Esperadas

- **FPS**: 60fps constante
- **CPU**: <5% em idle, <15% em movimento
- **Memória**: ~2-5MB adicional
- **First Paint**: Sem impacto (renderizado após hidratação)

### Mobile

- **FPS**: 60fps constante
- **CPU**: <3% em idle, <10% em movimento
- **Bateria**: Impacto mínimo (<1%)

## Manutenção

### Ajustar Densidade

Para alterar a densidade globalmente, edite o arquivo `app/layout.tsx`:

```tsx
<ParticlesBackground
  density="low" // ou "medium" ou "high"
/>
```

### Ajustar Cor

Para usar outra cor do tema:

```tsx
<ParticlesBackground particleColor="#HEXCODE" />
```

### Desabilitar Conexões (Performance Extra)

Edite `components/ui/particles-background.tsx` linha ~172:

```typescript
if (!isMobile && false) {
  // Força desabilitar
  // código das conexões
}
```

## Solução de Problemas

### Performance Baixa em Mobile

1. Reduza densidade: `density="low"`
2. Reduza velocidade: `speed={0.3}`
3. Desabilite conexões (já desabilitadas por padrão)

### Partículas Não Aparecem

1. Verifique se `ClientOnly` está envolvendo o componente
2. Verifique z-index do container
3. Verifique opacidade do container

### Movimento Muito Rápido

Ajuste a propriedade `speed`:

```tsx
<ParticlesBackground speed={0.2} />
```

## Próximas Melhorias Sugeridas

- [ ] Interação com mouse (repulsão/atração de partículas)
- [ ] Cores gradientes nas partículas
- [ ] Tamanhos variáveis de partículas
- [ ] Efeito de parallax no scroll
- [ ] WebGL para ainda mais partículas (opcional)

## Conclusão

O novo sistema de partículas oferece um equilíbrio ideal entre:

- ✨ Impacto visual impressionante
- ⚡ Performance otimizada
- 📱 Experiência mobile fluida
- ♿ Acessibilidade completa

Todas as páginas do site agora compartilham este background dinâmico de forma consistente e performática.
