# AI Prompt Studio

Extensão Chrome para gerenciamento de prompts de IA com recursos avançados.

## Screenshots

### Dark Mode (Padrão)
![Dark Mode](./docs/images/screenshot-main.svg)

### Light Mode
![Light Mode](./docs/images/screenshot-light.svg)

### Editor de Prompts
![Prompt Editor](./docs/images/screenshot-editor.svg)

### Histórico
![History](./docs/images/screenshot-history.svg)

## Funcionalidades

### Core
- Criar, editar, copiar e excluir prompts
- Melhorar prompts com IA (Gemini)
- Gerar variações de prompts
- Sugestões de enhancement
- dark/light mode

### Avançadas
- **History** - Salva os últimos 50 prompts copiados
- **Favoritos** - Marca prompts favoritos com um clique
- **Tags** - Organize prompts com tags e categorias
- **Contagem de uso** - Acompanha quantas vezes cada prompt foi usado
- **Export/Import** - Backup em JSON, sincronize entre dispositivos
- **Atalhos de teclado**
  - `Ctrl+N` - Novo prompt
  - `Ctrl+F` - Buscar prompts
  - `Esc` - Fechar modal

## Como Instalar

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure a API key: crie arquivo `.env.local` com `GEMINI_API_KEY=sua_chave`
4. Execute: `npm run dev`
5. Carregue em `/dist` no Chrome em `chrome://extensions/`

## Tecnologias
- React + TypeScript
- Vite
- Gemini API
- TailwindCSS

## Keyboard Shortcuts
- `Ctrl+N` - New prompt
- `Ctrl+F` - Search
- `Esc` - Close modal
