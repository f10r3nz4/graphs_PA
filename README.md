# graphs_PA - API per Creazione ed Esecuzione di Grafi

Progetto per il corso di Programmazione Avanzata dell'A.A: 2021/2022, Prof. Adriano Mancini - Università Politecnica delle Marche

## Specifica del Progetto
Si realizza un sistema che permette all'utente, autenticato con JWT, la creazione e l'esecuzione di modelli di ottimizzazione su grafo, con la possibilità di gestire l'aggiornamento di cambio pesi.
Si aggiunge anche la funzionalità dell'admin di assegnare un credito all'utente che verrà scalato ad ogni creazione o esecuzione di un modello, oltre che alla ricerca filtrata per nodi e archi tra i modelli dell'utente.
Una ultima funzionalità è quella della simulazione che permette all'utente di variare il peso di un arco in maniera iterativa fino a trovare la soluzione ottima.

La specifica completa del progetto è consultabile in questo [documento](https://github.com/f10r3nz4/graphs_PA/blob/main/specifiche.pdf).

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
npm install i
  ```
  
  e poi:
  
 ```
docker-compose up --build 
  ```
  
*NB* Se si utilizza un SO Windows si consiglia di utilizzare la WSL onde evitare errori di decoding dei volumi 
  
3. In un altra finestra, dopo l'esecuzione, posizionarsi sulla cartella graph_PA e lanciare:
```
docker exec -i mysqlcontainer mysql -uroot -pVal12345-% usersdb < ./dbinit/init.sql
```

4. Aprire Postman e digitare
```
http://localhost:3000/
  ```

## Database

All'interno del file [init.sql](https://github.com/f10r3nz4/graphs_PA/blob/main/dbinit/init.sql) è presente la generazione del database MySQL. Nel DB sono già presenti tre utenti e due modelli.

Le credenziali degli utenti sono:

email:    user@user1.it
password: user123
ruolo:    user
con credito

email:    user2@user2.it
password: user123
ruolo:    user
senza credito

email:    admin@user1.it
password: admin123
ruolo:    admin

I modelli sono:

Grafo con ID 1 ha 10 nodi e 16 archi, orientato, associato all'utente user@user1.it.

Grafo con ID 2 ha 21 nodi e 30 archi, orientato, associato all'utente user@user1.it.

Per visualizzarli in fase di test, dopo aver effettuato il login (autenticazione inserendo il token all'interno di header-authorization), occorre utilizzare le rotte ``` /graphs ``` e ``` /nodes ```, che sono rotte di test utili per verificare il corretto inserimento dei grafi.

## Utilizzo
All'indirizzo si aggiungono le seguenti rotte

### /login
- Metodo:  ``` GET ```
- Ruolo utente: user, admin
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
- Ruolo utente: user, admin
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
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Body: 
  - ``` numberOfNodes ```, indicare il numero di nodi contenuti nel grafo da ricercare
  - ``` numberOfLinks ```, indicare il numero di link contenuti nel grafo da ricercare
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente può filtrare i modelli da lui creati indicando numero nodi e numero archi

*NB*: la rotta ``` /graph ``` è una rotta di test che può essere chiamata con autenticazione per restituire tutti i modelli creati dall'utente

Esempio:
![esempio graph/filter](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/Schermata%202022-11-10%20alle%208.07.35%20PM.png?raw=true)

### /graphs/modifyWeight
- Metodo:  ``` POST ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Body: 
  - ``` newWeight ```, il nuovo peso da associare al link desiderato
  - ``` link ```, id del link indicato come nodopartenza-nodoarrivo-idgrafo
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente, specificando l'id di uno specifico arco, può modificarne il peso

Esempio:
![esempio graph/filter](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/Schermata%202022-11-10%20alle%208.07.35%20PM.png?raw=true)

### /runGraph
- Metodo:  ``` GET ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Body: 
  - ``` idGraph ```, id del grafo da eseguire
  - ``` algorithm ```, algoritmo da utilizzare per l'esecuzione, a scelta tra nba, astar e agreedy
  - ``` from ```, nome del nodo di partenza per l'esecuzione
  - ``` to ```, nome del nodo di fine per l'esecuzione
  - ``` isOriented ```, non è obbligatorio inserirlo in quanto viene recuperato dal DB, indica se il grafo è orientato o meno
  - ``` heuristic ```, euristica da utilizzare per l'esecuzione, 1 (norma 1) o 2 (norma 2)
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente esegue il modello indicando l'id del grafo, l'algoritmo di esecuzione (astar, agreedy, nba), il nome dei nodi di inizio e fine, l'ordinamento e l'euristica (norma 1 o norma 2)

Esempio:

![esempio runGraph](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runGraph%20body.png?raw=true)
![esempio runGraph](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runGraph%20json.png?raw=true)

### /runs
- Metodo:  ``` GET ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente recupera tutte le esecuzioni da lui effettuate

Esempio:

![esempio runs](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runs.png?raw=true)


### /simulation
- Metodo:  ``` GET ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Formato risposta:  ``` application/json ```
- Body:
 - ```  ```,
- Descrizione:
Esempio:

![esempio simulation](?raw=true)


## Progettazione

### Rotte

| Rotta               | Metodo | Descrizione                                                                        | Ruolo Utente | Autenticazione JWT |
|:-------------------:|:------:|:----------------------------------------------------------------------------------:|:------------:|:------------------:|
| /login              | GET    | l'utente effettua il login e viene autenticato tramite JWT                         | admin o user | NO                 |
| /chargeTokens       | POST   | l'admin aggiunge un credito all'utente                                             | admin        | SI                 |
| /createGraph        | POST   | l'utente crea un modello                                                           | admin o user | SI                 |
| /graph/filter       | GET    | l'utente visualizza tutti i modelli da lui criati filtrati in AND tra nodi e links | admin o user | SI                 |
| /graph/modifyWeight | POST   | l'utente, indicando grafo e arco può modificarne il peso                           | admin o user | SI                 |
| /runGraph           | GET    | l'utente esegue il modello indicando algoritmo, euristica e nodo di inizio e fine  | admin o user | SI                 |
| /runs               | GET    | l'utente visualizza tutte le esecuzioni da lui effettuate                          | admin o user | SI                 |
| /simulation         | GET    | l'utente indicando peso di inizio e fine può trovare la soluzione ottima in modo iterativo | admin o user | SI                 |

### Diagrammi UML

#### Caso d'Uso

![caso d'uso UML](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-UML%20users.drawio.png)

#### Diagrammi di Sequenza

***/login SUCCESS:***

![login success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-success.drawio.png?raw=true)

***/login ERROR:***

![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-error-unauth.drawio.png?raw=true)
![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-error-internalservererror.drawio.png?raw=true)
![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-login-error-badreq.drawio.png?raw=true)

***/chargeTokens SUCCESS:***

![chargetokens success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/Diagramma%20senza%20titolo-chargeToken-success.drawio.png?raw=true)

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

![graphmodifyweight error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/Diagramma%20senza%20titolo-graphs_modifyWeight%20error.drawio.png?raw=true)

***/runGraph SUCCESS:***

![rungraph success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/Diagramma%20senza%20titolo-_runGraph.drawio.png?raw=true)

***/runGraph ERROR:***

![rungraph error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runGraph%20badreq.drawio.png?raw=true)
![rungraph error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runGraph%20error.drawio.png?raw=true)

***/runs SUCCESS:***

![runs success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/uml-chargeToken-badrequst-_runs.drawio.png?raw=true)

***/simulation SUCCESS:***

***/simulation ERROR:***

### Pattern

#### MVC

Pattern Model-View-Controller utilizzato per dividere il codice in blocchi di funzionalità distinte. Nel presente la componente View non è stataa inserita in quanto non richiesta, quindi il pattern diventa Model - Controller.
- *Controller*, composto da "user" e "graph" che gestiscono rispettivamente l'utente e il modello. Riceve i comandi e reagisce eseguendo le operazioni richieste restituendo un risultato JSON.
- *Model*, si interfaccia con la base di dati, ne astrae le infomrazioni in modo che possano essere manipolate dal Controller.

#### DAO

Pattern DAO per la gestione della persistenza, utilizzato per il mantenimento di una rigida separazione tra le componenti di un'applicazione. Nel presente progetto il pattern DAO è diviso per ogni tabella del database mysql, ognuno si occupa di tradurre la richiesta nel linguaggio di interrogazione del DB con le query apposite, sono presenti DAO per gli archi, i nodi, i grafi, le esecuzioni e gli utenti. Si interfacca con il Controller per accedere al database ed è usato per separare la logica di business dalla logica di acceso ai dati.

#### Middleware


