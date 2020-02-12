const downloadSources = [
    'defence',
    'hills',
    'milestones',
    'trails',
    'follies',
    'rnli',
    'nationalparks',
    'coastallandmarks',
]
const downloaders = new Map(downloadSources.map(processor =>
    [processor, require(`./${processor}_download`)]
));
const processors = new Map([
    ...downloadSources,
    //downloading and processing together
    'nt',
    //processing manually downloaded stuff
    'trigs'
].map(processor => [processor, require(`./${processor}`)]));

let errored = [];

async function single(action, name, processor) {
    console.log(`${action} ${name}: started.`);
    try {
        await processor();
        console.log(`${action} ${name}: completed.`);
    } catch (err) {
        console.log(`${action} ${name}: errored.`);
        console.log(err);
        errored.push(`${action} ${name}`)
    }
}

async function run() {
    for (const [name, processor] of downloaders) {
        await single('Downloading', name, processor)
    }
    if (errored.length == 0) {//only continue if none of the download have errored
        console.log("");
        console.log("Initial download finished, starting processing.");
        console.log("");
        //processing downloaded stuff
        for (const [name, processor] of processors) {
            await single('Processing', name, processor)
        }
    }
    if (errored.length > 0) {
        console.log("");
        console.log(['Some things errored: ', ...errored].join('\n * '))
        process.exit(1)
    }
}

run();
