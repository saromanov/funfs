import fs from "fs";
import fuse from "fuse-bindings";
import path from "path";

export class FunFS{

    mount(mountpath){
        funfs_mount(mountpath);
    }

    unmount(mountpath){
        funfs_unmount(mountpath);
    }
}


let funfs_mount = function(mountpath){
     checkdir(mountpath);
     fuse.mount(mountpath, {

        readdir(mountpath, cb) {
           console.log(mountpath);
           fs.readdir(mountpath, (err, result) =>{
               if(err){
                cb(fuse.errno(err.code));
                }
             
             cb(0, result);
        });

        },

        getattr(mountpath, cb) {
            console.log('getattr(%s)', mountpath);
            if (mountpath === '/') {
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

        open(mountpath, permissions, cb){
            fs.open(mountpath, permissions, (err, result) => {
                if(err){
                    cb(fuse.errno(err));
                }

                cb(0, result);
            });
        },

        create(mountpath, cb){
            fs.open(mountpath, 'w', (err, result) => {
                
            });
        },

        read(mountpath, cb){
            fs.read(mountpath, (err, data) => {
                if(err){
                    cb(fuse.errno(err));
                }
                cb(0, data);
            });
        },

        write(mountpath, buffer, offset, length, cb){
            fs.write(mountpath, buffer, offset, length, function(err, info){
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

        mkdir(dirpath, mode, cb){
            let targetpath = path.join(mountpath,dirpath);
            console.log("MKDIR: ", targetpath);
            fs.mkdir(targetpath, mode, (err) => {
                if(err){
                    cb(fuse.errno(err));
                }

                cb(ENOENT)
            });
        }
    });

}

let checkdir = function(mountpath){
    if(!fs.existsSync(mountpath)){
        fs.mkdirSync(mountpath);
    }
}

let funfs_unmount = function(mountpath){
    fuse.unmount(mountpath, err => {

    });
}

