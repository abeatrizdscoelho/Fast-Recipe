# 🍝 Fast-Recipe
Aplicativo de receitas desenvolvido para a matéria de Programação para Dispositivos Móveis I.

<br>

<span id="sumario">

<div align=center>
<a href ="#projeto"> Projeto </a> | <a href ="#backlog"> Backlog do Produto </a> | <a href ="#dor-dod"> DoR e DoD </a> | <a href ="#sprints"> Sprints </a> | <a href ="#tecnologias"> Tecnologias </a> | <a href ="#execucao"> Guia de Execução </a> 
</div>

<br>

<span id="projeto">

## 📋 O Projeto
> **Status do Projeto: Em andamento**

O **Fast Recipe** é um aplicativo mobile desenvolvido em **React Native** que permite aos usuários descobrir, organizar e compartilhar receitas culinárias de forma simples e prática. A plataforma oferece um **feed de receitas**, onde os usuários podem explorar diferentes pratos, visualizar **detalhes completos com ingredientes, modo de preparo e imagens**, além de cadastrar e publicar **suas próprias receitas**.

O aplicativo também inclui funcionalidades que auxiliam na organização da rotina alimentar, como **planejamento semanal de refeições**, **geração automática de listas de compras** com base nas receitas selecionadas e **marcação de receitas favoritas** para acesso rápido. Além disso, os usuários podem **avaliar e comentar receitas**, contribuindo para a interação dentro da comunidade e ajudando outros usuários a identificar as melhores opções.

Com recursos de **busca, filtros por categoria ou restrições alimentares**, o Fast Recipe tem como objetivo proporcionar uma experiência completa para quem deseja **explorar novas receitas, organizar suas refeições e otimizar o tempo na cozinha**.

O sistema contempla as seguintes funcionalidades principais:

- **Autenticação de usuário**, com recuperação de senha e edição de perfil;
- **CRUD de receitas** (cadastrar, listar, atualizar e deletar);
- **Filtro** de receitas **por categoria e restrição alimentar**;
- **Visualização** detalhada **da receita**;
- Lista de **receitas favoritas**;
- Planejamento de **refeições semanais**;
- Geração automática de **lista de compras**;
- Modo "mãos ocupadas" (**comando de voz**);
- **Timer** integrado para receitas que exigem tempo de preparo;
- Notificações de **lembrete para refeições planejadas**;
- **Compartilhar receitas** em redes sociais;
- **Avaliação de receitas** com estrelas;
- **Comentários em receitas**;
- Modo escuro (tema);
- **Cálculo de proporção** de ingredientes;
- **Histórico** de receitas visualizadas;
- **Sugestão de receitas** baseadas em ingredientes disponíveis;
- Relatório de **estatísticas**.

<br>

<span id="backlog">

## 🗂️ Backlog do Produto 

| ID | Prioridade | User Story | Sprint |
|----|------------|-----------|---------|
| 1 | ALTA | Como usuário, quero cadastrar minhas próprias receitas informando título, ingredientes, modo de preparo, tempo de preparo, porções e categoria, para registrar e compartilhar minhas receitas no aplicativo. | 1 |
| 2 | ALTA | Como usuário, quero visualizar um feed com receitas disponíveis no aplicativo, para descobrir novas receitas e ideias de preparo. | 1 |
| 3 | ALTA | Como usuário, quero visualizar os detalhes completos de uma receita, incluindo ingredientes, modo de preparo e imagens, para acompanhar corretamente o preparo do prato. | 1 |
| 4 | ALTA | Como usuário, quero marcar receitas como favoritas, para acessá-las facilmente sempre que quiser prepará-las novamente. | 1 |
| 5 | MÉDIA | Como usuário, quero buscar receitas pelo nome ou por ingredientes e aplicar filtragem por categoria ou restrição alimentar, para encontrar rapidamente receitas específicas do meu desejo ou restrição que desejo preparar. | 2 |
| 6 | MÉDIA | Como usuário, quero planejar minhas refeições da semana organizando receitas por dia e tipo de refeição, para facilitar a organização da minha alimentação. | 2 |
| 7 | MÉDIA | Como usuário, quero gerar automaticamente uma lista de compras com base nas receitas planejadas, para saber exatamente quais ingredientes preciso comprar. | 2 |
| 8 | MÉDIA | Como usuário, quero compartilhar receitas em redes sociais ou outros aplicativos, para enviar receitas interessantes para amigos e familiares. | 2 |
| 9 | MÉDIA | Como usuário, quero comentar e avaliar receitas, para interagir com outros usuários e compartilhar opiniões ou dicas de preparo. | 2 |
| 10 | BAIXA | Como usuário, quero utilizar um timer durante o preparo das receitas, para controlar corretamente o tempo de cozimento dos alimentos. | 3 |
| 11 | BAIXA | Como usuário, quero informar os ingredientes que tenho em casa e receber sugestões de receitas compatíveis, para aproveitar melhor os alimentos disponíveis. | 3 |
| 12 | BAIXA | Como usuário, quero visualizar informações nutricionais das receitas, para entender melhor os valores nutricionais dos pratos que preparo. | 3 |

<br>

<span id="dor-dod">

## ✅ DoR e DoD
### DoR Definition of Ready
Uma tarefa é considerada **pronta para ser iniciada** quando:
- História bem definida e escrita no formato: “Como [tipo de usuário], quero [funcionalidade], para [benefício]”.
- Cenários de teste definidos.
- Mockups ou fluxos UX disponíveis.
- Regras de negócio claras.
- Critérios de aceitação definidos.

### DoD Definition of Done
Uma tarefa é considerada **pronta** quando:
- Código revisado e integrado.
- Testes aprovados.
- Critérios de aceitação atendidos.
- Regras de negócio respeitadas.
- Documentação atualizada.
- Interface implementada conforme mockups.

<br>

<span id="sprints">

## 📊 Sprints
Sprint | Previsão | Status | Documentação | Vídeo do Projeto |
|------|----------|--------|--------------|------------------|
|01| 16/03/2026 - 12/04/2026 |✅ Concluído| [Ver Documento](./docs/Documento-Sprint-1.pdf) | <a href='https://youtu.be/7vQwrftsCXg'>Ver Vídeo</a> |
|02|  13/04/2026 - 10/05/2026 |⏳ A iniciar| [Ver Documento]() | <a href=''>Ver Vídeo</a> |
|03| 11/05/2026 - 07/06/2026 |⏳ A iniciar| [Ver Documento]() | <a href=''>Ver Vídeo</a> |

<br>

<span id="tecnologias">

## 🔧 Tecnologias
 
As seguintes ferramentas, linguagens, bibliotecas e tecnologias foram usadas na construção do projeto:
 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![React Native](https://img.shields.io/badge/react%20native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) 
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white) 
![Figma](https://img.shields.io/badge/Figma-696969?style=for-the-badge&logo=figma&logoColor=figma)  

<br>

<span id="execucao">

## ⬇ Guia de Execução

<br>

→ <a href="#sumario"> Voltar ao topo </a>
