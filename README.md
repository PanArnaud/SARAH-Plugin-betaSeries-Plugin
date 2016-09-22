betaSeries-Plugin
==========

This plugin is an add-on for the framework [S.A.R.A.H.](http://encausse.net/s-a-r-a-h), an Home Automation project built
on top of:
* C# (Kinect) client for Voice, Gesture, Face, QRCode recognition.
* NodeJS (ExpressJS) server for Internet of Things communication

## Introduction
betaSeries-Plugin permet de se tenir informé rapidement des épisodes à venir des séries que vous suivez.

## Table des matières
- [Compatibilité](#compatibilité)
- [Installation](#installation)
- [Utilisation](#utilsation)
- [Customiser](#customiser)
- [Problèmes](#problemes)
- [Remarques](#remarques)

## Compatibilité
- betaSeries-Plugin est compatible Sarah V3.

## Installation
- Assurez vous d'être inscrit sur [BetaSeries](http://www.betaseries.com/).
- Ajouter des séries que vous souhaitez suivre.
- Rendez-vous ensuite sur [ce lien](http://www.betaseries.com/api/) afin de récupérer une clé API.
- Dans betaSeries.js, collez votre clé à l'emplacement indiqué, ainsi que votre identifiant et votre mot de passe.
- Testez.

## Utilisation
- Demandez simplement : "Quels sont les episodes de la semaine". Après un cours moment, SARAH vous listera les épisodes à venir.

## Customiser
- Vous pouvez changer la date limite des épisode que SARAH récupère. Par défaut elle est fixée à AUJOURD'HUI + 7, soit une semaine. A la ligne de 57 du fichier betaSeries.js vous pouvez modifier cette valeur par le nombre de jours que vous souhaiter (Adapter la phrase dans le .xml :D ).

## Problèmes
- SARAH n'énumère pas les épisodes dans l'ordre des dates.

## Remarques
- Ce plugin est le tout premier que je code, il n'est sûrement pas optimisé, tout remarque est la bienvenue !  
