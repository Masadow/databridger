Je développe une bibliothèque databridger, qui est une integration platform as code.

Elle répond à trois besoins :

1. Gestion des flux OAuth
2. Unification des APIs en interface communes (ex: EmailIntegration qui réunit la possibilité de lire des mails de la même façon pour Gmail, Outlook ou yahoo)
3. Une passerelle directe pour utiliser le SDK natif (ex: createIntegration('gmail').native représente l'objet gmail_v1.Gmail de googleapis)

L'objectif est d'avoir l'ensemble des modules découpés en sous module dans packages.

@databridger/core est le module principal côté back, il décrit toutes les interfaces.

@databridger/client est le module principal côté front, il simplifie le process d'authentification en OAuth2

Le repository est organisé de telle sorte que les packages se référencent localement pour faciliter le développement et ne pas avoir à publish ou build pour que les changements se répecurtent, notamment dans les exemples.

Les exemples utilisent tous la même structure, un front en vite + shadcn, un back en express
