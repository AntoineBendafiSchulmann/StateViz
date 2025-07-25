# StateViz

Éditeur visuel minimaliste de machines à états

## Code (Monorepo)

```bash
StateViz/
├─ apps/
│  └─ frontend/ # Vite + React + Radix UI + React Flow
└─ packages/
└─ core/ # Types + schéma Zod partagés
```

## Démarrage

```bash
pnpm i
pnpm dev
```

## Démarrage (développement)

```bash
pnpm i
pnpm --filter @stateviz/core run build
pnpm --filter frontend run dev
```

## Tests unitaires

Les tests Vitest actuels valident deux opérations principales du **store Zustand** :

1. **création puis suppression d’une transition**

   - **Contexte** : on part d’une machine avec deux états `a` et `b`.
   - **Action 1** : `createTransition('a', 'b', 'X')`  
     → ajoute une arête (transition) nommée **X** qui part de l’état **a** et pointe vers **b**.
   - **Vérification 1** : l’objet `graph.states['a'].on['X'].target` vaut bien `"b"`.
   - **Action 2** : `deleteTransition('a', 'X')`  
     → supprime cette transition.
   - **Vérification 2** : `graph.states['a'].on['X']` est maintenant **undefined**.

2. **renommage d’une transition**
   - **Contexte** : même machine, transition initiale `'OLD'` de **a** vers **b**.
   - **Action** : `renameTransition('a', 'OLD', 'NEW')`  
     → remplace l’événement **OLD** par **NEW**, sans toucher à la cible (**b**).
   - **Vérification 1** : `graph.states['a'].on['OLD']` est **undefined**.
   - **Vérification 2** : `graph.states['a'].on['NEW'].target` vaut toujours `"b"`.

```bash
pnpm test             # lance les deux tests
pnpm test -- --coverage   # même chose avec rapport de couverture en plus
```

## Fonctionnalités

- **Drag & Drop** : Déplacer librement les nœuds; la position est mémorisée.
- **+ State** : Ajouter un nouveau nœud vierge.
- **Transition** :
  1. Cliquer sur **Transition** (le bouton passe en bleu).
  2. Cliquer sur le nœud source.
  3. Cliquer sur le nœud cible → saisir le nom de l'évènement.
  4. L'arête apparaît immédiatement.
- **Zoom / Pan** : intégrés avec react flow.

## TODO (Petite Roadmap)

| Tâche                                          | État |
| ---------------------------------------------- | ---- |
| Panneau latéral de propriété (rename / delete) | ⏳   |
| Export / Import JSON                           | ⏳   |
| Persistance                                    | ⏳   |
| Thème Radix complet + toasts                   | ⏳   |
