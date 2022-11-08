# graphs_PA - API per Creazione ed Esecuzione di Grafi

Progetto per il corso di Programmazione Avanzata dell'A.A: 2021/2022, Prof. Adriano Mancini - Università Politecnica delle Marche

## Specifica del Progetto
La specifica completa del progetto è consultabile in questo documento

## Installazione
### Requisiti:
- [Docker](https://www.docker.com/) per l'istallazione
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
4. Aprire Postman e caricare la collection

## Utilizzo
All'indirizzo si aggiungono le seguenti rotte

### /login
- Metodo:  ``` GET ```
- Ruolo utente: user/admin
- Autenticazione JWT: No
- Parametri: 
  - ``` email ```, email dell'utente
  - ``` password ```, password dell'utente
- Descrizione: l'utente, effettuando il login, si autentica mediante JWT

Esempio:
(screen)

### /chargeTokens
- Metodo:  ``` POST ```
- Ruolo utente: admin
- Autenticazione JWT: Sì
- Parametri: 
  - ```  ```, 
  - ```  ```, 
- Descrizione:

Esempio:
(screen)

### /createGraph
- Metodo:  ``` POST ```
- Ruolo utente: user/admin
- Autenticazione JWT: Sì
- Parametri: 
  - ```  ```, 
  - ```  ```, 
- Descrizione:

Esempio:
(screen)

### /graphs/filter
- Metodo:  ``` GET ```
- Ruolo utente: user/admin
- Autenticazione JWT: Sì
- Parametri: 
  - ```  ```, 
  - ```  ```, 
- Descrizione:

Esempio:
(screen)

### /graphs/modifyWeight
- Metodo:  ``` POST ```
- Ruolo utente: user/admin
- Autenticazione JWT: Sì
- Parametri: 
  - ```  ```, 
  - ```  ```, 
- Descrizione:

Esempio:
(screen)

### /runGraph
- Metodo:  ``` GET ```
- Ruolo utente: user/admin
- Autenticazione JWT: Sì
- Parametri: 
  - ```  ```, 
  - ```  ```, 
- Descrizione:

Esempio:
(screen)

### /runs
- Metodo:  ``` GET ```
- Ruolo utente: user/admin
- Autenticazione JWT: Sì
- Parametri: 
  - ```  ```, 
  - ```  ```, 
- Descrizione:

Esempio:
(screen)

## Progettazione

### Rotte

### Diagrammi UML

#### Caso d'Uso

#### Diagrammi di Sequenza

### Pattern

#### MVC

#### DAO

#### Middleware
