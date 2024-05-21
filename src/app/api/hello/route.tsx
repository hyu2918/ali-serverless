import type { VercelRequest, VercelResponse } from "@vercel/node";

const lark = require("@larksuiteoapi/node-sdk");
const crypto = require("crypto");

// 如果你不想配置环境变量，或环境变量不生效，则可以把结果填写在每一行最后的 "" 内部
const FEISHU_APP_ID = process.env.APPID || "cli_a6caf576fff8d00c"; // 飞书的应用 ID
const FEISHU_APP_SECRET =
  process.env.SECRET || "cfulHANQwiwhD31Dk6LC2cCQSjftVsG3"; // 飞书的应用的 Secret
const FEISHU_BOTNAME = process.env.BOTNAME || ""; // 飞书机器人的名字
const OPENAI_KEY = process.env.KEY || ""; // OpenAI 的 Key
const OPENAI_MODEL = process.env.MODEL || "gpt-3.5-turbo"; // 使用的模型
const OPENAI_MAX_TOKEN = process.env.MAX_TOKEN || 1024; // 最大 token 的值

class AESCipher {
  key: any;
  constructor(key:string) {
    const hash = crypto.createHash("sha256");
    hash.update(key);
    this.key = hash.digest();
  }
  decrypt(encrypt:any) {
    const encryptBuffer = Buffer.from(encrypt, "base64");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      this.key,
      encryptBuffer.slice(0, 16)
    );
    let decrypted = decipher.update(
      encryptBuffer.slice(16).toString("hex"),
      "hex",
      "utf8"
    );
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body } = req;
  console.log("test")
  console.log("req",req)
  console.log("req.body",body)
  const encrypt = req.body.encrypt;
  const cipher = new AESCipher("SD33q5R2ppdsm7qETvyCqhJf2DJJIyAS");
  const result = JSON.parse(cipher.decrypt(encrypt));
  // console.log('req.body',req.body)
  console.log(result);

  return res.json({
    "challenge": result["challenge"],
  });

  // const { name = "World" } = req.query;
  // return res.json({
  //   message: `Hello ${name}!`,
  // });
}
