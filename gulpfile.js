const gulp = require("gulp");
const Bundler = require("parcel-bundler");
const path = require("path");
const replace = require("gulp-replace");
const fs = require("fs");
const promisify = require("util").promisify;

const p_copyFile = promisify(fs.copyFile);

const MODULES =  path.join(__dirname, "node_modules");
const WWW = path.join(__dirname, "www");
const BS = path.join(MODULES, "bootstrap", "dist");

/*
gulp.task("css", () => {
	let indexFile = path.join(_dirname, "src", "css", "index.css");
	let bootFile = path.join(BS, "src", "css", "index.css");
	let indexFile = path.join(_dirname, "src", "css", "index.css");
	return p_copyFile(__dirName + "/src/css/index.css", dest)
	.then(() => p_copyFile)
});
*/

gulp.task("fix-cordova", () => {
	let file = path.join(WWW, "index.html");
	return gulp.src([file])
	.pipe(replace(
		/<!--CORDOVA-->/g,
		'<script type="text/javascript" src="cordova.js"></script>'
	))
	.pipe(gulp.dest(WWW + "/"));
});

gulp.task("parcel", () => {
	let opts = {
		outDir: path.join(__dirname, "www"),
		watch: false
	};
	let file = path.join(__dirname, "./src/index.html");
	let bundler = new Bundler(file, opts);
	return bundler.bundle();
});

gulp.task("build", gulp.series("parcel", "fix-cordova"));

gulp.task("watch", () => {
	let opts = {
		outDir: path.join(__dirname, "www"),
		watch: true
	};
	let file = path.join(__dirname, "./src/index.html");
	let bundler = new Bundler(file, opts);
	return bundler.bundle();
});

gulp.task("default", gulp.series("build"));
