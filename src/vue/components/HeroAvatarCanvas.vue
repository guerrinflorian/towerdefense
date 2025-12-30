<template>
  <canvas
    ref="canvasRef"
    :width="size"
    :height="size"
    class="hero-avatar-canvas"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { drawHeroBody } from '../../objects/HeroDesigns.js';
import { drawWeapon } from '../../objects/HeroWeapons.js';

const props = defineProps({
  heroId: {
    type: [Number, String],
    required: true,
    validator: (value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    },
  },
  heroColor: {
    type: String,
    default: '#2b2b2b',
  },
  size: {
    type: Number,
    default: 80,
  },
});

const canvasRef = ref(null);

// Créer un contexte Phaser Graphics simulé pour dessiner sur canvas HTML
// Cette version enregistre les opérations au lieu de dessiner directement
function createPhaserGraphicsLike() {
  const operations = [];
  const centerX = props.size / 2;
  const centerY = props.size / 2;
  
  const g = {
    _operations: operations,
    
    fillStyle(color, alpha = 1) {
      operations.push({ type: 'fillStyle', color, alpha });
    },
    
    lineStyle(width, color, alpha = 1) {
      operations.push({ type: 'lineStyle', width, color, alpha });
    },
    
    fillEllipse(x, y, width, height) {
      operations.push({ type: 'fillEllipse', x, y, width, height });
    },
    
    fillRoundedRect(x, y, width, height, radius) {
      operations.push({ type: 'fillRoundedRect', x, y, width, height, radius });
    },
    
    fillTriangle(x1, y1, x2, y2, x3, y3) {
      operations.push({ type: 'fillTriangle', x1, y1, x2, y2, x3, y3 });
    },
    
    fillRect(x, y, width, height) {
      operations.push({ type: 'fillRect', x, y, width, height });
    },
    
    fillCircle(x, y, radius) {
      operations.push({ type: 'fillCircle', x, y, radius });
    },
    
    strokeRoundedRect(x, y, width, height, radius) {
      operations.push({ type: 'strokeRoundedRect', x, y, width, height, radius });
    },
    
    strokeCircle(x, y, radius) {
      operations.push({ type: 'strokeCircle', x, y, radius });
    },
    
    beginPath() {
      operations.push({ type: 'beginPath' });
    },
    
    moveTo(x, y) {
      operations.push({ type: 'moveTo', x, y });
    },
    
    lineTo(x, y) {
      operations.push({ type: 'lineTo', x, y });
    },
    
    strokePath() {
      operations.push({ type: 'strokePath' });
    },
    
    arc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
      operations.push({ type: 'arc', x, y, radius, startAngle, endAngle, anticlockwise });
    },
    
    fillPath() {
      operations.push({ type: 'fillPath' });
    },
    
    closePath() {
      operations.push({ type: 'closePath' });
    },
    
    clear() {
      operations.length = 0;
    },
    
    // Exécuter les opérations sur un contexte canvas (sans ajouter centerX/centerY car déjà dans un contexte transformé)
    execute(ctx) {
      if (operations.length === 0) {
        return;
      }
      
      // Helper pour roundRect
      if (!ctx.roundRect) {
        ctx.roundRect = function(x, y, w, h, r) {
          if (w < 2 * r) r = w / 2;
          if (h < 2 * r) r = h / 2;
          this.beginPath();
          this.moveTo(x + r, y);
          this.arcTo(x + w, y, x + w, y + h, r);
          this.arcTo(x + w, y + h, x, y + h, r);
          this.arcTo(x, y + h, x, y, r);
          this.arcTo(x, y, x + w, y, r);
          this.closePath();
        };
      }
      
      operations.forEach((op, index) => {
        switch (op.type) {
          case 'fillStyle':
            const r = (op.color >> 16) & 0xff;
            const g = (op.color >> 8) & 0xff;
            const b = op.color & 0xff;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${op.alpha})`;
            break;
          case 'lineStyle':
            const lr = (op.color >> 16) & 0xff;
            const lg = (op.color >> 8) & 0xff;
            const lb = op.color & 0xff;
            ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${op.alpha})`;
            ctx.lineWidth = op.width;
            break;
          case 'fillEllipse':
            ctx.beginPath();
            ctx.ellipse(op.x, op.y, op.width / 2, op.height / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'fillRoundedRect':
            ctx.beginPath();
            ctx.roundRect(op.x, op.y, op.width, op.height, op.radius);
            ctx.fill();
            break;
          case 'fillTriangle':
            ctx.beginPath();
            ctx.moveTo(op.x1, op.y1);
            ctx.lineTo(op.x2, op.y2);
            ctx.lineTo(op.x3, op.y3);
            ctx.closePath();
            ctx.fill();
            break;
          case 'fillRect':
            ctx.fillRect(op.x, op.y, op.width, op.height);
            break;
          case 'fillCircle':
            ctx.beginPath();
            ctx.arc(op.x, op.y, op.radius, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'strokeRoundedRect':
            ctx.beginPath();
            ctx.roundRect(op.x, op.y, op.width, op.height, op.radius);
            ctx.stroke();
            break;
          case 'strokeCircle':
            ctx.beginPath();
            ctx.arc(op.x, op.y, op.radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case 'beginPath':
            ctx.beginPath();
            break;
          case 'moveTo':
            ctx.moveTo(op.x, op.y);
            break;
          case 'lineTo':
            ctx.lineTo(op.x, op.y);
            break;
          case 'strokePath':
            ctx.stroke();
            break;
          case 'arc':
            ctx.arc(op.x, op.y, op.radius, op.startAngle, op.endAngle, op.anticlockwise);
            break;
          case 'fillPath':
            ctx.fill();
            break;
          case 'closePath':
            ctx.closePath();
            break;
        }
      });
    },
  };
  
  return g;
}

// Créer un adaptateur de "scene" pour utiliser les fonctions de HeroWeapons.js
function createSceneAdapter() {
  // Simuler scene.add.graphics()
  const createGraphics = () => {
    return createPhaserGraphicsLike();
  };
  
  // Simuler scene.add.container(x, y)
  const createContainer = (x = 0, y = 0) => {
    const children = [];
    let rotation = 0;
    let scaleX = 1;
    let scaleY = 1;
    let containerX = x;
    let containerY = y;
    
    const container = {
      x: containerX,
      y: containerY,
      rotation: rotation,
      scaleX: scaleX,
      scaleY: scaleY,
      list: children,
      
      setRotation(r) {
        rotation = r;
        this.rotation = r;
      },
      
      setScale(sx, sy = sx) {
        scaleX = sx;
        scaleY = sy;
        this.scaleX = sx;
        this.scaleY = sy;
      },
      
      add(child) {
        children.push(child);
      },
    };
    
    return container;
  };
  
  return {
    add: {
      graphics: createGraphics,
      container: createContainer,
    },
  };
}

// Fonction pour dessiner récursivement les containers et graphics
function drawContainerRecursive(ctx, container, parentX = 0, parentY = 0, parentRotation = 0, parentScaleX = 1, parentScaleY = 1) {
  if (!container) return;
  
  // Calculer les transformations cumulées (relatives, pas absolues)
  const totalX = parentX + container.x;
  const totalY = parentY + container.y;
  const totalRotation = parentRotation + (container.rotation || 0);
  const totalScaleX = parentScaleX * (container.scaleX || 1);
  const totalScaleY = parentScaleY * (container.scaleY || 1);
  
  ctx.save();
  // Appliquer les transformations (sans ajouter centerX/centerY ici, on le fait seulement au niveau racine)
  ctx.translate(totalX, totalY);
  ctx.rotate(totalRotation);
  ctx.scale(totalScaleX, totalScaleY);
  
  // Dessiner les enfants
  if (container.list && container.list.length > 0) {
    container.list.forEach((child, index) => {
      if (child.list) {
        // C'est un container - passer les transformations cumulées
        drawContainerRecursive(ctx, child, 0, 0, 0, 1, 1);
      } else if (child._operations) {
        // C'est un graphics - exécuter ses opérations (déjà dans le bon contexte transformé)
        child.execute(ctx);
      }
    });
  }
  
  ctx.restore();
}

function drawHero() {
  if (!canvasRef.value) return;
  
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // Effacer le canvas
  ctx.clearRect(0, 0, props.size, props.size);
  
  // Créer un wrapper Phaser-like pour le corps (version directe pour le corps)
  const centerX = props.size / 2;
  const centerY = props.size / 2;
  
  // Helper pour roundRect
  if (!ctx.roundRect) {
    ctx.roundRect = function(x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
    };
  }
  
  const g = {
    fillStyle(color, alpha = 1) {
      const r = (color >> 16) & 0xff;
      const g = (color >> 8) & 0xff;
      const b = color & 0xff;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    lineStyle(width, color, alpha = 1) {
      const r = (color >> 16) & 0xff;
      const g = (color >> 8) & 0xff;
      const b = color & 0xff;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = width;
    },
    fillEllipse(x, y, width, height) {
      ctx.beginPath();
      ctx.ellipse(centerX + x, centerY + y, width / 2, height / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
    },
    fillRoundedRect(x, y, width, height, radius) {
      ctx.beginPath();
      ctx.roundRect(centerX + x, centerY + y, width, height, radius);
      ctx.fill();
    },
    fillTriangle(x1, y1, x2, y2, x3, y3) {
      ctx.beginPath();
      ctx.moveTo(centerX + x1, centerY + y1);
      ctx.lineTo(centerX + x2, centerY + y2);
      ctx.lineTo(centerX + x3, centerY + y3);
      ctx.closePath();
      ctx.fill();
    },
    fillRect(x, y, width, height) {
      ctx.fillRect(centerX + x, centerY + y, width, height);
    },
    fillCircle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, radius, 0, 2 * Math.PI);
      ctx.fill();
    },
    strokeRoundedRect(x, y, width, height, radius) {
      ctx.beginPath();
      ctx.roundRect(centerX + x, centerY + y, width, height, radius);
      ctx.stroke();
    },
    strokeCircle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    },
    beginPath() {
      ctx.beginPath();
    },
    moveTo(x, y) {
      ctx.moveTo(centerX + x, centerY + y);
    },
    lineTo(x, y) {
      ctx.lineTo(centerX + x, centerY + y);
    },
    strokePath() {
      ctx.stroke();
    },
    arc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
      ctx.arc(centerX + x, centerY + y, radius, startAngle, endAngle, anticlockwise);
    },
    fillPath() {
      ctx.fill();
    },
    closePath() {
      ctx.closePath();
    },
    clear() {},
  };
  
  // Dessiner le héros avec la fonction originale
  const scale = props.size / 50;
  const heroId = Number(props.heroId);
  drawHeroBody(g, scale, 1, heroId, props.heroColor);
  
  // Créer un adaptateur scene pour drawWeapon
  const scene = createSceneAdapter();
  
  // Appeler la fonction originale de HeroWeapons.js
  const weaponData = drawWeapon(scene, heroId, scale, 1);
  
  // Dessiner les armes en appliquant les transformations des containers
  // On translate au centre une seule fois au début
  ctx.save();
  ctx.translate(props.size / 2, props.size / 2);
  
  if (weaponData.swordGroup) {
    if (weaponData.swordGroup.list && weaponData.swordGroup.list.length > 0) {
      drawContainerRecursive(ctx, weaponData.swordGroup);
    }
  }
  
  if (weaponData.secondWeaponGroup) {
    if (weaponData.secondWeaponGroup.list && weaponData.secondWeaponGroup.list.length > 0) {
      drawContainerRecursive(ctx, weaponData.secondWeaponGroup);
    }
  }
  
  ctx.restore();
}

onMounted(() => {
  drawHero();
});

watch([() => props.heroId, () => props.heroColor], () => {
  drawHero();
});
</script>

<style scoped>
.hero-avatar-canvas {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
