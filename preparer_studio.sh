#!/usr/bin/env bash
# ==========================================================================
# Glass Thought Studio — prépare le « studio » d'un projet.
# Copie le skill de base Glass Thought dans <dossier-projet>/studio (le skill
# de base n'est jamais modifié), puis y branche les extensions du studio :
#   - moteur : components-bibliotheque.js + components-sur-mesure.js (projet)
#   - générateur : modeles_bibliotheque.py + modeles_sur_mesure.py (projet)
#   - rendu : qualité réglable (GT_ECHELLE, GT_CRF, GT_JPEG) → jusqu'en 4K
#   - outils/planches_detail.py : storyboard détaillé image par image
# usage : bash preparer_studio.sh <dossier du skill de base> <dossier-projet>
# Relancer le script met à jour la bibliothèque sans toucher aux fichiers
# sur mesure du projet.
# ==========================================================================
set -euo pipefail
ICI="$(cd "$(dirname "$0")" && pwd)"
GT="$(cd "$1" && pwd)"; PROJ="$2"; mkdir -p "$PROJ"; PROJ="$(cd "$PROJ" && pwd)"; S="$PROJ/studio"
[ -f "$GT/outils/gt.py" ] || { echo "skill de base introuvable dans $GT"; exit 1; }
case "$S" in "$GT"/*) echo "le projet ne doit pas être dans le dossier du skill de base"; exit 1;; esac
mkdir -p "$S"
(cd "$GT" && tar --exclude=.outils --exclude=.git -cf - .) | (cd "$S" && tar xf -)
[ -e "$S/.outils" ] || ln -s "$GT/.outils" "$S/.outils"
cp "$ICI/extensions/components-bibliotheque.js" "$S/moteur/engine/"
cp "$ICI/extensions/modeles_bibliotheque.py" "$ICI/extensions/planches_detail.py" "$S/outils/"
[ -f "$S/moteur/engine/components-sur-mesure.js" ] || printf '/* Composants sur mesure de ce projet (chargés après la bibliothèque). */\n' > "$S/moteur/engine/components-sur-mesure.js"
[ -f "$S/outils/modeles_sur_mesure.py" ] || printf '# Modèles sur mesure de ce projet (chargés après modeles_bibliotheque.py).\n# Terminer par : MODELES.update({...})\n' > "$S/outils/modeles_sur_mesure.py"
python3 - "$S" <<'PY'
import sys, os
S = sys.argv[1]
# 1. le moteur charge la bibliothèque puis les composants du projet
t = os.path.join(S, 'moteur/template.html'); s = open(t, encoding='utf-8').read()
tags = '<script src="engine/components-bibliotheque.js"></script>\n<script src="engine/components-sur-mesure.js"></script>'
if 'components-bibliotheque.js' not in s:
    s = s.replace('<script src="engine/components-extra.js"></script>', '<script src="engine/components-extra.js"></script>\n' + tags)
open(t, 'w', encoding='utf-8').write(s)
# 2. le générateur exécute la bibliothèque puis les modèles du projet
g = os.path.join(S, 'outils/generer.py'); s = open(g, encoding='utf-8').read()
hook = ("# --- GLASS THOUGHT STUDIO : extensions ---\n"
        "for _f in ('modeles_bibliotheque.py', 'modeles_sur_mesure.py'):\n"
        "    _p = os.path.join(os.path.dirname(os.path.abspath(__file__)), _f)\n"
        "    if os.path.exists(_p): exec(open(_p, encoding='utf-8').read())\n\n")
if 'GLASS THOUGHT STUDIO' not in s:
    s = s.replace("if __name__ == '__main__':", hook + "if __name__ == '__main__':", 1)
open(g, 'w', encoding='utf-8').write(s)
# 3. le rendu accepte une qualité réglable (1080 px par défaut, 4K avec GT_ECHELLE=3)
r = os.path.join(S, 'outils/rendu.cjs'); s = open(r, encoding='utf-8').read()
s = s.replace("scale = preview ? .75 : 1.5", "scale = preview ? .75 : parseFloat(process.env.GT_ECHELLE || '1.5')")
s = s.replace("'-crf', preview ? '24' : '19'", "'-crf', preview ? '24' : (process.env.GT_CRF || '19')")
s = s.replace("type: 'jpeg', quality: 93", "type: 'jpeg', quality: parseInt(process.env.GT_JPEG || '93')")
open(r, 'w', encoding='utf-8').write(s)
PY
echo "studio prêt : $S"
echo "commandes : python3 \"$S/outils/gt.py\" <nouveau|aligner|storyboard|rendre> \"$PROJ\""
