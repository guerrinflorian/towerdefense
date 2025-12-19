export function addStatLine(scene, xPos, yPos, lineHeight, fontSize, label, leftValue, rightValue) {
  const leftText = scene.add
    .text(xPos, yPos, `${label} : ${leftValue}`, {
      fontSize: `${fontSize}px`,
      fill: "#ffffff",
      fontFamily: "Arial",
    })
    .setDepth(241);

  const rightText = scene.add
    .text(xPos + leftText.width, yPos, `${rightValue}`, {
      fontSize: `${fontSize}px`,
      fill: "#00ff00",
      fontStyle: "bold",
      fontFamily: "Arial",
    })
    .setDepth(241);

  scene.upgradeTextLines.push(leftText, rightText);
  scene.upgradeMenu.add([leftText, rightText]);

  return yPos + lineHeight;
}

export function renderBarracksUpgrade(scene, turret, xPos, yPosStart, lineHeight, fontSize) {
  const s = scene.scaleFactor;
  let yPos = yPosStart;

  const level = turret.level || 1;
  const soldiersCount = turret.config.soldiersCount[level - 1] || 2;
  const respawnTime = turret.config.respawnTime[level - 1] || 12000;
  const soldierHp = turret.config.soldierHp[level - 1] || 100;

  const nextStats = turret.getNextLevelStats?.();

  const title = scene.add
    .text(xPos, yPos, `Caserne - Niveau ${level}`, {
      fontSize: `${fontSize + 2}px`,
      fill: "#ffffff",
      fontStyle: "bold",
      fontFamily: "Arial",
    })
    .setDepth(241);

  scene.upgradeTextLines.push(title);
  scene.upgradeMenu.add(title);
  yPos += lineHeight * 1.5;

  if (nextStats) {
    const nextSoldiers = turret.config.soldiersCount[level] || 3;
    const nextRespawn = turret.config.respawnTime[level] || 10000;
    const nextHp = turret.config.soldierHp[level] || 120;

    yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Soldats", `${soldiersCount} > `, `${nextSoldiers}`);
    yPos = addStatLine(
      scene,
      xPos,
      yPos,
      lineHeight,
      fontSize,
      "Respawn",
      `${(respawnTime / 1000).toFixed(1)}s > `,
      `${(nextRespawn / 1000).toFixed(1)}s`
    );
    yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "HP Soldat", `${soldierHp} > `, `${nextHp}`);

    yPos += lineHeight * 0.5;

    const canAfford = scene.money >= nextStats.cost;
    const costText = scene.add
      .text(xPos, yPos, `Coût : `, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    const costValue = scene.add
      .text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
        fontSize: `${fontSize}px`,
        fill: canAfford ? "#ffd700" : "#ff4444",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);

    scene.upgradeTextLines.push(costText, costValue);
    scene.upgradeMenu.add([costText, costValue]);
  } else {
    const soldiersText = scene.add
      .text(xPos, yPos, `Soldats : ${soldiersCount}`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(soldiersText);
    scene.upgradeMenu.add(soldiersText);
    yPos += lineHeight;

    const respawnText = scene.add
      .text(xPos, yPos, `Respawn : ${(respawnTime / 1000).toFixed(1)}s`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(respawnText);
    scene.upgradeMenu.add(respawnText);
    yPos += lineHeight;

    const hpText = scene.add
      .text(xPos, yPos, `HP Soldat : ${soldierHp}`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(hpText);
    scene.upgradeMenu.add(hpText);
    yPos += lineHeight * 1.5;

    const maxText = scene.add
      .text(xPos, yPos, `Niveau Maximum`, {
        fontSize: `${fontSize}px`,
        fill: "#ff0000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(maxText);
    scene.upgradeMenu.add(maxText);
  }
}

export function renderTurretUpgrade(scene, turret, xPos, yPosStart, lineHeight, fontSize) {
  let yPos = yPosStart;

  const level = turret.level || 1;
  const nextStats = turret.getNextLevelStats?.();

  const title = scene.add
    .text(xPos, yPos, `${turret.config.name} - Niveau ${level}`, {
      fontSize: `${fontSize + 2}px`,
      fill: "#ffffff",
      fontStyle: "bold",
      fontFamily: "Arial",
    })
    .setDepth(241);

  scene.upgradeTextLines.push(title);
  scene.upgradeMenu.add(title);
  yPos += lineHeight * 1.5;

  const currentDamage = turret.config.damage || 0;
  const currentRate = turret.config.rate || 0;
  const currentRange = turret.config.range || 0;

  if (nextStats) {
    yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Dégâts", `${currentDamage} > `, `${nextStats.damage || 0}`);
    yPos = addStatLine(
      scene,
      xPos,
      yPos,
      lineHeight,
      fontSize,
      "Cadence",
      `${(currentRate / 1000).toFixed(1)}s > `,
      `${((nextStats.rate || 0) / 1000).toFixed(1)}s`
    );
    yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Portée", `${currentRange} > `, `${nextStats.range || 0}`);

    if (nextStats.aoe) {
      yPos = addStatLine(scene, xPos, yPos, lineHeight, fontSize, "Zone", `${turret.config.aoe || 0} > `, `${nextStats.aoe}`);
    }

    yPos += lineHeight * 0.5;

    const canAfford = scene.money >= nextStats.cost;
    const costText = scene.add
      .text(xPos, yPos, `Coût : `, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    const costValue = scene.add
      .text(xPos + costText.width, yPos, `${nextStats.cost}$`, {
        fontSize: `${fontSize}px`,
        fill: canAfford ? "#ffd700" : "#ff4444",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);

    scene.upgradeTextLines.push(costText, costValue);
    scene.upgradeMenu.add([costText, costValue]);
  } else {
    const damageText = scene.add
      .text(xPos, yPos, `Dégâts : ${currentDamage}`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(damageText);
    scene.upgradeMenu.add(damageText);
    yPos += lineHeight;

    const rateText = scene.add
      .text(xPos, yPos, `Cadence : ${(currentRate / 1000).toFixed(1)}s`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(rateText);
    scene.upgradeMenu.add(rateText);
    yPos += lineHeight;

    const rangeText = scene.add
      .text(xPos, yPos, `Portée : ${currentRange}`, {
        fontSize: `${fontSize}px`,
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(rangeText);
    scene.upgradeMenu.add(rangeText);
    yPos += lineHeight;

    if (turret.config.aoe) {
      const aoeText = scene.add
        .text(xPos, yPos, `Zone : ${turret.config.aoe}`, {
          fontSize: `${fontSize}px`,
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        .setDepth(241);
      scene.upgradeTextLines.push(aoeText);
      scene.upgradeMenu.add(aoeText);
      yPos += lineHeight;
    }

    yPos += lineHeight * 0.5;

    const maxText = scene.add
      .text(xPos, yPos, `Niveau Maximum`, {
        fontSize: `${fontSize}px`,
        fill: "#ff0000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(241);
    scene.upgradeTextLines.push(maxText);
    scene.upgradeMenu.add(maxText);
  }
}
