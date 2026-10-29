addLayer("y", {
    name: "yellow", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Y", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFC800",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "yellow", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('y',13)) mult = mult.times(upgradeEffect('y',13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "y", description: "Y: Reset for yellow", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return true },
    upgrades: {
        11: {
            title: "epic point booster POWER OF YELLOW",
            description: "x2 points",
            cost: new Decimal(1),
        },
        12: {
            title: "yellow booster",
            description: "Yellow boosts points",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1.1).pow(0.4)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        13: {
            title: "booster yellow",
            description: "Points boost yellow",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        14: {
            title: "make points yellow",
            description: "Points boost points",
            cost: new Decimal(25),
            effect() {
                return player.points.add(1).log(20).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        15: {
            title: "buy yellow things",
            description: "1.5x points & unlock a buyable!",
            cost: new Decimal(100),
            effect() {
                return player.points.add(1).log(20).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        }
    },
    buyables: {
        11: {
            cost(x = new Decimal(0)) { return new Decimal(20).times(x) },
            display() { return "x1.1 points" },
            canAfford() {
                let amount = getBuyableAmount(this.layer, this.id)
                let cost = this.cost(amount)
                return player[this.layer].points.gte(cost)
            },
            buy() {
                let amount = getBuyableAmount(this.layer, this.id)
                let cost = this.cost(amount)
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, amount.add(1))
            },
        }
    }
})
