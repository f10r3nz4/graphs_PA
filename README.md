# graphs_PA - API per Creazione ed Esecuzione di Grafi

Progetto per il corso di Programmazione Avanzata dell'A.A: 2021/2022, Prof. Adriano Mancini - Università Politecnica delle Marche

## Specifica del Progetto
Si realizza un sistema che permette all'utente, autenticato con JWT, la creazione e l'esecuzione di modelli di ottimizzazione su grafo, con la possibilità di gestire l'aggiornamento di cambio pesi.
Si aggiunge anche la funzionalità dell'admin di assegnare un credito all'utente che verrà scalato ad ogni creazione o esecuzione di un modello, oltre che alla ricerca filtrata per nodi e archi tra i modelli dell'utente.
Una ultima funzionalità è quella della simulazione che permette all'utente di variare il peso di un arco in maniera iterativa fino a trovare la soluzione ottima.

La specifica completa del progetto è consultabile in questo [documento](https://github.com/f10r3nz4/graphs_PA/blob/main/specifiche.pdf).

## Strumenti e Librerie

- [NodeJS](https://nodejs.org/en/)
- [npm ngraph.graph](https://www.npmjs.com/package/ngraph.graph)
- [npm ngraph.path](https://www.npmjs.com/package/ngraph.path)
- [npm nodemon](https://www.npmjs.com/package/nodemon)
- [VS Code](https://code.visualstudio.com/)
- [JSON Web Token](https://jwt.io/)

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
  
3. In un altra finestra del terminale, dopo l'esecuzione, posizionarsi sulla cartella graph_PA e lanciare:
```
docker exec -i mysqlcontainer mysql -uroot -pVal12345-% usersdb < ./dbinit/init.sql
```

4. Aprire Postman e digitare
```
http://localhost:3000/
  ```
*NB* Per le rotte per cui è prevista l'autenticazione, dopo aver effettuato il login, il token generato va inserito in Header Authorization, questo ha una durata di validità di un'ora

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

Grafo con ID 1 ha 10 nodi e 16 archi, non orientato, associato all'utente user@user1.it. Rappresenta la distanza in km tra alcune città italiane.

Grafo con ID 2 ha 21 nodi e 30 archi, orientato, associato all'utente user@user1.it. Rappresenta la distanza tra punti.

Per visualizzarli in fase di test, dopo aver effettuato il login (autenticazione), occorre utilizzare le rotte get ``` /graphs ```, ``` /users ``` e ``` /nodes ```, che sono rotte di test utili per verificare il corretto inserimento delle informazioni nel DB.

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
- Descrizione: l'utente autenticato come admin, indicando email e numero di token, aggiunge credito all'utente

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

![esempio graph/filter](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20filter.png?raw=true)

### /graphs/modifyWeight
- Metodo:  ``` POST ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Body: 
  - ``` newWeight ```, il nuovo peso da associare al link desiderato
  - ``` link ```, id del link indicato come nodopartenza-nodoarrivo-idgrafo
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente, specificando l'id di uno specifico arco, può modificarne il peso attraverso una media esponenziale

p(i,j) = alpha * p(i,j) + (1 – alpha)*p_new(i,j) 

Esempio:

![esempio graph/modifyWeight](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20modify%20weight.png?raw=true)

### /runGraph
- Metodo:  ``` GET ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Body: 
  - ``` idGraph ```, id del grafo da eseguire
  - ``` algorithm ```, algoritmo da utilizzare per l'esecuzione, a scelta tra nba, astar e agreedy
  - ``` from ```, nome del nodo di partenza per l'esecuzione
  - ``` to ```, nome del nodo di fine per l'esecuzione
  - ``` heuristic ```, euristica da utilizzare per l'esecuzione, 1 (norma 1, distanza Euclidea) o 2 (norma 2, distanza di Manhattan)
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente esegue il modello indicando l'id del grafo, l'algoritmo di esecuzione (astar, agreedy, nba), il nome dei nodi di inizio e fine, l'ordinamento e l'euristica (norma 1 o norma 2). Viene restituito il risultato con: costo in termini di credito che viene detratto all'utente, tempo in millisecondi di esecuzione, costo ottimo in termini di somma dei pesi degli archi del cammino minimo, flag di orientamento e nome dell'euristica scelta.

Esempio:

![esempio runGraph](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20run%20graph.png?raw=true)

### /runs
- Metodo:  ``` GET ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Formato risposta:  ``` application/json ```
- Descrizione: l'utente recupera tutte le esecuzioni da lui effettuate

Esempio:

![esempio runs](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/screen%20runs.png?raw=true)


### /simulation
- Metodo:  ``` POST ```
- Ruolo utente: user, admin
- Autenticazione JWT: Sì
- Formato risposta:  ``` application/json ```
- Body:
  - ``` from ```, nome del nodo di partenza (se grafo orientato) del link da modificare
  - ``` to ```, nome del nodo di arrivo (se grafo orientato) del link da modificare
  - ``` startingValue ```, peso di partenza
  - ``` endingValue ```, peso di fine
  - ``` increment ```, passo di incremento per ogni iterazione
  - ``` algorithm ```, nome dell'algoritmo da usare tra astar, agreedt e nba
  - ``` idGraph ```, ID del modello
  - ``` heuristic ```, numero dell'euristica, 1 norma 1 o 2 norma 2
- Descrizione: l'utente autenticato, indicando il grafo da utilizzare, il link da modificare, un peso di partenza e un peso di fine, un passo di incremento, l'algoritmo e l'euristica da utilizzare, esegue una simulazione che calcola in modo iterativo il peso migliore sul link perchè il costo sia ottimo secondo l'algoritmo usato. Il risultato contiene tutti le esecuzioni con i pesi nel range specificato con quello migliore (peso che dà costo minimo) come best result.

Esempio:

![esempio simulation](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/simulation%20req.png?raw=true)
![esempio simulation](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/simulation%20res1.png?raw=true)
![esempio simulation](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/simulation%20res2.png?raw=true)


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
| /simulation         | POST   | l'utente, indicando peso di inizio e fine ed un passo di incremento, può trovare la soluzione ottima in modo iterativo | admin o user | SI                 |

### Diagrammi UML

#### Caso d'Uso

![caso d'uso UML](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/caso%20d'uso.png?raw_true)

#### Diagrammi di Sequenza

***/login SUCCESS:***

![login success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/login%20success.png?raw=true)

***/login ERROR:***

![login error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/login%20error.png?raw=true)

***/chargeTokens:***

![chargetokens success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/chargetoken%20success.png?raw=true)

***/createGraph SUCCESS:***

![creategraph success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/createGraph%20success.png?raw=true)

***/createGraph ERROR:***

![chargetokens error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/creategraph%20error.png?raw=true))

***/graph/filter SUCCESS:***

![graphfilter success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/filter%20success.png?raw=true)

***/graph/filter ERROR:***

![graphfilter error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/filter%20error.png?raw=true)

***/graph/modifyWeight SUCCESS:***

![graphmodifyweight success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/modifyweight%20success.png?raw=true)

***/graph/modifyWeight ERROR:***

![graphmodifyweight error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/modifyweight%20error.png?raw=true)

***/runGraph SUCCESS:***

![rungraph success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/rungraph%20success.png?raw=true)

***/runGraph ERROR:***

![rungraph error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/rungrapherror.png?raw=true)

***/runs:***

![runs success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/runs.png?raw=true)

***/simulation SUCCESS:***

![simulation success](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/simulation%20success.png?raw=true)

***/simulation ERROR:***

![simulation error](https://github.com/f10r3nz4/graphs_PA/blob/main/uml%20e%20screen/simulation%20error.png?raw=true)

### Pattern

#### MVC

Pattern Model-View-Controller utilizzato per dividere il codice in blocchi di funzionalità distinte. Nel presente progetto la componente View non è stataa inserita in quanto non richiesta, quindi il pattern diventa Model - Controller.
- *Controller*, composto da "user" e "graph" che gestiscono rispettivamente l'utente e il modello. Riceve i comandi e reagisce eseguendo le operazioni richieste restituendo un risultato JSON. Il primo gestisce tutto quello che riguarda l'inserimento del credito e il recupero delle informazioni dell'utente. Il secondo gestisce ogni funzione collegata al grafo, dall'esecuzione del modello alla simulazione e al cambio dei pesi, oltre a restituire le informazioni relative a nodi e archi.
- *Model*, si interfaccia con la base di dati, ne astrae le informazioni in modo che possano essere manipolate dal Controller. Il model in questo caso viene implementato tramite il DAO che funge da ponte tra il controller e la base di dati contenente le informazioni di interesse.

L'utilizzo di questo pattern si è ritenuto necessario perchè permette di implementare un servizio in maniera veloce e supporta le funzioni asincrone.

#### DAO

Pattern DAO per la gestione della persistenza, utilizzato per il mantenimento di una rigida separazione tra le componenti di un'applicazione. Si interfacca con il Controller per accedere al database ed è usato per separare la logica di business dalla logica di acceso ai dati. Nel presente progetto il pattern DAO è diviso per ogni tabella del database mysql, ognuno si occupa di tradurre la richiesta nel linguaggio di interrogazione del DB con le query apposite. Sono presenti DAO per gli archi, i nodi, i grafi, le esecuzioni e gli utenti. Le query si trovano nell'omonima cartella e sono divise per utente, grafo ed esecuzione, vengono salvate in una costante che poi viene esportata e richiamata al bisogno nei DAO.

Questo pattern è stato utilizzato per interfacciarsi in maniera efficace con il database ed avere quindi uno strato intermedio tra il controller che manipola i dati nelle funzioni ed i dati stessi, senza dover richiamare direttamente la query necessaria.

#### Middleware

Per middleware si intende il software che rende accessibile sul Web risorse hardware o software che prima erano disponibili solo localmente o su reti non Internet. Al termine di ogni middleware questo richiama next() che invoca l'eventuale middleware successivo che si trova in catena. Nel presente progetto i middleware vengono utilizzati per effettuare controlli sugli input params o body e per controllare la validità dei token JWT nelle rotte dove è richiesta l'autenticazione.

### Sicurezza e Privacy

Nel presente progetto vi sono alcuni documenti ed informazioni sensibili che normalmente non vengono esposti in chiaro per ragioni di sicurezza informatica e tutela della privacy dell'utente. Tra questi dati vi sono sicuramente la chiave generatrice del token JWT per l'autenticazione e le password degli utenti. Il token JWT viene salvato nel file .env che contiene le variabili d'ambiente del progetto e non viene condiviso insieme al codice, in questo caso è stato fornito per agevolare l'istallazione e include oltre al JWT anche le credenziali ed il nome del DB e la variabile alpha di default usata nell'endpoint del cambio peso. Nel database, inoltre, le password vengono salvate in chiaro come stringhe proprio per facilitare la fase di test e non appesantire l'API.
