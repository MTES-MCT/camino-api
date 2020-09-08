const MatomoTracker = require('matomo-tracker')

module.exports =
  process.env.MATOMO_SITE_ID &&
  Number(process.env.MATOMO_SITE_ID) &&
  process.env.MATOMO_HOST
    ? new MatomoTracker(
        Number(process.env.MATOMO_SITE_ID),
        `${process.env.MATOMO_HOST}/matomo.php`,
        false
      )
    : null
