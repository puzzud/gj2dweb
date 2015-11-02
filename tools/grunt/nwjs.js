/*global module*/

module.exports = function (grunt, tasks) {
  'use strict';
  
  // Load node module required for this task.
  grunt.loadNpmTasks('grunt-nw-builder');

  // The configuration for a specific task.
  tasks.nwjs = {
    // The files that we want to check.
    options: {
      version: "0.12.3", // NOTE: Need to use an old fixed version until grunt-nw-builder and nw-builder improve support.
      platforms: ['win64', 'osx64', 'linux64'], // TODO: Pull these platforms from package.json somehow?
      buildDir: grunt.uriBuild, // Where the build version of my NW.js app is saved.
      cacheDir: grunt.uri + 'node_modules/grunt-nw-builder/cache'
    },
    src: [grunt.uri + 'www/**/*'] // NW.js app location.
  };

  return tasks;
};