"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var fs = _interopRequire(require("fs"));

var fuse = _interopRequire(require("fuse-bindings"));

var FunFS = exports.FunFS = (function () {
    function FunFS() {
        _classCallCheck(this, FunFS);
    }

    _createClass(FunFS, {
        mount: {
            value: function mount(path) {
                funfs_mount(path);
            }
        },
        unmount: {
            value: function unmount(path) {
                funfs_unmount(path);
            }
        }
    });

    return FunFS;
})();

var funfs_mount = function funfs_mount(path) {
    fuse.mount(path, {

        readdir: function readdir(path, cb) {
            fs.readdir(path, function (err, result) {
                if (err) {
                    cb(fuse.errno(err.code));
                }

                cb(0, result);
            });
        },

        open: function open(path, permissions, cb) {
            fs.open(path, permissions, function (err, result) {
                if (err) {
                    cb(fuse.errno(err));
                }

                cb(0, result);
            });
        },

        create: function create(path, cb) {
            fs.open(path, "w", function (err, result) {});
        }
    });
};

var funfs_unmount = function funfs_unmount(path) {
    fuse.unmount(path, function (err) {});
};