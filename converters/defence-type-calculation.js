const types = {
    default: 'Other',
    weaponry: 'Other Weaponry',
    artillery: 'Artillery',
    pillbox: 'Pillbox',
    obstacles: 'Obstacles'
}

const typeConversions = [
    [[/.*/, /Artillery/], types.artillery],
    [[/.*/, /Flame Warfare/], types.weaponry],
    [[/.*/, /Pillboxes/], types.pillbox],
    [[/.*/, /Obstacles/], types.obstacles],
    [[/Anti Tank Measures/, /Anti Tank Island/], types.obstacles],
    [[/Anti Tank Measures/, /Artillery/, /Pillbox.*/], types.pillbox],
    [[/.*/, /.*/, /Spigot Mortar Emplacement/], types.weaponry]
]

function guessType(categories) {
    let newType = types.default
    typeConversions.forEach(([filters, type]) => {
        if (filters.length <= categories.length) {
            for (let i = 0; i < filters.length; i++) {
                if (filters[i].test(categories[i])) {
                    if (i == filters.length - 1) {
                        newType = type
                    }
                } else {
                    break;
                }
            }
        }
    })
    return newType
}

module.exports = {
    guessType
}
