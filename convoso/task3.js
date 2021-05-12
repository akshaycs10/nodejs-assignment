const os = require('os');
const serverResource = {
    totalMemoryInMb: os.totalmem() / (1024 * 1024),
    freeMemoryInMb: os.freemem() / (1024 * 1024),
    freememPercentage: (os.freemem() / os.totalmem()) * 100,
    hostname: os.hostname(),
    platform: os.platform(),
    type: os.type(),
    uptimeInSeconds: os.uptime()
}

function getCPUUsage(free, cb) {

    let stats1 = getCPUInfo();
    let startIdle = stats1.idle;
    let startTotal = stats1.total;
    setTimeout(function () {
        let stats2 = getCPUInfo();
        let endIdle = stats2.idle;
        let endTotal = stats2.total;

        let idle = endIdle - startIdle;
        let total = endTotal - startTotal;
        let perc = idle / total;
        if (free === true)
            cb(perc);
        else
            cb(1 - perc);
    }, 1000)
}

function getCPUInfo() {
    let cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    let total = 0;

    for (let cpu in cpus) {
        if (!cpus.hasOwnProperty(cpu)) continue;
        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        irq += cpus[cpu].times.irq;
        idle += cpus[cpu].times.idle;
    }

    total = user + nice + sys + idle + irq;
    return { 'idle': idle, 'total': total };
}
//server resource stats
getCPUUsage(false, function (v) {
    serverResource.cpuUsage = v;
    console.log("Server Resource stats:", serverResource)
});

