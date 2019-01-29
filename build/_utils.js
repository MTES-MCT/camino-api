module.exports = {
  webpackPluginProgressHandler: function(
    percentage,
    msg,
    current,
    active,
    modulepath
  ) {
    if (process.stdout.isTTY && percentage < 1) {
      process.stdout.cursorTo(0)
      modulepath = modulepath
        ? ' …' + modulepath.substr(modulepath.length - 30)
        : ''
      current = current ? ' ' + current : ''
      active = active ? ' ' + active : ''
      process.stdout.write(
        (percentage * 100).toFixed(0) +
          '% ' +
          msg +
          current +
          active +
          modulepath +
          ' '
      )
      process.stdout.clearLine(1)
    } else if (percentage === 1) {
      process.stdout.write('\n')
      console.log('Webpack: done.')
      console.log('Env:', process.env.NODE_ENV)
    }
  },
  webpackRunCallback: function(err, stats) {
    if (err) {
      throw err
    }
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    )
  }
}
