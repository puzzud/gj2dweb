/*global module*/

module.exports = function (grunt, tasks) {
    'use strict';
    
    // Load our node module required for this task.
    grunt.loadNpmTasks('grunt-contrib-csslint');

    // The configuration for a specific task.
    tasks.csslint = {
        // The files that we want to check.
        dist: {
            src: [
                grunt.uriWww + '*.css', // Include all CSS files in this directory.
                grunt.uriWww + '!*.min.css' // Exclude any files ending with `.min.css`
            ]
        }
    };

    return tasks;
};