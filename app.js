require("dotenv").config();
const utils = require("./utils");

const STEAM_BASE_URI = "https://api.steampowered.com";
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_IDS = process.env.STEAM_USER_IDS.replace(/\s/g, "").split(",");
const MIN_PLAYTIME = process.env.MIN_PLAYTIME ?? 60;

async function main() {
  let sharedApps = new Map();

  for (const user of STEAM_USER_IDS) {
    const userGamesResponse = await fetch(
      `${STEAM_BASE_URI}/IPlayerService/GetOwnedGames/v0001/?` +
        new URLSearchParams({
          steamid: user,
          include_played_free_games: true,
          include_appinfo: true,
        }),
      { headers: { "x-webapi-key": STEAM_API_KEY } }
    );

    console.log(userGamesResponse);
    if (!userGamesResponse.ok) {
      const resText = await res.text();
      console.log(resText);
      throw new Error(resText);
    }
    const responseData = await userGamesResponse.json();

    console.log(responseData);

    const filteredApps = new Map(
      responseData.response.games
        .filter((x) => x.playtime_forever >= MIN_PLAYTIME)
        .map((obj) => [
          obj.appid,
          { name: obj.name, storeUri: `https://store.steampowered.com/app/${obj.appid}` },
        ])
    );
    utils.intersection(sharedApps, filteredApps);
    sharedApps = sharedApps.size == 0 ? filteredApps : utils.intersection(sharedApps, filteredApps);
  }
  console.log(`Shared games: ${JSON.stringify([...sharedApps.values()], null, 2)}`);
  console.log(`Users: ${JSON.stringify(STEAM_USER_IDS, null, 2)}`);
  console.log(`Minimum playtime: ${MIN_PLAYTIME}`);
  console.log(`Shared games count: ${sharedApps.size}`);
}

main();
