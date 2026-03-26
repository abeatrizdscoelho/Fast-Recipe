# 🍝 Fast-Recipe
Aplicativo de receitas desenvolvido para a matéria de Programação para Dispositivos Móveis I.

<br>

<span id="sumario">

<div align=center>
<a href ="#projeto"> Projeto </a> | <a href ="#backlog"> Backlog do Produto </a> | <a href ="#sprints"> Sprints </a> | <a href ="#tecnologias"> Tecnologias </a> | <a href ="#execucao"> Guia de Execução </a> 
</div>

<br>

<span id="projeto">

## 📋 O Projeto
> **📌 Status do Projeto: Em andamento**

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

| ID | RF  | Prioridade | User Story | Sprint |
|----|-----|-----------|-----------|--------|
| 1 | RF01 | ALTA | Como usuário, quero me cadastrar informando nome, e-mail válido e senha, para garantir a segurança do meu acesso e facilitar meu ingresso no sistema. | 1 |
| 2 | RF02 | ALTA | Como usuário, quero iniciar sessão informando meu e-mail e senha cadastrados, para acessar e utilizar todas as funcionalidades do sistema. | 1 |
| 3 | RF03 | ALTA | Como usuário, quero recuperar minha senha através do envio de um link para meu e-mail, para redefinir meu acesso caso eu esqueça a minha senha. | 1 |
| 4 | RF04 | ALTA | Como usuário, quero gerenciar os dados da minha conta, para manter minhas informações atualizadas e meu perfil personalizado. | 1 |
| 5 | RF05 | ALTA | Como usuário, quero adicionar ou alterar minha foto de perfil utilizando a câmera ou galeria do dispositivo, para personalizar minha conta. | 1 |
| 6 | RF06 | ALTA | Como usuário, quero cadastrar minhas próprias receitas informando título, ingredientes, modo de preparo, tempo de preparo, porções e categoria, para registrar e compartilhar minhas receitas no aplicativo. | 1 |
| 7 | RF07 | ALTA | Como usuário, quero visualizar um feed com receitas disponíveis no aplicativo, para descobrir novas receitas e ideias de preparo. | 1 |
| 8 | RF10 | ALTA | Como usuário, quero visualizar os detalhes completos de uma receita, incluindo ingredientes, modo de preparo e imagens, para acompanhar corretamente o preparo do prato. | 1 |
| 9 | RF30 | ALTA | Como usuário, quero visualizar telas de boas-vindas na primeira vez que abrir o aplicativo, para conhecer as principais funcionalidades e entender como utilizar o sistema. | 1 |
| 10 | RF08 | MÉDIA | Como usuário, quero buscar receitas pelo nome ou por ingredientes digitando palavras-chave, para encontrar rapidamente receitas específicas que desejo preparar. | 2 |
| 11 | RF09 | MÉDIA | Como usuário, quero filtrar receitas por categoria ou restrição alimentar, para visualizar apenas receitas que atendam às minhas preferências ou necessidades alimentares. | 2 |
| 12 | RF11 | MÉDIA | Como usuário, quero marcar receitas como favoritas, para acessá-las facilmente sempre que quiser prepará-las novamente. | 2 |
| 13 | RF13 | MÉDIA | Como usuário, quero planejar minhas refeições da semana organizando receitas por dia e tipo de refeição, para facilitar a organização da minha alimentação. | 2 |
| 14 | RF14 | MÉDIA | Como usuário, quero gerar automaticamente uma lista de compras com base nas receitas planejadas, para saber exatamente quais ingredientes preciso comprar. | 2 |
| 15 | RF15 | MÉDIA | Como usuário, quero editar manualmente minha lista de compras adicionando, removendo ou marcando itens como comprados, para adaptar a lista às minhas necessidades. | 2 |
| 16 | RF19 | MÉDIA | Como usuário, quero compartilhar receitas em redes sociais ou outros aplicativos, para enviar receitas interessantes para amigos e familiares. | 2 |
| 17 | RF20 | MÉDIA | Como usuário, quero avaliar receitas utilizando um sistema de estrelas, para ajudar outros usuários a identificar quais receitas são melhor avaliadas. | 2 |
| 18 | RF21 | MÉDIA | Como usuário, quero comentar em receitas, para interagir com outros usuários e compartilhar opiniões ou dicas de preparo. | 2 |
| 19 | RF12 | BAIXA | Como usuário, quero acessar minhas receitas favoritas mesmo sem conexão com a internet, para poder consultá-las a qualquer momento durante o preparo. | 3 |
| 20 | RF16 | BAIXA | Como usuário, quero avançar as etapas da receita utilizando comandos de voz, para conseguir cozinhar sem precisar tocar no celular enquanto preparo os alimentos. | 3 |
| 21 | RF17 | BAIXA | Como usuário, quero utilizar um timer durante o preparo das receitas, para controlar corretamente o tempo de cozimento dos alimentos. | 3 |
| 22 | RF18 | BAIXA | Como usuário, quero receber notificações próximas ao horário das refeições planejadas, para lembrar de preparar ou consultar a receita correspondente. | 3 |
| 23 | RF22 | BAIXA | Como usuário, quero alternar entre tema claro e escuro no aplicativo, para melhorar o conforto visual durante o uso. | 3 |
| 24 | RF23 | BAIXA | Como usuário, quero converter unidades de medida culinárias automaticamente, para entender melhor as quantidades dos ingredientes nas receitas. | 3 |
| 25 | RF24 | BAIXA | Como usuário, quero ajustar automaticamente as quantidades dos ingredientes conforme o número de porções desejadas, para adaptar a receita à quantidade de pessoas. | 3 |
| 26 | RF26 | BAIXA | Como usuário, quero informar os ingredientes que tenho em casa e receber sugestões de receitas compatíveis, para aproveitar melhor os alimentos disponíveis. | 3 |
| 27 | RF28 | BAIXA | Como usuário, quero visualizar estatísticas sobre meu uso do aplicativo, como receitas preparadas e favoritas, para acompanhar minhas atividades no sistema. | 3 |
| 28 | RF29 | BAIXA | Como usuário, quero visualizar informações nutricionais das receitas, para entender melhor os valores nutricionais dos pratos que preparo. | 3 |


<br>

<span id="sprints">

## 📊 Sprints
Sprint | Previsão | Status | Relatório | Vídeo do Projeto |
|------|--------|------|---------|----------|
|01 | 16/03/2026 - 05/04/2026 |⏳ A iniciar| [Ver Relatório]() | <a href=''>Ver Vídeo</a> |
|02|  13/04/2026 - 03/05/2026 |⏳ A iniciar| [Ver Relatório]() | <a href=''>Ver Vídeo</a> |
|03| 11/05/2026 - 31/05/2026 |⏳ A iniciar| [Ver Relatório]() | <a href=''>Ver Vídeo</a> |

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
