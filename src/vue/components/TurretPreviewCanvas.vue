<template>
  <canvas
    ref="canvasRef"
    :width="size"
    :height="size"
    class="turret-preview-canvas"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { TURRETS } from '../../config/turrets/index.js';

const props = defineProps({
  turretKey: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
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
    clear() {
      operations.length = 0;
      currentFillStyle = null;
      currentLineStyle = null;
      currentPath = null;
    },
    fillStyle(color, alpha) {
      currentFillStyle = { color, alpha: alpha !== undefined ? alpha : 1 };
    },
    fillRect(x, y, w, h) {
      operations.push({ type: 'fillRect', x, y, w, h, style: currentFillStyle });
    },
    fillCircle(x, y, r) {
      operations.push({ type: 'fillCircle', x, y, r, style: currentFillStyle });
    },
    fillRoundedRect(x, y, w, h, r) {
      operations.push({ type: 'fillRoundedRect', x, y, w, h, r, style: currentFillStyle });
    },
    fillTriangle(x1, y1, x2, y2, x3, y3) {
      operations.push({ type: 'fillTriangle', x1, y1, x2, y2, x3, y3, style: currentFillStyle });
    },
    lineStyle(width, color, alpha) {
      currentLineStyle = { width, color, alpha: alpha !== undefined ? alpha : 1 };
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
    strokeTriangle(x1, y1, x2, y2, x3, y3) {
      operations.push({ type: 'strokeTriangle', x1, y1, x2, y2, x3, y3, style: currentLineStyle });
    },
    lineBetween(x1, y1, x2, y2) {
      operations.push({ type: 'lineBetween', x1, y1, x2, y2, style: currentLineStyle });
    },
    beginPath() {
      currentPath = [];
    },
    moveTo(x, y) {
      if (currentPath) currentPath.push({ type: 'moveTo', x, y });
    },
    lineTo(x, y) {
      if (currentPath) currentPath.push({ type: 'lineTo', x, y });
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
    fill() {
      // Remplir le path courant (après beginPath/moveTo/lineTo/closePath)
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
    setDepth(depth) {
      g.depth = depth;
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
          // Si c'est un graphics ou rectangle avec des operations, l'ajouter à la liste
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

  const createRectangle = (x, y, w, h, color, alpha) => {
    const rect = {
      x, y, w, h, color, alpha,
      setStrokeStyle(width, strokeColor, strokeAlpha) {
        rect.strokeStyle = { width, color: strokeColor, alpha: strokeAlpha !== undefined ? strokeAlpha : 1 };
        // Enregistrer comme opération pour le dessin
        if (!rect.operations) rect.operations = [];
        rect.operations.push({ type: 'strokeRect', x, y, w, h, style: rect.strokeStyle });
      },
      operations: [],
    };
    // Enregistrer le rectangle rempli
    rect.operations.push({ type: 'fillRect', x, y, w, h, style: { color, alpha: alpha !== undefined ? alpha : 1 } });
    allGraphics.push(rect);
    return rect;
  };

  const createText = (x, y, text, style) => {
    const textObj = {
      x, y, text, style,
      setOrigin(originX, originY) {
        textObj.originX = originX;
        textObj.originY = originY !== undefined ? originY : originX;
        return textObj; // Permettre le chaînage
      },
      setFontSize(size) {
        textObj.fontSize = size;
        return textObj;
      },
      setColor(color) {
        textObj.color = color;
        return textObj;
      },
      setDepth(depth) {
        textObj.depth = depth;
        return textObj;
      },
    };
    return textObj;
  };

  const createEllipse = (x, y, w, h, color, alpha) => {
    const ellipse = {
      x, y, w, h, color, alpha,
      setDepth(depth) {
        ellipse.depth = depth;
        return ellipse;
      },
      scaleY: 1,
    };
    return ellipse;
  };

  return {
    add: {
      graphics: createGraphics,
      container: createContainer,
      rectangle: createRectangle,
      text: createText,
      ellipse: createEllipse,
    },
    containers,
    allGraphics,
  };
}

function drawOperations(ctx, operations) {
  if (!operations || operations.length === 0) {
    console.warn('[TurretPreview] Aucune opération à dessiner');
    return;
  }
  
  operations.forEach((op, index) => {
    try {
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
      } else if (op.type === 'fillRoundedRect' && op.style) {
        ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
        ctx.globalAlpha = op.style.alpha;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(op.x, op.y, op.w, op.h, op.r);
        } else {
          // Fallback pour navigateurs qui ne supportent pas roundRect
          const r = op.r;
          ctx.moveTo(op.x + r, op.y);
          ctx.lineTo(op.x + op.w - r, op.y);
          ctx.quadraticCurveTo(op.x + op.w, op.y, op.x + op.w, op.y + r);
          ctx.lineTo(op.x + op.w, op.y + op.h - r);
          ctx.quadraticCurveTo(op.x + op.w, op.y + op.h, op.x + op.w - r, op.y + op.h);
          ctx.lineTo(op.x + r, op.y + op.h);
          ctx.quadraticCurveTo(op.x, op.y + op.h, op.x, op.y + op.h - r);
          ctx.lineTo(op.x, op.y + r);
          ctx.quadraticCurveTo(op.x, op.y, op.x + r, op.y);
          ctx.closePath();
        }
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
      } else if (op.type === 'strokeTriangle' && op.style) {
        ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
        ctx.lineWidth = op.style.width;
        ctx.globalAlpha = op.style.alpha;
        ctx.beginPath();
        ctx.moveTo(op.x1, op.y1);
        ctx.lineTo(op.x2, op.y2);
        ctx.lineTo(op.x3, op.y3);
        ctx.closePath();
        ctx.stroke();
      } else if (op.type === 'strokeRoundedRect' && op.style) {
        ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
        ctx.lineWidth = op.style.width;
        ctx.globalAlpha = op.style.alpha;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(op.x, op.y, op.w, op.h, op.r);
        } else {
          // Fallback pour navigateurs qui ne supportent pas roundRect
          const r = op.r;
          ctx.moveTo(op.x + r, op.y);
          ctx.lineTo(op.x + op.w - r, op.y);
          ctx.quadraticCurveTo(op.x + op.w, op.y, op.x + op.w, op.y + r);
          ctx.lineTo(op.x + op.w, op.y + op.h - r);
          ctx.quadraticCurveTo(op.x + op.w, op.y + op.h, op.x + op.w - r, op.y + op.h);
          ctx.lineTo(op.x + r, op.y + op.h);
          ctx.quadraticCurveTo(op.x, op.y + op.h, op.x, op.y + op.h - r);
          ctx.lineTo(op.x, op.y + r);
          ctx.quadraticCurveTo(op.x, op.y, op.x + r, op.y);
          ctx.closePath();
        }
        ctx.stroke();
      } else if (op.type === 'fillPath' && op.path && op.style) {
        ctx.fillStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
        ctx.globalAlpha = op.style.alpha;
        ctx.beginPath();
        op.path.forEach(step => {
          if (step.type === 'moveTo') ctx.moveTo(step.x, step.y);
          else if (step.type === 'lineTo') ctx.lineTo(step.x, step.y);
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
          else if (step.type === 'closePath') ctx.closePath();
        });
        ctx.stroke();
      } else if (op.type === 'lineBetween' && op.style) {
        ctx.strokeStyle = `#${op.style.color.toString(16).padStart(6, '0')}`;
        ctx.lineWidth = op.style.width;
        ctx.globalAlpha = op.style.alpha;
        ctx.beginPath();
        ctx.moveTo(op.x1, op.y1);
        ctx.lineTo(op.x2, op.y2);
        ctx.stroke();
      } else {
        console.warn(`[TurretPreview] Opération non gérée: ${op.type}`, op);
      }
      ctx.globalAlpha = 1;
    } catch (e) {
      console.warn(`[TurretPreview] Erreur dessin opération ${index} (${op.type}):`, e);
    }
  });
}

function renderTurret() {
  if (!canvasRef.value) {
    console.warn('[TurretPreview] Canvas ref non disponible');
    return;
  }
  
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('[TurretPreview] Contexte canvas non disponible');
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const turret = TURRETS[props.turretKey];
  if (!turret) {
    console.warn(`[TurretPreview] Tourelle ${props.turretKey} non trouvée`);
    return;
  }
  
  if (!turret.onDrawBarrel) {
    console.warn(`[TurretPreview] Tourelle ${props.turretKey} n'a pas de fonction onDrawBarrel`);
    return;
  }
  
  // Centrer le dessin
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1.2, 1.2);
  
  // Dessiner le fond carré blanc semi-transparent
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(-30, -30, 60, 60);
  
  // Créer l'adaptateur de scène
  const sceneAdapter = createSceneAdapter(ctx);
  const container = sceneAdapter.add.container(0, 0);
  
  // Dessiner la base de la tourelle (fond circulaire)
  const baseGraphics = sceneAdapter.add.graphics();
  const baseColor = props.level > 1 ? 0x554422 : 0x333333;
  baseGraphics.fillStyle(baseColor);
  baseGraphics.fillCircle(0, 0, 24);
  baseGraphics.lineStyle(2, 0x111111);
  baseGraphics.strokeCircle(0, 0, 24);
  
  // Indicateurs visuels de niveau sur le socle
  if (props.level >= 2) {
    baseGraphics.fillStyle(0xffff00); // Jaune pour niv 2
    baseGraphics.fillCircle(-10, -18, 3);
  }
  if (props.level >= 3) {
    baseGraphics.fillStyle(0x00ffff); // Cyan pour niv 3
    baseGraphics.fillCircle(10, -18, 3);
  }
  if (props.level >= 4) {
    // Indicateur doré pour le niveau 4
    baseGraphics.fillStyle(0xffd700);
    baseGraphics.fillCircle(0, -20, 4);
    baseGraphics.lineStyle(1, 0xcc9900);
    baseGraphics.strokeCircle(0, -20, 4);
  }
  container.add(baseGraphics);
  
  // Créer un mock turret avec le niveau
  const mockTurret = {
    level: props.level,
    barrelGroup: container,
  };
  
  // Fonction récursive pour collecter tous les graphics avec leurs positions de container
  const collectGraphics = (cont, graphicsList = [], parentX = 0, parentY = 0) => {
    if (!cont) return graphicsList;
    
    const currentX = parentX + (cont.x || 0);
    const currentY = parentY + (cont.y || 0);
    
    if (cont.children && Array.isArray(cont.children)) {
      cont.children.forEach(child => {
        if (child && child.operations && Array.isArray(child.operations)) {
          // Stocker la position du container parent avec les opérations
          graphicsList.push({ graphics: child, containerX: currentX, containerY: currentY });
        }
        // Récursivement chercher dans les containers imbriqués
        if (child && child.children && Array.isArray(child.children)) {
          collectGraphics(child, graphicsList, currentX, currentY);
        }
      });
    }
    
    return graphicsList;
  };
  
  // Appeler la fonction de dessin réelle
  try {
    turret.onDrawBarrel(sceneAdapter, container, turret.color, mockTurret);
    
    // Récupérer toutes les opérations des graphics (récursivement)
    const allGraphics = collectGraphics(container);
    const allOperations = [];
    
    allGraphics.forEach(({ graphics: g, containerX, containerY }) => {
      if (g && g.operations && Array.isArray(g.operations)) {
        // Appliquer l'offset du container aux opérations
        g.operations.forEach(op => {
          const adjustedOp = { ...op };
          // Ajuster les coordonnées selon le type d'opération
          if (op.type === 'fillRect' || op.type === 'strokeRect') {
            adjustedOp.x = op.x + containerX;
            adjustedOp.y = op.y + containerY;
          } else if (op.type === 'fillCircle' || op.type === 'strokeCircle') {
            adjustedOp.x = op.x + containerX;
            adjustedOp.y = op.y + containerY;
          } else if (op.type === 'fillRoundedRect' || op.type === 'strokeRoundedRect') {
            adjustedOp.x = op.x + containerX;
            adjustedOp.y = op.y + containerY;
          } else if (op.type === 'fillTriangle' || op.type === 'strokeTriangle') {
            adjustedOp.x1 = op.x1 + containerX;
            adjustedOp.y1 = op.y1 + containerY;
            adjustedOp.x2 = op.x2 + containerX;
            adjustedOp.y2 = op.y2 + containerY;
            adjustedOp.x3 = op.x3 + containerX;
            adjustedOp.y3 = op.y3 + containerY;
          } else if (op.type === 'fillEllipse' || op.type === 'strokeEllipse') {
            adjustedOp.x = op.x + containerX;
            adjustedOp.y = op.y + containerY;
          } else if (op.type === 'lineBetween') {
            adjustedOp.x1 = op.x1 + containerX;
            adjustedOp.y1 = op.y1 + containerY;
            adjustedOp.x2 = op.x2 + containerX;
            adjustedOp.y2 = op.y2 + containerY;
          } else if (op.type === 'fillPath' || op.type === 'strokePath') {
            adjustedOp.path = op.path.map(step => {
              if (step.type === 'moveTo' || step.type === 'lineTo') {
                return { ...step, x: step.x + containerX, y: step.y + containerY };
              } else if (step.type === 'arc') {
                return { ...step, x: step.x + containerX, y: step.y + containerY };
              }
              return step;
            });
          }
          allOperations.push(adjustedOp);
        });
      }
    });
    
    // Aussi vérifier allGraphics de l'adaptateur (ceux qui ne sont pas dans des containers)
    sceneAdapter.allGraphics.forEach(g => {
      if (g && g.operations && Array.isArray(g.operations)) {
        // Vérifier si ce graphics n'est pas déjà dans allGraphics
        const alreadyIncluded = allGraphics.some(({ graphics }) => graphics === g);
        if (!alreadyIncluded) {
          allOperations.push(...g.operations);
        }
      }
    });
    
    // Dessiner les opérations
    if (allOperations.length > 0) {
      drawOperations(ctx, allOperations);
    } else {
      console.warn(`[TurretPreview] Aucune opération trouvée pour ${props.turretKey}`);
      console.warn(`[TurretPreview] Container children:`, container.children?.length || 0);
      console.warn(`[TurretPreview] AllGraphics de l'adaptateur:`, sceneAdapter.allGraphics.length);
    }
  } catch (e) {
    console.error(`[TurretPreview] Erreur dessin tourelle ${props.turretKey}:`, e);
    console.error(e.stack);
  }
  
  ctx.restore();
}

const tryRender = () => {
  if (canvasRef.value) {
    renderTurret();
  } else {
    setTimeout(tryRender, 50);
  }
};

watch([() => props.turretKey, () => props.level], () => {
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
.turret-preview-canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>



