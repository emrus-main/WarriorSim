importScripts(
    './data/buffs.min.js',
    './data/levelstats.min.js',
    './data/spells2.min.js',
    './data/talents.min.js',
    './classes/player.js',
    './classes/simulation.js',
    './classes/spell.js',
    './classes/weapon.min.js',
    './globals.min.js',
);

onmessage = (event) => {
    const params = event.data;
    if (params.globals.sod) importScripts('./data/gear_sod.min.js','./data/runes.min.js');
    else importScripts('./data/gear.min.js');
    updateGlobals(params.globals);
    // console.log('starting sim-worker', params);
    const player = new Player(...params.player);
    const sim = new Simulation(player, (report) => {
        // Finished
        if (params.fullReport) {
            report.player = player.serializeStats();
            report.spread = sim.spread;
        }
        postMessage([TYPE.FINISHED, report]);
    }, (iteration, report) => {
        // Update
        postMessage([TYPE.UPDATE, iteration, report]);
    }, params.sim);
    sim.startSync();
};

// console.log('sim-worker loaded');
