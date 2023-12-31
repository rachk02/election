# Election décentralisée
### Participants
- Badolo Micheline Latifatou
- Fofana Abdoul-rachid B.
- Some Wendbele Diane

## Procedures a suivre pour l'exécution du code 

1. **Cloner le projet**
   ```
   $ git clone https://github.com/rachk02/election.git
   ```
2. **Installer les dépendances**
    
    * Se placer dans le dossier cloner
    ``` 
    $ cd election
    ```
    * ##### [Installer Node.js](https://github.com/Schniz/fnm#using-a-script-macoslinux)
    * ##### [Installer Truffle](https://trufflesuite.com/docs/truffle/how-to/install/)
    * ##### [Installer Ganache](https://trufflesuite.com/ganache/)
    * ##### Installer l'extension Metamask dans chrome ou firefox
***
3. **Configurer Ganache**
   * Lancer le client graphique Ganache. Cela démarrera votre instance de blockchain locale.
   * Cliquer sur le bouton `NEW WORKSPACE` et ensuite nommez votre workspace dans le champ `WORKSPACE NAME`.
   * Cliquer sur le bouton `ADD PROJECT` pour ajouter le fichier de configuration `truffle-config.js` du programme et par la suite cliquer sur le bouton `START` pour enregistrer le workspace.
***
4. **Compiler et déployer le contrat intelligent Election**
    ```
    $ truffle migrate --reset
    ```
    Vous devez migrer le contrat intelligent de l'élection à chaque redémarrage de Ganache.
***  
5. **Configurer Metamask**
    * Creer un compte metamask avec l'extension intalle sur le navigateur.
    * Connecter Metamask à la blockchain Ethereum locale fournie par Ganache.
        * Dans les parametres de Metamask cliquer sur `Réseaux > Ajouter un réseau > Ajouter manuellement un réseau`
        * Renseigner les différents champs avec :
            *Nouvelle URL de RPC*
            ```
            http://127.0.0.1:7545/
            ```
            *ID de chaîne*
            ```
            1337
            ```
            *Symbole de la devise*
            ```
            ETH
            ```
    * Enregistrer le réseau.
    * Ajouter un compte fourni par Ganache en l'important dans Metamask avec sa clé privée
***
6. **Exécuter l'application**
    * Exécuter la commande:
    ```bash
    $ npm run dev
    ```
    * Visiter cette URL dans votre navigateur : [http://localhost:3000](http://localhost:3000)
    * Connecter le compte importer dans Metamask a l'URL afin d'éffectuer le vote.
