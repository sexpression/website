const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { minify } = require("terser");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownLib = markdownIt({ html: true }).use(markdownItAnchor);
// const pluginTOC = require('eleventy-plugin-toc')
const pluginTOC = require('eleventy-plugin-nesting-toc');

function eleventy(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/svg");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy({ "src/css": "/" });
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.setLibrary("md", markdownLib);
    eleventyConfig.addPlugin(pluginTOC);
    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.error("Terser error: ", err);
            // Fail gracefully.
            callback(null, code);
        }
    });

    return {
        dir: {
            input: "src",
            includes: "_includes",
            layouts: "_layouts",
            data: "_data",
            output: "dist"
        }
    };
}

module.exports = eleventy;