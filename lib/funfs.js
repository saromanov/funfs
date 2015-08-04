"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var fs = _interopRequire(require("fs"));

var fuse = _interopRequire(require("fuse-bindings"));

var path = _interopRequire(require("path"));

var FunFS = exports.FunFS = (function () {
    function FunFS() {
        _classCallCheck(this, FunFS);
    }

    _createClass(FunFS, {
        mount: {
            value: function mount(mountpath) {
                funfs_mount(mountpath);
            }
        },
        unmount: {
            value: function unmount(mountpath) {
                funfs_unmount(mountpath);
            }
        }
    });

    return FunFS;
})();

var funfs_mount = function funfs_mount(mountpath) {
    fuse.mount(mountpath, {

        readdir: function readdir(mountpath, cb) {
            console.log(mountpath);
            fs.readdir(mountpath, function (err, result) {
                if (err) {
                    cb(fuse.errno(err.code));
                }

                cb(0, result);
            });
        },

        getattr: function getattr(dpath, cb) {
            //let targetpath = path.join(mountpath, dpath);
            console.log("getattr(%s)", dpath);
            if (dpath === "/") {
                cb(0, {
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date(),
                    size: 100,
                    mode: 16877,
                    uid: process.getuid(),
                    gid: process.getgid()
                });
                return;
            }

            cb(fuse.ENOENT);
        },

        open: function open(mountpath, permissions, cb) {
            console.log("OPEN: ", mountpath);
            fs.open(mountpath, permissions, function (err, result) {
                if (err) {
                    cb(fuse.errno(err));
                }

                cb(0, result);
            });
        },

        create: function create(mountpath, cb) {
            fs.open(mountpath, "w", function (err, result) {});
        },

        read: function read(mountpath, cb) {
            fs.read(mountpath, function (err, data) {
                if (err) {
                    cb(fuse.errno(err));
                }
                cb(0, data);
            });
        },

        write: function write(mountpath, buffer, offset, length, cb) {
            fs.write(mountpath, buffer, offset, length, function (err, info) {
                if (err) {
                    cb(fuse.errno(err));
                }
            });
        },

        fsync: function fsync(fd, cb) {
            fs.fsync(fd, function (err) {
                if (err) {
                    cb(fuse.errno(err));
                }
            });
        },

        mkdir: function mkdir(dirpath, mode, cb) {
            var targetpath = path.join(mountpath, dirpath);
            console.log("MKDIR: ", targetpath);
            cb(0);
            /*fs.mkdir(targetpath, mode, (err) => {
                if(err){
                    cb(fuse.errno(err));
                }
                cb(0);
             });*/
        }
    });
};

var funfs_unmount = function funfs_unmount(mountpath) {
    fuse.unmount(mountpath, function (err) {
        if (err) {
            console.error(err);
        }
    });
};