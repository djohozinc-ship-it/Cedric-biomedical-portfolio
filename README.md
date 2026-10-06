# Portfolio de Cédric DJOHOZIN — Génie biomédical

Portfolio personnel (React 18 + TypeScript + SCSS + Three.js) présentant le parcours, l'expertise et les projets
de Cédric DJOHOZIN : maintenance biomédicale et hospitalière, électronique embarquée, IoT et robotique médicale.

**Site :** https://djohozinc-ship-it.github.io/Cedric-biomedical-portfolio

## Contenu

- Accueil avec scène 3D (ville biomédicale), expertise, parcours, projets, formulaire de contact (EmailJS)
- Fiches projets détaillées : SACRURO, MOR-EYES COM V1.0, PPG par vision par ordinateur, Medura
- Galerie photo avec filtres par catégorie et visionneuse plein écran (clavier, balayage tactile)
- Mode sombre / clair (mémorisé), navigation fluide, responsive, PWA

## Lancer en local

```bash
npm install
npm start        # http://localhost:3000
npm run build    # version de production dans /build
```

## Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| Compétences | `src/components/Expertise.tsx` |
| Parcours / stages | `src/components/Timeline.tsx` |
| Cartes de la section Projets | `src/components/Project.tsx` |
| Fiches projets simples (Medura…) | `src/components/ProjectDetails.tsx` |
| Fiches détaillées | `SacruroDetails.tsx`, `MorEyesDetails.tsx`, `PPGComputerVisionDetails.tsx` |
| Photos de la galerie | `public/images/gallery/` + `src/data/gallery.ts` |
| Images de projets (MOR-EYES, PPG) | `public/images/projects/…` |
| Images SACRURO (intégrées au build) | `src/assets/images/sacruro/` |

## Déploiement

Poussez sur la branche `master` : le workflow `.github/workflows/deploy-pages.yml` construit et publie sur GitHub Pages.
