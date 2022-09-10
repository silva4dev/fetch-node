import log from 'log';
import logNode from 'log-node';
import fetch from 'cross-fetch';

process.env['LOG_LEVEL'] = 'info';
logNode();

const launches = new Map();

async function downloadLaunchData() {
  log.info('Downloading launch data...');
  const response = await fetch('https://api.spacexdata.com/v3/launches', {
    method: 'GET',
  });

  if (!response.ok) {
    log.warning('Problem downloading launch data.');
    throw new Error('Launch data download failed.');
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const [payloads] = launch['rocket']['second_stage']['payloads'];
    const flightData = {
      flightNumber: launch['flight_number'],
      mission: launch['mission_name'],
      rocket: launch['rocket']['rocket_name'],
      customers: payloads['customers'],
    };
    launches.set(flightData.flightNumber, flightData);
    log.info(JSON.stringify(flightData));
  }
}

async function finishLaunchData() {
  await downloadLaunchData();
  log.info(`Downloaded data for ${launches.size} SpaceX launches.`);
}

finishLaunchData();
