/* eslint-env node, mocha */
/* istanbul ignore file */
"use strict";

const assert = require("assert");
const plugin = require("./index.js");


function fixtures() { // eslint-disable-line require-jsdoc
    const obj = {};

    obj.files = {
        "index.html": {},
        "foo.html": {},
        "foo/index.html": {},
        "foo/bar.html": {}
    };

    obj.metalsmith = null;

    obj.done = () => {
        obj.done.called = true;
    };

    return obj;
}


describe("metalsmith-link", () => {
    let args;


    beforeEach(() => {
        args = fixtures();
    });


    it("should set the 'href' property with relative link", () => {
        plugin({ index: "" })(args.files, args.metalsmith, args.done);
        assert.strictEqual(args.files["index.html"].href, "/index.html");
        assert.strictEqual(args.files["foo.html"].href, "/foo.html");
        assert.strictEqual(args.files["foo/index.html"].href, "/foo/index.html");
        assert.strictEqual(args.files["foo/bar.html"].href, "/foo/bar.html");
    });


    it("should use the custom property name passed as option", () => {
        plugin({ property: "url", index: "" })(args.files, args.metalsmith, args.done);
        assert.strictEqual(args.files["index.html"].url, "/index.html");
        assert.strictEqual(args.files["foo.html"].url, "/foo.html");
        assert.strictEqual(args.files["foo/index.html"].url, "/foo/index.html");
        assert.strictEqual(args.files["foo/bar.html"].url, "/foo/bar.html");
    });


    it("should remove the filename for index files", () => {
        plugin({ index: "index.html" })(args.files, args.metalsmith, args.done);
        assert.strictEqual(args.files["index.html"].href, "/");
        assert.strictEqual(args.files["foo.html"].href, "/foo.html");
        assert.strictEqual(args.files["foo/index.html"].href, "/foo/");
        assert.strictEqual(args.files["foo/bar.html"].href, "/foo/bar.html");
    });


    it("should prepend the basehref property to the link", () => {
        plugin({ basehref: "https://example.com" })(args.files, args.metalsmith, args.done);
        assert.strictEqual(args.files["index.html"].href, "https://example.com/");
        assert.strictEqual(args.files["foo.html"].href, "https://example.com/foo.html");
        assert.strictEqual(args.files["foo/index.html"].href, "https://example.com/foo/");
        assert.strictEqual(args.files["foo/bar.html"].href, "https://example.com/foo/bar.html");
    });
});
