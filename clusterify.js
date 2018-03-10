const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

module.exports = app => {
  if (cluster.isMaster) {
    console.log(`master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (deadWorker, code, signal) => {
      console.log(`worker ${deadWorker.process.pid} died.`);
      if (signal != 'SIGINT') {
        const worker = cluster.fork();
        console.log(`worker ${worker.process.pid} born.`);
      }
    });
  } else {
    app.listen(PORT, () => console.log(`worker ${process.pid} started`));
  }
};
