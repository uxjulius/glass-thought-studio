# Glass Thought Studio

Extensions du skill de motion design **Glass Thought** ([oriaagentpro-a11y/Glass-Thought](https://github.com/oriaagentpro-a11y/Glass-Thought)), utilisées par le skill Claude **glass-thought-studio**.

Le skill de base produit des vidéos dans un style unique : fond sombre, faisceau de lumière, objets en verre chromé et texte qui apparaît mot à mot, calé sur la voix. Le studio garde ce style à l'identique et lui ajoute quatre choses :

- **Des illustrations sur mesure** : une bibliothèque de 12 illustrations en verre conçues pour coller au sujet de la vidéo, et la possibilité d'en créer de nouvelles pour chaque projet.
- **Une signature de fin avec logo**, en plus du nom et du cœur en verre.
- **Un rendu jusqu'en 4K** (2160 × 3840), en plus du Full HD.
- **Des planches de storyboard détaillées**, avec plusieurs images par plan.

Le skill de base n'est jamais modifié. Chaque projet travaille dans sa propre copie, appelée le « studio ».

## Utilisation

```bash
# 1. skill de base (installé et testé)
GT=~/.claude/skills/glass-thought
[ -d "$GT" ] || git clone https://github.com/oriaagentpro-a11y/Glass-Thought.git "$GT"
python3 "$GT/outils/gt.py" docteur || bash "$GT/outils/installer.sh"
python3 "$GT/outils/gt.py" tester

# 2. ce dépôt
git clone <url de ce dépôt> ~/glass-thought-studio

# 3. studio du projet
bash ~/glass-thought-studio/preparer_studio.sh "$GT" ~/mon-projet
STUDIO=~/mon-projet/studio
python3 "$STUDIO/outils/gt.py" nouveau ~/mon-projet
python3 "$STUDIO/outils/gt.py" aligner ~/mon-projet
python3 "$STUDIO/outils/gt.py" storyboard ~/mon-projet
python3 "$STUDIO/outils/planches_detail.py" ~/mon-projet 9:16 3 4
python3 "$STUDIO/outils/gt.py" rendre ~/mon-projet                              # Full HD
GT_ECHELLE=3 GT_CRF=16 GT_JPEG=98 python3 "$STUDIO/outils/gt.py" rendre ~/mon-projet   # 4K
```

Relancer `preparer_studio.sh` met la bibliothèque à jour sans toucher aux fichiers sur mesure du projet.

## Contenu

| Fichier | Rôle |
|---|---|
| `preparer_studio.sh` | Copie le skill de base dans `<projet>/studio` et y branche les extensions |
| `extensions/components-bibliotheque.js` | Les 12 illustrations en verre (composants du moteur) |
| `extensions/modeles_bibliotheque.py` | Le socle (déclencheurs, signature avec logo) et les 12 modèles de plans |
| `extensions/planches_detail.py` | Storyboard détaillé : N images par plan, sans limite de planches |
| `docs/catalogue-sur-mesure.md` | Catalogue des modèles : image, options, déclencheurs, usages |
| `exemples/penser-par-soi-meme/` | Projet réel « Penser par soi-même » : texte, réglages et storyboard |

## Signature avec logo

Dans `projet.json` :

```json
"signature": { "texte": "Votre nom", "logo": "logo.png", "coeur": false, "taille_logo": 130 }
```

Le logo doit être un PNG à fond transparent, placé dans le dossier projet. Comme tout le reste de l'image, il est teinté dans la palette de la vidéo.

## Vérifié

- Le test de fidélité du skill de base passe toujours avec le studio (SSIM minimum 1,0000).
- Les planches du projet d'exemple régénérées avec ce dépôt sont identiques au pixel près à la version validée.
- La signature avec logo et le rendu 4K ont été contrôlés sur des images réelles.

Les polices Poppins et Montserrat appartiennent au skill de base, sous licence SIL Open Font License. Ce dépôt ne contient aucun fichier du skill de base.
