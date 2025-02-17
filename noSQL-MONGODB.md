# MongoDB

## Referência

https://www.mongodb.com/

## Conceitos

- É um banco de dados orientado a documentos
- Projetado para proporcional escalabilidade horizontal (scale out), isto é, ao invés de investir recursos aumentando
a capacidade de um servidor novos computadores são adicionados ao cluster
- Escalabilidade transparente para a aplicação / desenvolvedor à o próprio MongoDB cuida disso
- Apresenta alta performance
- Recursos de indexação, replicação, uso de javascript nativo no lado servidor, consultas com expressões regulares, etc...
- Dados estruturados em **Documentos** agrupados em **Coleções**

```mermaid
graph TD;
    banco_dados-->collection;
    collection-->document;
```

## Instalação

- [Instalação do MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

## Utilizando Docker

[Docker Playground](https://labs.play-with-docker.com/)

## Preparando o Ambiente

- Criar uma imagem baseada no centOS

`docker pull centos`

- Iniciar um `container`

`docker run -it -p 27017:27017 --name mongodb centos`

- Atualizar o repositório do `yum`

```
cd /etc/yum.repos.d/
echo -e '[mongodb-org-7.0]\nname=MongoDB Repository\nbaseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/\ngpgcheck=1\nenabled=1\ngpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc' > mongodb-org-7.0.repo
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
dnf update -y
```

## Instalando Mongodb no Container


```mermaid
graph TD;
    mongod-->mongosh;
    mongod-->compass;
```

`yum install -y mongodb-org`

## Iniciando o servidor

- Criar um diretório para conter o banco de dados, por exemplo:
    ```bash
    mkdir ~/mongodb
    cd ~/mongodb
    ```
- Iniciar o servidor

    `mongod --dbpath /root/mongodb --fork --logpath /dev/null`

- Acessar o cliente

    `mongosh`

- Cliente aceita código em *javascript*
    ```javascript
    function mensagem() {
        return "Alo Mongodb!!!"
    }

    mensagem()
    ``` 
## Comandos Básicos
- `help`: exibe descrição dos comandos
- `cls`: limpa a tela
- `show databases`: lista os bancos de dados
- Criar / utilizar um banco de dados

    ```javascript
    use imobiliaria
    show collections
    ```
- Criar uma **collection** e um **documento**

    ```javascript
    db.tipo_imovel.insertOne({nome: "Residencial"})
    db.tipo_imovel.find()
    ```
## _id

- Atributo `_id` deve ser obrigatório para cada documento
- Deve ser uma sequência de 12 bytes hexadecimais (24 caracteres)
- Pode-se fornecer um `_id` explicitamente ou ele pode ser gerado automaticamente (caso não seja fornecido explicitamente)
- `ObjectId` encapsula o `_id`
- Função `toString()` retorna a *String* representada pelo `ObjectId`
- Função `getTimestamp()` retorna o *timestamp* de um `ObjectId`

## Tipos de Dados

- null Valores nulos
- true / false Boolean
- 3.14, 3 Números
- "Teste" String
- `new Date()` / `ISODate()` (sem o new) Date
- `new Date("<YYYY-mm-dd>")` / `ISODate("<YYYY-mm-dd>")` (sem o new)  Date
- `ObjectId()` Chave única (_id)
- [1,2,3] Array
- {"novo": "documento"} Documento embutido - embedded

## Operações Sobre Datas
- `new Date().getUTCFullYear()`
- `new Date().getUTCMonth()`
- `new Date().getUTCDate()`
- `new Date().getUTCHours()`
- `new Date().getUTCMinutes()`
- `new Date().getUTCSeconds()`

# Operações

- Inserir mais de um documento:

    ```javascript
    db.tipo_imovel.insertMany([{nome: "Comercial"}, {nome: "Temporada"}])
    db.tipo_imovel.find().pretty()
    ```
- Atualizando um documento:

    ```
    db.tipo_imovel.updateOne({_id: ObjectId('64f888e0825db8d91dcfcb7f')}, {$set: {nome: "Air B&B"}})
    ```
- `$set` cria / atualiza um campo em um documento `$unset` remove um campo
- `$inc` incrementa o valor de um campo numérico (pode ser negativo também, decrementando)
    ```javascript
    db.imovel.insertOne({endereco: "Rua Leste, 152"})
    db.imovel.updateOne({endereco: "Rua Leste, 152"}, {$set:{quartos:1}})
    db.imovel.updateOne({ endereco: "Rua Leste, 152" }, { $inc: {"quartos":1}})
    db.imovel.updateOne({endereco: "Rua Leste, 152"}, {$unset:{quartos:-1}})
    ```
- Um documento pode ser substituído integralmente por outro com o `replaceOne({filtro}, novo_doc)`
    ```javascript
    db.imovel.replaceOne({endereco: "Rua Leste, 152"}, {endereco: "Rua Oeste, 155", cidade: "São Paulo"})
    db.imovel.find().pretty()
    ```
- A exclusão de um documento se dá com `deleteOne` passando um seletor como parâmetro Para excluir mais de um ao mesmo tempo utilizar o `deleteMany({filtro})`
- Uma coleção inteira pode ser excluída por meio da função `drop()`
    ```javascript
    db.imovel.deleteOne({endereco: "Rua Oeste, 155"})
    db.imovel.find().pretty()
    show collections
    db.imovel.drop()
    ```

## Operações com Arrays

- *Arrays* são suportados nativamente como um tipo de dados
    ```javascript
    db.imovel.insertOne({endereco: "Rua Oeste, 155", comodos: ["sala", "quarto 1", "quarto 2"]})
    db.imovel.find().pretty()
    ```
- `$push` cria / adiciona elementos a um array
- `$each` modificador de `$push` que permite incluir mais de um elemento no array
    ```javascript
    db.imovel.updateOne({endereco: "Rua Oeste, 155"}, {$push: {comodos: "banheiro social"}})
    db.imovel.updateOne({endereco: "Rua Oeste, 155"}, {$push: {comodos: {$each: ["cozinha", "banheiro serviço"]}}})
    db.imovel.find().pretty()
    ```
- `$addToSet` é semelhante ao `$push` mas previne que valores duplicados sejam inseridos no array
- `$pull` remove um elemento do array baseado em um critério (item dentro do *array*)
- `$pop` também pode ser utilizado para remover elementos do final (`{"key": 1}`) ou início (`{"key": -1}`) do *array*, onde *key* indica o nome do atributo
    ```javascript
    db.imovel.updateOne({endereco: "Rua Oeste, 155"}, {$pull: {comodos: "banheiro social"}})
    db.imovel.find().pretty()
    db.imovel.updateOne({endereco: "Rua Oeste, 155"}, {$pop: {comodos: -1}})
    ```
- Documentos podem ser definidos como atributos de outros documentos
    ```javascript
    db.imovel.updateOne({endereco: "Rua Oeste, 155"}, {$set: {metragem: {largura: 40, profundidade: 60}}})
    db.imovel.find().pretty()
    ```
## Consultas Básicas

- A forma mais simples de efetuar consultas ao MongoDB é por meio do `find()`
- Na sua forma mais simples o `find()` retorna todos os documentos de uma coleção
    ```javascript
    imoveis=[
        {tipo: "Casa", endereco: "Rua Leste, 123", configuracao: {quartos: 1, banheiro: 1}, lazer: ["jardim"], valor: 100000},
        {tipo: "Casa", endereco: "Rua Oeste, 30", configuracao: {quartos: 2, banheiro: 3, vagas: 2}, lazer: ["piscina", "jardim"], valor: 180000},
        {tipo: "Apartamento", endereco: "Rua Leste, 500", configuracao: {quartos: 1, banheiro: 1}, lazer: ["churrasqueira", "piscina"], valor: 90000},
        {tipo: "Apartamento", endereco: "Rua Norte, 100", configuracao: {quartos: 4, banheiro: 3}, lazer: ["jardim", "academia", "playground"], valor: 300000},
        {tipo: "Casa", endereco: "Rua Norte, 200", configuracao: {quartos: 5, banheiro: 3}, lazer: ["piscina"], valor: 400000},
        {tipo: "Casa", endereco: "Rua Sul, 20", configuracao: {quartos: 3, banheiro: 2}, lazer: ["churrasqueira"], valor: 300000},
        {tipo: "Apartamento", endereco: "Rua Sul, 30", configuracao: {quartos: 1, banheiro: 1}, lazer: ["jardim"], valor: 80000},
        {tipo: "Casa", endereco: "Rua Leste, 400", configuracao: {quartos: 1, banheiro: 1}, lazer: ["churrasqueira", "piscina"], valor: 50000},
        {tipo: "Casa", endereco: "Rua Leste, 100", configuracao: {quartos: 2, banheiro: 1}, lazer: ["jardim"], valor: 400000},
        {tipo: "Apartamento", endereco: "Rua Oeste, 40", configuracao: {quartos: 2, banheiro: 2}, lazer: ["jardim", "academia", "playground", "piscina"], valor: 130000},
    ]
    db.imovel.insertMany(imoveis)
    ```

- Um filtro pode ser fornecido como parâmetro na forma de chave: valor
- Mais de uma chave: valor pode ser fornecida e são tratadas como um **AND**
    ```javascript
    db.imovel.find({tipo: "Apartamento"})
    db.imovel.find({tipo: "Apartamento", endereco: "Rua Leste, 500"})
    ```
- É possível selecionar determinados campos e excluir alguns no resultado da consulta
- Os campos são definidos no segundo parâmetro do `find()` onde o **1** indica a inclusão e **0** a exclusão
    ```javascript
    db.imovel.find({tipo: "Apartamento"},{_id: 0, lazer: 1})
    ```
- Critérios podem ser fornecidos como filtros para as consultas: 
    - `$lt` <
    - `$lte` <=
    - `$gt` >
    - `$gte` >= 
    - `$ne` <>
    - `$in`(`$nin`) permite incluir / excluir um conjunto de valores na consulta de um campo 
    - `$or` define cláusulas inclusivas na consulta (operação OR)
    
    ```javascript
    db.imovel.find({"configuracao.quartos": {$gt: 2}})
    db.imovel.find({$or:[{"configuracao.quartos": {$eq: 1}}, {"configuracao.quartos": {$gt: 2}}]})
    db.imovel.find({"configuracao.quartos": {$in: [3,5]}})
    ```
- As consultas permitem que os critérios de filtros sejam especificados por meio de expressões regulares compatíveis com Pearl [PCRE](https://www.pcre.org/)
- Dica: para [testar expressões regulares](https://regex101.com/)
- Para utilizar expressões regulares como critério basta especificar a expressão em `$regex`:
    ```javascript
    db.imovel.find({endereco: {$regex: "^Rua Oeste"}})
    ```
## Consultas Arrays

- `db.imovel.find({lazer: "piscina"})`: retorna todos os registros onde o *array* lazer possua ao menos um elemento
"piscina"
- `db.imovel.find({lazer:{$all:["academia", "piscina"]}})`: retorna todos os registros onde o *array* lazer possua "academia" **E** "piscina" (ao menos)
- `db.imovel.find({"lazer":["academia", "piscina"]})`: retorna todos os registros onde o *array* lazer possua **EXATAMENTE** "academia" e "piscina" (nesta ordem)
- `db.imovel.find({"lazer.0":"jardim"})`: busca por índice no array, retornando documentos onde o primeiro item de lazer na lista (índice 0) seja "jardim"
- `db.imovel.find({"lazer":{$size: 2}})`: retorna documentos que possuam dois elementos no array lazer

## Agregações

- [Agregações](https://www.mongodb.com/docs/manual/reference/operator/aggregation/) permitem realizar várias operações sobre uma coleção
    ```javascript
    db.imovel.aggregate([
        {$group:{_id: "$tipo", total:{$sum: "$valor"}}}
    ])
    ```
- Algumas agregações possíveis
    - `$sum` soma 
    - `$avg` média
    - `$max` máximo
    - `$min` mínimo
    - `$first` primeiro item 
    - `$last` último item
- Um estágio de ordenação dos dados pode ser definido por `$sort` que recebe o atributo e 1 (crescente) ou -1 (descendente)
- Com o `$project` define-se quais atributos serão considerados
    ```javascript
    db.imovel.aggregate([
        {$project:{_id: 0, endereco: 1, valor: 1}},
        {$sort:{valor: -1, endereco: 1}}
    ])
    ```
- Novos estágios podem ser adicionados por exemplo para filtrar os documentos com o `$match`
    ```javascript
    db.imovel.aggregate([
        {$match:{lazer: "piscina"}},
        {$project:{_id: 0, endereco: 1, valor: 1}},
        {$sort:{valor: -1, endereco: 1}}
    ])
    ```
- Contadores podem ser utilizados para totalizar resultados com filtros aplicados utilizando o `$count`
    ```javascript
    db.imovel.aggregate([
        {$match:{lazer: "piscina"}},
        {$count: "total_piscina"}
    ])
    ```
- É possível converter arrays em simples objetos com o `$unwind`
    ```javascript
    db.imovel.aggregate([
        {$unwind: "$lazer"},
        {$group:{_id: "$lazer", total:{$sum: "$valor"}}}
    ])
    ```
## Consultas Where

- Neste tipo de consulta é possível incluir código javascript para processar cada um dos documentos de uma coleção É um recurso muito poderoso que permite implementar consultas com maior complexidade
    ```javascript
    db.imovel.find({$where: function () {
        if (this.endereco.indexOf("500") === -1)
            return false;
        else return true;
    }})
    ```
## Cursores
- Permitem manipular o resultado de uma consulta de forma flexível
    ```javascript
    var imoveis = db.imovel.find()
        imoveis.forEach(function(imovel) { print(imovel.endereco);
    })
    ```
