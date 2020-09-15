import * as MatomoTracker from 'matomo-tracker'

const matomo =
  process.env.API_MATOMO_ID &&
  Number(process.env.API_MATOMO_ID) &&
  process.env.API_MATOMO_URL
    ? new MatomoTracker(
        Number(process.env.API_MATOMO_ID),
        `${process.env.API_MATOMO_URL}/matomo.php`,
        false
      )
    : null

export default matomo
