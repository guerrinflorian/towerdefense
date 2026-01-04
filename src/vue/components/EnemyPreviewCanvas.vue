<template>
  <canvas
    ref="canvasRef"
    :width="size"
    :height="size"
    class="enemy-preview-canvas"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { ENEMIES } from '../../config/ennemies/index.js';

const props = defineProps({
  enemyKey: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 120,
  },
});

const canvasRef = ref(null);

// Créer un adaptateur Phaser Graphics pour Canvas
function createPhaserGraphicsLike(ctx) {
  const operations = [];
  let currentFillStyle = null;
  let currentLineStyle = null;
  let currentPath = null;

  const g = {
    fillStyle(color, alpha) {
      currentFillStyle = { color, alpha: alpha !== undefined ? alpha : 1 };
      return g; // Permettre le chaînage
    },
    fillRect(x, y, w, h) {
      operations.push({ type: 'fillRect', x, y, w, h, style: currentFillStyle });
      return g; // Permettre le chaînage
    },
    fillCircle(x, y, r) {
      operations.push({ type: 'fillCircle', x, y, r, style: currentFillStyle });
      return g; // Permettre le chaînage
    },
    fillEllipse(x, y, w, h) {
      operations.push({ type: 'fillEllipse', x, y, w, h, style: currentFillStyle });
      return g; // Permettre le chaînage
    },
    fillRoundedRect(x, y, w, h, r) {
      operations.push({ type: 'fillRoundedRect', x, y, w, h, r, style: currentFillStyle });
      return g; // Permettre le chaînage
    },
    fillTriangle(x1, y1, x2, y2, x3, y3) {
      operations.push({ type: 'fillTriangle', x1, y1, x2, y2, x3, y3, style: currentFillStyle });
      return g; // Permettre le chaînage
    },
    lineStyle(width, color, alpha) {
      currentLineStyle = { width, color, alpha: alpha !== undefined ? alpha : 1 };
      return g; // Permettre le chaînage
    },
    strokeRect(x, y, w, h) {
      operations.push({ type: 'strokeRect', x, y, w, h, style: currentLineStyle });
    },
    strokeCircle(x, y, r) {
      operations.push({ type: 'strokeCircle', x, y, r, style: currentLineStyle });
    },
    strokeRoundedRect(x, y, w, h, r) {
      operations.push({ type: 'strokeRoundedRect', x, y, w, h, r, style: currentLineStyle });
    },
    strokeEllipse(x, y, w, h) {
      operations.push({ type: 'strokeEllipse', x, y, w, h, style: currentLineStyle });
    },
    lineBetween(x1, y1, x2, y2) {
      operations.push({ type: 'lineBetween', x1, y1, x2, y2, style: currentLineStyle });
    },
    setVisible(visible) {
      g.visible = visible;
      return g; // Permettre le chaînage
    },
    beginPath() {
      currentPath = [];
      return g; // Permettre le chaînage
    },
    moveTo(x, y) {
      if (currentPath) currentPath.push({ type: 'moveTo', x, y });
      return g; // Permettre le chaînage
    },
    lineTo(x, y) {
      if (currentPath) currentPath.push({ type: 'lineTo', x, y });
      return g; // Permettre le chaînage
    },
    closePath() {
      if (currentPath) currentPath.push({ type: 'closePath' });
    },
    fillPath() {
      if (currentPath) {
        operations.push({ type: 'fillPath', path: [...currentPath], style: currentFillStyle });
        currentPath = null;
      }
    },
    strokePath() {
      if (currentPath) {
        operations.push({ type: 'strokePath', path: [...currentPath], style: currentLineStyle });
        currentPath = null;
      }
    },
    clear() {
      operations.length = 0;
    },
    setVisible(visible) {
      g.visible = visible;
      return g; // Permettre le chaînage
    },
    setDepth(depth) {
      g.depth = depth;
      return g; // Permettre le chaînage
    },
    strokeLineShape(line) {
      // line est un objet Phaser.Geom.Line avec x1, y1, x2, y2
      const x1 = line.x1 !== undefined ? line.x1 : (line.start ? line.start.x : 0);
      const y1 = line.y1 !== undefined ? line.y1 : (line.start ? line.start.y : 0);
      const x2 = line.x2 !== undefined ? line.x2 : (line.end ? line.end.x : 0);
      const y2 = line.y2 !== undefined ? line.y2 : (line.end ? line.end.y : 0);
      operations.push({ type: 'lineBetween', x1, y1, x2, y2, style: currentLineStyle });
    },
    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      // Enregistrer l'arc dans le path courant
      if (!currentPath) {
        currentPath = [];
      }
      currentPath.push({ type: 'arc', x, y, radius, startAngle, endAngle, anticlockwise: anticlockwise || false });
      return g; // Permettre le chaînage
    },
    operations,
  };

  return g;
}

function createSceneAdapter(ctx) {
  const containers = [];
  const allGraphics = [];
  
  const createContainer = (x = 0, y = 0) => {
    const children = [];
    const container = {
      x: x || 0,
      y: y || 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      add(child) {
        if (child) {
          children.push(child);
          // Si c'est un graphics avec des operations, l'ajouter à la liste
          if (child.operations && Array.isArray(child.operations)) {
            allGraphics.push(child);
          }
          // Si c'est un container, récursivement chercher ses graphics
          if (child.children && Array.isArray(child.children)) {
            child.children.forEach(subChild => {
              if (subChild && subChild.operations && Array.isArray(subChild.operations)) {
                allGraphics.push(subChild);
              }
            });
          }
        }
      },
      sendToBack(child) {
        // Déplacer l'enfant au début du tableau pour qu'il soit dessiné en premier
        const index = children.indexOf(child);
        if (index > 0) {
          children.splice(index, 1);
          children.unshift(child);
        }
        return container; // Permettre le chaînage
      },
      setVisible(visible) {
        container.visible = visible;
        return container; // Permettre le chaînage
      },
      setAlpha(alpha) {
        container.alpha = alpha;
        return container; // Permettre le chaînage
      },
      children,
    };
    containers.push(container);
    return container;
  };

  const createGraphics = () => {
    const g = createPhaserGraphicsLike(ctx);
    allGraphics.push(g);
    return g;
  };

  const createCircle = (x, y, radius, color, alpha) => {
    const circle = {
      x, y, radius, color, alpha,
      setDepth(depth) {
        circle.depth = depth;
        return circle;
      },
      setVisible(visible) {
        circle.visible = visible;
        return circle;
      },
    };
    // Créer une opération fillCircle pour le dessiner
    const g = createPhaserGraphicsLike(ctx);
    g.fillStyle(color, alpha);
    g.fillCircle(x, y, radius);
    allGraphics.push(g);
    return circle;
  };

  return {
    add: {
      graphics: createGraphics,
      container: createContainer,
      circle: createCircle,
    },
    time: {
      now: Date.now(),
    },
    containers,
    allGraphics,
  };
}

function drawOperations(ctx, operations) {
  operations.forEach(op => {
    if (op.type === 'fillRect' && op.style) {
      ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.globalAlpha = op.style.alpha;
      ctx.fillRect(op.x, op.y, op.w, op.h);
    } else if (op.type === 'fillCircle' && op.style) {
      ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.arc(op.x, op.y, op.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (op.type === 'fillEllipse' && op.style) {
      ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.ellipse(op.x, op.y, op.w / 2, op.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (op.type === 'fillRoundedRect' && op.style) {
      ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.roundRect(op.x, op.y, op.w, op.h, op.r);
      ctx.fill();
    } else if (op.type === 'fillTriangle' && op.style) {
      ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.moveTo(op.x1, op.y1);
      ctx.lineTo(op.x2, op.y2);
      ctx.lineTo(op.x3, op.y3);
      ctx.closePath();
      ctx.fill();
    } else if (op.type === 'strokeRect' && op.style) {
      ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = op.style.width;
      ctx.globalAlpha = op.style.alpha;
      ctx.strokeRect(op.x, op.y, op.w, op.h);
    } else if (op.type === 'strokeCircle' && op.style) {
      ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = op.style.width;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.arc(op.x, op.y, op.r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (op.type === 'strokeEllipse' && op.style) {
      ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = op.style.width;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.ellipse(op.x, op.y, op.w / 2, op.h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (op.type === 'strokeRoundedRect' && op.style) {
      ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = op.style.width;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.roundRect(op.x, op.y, op.w, op.h, op.r);
      ctx.stroke();
    } else if (op.type === 'lineBetween' && op.style) {
      ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = op.style.width;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      ctx.moveTo(op.x1, op.y1);
      ctx.lineTo(op.x2, op.y2);
      ctx.stroke();
    } else if (op.type === 'fillPath' && op.path && op.style) {
      ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      op.path.forEach(step => {
        if (step.type === 'moveTo') ctx.moveTo(step.x, step.y);
        else if (step.type === 'lineTo') ctx.lineTo(step.x, step.y);
        else if (step.type === 'arc') ctx.arc(step.x, step.y, step.radius, step.startAngle, step.endAngle, step.anticlockwise);
        else if (step.type === 'closePath') ctx.closePath();
      });
      ctx.fill();
    } else if (op.type === 'strokePath' && op.path && op.style) {
      ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = op.style.width;
      ctx.globalAlpha = op.style.alpha;
      ctx.beginPath();
      op.path.forEach(step => {
        if (step.type === 'moveTo') ctx.moveTo(step.x, step.y);
        else if (step.type === 'lineTo') ctx.lineTo(step.x, step.y);
        else if (step.type === 'arc') ctx.arc(step.x, step.y, step.radius, step.startAngle, step.endAngle, step.anticlockwise);
        else if (step.type === 'closePath') ctx.closePath();
      });
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

function renderEnemy() {
  if (!canvasRef.value) {
    console.warn('[EnemyPreview] Canvas ref non disponible');
    return;
  }
  
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('[EnemyPreview] Contexte canvas non disponible');
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const enemy = ENEMIES[props.enemyKey];
  if (!enemy) {
    console.warn(`[EnemyPreview] Ennemi ${props.enemyKey} non trouvé`);
    return;
  }
  
  if (!enemy.onDraw) {
    console.warn(`[EnemyPreview] Ennemi ${props.enemyKey} n'a pas de fonction onDraw`);
    return;
  }
  
  // Centrer le dessin
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1.0, 1.0);
  
  // Créer l'adaptateur de scène
  const sceneAdapter = createSceneAdapter(ctx);
  const container = sceneAdapter.add.container(0, 0);
  
  // Créer un mock enemy
  const mockEnemy = {
    legs: {},
    elements: {},
    shouldRotate: false,
  };
  
  // Fonction récursive pour collecter tous les graphics
  const collectGraphics = (cont, graphicsList = []) => {
    if (!cont) return graphicsList;
    
    if (cont.children && Array.isArray(cont.children)) {
      cont.children.forEach(child => {
        if (child && child.operations && Array.isArray(child.operations)) {
          graphicsList.push(child);
        }
        // Récursivement chercher dans les containers imbriqués
        if (child && child.children && Array.isArray(child.children)) {
          collectGraphics(child, graphicsList);
        }
      });
    }
    
    return graphicsList;
  };
  
  // Appeler la fonction de dessin réelle
  try {
    enemy.onDraw(sceneAdapter, container, enemy.color, mockEnemy);
    
    // Récupérer toutes les opérations des graphics (récursivement)
    const allGraphics = collectGraphics(container);
    const allOperations = [];
    
    allGraphics.forEach(g => {
      if (g && g.operations && Array.isArray(g.operations)) {
        allOperations.push(...g.operations);
      }
    });
    
    // Aussi vérifier allGraphics de l'adaptateur
    sceneAdapter.allGraphics.forEach(g => {
      if (g && g.operations && Array.isArray(g.operations) && !allGraphics.includes(g)) {
        allOperations.push(...g.operations);
      }
    });
    
    // Dessiner les opérations
    if (allOperations.length > 0) {
      drawOperations(ctx, allOperations);
    } else {
      console.warn(`[EnemyPreview] Aucune opération trouvée pour ${props.enemyKey}`);
      console.warn(`[EnemyPreview] Container children:`, container.children?.length || 0);
      console.warn(`[EnemyPreview] AllGraphics de l'adaptateur:`, sceneAdapter.allGraphics.length);
      // Dessiner un rectangle de test pour vérifier que le canvas fonctionne
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(10, 10, 50, 50);
    }
  } catch (e) {
    console.error(`[EnemyPreview] Erreur dessin ennemi ${props.enemyKey}:`, e);
    console.error(e.stack);
    // Dessiner un rectangle d'erreur
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.restore();
}

const tryRender = () => {
  if (canvasRef.value) {
    renderEnemy();
  } else {
    setTimeout(tryRender, 50);
  }
};

watch(() => props.enemyKey, () => {
  nextTick(() => {
    tryRender();
  });
});

watch(canvasRef, (newVal) => {
  if (newVal) {
    nextTick(() => {
      tryRender();
    });
  }
}, { immediate: true });

onMounted(() => {
  // Essayer plusieurs fois avec des délais croissants
  setTimeout(() => {
    tryRender();
  }, 100);
  setTimeout(() => {
    tryRender();
  }, 300);
  setTimeout(() => {
    tryRender();
  }, 500);
});
</script>

<style scoped>
.enemy-preview-canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>



