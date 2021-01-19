# Features von Stunning-Octo-Security


##  1. Sichere Passwortspeicherung
Die sichere Passwortspeicherung wird mit bcrypt sichergestellt. Zuerst nehme ich das Passwort und füge manuel einen Salt hinzu. Dieser Salt ist in der dAtei `config.js` hinterlegt. Danach hashen wir das Passwort mit bcrypt. Hier wie der Code etwa aussieht:

`password` ist das Passwort welches der User  beim login oder bei der Registiereung liefert
`user.pw_hash` ist der Hash welcher sich in der DB befindet

```js
const bcrypt = require('bcrypt');
const config = require('./config');

// Hashes des Passworts 
const hash = bcrypt.hashSync(password + config.salt, 10);


// Überprüfen des Passworts mit dem gespeicherten Hash 
const valid = bcrypt.compareSync(password + config.salt, user.pw_hash)

```
##  2. Login

Bei Login wird der User per `username` geholt und dann überprüft ob das Passwort stimmt. Dies wurde bei "1. Sichere Passwortspeicherung" Dokumentiert.

Wenn das login stimmt wird ein Token erstellt und an den Client versendet siehe "3. Session-Handling".


##  3. Session-Handling
Nach dem login wird auf dem Server ein jwt Bearer-Token erstellt. Dieses enthält userid, username, email und die Zeit, wenn das Token abläuft. Dieses wird mit jsonwebtoken erstellt:
```js
const jwt = require('jsonwebtoken');

let token = await jwt.sign(
    {
        id: user.id,
        username: user.username,
        email: user.email
    }, 
    config.jwt_secret_key, { expiresIn: '1800000' });
``` 

Dieses Token speichert der Client im localStorage und sendet ihn von da an immer an das Backend mit.
```js

let valid = await jwt.verify(token, config.jwt_secret_key);
``` 

##  4. Log-Datei
Für das Logging wurde ein eigener Service erstellt. Dieser behinhaltet das Speichern von logs in einer Datei. 
Das Format der Logs sieht folgendermassen aus:
`(SUCESS) --- b961fd46-be64-4840-be27-376ddc692cb6 --- [1/19/2021 6:21:56 PM] "GET /role" :::::::: message = { role: 'Octo_Boss' }`
1. Zuerst der STAUTS. Dieser kann INFO, ERROR oder SUCCESS sein.
Bedeutung:
- INFO
  - Eine Request hat das Backend erreicht oder ein User wurde erfolgreich identifiziert
- ERROR
  - Es hat einen Fehler gegeben
- SUCCESS
  - Die Anfrage hat ohne Probleme geklappt 

2. Eine UUID. Da ein Request mehrere logs auslöst, kann so geschaut werden, welcher log zu welcher Request gehört, dies auch falls 2 Request gleichzeitig geamcht werden.

3. Das Datum + Uhrzeit wann der Log geschah
4. Welche Schnittstelle wird angesprochen. In diesem Beispiel ist es `POST /command`

5. Optional, Falls eine Message hinterlegt ist, wird diese am Ende angezeigt. 

##  5. Registration
Beim Regististrieren muss man Username, Email und passwort angeben. Speicherung der Passwort wurde bei "1. Sichere Passwortspeicherung" Dokumentiert.
Die Email wird mit folgendem REGEX validiert: 
```/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/```

Mit hilfe der Library Crypto, wird ein Private-, Public-KeyPair erstellt. Der Public key wird in der DB gespichert und der Private Key wird an den User versendet. (Login per Key geht aber nicht)
```js
const crypto = require('crypto');

let keyPair = {};
crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'secret'
            }
        }, (err, publicKey, privateKey) => {
            keyPair = { publicKey, privateKey }
        });
```
##  6. Cross-Site-Scripting XSS
XSS wird von Angular selber verhindert. Falls ich es aber selber beheben müsste, würde ich mit den Usern folgenden Code ausführen:
```js
 this.members = members.map((member) => {
          if (member.email) {
            member.email = member.email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          }
          member.username = member.username.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        return member
      });
```

##  7. Systemkommandos 
Mit Hilfe von folgendem Code kann nur die Methode `executeCommand(command)` aufgerufen werden und der Command `command` wird ausgeführt.
```js
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

module.exports.executeCommand = async (command) => {
    return (await exec(command))["stdout"];
};
```
 Das dieser aber nicht sicher sein muss, wird mit dieser Methode zuerst überprüft ob der Command sicher ist.
 ```js
 
function validateCommand(commandToValidate) {
    let whitelist = ["ls"];
    let blacklist = ["&", ";", "|", "&", ">", "<"];
    let clean = false;
    for (let whiteObject of whitelist) {
        if (commandToValidate.startsWith(whiteObject)) {
            clean = true;
        }
    }
    for (let blackObject of blacklist) {
        if (commandToValidate.indexOf(blackObject) > -1) {
            return false;
        }
    }
    return clean;
}
 ```
##  8. SSL/TLS
Mit Openssl kann ein Zertifikat erstellt werden. Im `README.md` unter installationen findet man die genaue Anleitung wie man dies macht. 
Danach kann ich mit `https` von Nodejs einfach einen HTTPS server aus meiner HTTP Applikation erstellen.

```js
const https = require('https');

const server = https.createServer(config.options, app);
server.listen(config.port, () => {
    // Server läuft mit https
});
```
##  9. Autorisierung 
Ich habe ein Rollenkonzept ausgearbeitet mit folgenden Kriterien

- Jeder neue Benutzer ist ein User
- Ein Boss oder ein Admin können User zum Rang Admin befördern
- Ein Boss kann einen Admin zum Rang User herabstufen

Diese Rollen haben folgende Rechte:

- Nicht eingeloggt
  - Einloggen oder Registrieren
- User
  - Anzeigen Member bereicht exkl. Email
  - Anzeigen Command bereicht
- Admin
  - Erbt Rechte von User 
  - Anzeigen Member bereicht inkl. Email
  - Ausführen von Commands
  - Usern Adminrechte geben
- Boss
  - Erbt Rechte von Admin 
  - Admins Admin-Rechte entziehen




