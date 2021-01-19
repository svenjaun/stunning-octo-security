# Stunncting Octo Security - Projekt Modul 183
Dieses Repository wurde im Rahmen des Schulfaches 183 Applikation Sicherheit implementieren gemacht.
<br>
<br>
**Author:** Jaun Sven

## Dokumentation

[`Arbeitsjournal`](documentation/work_journal.md)

[`Feature Dokumentation`](documentation/feature_documentation.md)

## Applikation starten

Alle Programme und Commands welche benötigt werden sind auf der `bmLP1` vorinstalliert.
Falls man diese nicht hat, braucht es folgende Programme:
- [`Nodejs/npm`](https://nodejs.org/en/)
- [`PostgreSQL`](https://www.postgresql.org/)
- Browser nach Wunsch (NICHT Internet Explorer)

### Backend 

#### Installieren (ist auf `bmLP1` installiert)
- `npm i`
- Datenbank einrichten und `DBINIT.sql` durchführen
- `config.js` nach wunsch konfigurieren
- SSL Key generieren mit folgenden Commandos:
  - `openssl genrsa -out key.pem`
  - `openssl req -new -key key.pem -out csr.pem`
  - `openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem`

#### Starten
- `node server.js`


### Frontend  

#### Installieren (ist auf `bmLP1` installiert)
- `npm i`

#### Starten
#### Starten
- `ng s`
