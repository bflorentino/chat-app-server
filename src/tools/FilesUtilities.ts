import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import multer from 'multer'
import path from 'path';

export default class FileUtilities{

    constructor(){}
    
    public saveImage = async (arrayBuffer:number[], directory:string) => {

        const image = Buffer.from(arrayBuffer)
        const fileName = `${randomUUID()}.jpg`
        console.log(fileName)
        await fs.writeFile( `${process.cwd()}/public/${directory}/${fileName}`, image)

        return fileName
    }
}