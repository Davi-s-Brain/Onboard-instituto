const bcrypt = require("bcryptjs")

export class hashPassword {
  public async hash(text: string): Promise<string> {
    const rounds = process.env.ROUND 
    const salt = await bcrypt.genSalt(rounds)
    return bcrypt.hash(text, salt)
  }

  public async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash)
  }
}