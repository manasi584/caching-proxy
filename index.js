const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const CachingProxyServer = require('./caching-proxy');

yargs(hideBin(process.argv))
  .command(
    'start <port> <origin>',
    'Start the caching proxy server',
    (yargs) => {
      return yargs
        .positional('port', {
          describe: 'Port to run server on',
          type: 'number',
        })
        .positional('origin', {
          describe: 'Origin server URL',
          type: 'string',
        });
    },
    async (argv) => {
      const { port, origin } = argv;
      if(!port || !origin) {
        console.error('Both port and origin are required');
        process.exit(1);
      }
      
      const server = new CachingProxyServer(port, origin);
      await server.start();
      //console.log(`Starting caching proxy server on port ${port} with origin ${origin}`);
    }
  )
  .command(
    'clear',
    'Clear the cache',
    () => {},
    () => {
      const server = new CachingProxyServer();
      server.clearCache();
      console.log('Cache cleared');
    }
  )
  .argv;

