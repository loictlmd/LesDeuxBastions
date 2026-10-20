# Jouer sur Internet avec ngrok

Le fichier **Lancer le jeu.bat** démarre désormais le serveur Node.js et ngrok dans une même fenêtre. Il affiche le lien HTTPS et ouvre ce lien dans le navigateur lorsque le tunnel est connecté. Les deux équipes utilisent ce même lien, même depuis des réseaux différents.

## Première configuration sur Windows

Node.js 20 ou supérieur et un compte ngrok sont nécessaires. Téléchargez ngrok depuis le [site officiel](https://ngrok.com/download/windows), avec une version adaptée à votre Windows, puis décompressez `ngrok.exe` dans le sous-dossier `tools` du projet.

Si vous avez utilisé notre téléchargement PowerShell précédent, le lanceur retrouve automatiquement `%TEMP%\bastions-ngrok\ngrok.exe` et `%TEMP%\ngrok\ngrok.exe`. Pour conserver l’exécutable après un nettoyage du dossier temporaire :

```powershell
cd "C:\Users\lotou\Desktop\Projet Dev\LesDeuxBastions"
New-Item -ItemType Directory -Force .\tools | Out-Null
Copy-Item "$env:TEMP\bastions-ngrok\ngrok.exe" .\tools\ngrok.exe
```

Configurez une seule fois votre [authtoken personnel](https://dashboard.ngrok.com/get-started/your-authtoken) si ce n’est pas déjà fait :

```powershell
.\tools\ngrok.exe config add-authtoken "VOTRE_JETON"
```

Le jeton est conservé dans la configuration utilisateur ngrok, jamais dans les fichiers du projet. Ne le collez pas dans le README ou dans un message. Le dossier `tools`, les exécutables et `ngrok.yml` sont ignorés par Git.

## Lancements suivants

1. Arrêtez l’ancien `npm start` et tout ancien tunnel avec `Ctrl+C` pour libérer le port et la session ngrok.
2. Double-cliquez sur **Lancer le jeu.bat**.
3. Attendez le message **LIEN INTERNET À PARTAGER**.
4. Ouvrez ce lien sur les deux appareils. Si ngrok affiche une page intermédiaire, cliquez sur **Visit Site**.
5. Gardez la fenêtre ouverte et le PC connecté, sans mise en veille. `Ctrl+C` arrête le serveur et le tunnel lancés par ce fichier.

En ligne de commande, `npm run share` lance le même programme. `npm start` démarre uniquement le jeu local, sans ngrok. Aucun compte ngrok n’est nécessaire aux joueurs.

## Emplacement de ngrok et port du jeu

Le lanceur cherche successivement le chemin défini par `NGROK_PATH`, `tools/ngrok.exe`, `ngrok.exe` à la racine du projet, les deux dossiers temporaires ci-dessus, le lien WinGet et les dossiers du `PATH`.

Pour un autre emplacement ou un autre port, depuis le dossier du projet :

```powershell
$env:NGROK_PATH = "C:\chemin vers ngrok\ngrok.exe"
$env:PORT = "3001"
npm run share
```

Le serveur et le tunnel utilisent automatiquement le même port. Le lien d’invitation dans l’interface locale adopte l’adresse publique dès qu’elle est connue (actualisation sous dix secondes).

## En cas de problème

| Message / symptôme | Action |
|---|---|
| ngrok introuvable | Placez l’exécutable dans `tools`, ou renseignez `NGROK_PATH`. |
| Application non valide pour Windows | Retéléchargez la bonne architecture et attendez la fin complète du téléchargement. |
| Erreur d’authentification ngrok | Configurez l’authtoken de votre compte, puis relancez. |
| Session ngrok déjà active | Arrêtez l’ancien tunnel avant de relancer. |
| Port déjà utilisé | Arrêtez l’ancien serveur, ou changez `PORT`. Le lanceur ne démarre pas de tunnel si le serveur n’a pas pu démarrer. |
| Connexion Internet refusée ou délai dépassé | Vérifiez le réseau et les messages ngrok ; un réseau filtré peut aussi bloquer ngrok. |
| Tunnel arrêté | Le jeu reste accessible localement ; relancez le lanceur pour rétablir le tunnel. |

Le tunnel dépend de votre compte, de ses quotas et du réseau. Le lanceur ne contourne pas ces restrictions et ne modifie pas votre pare-feu. Les parties restent en mémoire et disparaissent lorsque le serveur s’arrête.

Référence technique : [CLI officielle ngrok](https://ngrok.com/docs/gateway/agent/cli), commandes `config add-authtoken` et `http`, options de journalisation JSON.

## Vérification

Le programme de lancement est testé avec un faux exécutable ngrok : démarrage du serveur avant le tunnel, transmission du bon port, récupération du lien public, arrêt des processus, erreur ngrok et port occupé. La vérification réelle du double-clic Windows, de l’ouverture du navigateur Windows et de la connexion au compte ngrok reste à faire sur le PC de l’animateur.
