# graphs_PA - API per Creazione ed Esecuzione di Grafi

Progetto per il corso di Programmazione Avanzata dell'A.A: 2021/2022, Prof. Adriano Mancini - Università Politecnica delle Marche

## Specifica del Progetto
Si realizza un sistema che permette all'utente, autenticato con JWT, la creazione e l'esecuzione di modelli di ottimizzazione su grafo, con la possibilità di gestire l'aggiornamento di cambio pesi.

La specifica completa del progetto è consultabile in questo ![documento](https://github.com/f10r3nz4/graphs_PA/blob/main/specifiche.pdf).

## Installazione
### Requisiti:
- [Docker](https://www.docker.com/) per l'installazione
- [Posteman](https://www.postman.com/) per il test
### Passaggi:
1. Clonare la presente repository
 ```
git clone https://github.com/f10r3nz4/graphs_PA.git
  ```
2. Posizionarsi sulla cartella graph_PA e lanciare:
 ```
docker-compose up --build 
  ```
3. In un altra finestra, dopo l'esecuzione, posizionarsi sulla cartella graph_PA e lanciare:
```
docker exec -i mysqlcontainer mysql -uroot -pVal12345-% usersdb < ./dbinit/init.sql
  ```
*NB*: nel file init.sql 
4. Aprire Postman e digitare
```
http://localhost:3000/
  ```

## Utilizzo
All'indirizzo si aggiungono le seguenti rotte

### /login
- Metodo:  ``` GET ```
- Ruolo utente: user/admin
- Autenticazione JWT: No
- Parametri: 
  - ``` email ```, email dell'utente
  - ``` password ```, password dell'utente
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente, effettuando il login, si autentica mediante JWT

Esempio:

![esempio login](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20login.png?raw=true)

### /chargeTokens
- Metodo:  ``` POST ```
- Ruolo utente: admin
- Autenticazione JWT: Sì
- Body: 
  - ``` email ```, email dell'utente a cui aggiungere i tokens
  - ``` amount ```, quantità di credito da aggiungere all'utente
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente autenticato come admin, indicando email e numero di token aggiunge credito all'utente

Esempio:

![esempio chargeTokens](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20chargeTokens.png?raw=true)

### /createGraph
- Metodo:  ``` POST ```
- Ruolo utente: user
- Autenticazione JWT: Sì
- Body: 
  - ``` oriented ```, flag per indicare se il grafo da creare è orientato o meno
  - ``` links: [```
          ```     from: ,```
          ```     to: ,```
          ```     weight: ,```
          ```     ] ```, array contenente i link con nodi e peso
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente autenticato inserisce nodi e archi per creare un nuovo modello

Esempio:

![esempio createGraph](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20createGraph.png?raw=true)

### /graphs/filter
- Metodo:  ``` GET ```
- Ruolo utente: user
- Autenticazione JWT: Sì
- Body: 
  - ```  ```, 
  - ```  ```, 
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente può filtrare i modelli da lui creati indicando numero nodi e numero archi

*NB*: la rotta ``` /graph ``` è una rotta di test che può essere chiamata con autenticazione per restituire tutti i modelli creati dall'utente

Esempio:
(screen)

### /graphs/modifyWeight
- Metodo:  ``` POST ```
- Ruolo utente: user
- Autenticazione JWT: Sì
- Body: 
  - ```  ```, 
  - ```  ```,
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente, specificando arco e grafo, può modificarne il peso

Esempio:
(screen)

### /runGraph
- Metodo:  ``` GET ```
- Ruolo utente: user
- Autenticazione JWT: Sì
- Body: 
  - ``` idGraph ```, 
  - ``` algorithm ```, 
  - ``` from ```, 
  - ``` to ```,
  - ``` isOriented ```, 
  - ``` heuristic ```,
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente esegue il modello indicando l'id del grafo, l'algoritmo di esecuzione, i nodi di inizio e fine, l'ordinamento e l'euristica

Esempio:

![esempio runGraph](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runGraph%20body.png?raw=true)
![esempio runGraph](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runGraph%20json.png?raw=true)

### /runs
- Metodo:  ``` GET ```
- Ruolo utente: user
- Autenticazione JWT: Sì
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente recupera tutte le esecuzioni da lui effettuate

Esempio:

![esempio runs](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runs.png?raw=true)

## Progettazione

### Rotte

| Rotta               | Metodo | Descrizione                                                                        | Ruolo Utente | Autenticazione JWT |
|:-------------------:|:------:|:----------------------------------------------------------------------------------:|:------------:|:------------------:|
| /login              | GET    | l'utente effettua il login e viene autenticato tramite JWT                         | admin o user | NO                 |
| /chargeTokens       | POST   | l'admin aggiunge un credito all'utente                                             | admin        | SI                 |
| /createGraph        | POST   | l'utente crea un modello                                                           | user         | SI                 |
| /graph/filter       | GET    | l'utente visualizza tutti i modelli da lui criati filtrati in AND tra nodi e links | user         | SI                 |
| /graph/modifyWeight | POST   | l'utente, indicando grafo e arco può modificarne il peso                           | user         | SI                 |
| /runGraph           | GET    | l'utente esegue il modello indicando algoritmo, euristica e nodo di inizio e fine  | user         | SI                 |
| /runs               | GET    | l'utente visualizza tutte le esecuzioni da lui effettuate                          | user         | SI                 |

### Diagrammi UML

#### Caso d'Uso

#### Diagrammi di Sequenza

***/login SUCCESS:***

![login success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-success.drawio.png?raw=true)

***LOGIN ERROR:***

![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-error-unauth.drawio.png?raw=true)
![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-error-internalservererror.drawio.png?raw=true)
![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-error-badreq.drawio.png?raw=true)

***/chargeTokens SUCCESS:***

![chargetokens success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-chargeToken-success.drawio.png?raw=true)

***/chargeTokens ERROR:***

![chargetokens error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-chargeToken-unauth.drawio.png?raw=true)
![chargetokens error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-chargeToken-badrequst.drawio.png?raw=true)

***/createGraph SUCCESS:***

![creategraph success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-creategraph-success.drawio.png?raw=true)

***/createGraph ERROR:***

![chargetokens error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-creategraph-error-.nottoken.drawio.png?raw=true)
![chargetokens error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-creategraph-error.drawio.png?raw=true)

***/graph/filter SUCCESS:***

![graphfilter success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-graphs_filter%20success.drawio.png?raw=true)

***/graph/filter ERROR:***

![graphfilter error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-graphs_filter%20error.drawio.png?raw=true)

***/graph/modifyWeight SUCCESS:***

![graphmodifyweight success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-graphs_modifyWeight%C3%B9.drawio.png?raw=true)

***/graph/modifyWeight ERROR:***

![graphmodifyweight error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-graphs_modifyWeight%20error.drawio.png?raw=true)

***/runGraph SUCCESS:***

![rungraph success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runGraph.drawio.png?raw=true)

***/runGraph ERROR:***

![rungraph error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runGraph%20badreq.drawio.png?raw=true)
![rungraph error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runGraph%20error.drawio.png?raw=true)

***/runs SUCCESS:***

![runs success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runs.drawio.png?raw=true)

### Pattern

#### MVC

#### DAO

#### Middleware
