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
     fuse.mount(path, {

        readdir(path, cb) {
           fs.readdir(path, (err, result) =>{
               if(err){
                cb(fuse.errno(err.code));
                }
             
             cb(0, result);
        });

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
            fs.read(path, function(err, data){
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
            fs.fsync(fd, function(err){
                if(err){
                    cb(fuse.errno(err));
                }
            });
        }
    });

}

let funfs_unmount = function(path){
    fuse.unmount(path, err => {

    });
}

