# Syntaxe Markdown Étendue - BoycottTips

Cette documentation décrit la syntaxe markdown supportée dans les messages de conseils de boycott (BoycottTips).

## 🎨 Formatage du Texte

### Texte Enrichi
```markdown
**Texte en gras**
*Texte en italique*
```

**Rendu :**
- **Texte en gras**
- *Texte en italique*

## 📝 Listes à Puces

### Syntaxe
```markdown
• Premier élément de liste
• Deuxième élément de liste
• Troisième élément de liste
```

**Rendu :**
- Les éléments sont affichés avec des puces colorées (couleur primary)
- Espacement optimisé entre les éléments (mb-1)
- Layout flexbox avec alignement propre

## 🖼️ Images

### Image Individuelle
```markdown
![Description de l'image](https://example.com/image.jpg)
```

**Fonctionnalités :**
- Responsive (max-width: 100%)
- Coins arrondis (rounded-lg)
- Marges verticales (my-2)
- **Cliquable** : ouvre une modal lightbox au clic
- Modal avec overlay sombre et bouton fermeture

### Groupes d'Images
```markdown
[img-group]
![Image 1](https://example.com/image1.jpg)
![Image 2](https://example.com/image2.jpg)
![Image 3](https://example.com/image3.jpg)
[/img-group]
```

**Fonctionnalités :**
- **Affichage en ligne** : toutes les images sur la même ligne
- **Hauteur fixe** : 200px pour tout le groupe
- **Largeur automatique** : les images se partagent équitablement l'espace
- **Espacement** : 0.5rem entre les images
- **Responsive** : `object-fit: cover` pour maintenir les proportions
- **Cliquables** : chaque image ouvre la modal individuellement

## 🔍 Modal Lightbox

### Fonctionnement
- **Déclenchement** : Clic sur n'importe quelle image
- **Affichage** : Image agrandie centrée sur overlay sombre
- **Taille** : Maximum 90% de la largeur/hauteur d'écran
- **Navigation** :
  - Clic sur l'overlay → fermeture
  - Bouton × en haut à droite → fermeture
  - Clic sur l'image → reste ouvert (stopPropagation)

### Design
- Overlay : `bg-black/50` avec `backdrop-blur-xs`
- Image : `object-contain` pour conserver les proportions
- Bouton fermeture : cercle semi-transparent avec effet hover

## 💡 Exemples Complets

### Message avec Texte et Liste
```markdown
**Évitez absolument cette marque** pour les raisons suivantes :

• Pratiques de travail des enfants documentées
• Impact environnemental catastrophique
• Scandales financiers récurrents
• Direction impliquée dans des affaires judiciaires

*Privilégiez les alternatives locales et éthiques.*
```

### Message avec Images Individuelles
```markdown
**Documentations officielles** :

![Rapport ONG](https://example.com/rapport-ong.pdf.jpg)

![Décision de justice](https://example.com/jugement.jpg)

Ces documents prouvent les **pratiques controversées** de cette marque.
```

### Message avec Groupe d'Images
```markdown
**Preuves visuelles des conditions de travail** :

[img-group]
![Usine Bangladesh](https://example.com/usine1.jpg)
![Conditions travail](https://example.com/conditions.jpg)
![Témoignage ouvrier](https://example.com/temoignage.jpg)
[/img-group]

• **Salaires** : En dessous du seuil de pauvreté
• **Sécurité** : Normes internationales non respectées
• **Heures** : Jusqu'à 16h par jour documentées
```

## ⚙️ Implémentation Technique

### Fonction de Parsing
La fonction `formatMarkdown` traite les éléments dans cet ordre :
1. **Groupes d'images** (`[img-group]...[/img-group]`) → `<div class="image-group">`
2. **Images individuelles** (`![alt](url)`) → `<img>` avec modal
3. **Texte gras** (`**texte**`) → `<strong>`
4. **Texte italique** (`*texte*`) → `<em>`
5. **Listes à puces** (`• texte`) → `<div>` avec flexbox
6. **Retours à la ligne** (`\n`) → `<br />`
7. **Nettoyage** : Suppression des `<br />` après les éléments de liste

### Classes CSS Utilisées
```css
/* Groupes d'images */
.image-group {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 200px;
  gap: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.image-group img {
  flex: 1;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
  margin: 0;
  cursor: pointer;
}
```

### Event Handlers
- **Global function** : `window.handleImageClick(src)` pour compatibilité `onclick`
- **Modal state** : `selectedImage` state pour contrôler l'affichage
- **Cleanup** : Suppression automatique de la fonction globale au démontage

## 🚀 Bonnes Pratiques

### Pour les Rédacteurs
1. **Images** : Utilisez des URLs HTTPS fiables
2. **Alt text** : Décrivez toujours le contenu des images
3. **Groupes** : Maximum 4-5 images par groupe pour la lisibilité
4. **Format** : Préférez les images au format paysage (16:9 ou 4:3)

### Pour les Développeurs
1. **Sécurité** : Les images externes ne sont pas optimisées (Next.js `unoptimized`)
2. **Performance** : Modal lazy-loaded seulement si `selectedImage` existe
3. **Accessibilité** : Alt text requis pour toutes les images
4. **Mobile** : Modal responsive avec `max-w-[90vw] max-h-[90vh]`

Cette syntaxe permet de créer des conseils de boycott riches et interactifs tout en gardant une syntaxe simple à utiliser pour les contributeurs.