import fs from "fs";
import fuse from "fuse-bindings";

export class FunFS{

    mount(path){
        funfs_mount(path);
    }

    unmount(path){
        funfs_unmount(path);
    }
}


let funfs_mount = function(path){
     checkdir(path);
     fuse.mount(path, {

        readdir(path, cb) {
           console.log(path);
           fs.readdir(path, (err, result) =>{
               if(err){
                cb(fuse.errno(err.code));
                }
             
             cb(0, result);
        });

        },

        getattr(path, cb) {
            console.log('getattr(%s)', path);
            if (path === '/') {
                cb(0, {
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date(),
                    size: 100,
                    mode: 16877,
                    uid: process.getuid(),
                    gid: process.getgid()
                })
                return;
                }
            
            cb(fuse.ENOENT);

        },

        open(path, permissions, cb){
            fs.open(path, permissions, (err, result) => {
                if(err){
                    cb(fuse.errno(err));
                }

                cb(0, result);
            });
        },

        create(path, cb){
            fs.open(path, 'w', (err, result) => {
                
            });
        },

        read(path, cb){
            fs.read(path, (err, data) => {
                if(err){
                    cb(fuse.errno(err));
                }
                cb(0, data);
            });
        },

        write(path, buffer, offset, length, cb){
            fs.write(path, buffer, offset, length, function(err, info){
                if(err){
                    cb(fuse.errno(err));
                }
            });
        },

        fsync(fd, cb){
            fs.fsync(fd, (err) =>{
                if(err){
                    cb(fuse.errno(err));
                }
            });
        },

        mkdir(path, mode, cb){
            console.log("MKDIR: ", path);
            fs.mkdir(path, mode, (err) => {
                if(err){
                    cb(fuse.errno(err));
                }
            });
        }
    });

}

let checkdir = function(path){
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}

let funfs_unmount = function(path){
    fuse.unmount(path, err => {

    });
}

