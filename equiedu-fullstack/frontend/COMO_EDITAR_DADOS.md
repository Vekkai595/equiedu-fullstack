# Como cadastrar dados reais no EquiEdu

## Banco de questões

Acesse `/admin` e abra **Banco de questões**.

Para cada questão, preencha:

- ordem;
- ano escolar: 5 ou 9;
- idioma da questão;
- matéria;
- habilidade ou descritor;
- enunciado e texto de apoio, quando houver;
- alternativas, uma por linha;
- número da alternativa correta;
- professor ou fonte responsável pela validação;
- status;
- indicação de ativa ou inativa.

Somente questões com status **validada** e opção **ativa = true** aparecem para estudantes. Isso permite preparar tudo com antecedência sem publicar rascunhos.

## Importar várias questões

Na Gestão Local, clique em **Modelo de questões**. O site baixa um JSON com todos os campos necessários.

1. Duplique o objeto de exemplo para cada questão.
2. Crie um `id` diferente para cada item.
3. Deixe `status: "rascunho"` e `active: "false"` até a revisão.
4. Carregue o arquivo ou cole o JSON na área **Importar / editar JSON bruto**.
5. Clique em **Mesclar apenas questões**. Assim, arquivos de professores diferentes são unidos sem apagar o banco atual.

A opção **Substituir coleções do backup** deve ser usada apenas para restaurar um backup completo, porque ela substitui as coleções presentes no arquivo.

## Aplicação

Na página `/diagnostico`:

1. escolha 5º ou 9º ano;
2. use um código de escola, nunca o nome;
3. use um código de turma, nunca o nome de um estudante;
4. responda às questões;
5. confira o resultado por matéria.

## Resultados

Em `/impacto`, filtre por ano e turma. O painel mostra:

- quantidade de aplicações;
- média geral;
- quantidade de turmas e códigos de escola;
- médias por turma;
- médias por matéria.

Quando uma turma tem menos de cinco aplicações, a média não é exibida. O objetivo é evitar interpretação de grupos pequenos.

## Backup

Use **Exportar backup** após qualquer cadastro ou aplicação importante. Os dados não são sincronizados entre aparelhos e podem ser apagados ao limpar o navegador.

## O que não cadastrar

Não insira nome, e-mail, telefone, documento, endereço, informação médica ou qualquer dado pessoal de estudante. Não use nomes reais nos códigos de escola e turma.
