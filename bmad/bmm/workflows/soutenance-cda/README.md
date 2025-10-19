# Workflow: Soutenance CDA

## Objectif

Ce workflow guide l'utilisateur dans la création d'un document de soutenance structuré pour le Titre Professionnel de Concepteur Développeur d'Applications (CDA).

## Invocation

Pour exécuter ce workflow, utilisez la commande suivante dans l'interface BMAD :

`workflow soutenance-cda`

## Entrées Attendues

Le workflow est entièrement interactif. Il posera une série de questions à l'utilisateur pour collecter les informations nécessaires, notamment :

*   Des descriptions textuelles pour chaque section du document.
*   Des extraits de code pertinents (UI, métier, accès aux données).
*   Des exemples concrets de mise en œuvre pour chaque compétence du référentiel.

## Sortie Générée

Un unique document Markdown (`soutenance-cda-{{date}}.md`) sera créé dans le dossier de sortie configuré (par défaut, le dossier `/docs`).
