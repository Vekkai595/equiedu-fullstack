# EquiEdu — Educação para Todos

Protótipo da Falcon Robots para a TBR 2026, idealizado e desenvolvido por Samuel Borba.

O EquiEdu propõe uma ponte sustentável entre escolas, professores, estudantes e oportunidades educacionais. O diagnóstico usa questões revisadas por professores para observar aprendizagens acumuladas no 5º ano (fim dos EFAI) e no 9º ano (fim dos EFAF). Os resultados são calculados por turma, sem solicitar o nome do estudante.

## O que está pronto

- banco de questões vazio e editável, sem questões inventadas;
- fluxo separado para 5º e 9º ano;
- status de questão: rascunho, em revisão e validada;
- filtro por idioma da questão;
- fluxo principal em português, Guarani (Avañe'ẽ), inglês, espanhol, alemão e francês;
- aviso de que a tradução Guarani precisa de validação com falantes e educadores;
- modo claro, modo escuro e painel de acessibilidade;
- resultados por turma e matéria, usando somente aplicações reais;
- proteção de médias de grupos com menos de cinco aplicações;
- oportunidades inicialmente vazias e cadastráveis após verificação;
- importação e exportação de backup JSON;
- modelo JSON para receber questões dos professores;
- funcionamento local pelo navegador, sem sincronização automática.

## Rodar no computador

Requisitos: Node.js 18 ou mais recente.

```bash
npm install
npm run dev
```

Para testar a versão final:

```bash
npm run build
npm run preview
```

## Fluxo recomendado

1. Abra `/admin`.
2. Cadastre ou importe as questões recebidas dos professores.
3. Mantenha cada questão como `rascunho` durante a revisão.
4. Depois da validação pedagógica, mude o status para `validada` e marque a questão como ativa.
5. Abra `/diagnostico`, informe apenas códigos de escola e turma e faça a aplicação.
6. Consulte `/impacto` para ver médias agregadas.
7. Exporte o JSON para manter uma cópia dos resultados.

## Limite importante

Os dados ficam no navegador em que foram cadastrados. Limpar os dados do navegador apaga os registros. Para várias aplicações em aparelhos diferentes, exporte os arquivos e consolide-os com cuidado ou conecte um banco remoto futuramente. Antes de qualquer aplicação com estudantes, combine autorizações, privacidade e devolutiva com a escola responsável.

Veja também:

- `COMO_EDITAR_DADOS.md`
- `GUIA_REUNIAO_SESI.md`
