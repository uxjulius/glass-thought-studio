# Catalogue de la bibliothèque sur mesure

Ces modèles s'ajoutent à ceux du skill de base (`studio/references/catalogue.md`). Ils s'utilisent exactement de la même façon dans `storyboard.json` :

```json
{
  "phrase": "C'est pratique, c'est rapide et c'est justement là que se cache le piège.",
  "modele": "appat",
  "texte": [ { "t": "C'est pratique, c'est rapide", "pos": "haut" }, { "t": "se cache le [piège.]", "pos": "bas" } ],
  "options": { "appat": "Réponse rapide" },
  "declencheurs": { "piege": "piège." },
  "intention": "Un hameçon descend avec l'appât « Réponse rapide » ; la pointe étincelle sur « piège »."
}
```

Sans déclencheur, chaque animation clé part à un moment par défaut du plan (indiqué entre parenthèses).

| Modèle | Composant | Image et animation | Options | Déclencheurs | Idéal pour |
|---|---|---|---|---|---|
| `ampoule` | `bulb` | Ampoule en verre qui s'allume lentement, entourée de « ? » flottants. En mode `eteint`, elle vacille puis s'éteint. | `mode` : `eteint` | `allume` (80 %), `eteint` (50 %) | réflexion, idée, oubli, perte d'inspiration |
| `telephone` | `phone` | Téléphone en verre : la question part, l'IA « tape », la réponse tombe d'un coup, puis le chrono « 3 s » apparaît. | `question` | `question` (0,3 s), `reponse` (55 %) | application, réponse instantanée, réflexe numérique |
| `appat` | `hook` | Un hameçon descend en se balançant, avec un appât en verre ; la pointe étincelle. | `appat` (texte de l'appât) | `piege` (80 %) | piège, tentation, facilité trompeuse |
| `cerveau` | `brain` | Cerveau en verre lumineux qui s'éteint en clignotant, pendant qu'une barre se vide. | `label` (ENTRAÎNEMENT) | `eteint` (70 %) | habitude perdue, fatigue mentale, compétence qui s'use |
| `recherche` | `search` | La barre de recherche se tape seule puis se fait barrer ; un curseur clique sur un bouton et une coche apparaît. | `texte`, `bouton` (VALIDER) | `stop` (40 %), `clic` (75 %) | ne plus chercher, accepter sans vérifier |
| `copier` | `copy` | Deux feuilles en verre ; les touches s'enfoncent et le texte passe d'une feuille à l'autre. | `gauche`, `droite`, `touche1`, `touche2` | `copie` (60 %) | copier, plagier, reproduire |
| `puce` | `chip` | Puce « IA » en verre parcourue d'impulsions ; un panneau d'alerte apparaît puis se fait barrer. | — | `barre` (75 %) | IA, technologie, « ce n'est pas le problème » |
| `siege` | `seat` | Un petit robot arrive en sautillant et s'assoit sur le siège. | `etiquette` (TA PLACE) | `assis` (80 %) | remplacement, déléguer, « à ta place » |
| `ordre` | `order` | Deux étapes numérotées 1 et 2 dont les étiquettes s'échangent ; la nouvelle première s'illumine. | `premier`, `second` | `inverse` (30 %) | priorités, inverser, mettre dans le bon ordre |
| `brouillon` | `notepad` | Carnet à spirale : un stylo en verre écrit en manuscrit, rature un mot et continue. | `titre` (PREMIÈRE IDÉE) | — | écrire, brouillon, première version, imperfection |
| `relais` | `relay` | Une ligne part d'un point, rejoint la puce IA, puis file vers une flèche. | `depart`, `relais`, `arrivee` | `loin` (65 %) | collaboration, aller plus loin, étapes |
| `monde` | `globe` | Globe en verre qui tourne ; un bouton échoue et se fait barrer, puis le globe s'embrase avec des rayons. | `bouton` (GÉNÉRER) | `echec` (50 %), `vivant` (80 %) | vision du monde, unicité, conclusion forte |

Tous ces modèles respectent la mise en page du style : l'illustration tient dans la bande verticale 340–830 (9:16), entre les lignes de texte `haut` et `bas`.

## Ajouter une illustration

1. Le composant va dans `studio/moteur/engine/components-sur-mesure.js` (projet) ou dans `extensions/components-bibliotheque.js` (bibliothèque partagée), au format `C.nom = function (o, scene) { … return { el, w, h, update(t) } }`.
2. Le modèle de plan va dans `studio/outils/modeles_sur_mesure.py` (projet) ou dans `extensions/modeles_bibliotheque.py`. Il prend la forme `def m_nom(o, t, d): return [H(c='nom', …)], 'push'`, suivie de `MODELES.update({'nom': m_nom})`.
3. Une illustration réussie dans un projet peut rejoindre la bibliothèque : copiez-la dans `extensions/`, ajoutez une ligne à ce catalogue et publiez.
