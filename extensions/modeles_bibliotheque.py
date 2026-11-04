# ==========================================================================
# modeles_bibliotheque.py — Glass Thought Studio
# Exécuté à la fin de generer.py (H, MODELES, Refus, os, construire, charger
# y sont disponibles). Contient :
#   1. le socle du studio (déclencheurs, signature avec logo)
#   2. les modèles de plans de la bibliothèque d'illustrations sur mesure
# Les modèles propres à un projet vont dans modeles_sur_mesure.py (chargé après).
# ==========================================================================

def _dt(o, t, k, defaut):
    """Temps (s depuis le début du plan) du mot déclencheur k, sinon la valeur par défaut."""
    dc = o.get('declencheurs', {})
    return t(dc[k]) if k in dc else defaut

# --- Signature de fin avec logo ------------------------------------------
# projet.json → "signature": {"texte": "Nom", "logo": "logo.png", "coeur": false, "taille_logo": 130}
_construire0 = construire
def construire(P, W, S):
    scenes, END, rapport, avert = _construire0(P, W, S)
    sig = P.get('signature') or {}
    if sig.get('logo') and scenes:
        chemin = sig['logo'] if os.path.isabs(sig['logo']) else os.path.join(P.get('_dossier', '.'), sig['logo'])
        if not os.path.exists(chemin): raise Refus(f"signature : logo introuvable ({chemin})")
        taille = sig.get('taille_logo', 130)
        couche = H(c='image', src='file://' + os.path.abspath(chemin), x=360, y=760 if sig.get('texte') else 640, w=taille, h=taille, fit='contain', at=.9, **{'in': 'pop'})
        scenes[-1]['layers'] = [l for l in scenes[-1]['layers'] if l.get('c') != 'heart' or sig.get('coeur')] + [couche]
        if not sig.get('texte'): scenes[-1]['caption'] = []
    return scenes, END, rapport, avert

_charger0 = charger
def charger(dossier):
    P, W, S = _charger0(dossier); P['_dossier'] = os.path.abspath(dossier); return P, W, S

# --- Bibliothèque de modèles sur mesure ------------------------------------
def m_ampoule(o, t, d):
    if o.get('mode') == 'eteint':
        tf = _dt(o, t, 'eteint', d * .5)
        return [H(c='bulb', x=360, y=590, size=230, at=0, lit0=1, fadeFrom=max(.2, tf - 1.0), fadeTo=tf + .6, float=1, **{'in': 'rise'})], 'push'
    ta = _dt(o, t, 'allume', d * .8)
    return [H(c='bulb', x=360, y=600, size=230, at=0, lightFrom=.4, lightAt=ta, marks=True, float=1, **{'in': 'focus'})], 'ouverture'

def m_telephone(o, t, d):
    ra = _dt(o, t, 'reponse', d * .55)
    return [H(c='phone', x=360, y=590, w=290, h=470, at=0, ry=-10, rx=5, float=1, askAt=_dt(o, t, 'question', .3), answerAt=ra, question=o.get('question', 'J’ai une question…'), **{'in': 'swing'})], 'orbit'

def m_appat(o, t, d):
    return [H(c='hook', x=360, y=560, size=290, at=0, trapAt=_dt(o, t, 'piege', d * .8) - .1, bait=o.get('appat', 'Réponse rapide'), **{'in': 'fade'})], 'push'

def m_cerveau(o, t, d):
    return [H(c='brain', x=360, y=600, size=400, at=0, dimAt=_dt(o, t, 'eteint', d * .7), label=o.get('label', 'ENTRAÎNEMENT'), float=1, **{'in': 'focus'})], 'push'

def m_recherche(o, t, d):
    return [H(c='search', x=360, y=640, w=540, h=420, at=0, stopAt=_dt(o, t, 'stop', d * .4), clickAt=_dt(o, t, 'clic', d * .75), text=o.get('texte', 'Je cherche par moi-même'), button=o.get('bouton', 'VALIDER'), **{'in': 'rise'})], 'orbitL'

def m_copier(o, t, d):
    return [H(c='copy', x=360, y=630, w=520, h=390, at=0, copyAt=_dt(o, t, 'copie', d * .6), left=o.get('gauche', 'RÉPONSE'), right=o.get('droite', 'MON TEXTE'), key1=o.get('touche1', 'Ctrl'), key2=o.get('touche2', 'C'), **{'in': 'rise'})], 'push'

def m_puce(o, t, d):
    tc = _dt(o, t, 'barre', d * .75)
    return [H(c='chip', x=360, y=600, size=300, at=0, warnAt=max(.4, tc - 1.0), crossAt=tc, float=1, **{'in': 'zoomBlur'})], 'orbit'

def m_siege(o, t, d):
    return [H(c='seat', x=340, y=620, size=400, at=0, sitAt=_dt(o, t, 'assis', d * .8), label=o.get('etiquette', 'TA PLACE'), **{'in': 'rise'})], 'push'

def m_ordre(o, t, d):
    return [H(c='order', x=360, y=600, w=500, h=280, at=0, ry=-8, float=1, swapAt=_dt(o, t, 'inverse', d * .3), first=o.get('premier', 'La machine'), second=o.get('second', 'Toi'), **{'in': 'swing'})], 'orbitL'

def m_brouillon(o, t, d):
    return [H(c='notepad', x=360, y=620, w=400, h=420, at=0, ry=-8, rx=4, float=1, dur=max(1.5, d - .8), title=o.get('titre', 'PREMIÈRE IDÉE'), **{'in': 'swing'})], 'orbit'

def m_relais(o, t, d):
    return [H(c='relay', x=360, y=600, w=520, h=430, at=0, extendAt=_dt(o, t, 'loin', d * .65), left=o.get('depart', 'Toi'), mid=o.get('relais', 'IA'), far=o.get('arrivee', 'Plus loin'), **{'in': 'fade'})], 'push'

def m_monde(o, t, d):
    return [H(c='globe', x=360, y=560, size=300, at=0, failAt=_dt(o, t, 'echec', d * .5), liveAt=_dt(o, t, 'vivant', d * .8), button=o.get('bouton', 'GÉNÉRER'), **{'in': 'focus'})], 'pull'

MODELES.update({'ampoule': m_ampoule, 'telephone': m_telephone, 'appat': m_appat, 'cerveau': m_cerveau, 'recherche': m_recherche,
                'copier': m_copier, 'puce': m_puce, 'siege': m_siege, 'ordre': m_ordre, 'brouillon': m_brouillon, 'relais': m_relais, 'monde': m_monde})
