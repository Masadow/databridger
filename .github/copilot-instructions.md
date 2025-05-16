Je développe une bibliothèque ipac, integration platform as code.

L'objectif est d'avoir l'ensemble des modules découpés en sous module dans packages.

@ipac/core est le module principal côté back, il décrit toutes les interfaces.

@ipac/client est le module principal côté front, il simplifie le process d'authentification en OAuth2

Le repository est organisé de telle sorte que les packages se référencent localement pour faciliter le développement et ne pas avoir à publish ou build pour que les changements se répecurtent, notamment dans les exemples.

Les exemples utilisent tous la même structure, un front en vite + shadcn, un back en express
