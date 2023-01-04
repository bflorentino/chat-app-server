import bcrypt from 'bcryptjs'

class PasswordUtilities {

    public async encriptPassword(saltPassword: string) {
        const encripted = await bcrypt.hash(saltPassword, 10)
        return encripted
    }

    public compareHash(passwordToCheck:string, realPassword:string) {
        const areEquals = bcrypt.compareSync(passwordToCheck, realPassword)
        return areEquals
    }
}

export default PasswordUtilities