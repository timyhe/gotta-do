/*
    Tasks
        clean
        default
        build
        lib
        less
        html
        ts
        watch
        serve
*/
let gulp = require("gulp");
let argv = require("yargs").argv;
let util = require("gulp-util");
let runSequence = require("run-sequence");  // runs tasks 
let browserSync = require("browser-sync").create();

tools = require("imagine-gulp-tools");

// // custom helper task functions
// let helper = {
//     ts: require("./gulp/compileTs"),
//     less: require("./gulp/less"),
//     clean: require("./gulp/clean"),
//     copy: require("./gulp/copyGlob")
// };

let config = {
    folders: {
        src: "src/",
        library: "lib/",
        node_modules: "node_modules/",
        output: "Debug/"
    },
    globs: {
        lessCopy: "css/**/*.less",
        ts: "**/*.ts",
        tests: "**/*.tests.ts",
        templates: "**/*.html",
        json: "json/*.json",
        fonts: "**/*.{ttf,woff,woff2,eot,eof,svg,png}"
    },
    options: {
        watch: false
    },
    library_files: [] // set later
};

// needs to be set here to refer to config.folders
config.library_files = [
    config.folders.library + "lodash/lodash.min.js",
    config.folders.node_modules + "imagine-hermesjs/Release/hermesjs.min.js",
    config.folders.node_modules + "jquery/dist/jquery.min.js",
    config.folders.node_modules + "angular/angular.min.js"
];

let tasks = {
    clean: "clean",
    default: "default",
    build: "build",

    ts: "ts",
    html: "html",
    lib: "lib",
    less: "less",

    serve: "serve",
    watch: "watch"
}

// set flags
if (argv.watch !== undefined) {
    config.options.watch = true;
}

gulp.task(tasks.default, [tasks.build]);

gulp.task(tasks.clean, () => {
    return tools.clean([config.folders.output + "**/*"]);
});

gulp.task(tasks.build, [tasks.clean], (done) => {
    let buildSequence = [tasks.ts, tasks.html, tasks.lib, tasks.less];

    setTimeout(() => { // use timeout to ensure filesystem has finished tasks from clean
        if (config.options.watch)
            runSequence(buildSequence, [tasks.watch], done);
        else
            runSequence(buildSequence, done);
    }, 500)
});

gulp.task(tasks.lib, () => {
    return tools.copyGlob({
        src: config.library_files,
        dest: config.folders.output + "lib/"
    });
});

gulp.task(tasks.less, () => {
    return tools.less(config.folders.src + "css/main.less", config.folders.output);
});

gulp.task(tasks.html, () => {
    return tools.copyGlob({
        src: config.folders.src + "**/*.html",
        dest: config.folders.output
    });
});

gulp.task(tasks.ts, () => {
    return tools.compileTs({
        src: config.folders.src + "**/*.ts",
        optionsSrc: config.folders.src + "tsconfig.json",
        dest: config.folders.output
    });
});

// Serve files from the destination of this project
gulp.task(tasks.serve, () => {
    let server = {
        baseDir: "/",
        routes: {}
    };
    server.routes["/"] = config.folders.output;

    browserSync.init({
        notify: false,  // disable BrowserSync notify popup
        startPath: "/",
        port: 3000,
        server: server
    });
});

function createWatches() {
    util.log("Creating watchers...");
    return [
        gulp.watch(config.folders.src + config.globs.lessCopy, [tasks.less]),
        gulp.watch(config.folders.src + "**/*.html", [tasks.html]),
        gulp.watch(config.folders.src + config.globs.ts, [tasks.ts])
    ];
}

gulp.task(tasks.watch, () => {
    createWatches();
});