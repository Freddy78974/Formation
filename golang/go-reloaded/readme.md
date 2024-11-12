# Projet d'outil de correction et d'édition de texte en Go

## Objectifs

Ce projet consiste à développer un outil simple de correction, d'édition et d'auto-complétion de texte. Pour cela, vous utiliserez des fonctions que vous avez développées dans vos précédents projets, en les adaptant pour répondre aux exigences de cette application. L'outil prendra en entrée un fichier texte à modifier et produira un fichier de sortie avec les modifications demandées.

## Introduction

Votre outil prendra en arguments :

1. Le nom du fichier d'entrée contenant le texte à modifier.
2. Le nom du fichier de sortie où le texte modifié sera enregistré.

### Modifications à appliquer

Votre programme doit effectuer les transformations suivantes dans le texte :

1. **Conversion Hexadécimale** : Remplacer un mot suivi de `(hex)` par sa version décimale.  
   _Exemple :_ `1E (hex)` → `30`

2. **Conversion Binaire** : Remplacer un mot suivi de `(bin)` par sa version décimale.  
   _Exemple :_ `10 (bin)` → `2`

3. **Majuscules (up)** : Transformer le mot précédant `(up)` en majuscules.  
   _Exemple :_ `go (up)` → `GO`

4. **Minuscules (low)** : Transformer le mot précédant `(low)` en minuscules.  
   _Exemple :_ `SHOUTING (low)` → `shouting`

5. **Capitalisation (cap)** : Transformer le mot précédant `(cap)` en capitalisant la première lettre.  
   _Exemple :_ `bridge (cap)` → `Bridge`

6. **Transformation en série (low, up, cap)** : Si une commande est suivie d'un nombre, appliquer la transformation au nombre de mots spécifié.  
   _Exemple :_ `exciting (up, 2)` → `SO EXCITING`

7. **Ponctuation** : Les signes de ponctuation `.,;:?!` doivent être collés au mot précédent sans espace, avec un espace après eux, sauf pour les groupes `...` ou `!?` qui conservent leur format.  
   _Exemple :_ `there ,and then BAMM !!` → `there, and then BAMM!!`

8. **Guillemets simples** : Les mots entre deux `' '` doivent être entourés de guillemets sans espaces internes. Si plusieurs mots sont encadrés, placer les guillemets autour de chaque mot.  
   _Exemples :_  
   - `a ' awesome '` → `a 'awesome'`
   - `' I am happy '` → `'I am happy'`

9. **Correction de l'article "a" en "an"** : Si "a" précède un mot commençant par une voyelle ou "h", le remplacer par "an".  
   _Exemple :_ `a amazing rock` → `an amazing rock`

## Packages autorisés

Seuls les packages standards de Go sont autorisés.

## Utilisation

### Exemple d'entrée et de sortie

#### Exemple 1

**Input :** `sample.txt`
```txt
it (cap) was the best of times, it was the worst of times (up) , it was the age of wisdom, it was the age of foolishness (cap, 6) , it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of darkness, it was the spring of hope, IT WAS THE (low, 3) winter of despair.
```

Commande :

```bash
$ go run . sample.txt result.txt
``` 

**Output :** result.txt

```txt
It was the best of times, it was the worst of TIMES, it was the age of wisdom, It Was The Age Of Foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of darkness, it was the spring of hope, it was the winter of despair.
```

#### Exemple 2

**Input :** sample.txt
```txt
Simply add 42 (hex) and 10 (bin) and you will see the result is 68.
```

Commande :

```bash
$ go run . sample.txt result.txt
```

**Output :** result.txt

```txt
Simply add 66 and 2 and you will see the result is 68.
```

### Exemple 3

**Input :** sample.txt

```txt
There is no greater agony than bearing a untold story inside you.
```

Commande :

```bash
$ go run . sample.txt result.txt
```

**Output :** result.txt

```txt
There is no greater agony than bearing an untold story inside you.
```

### Exemple 4
**Input :** sample.txt

```txt
Punctuation tests are ... kinda boring ,what do you think ?
```

Commande :

```bash
$ go run . sample.txt result.txt
```

**Output :** result.txt

```txt
Punctuation tests are... kinda boring, what do you think?
```
