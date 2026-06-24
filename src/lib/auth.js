import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    usePlural: true,
  }),
  emailAndPassword: { 
    enabled: true, 
  },
   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        }, 
    },
  user :{
    additionalFields:{
      role:{
        type: "string",
        defaultValue: "user"
      },
      plan:{
        type: "string",
        defaultValue: "user"
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false
      },
      isPremium: {
        type: "boolean",
        defaultValue: false
      }
    }
  },
  session:{
    cookieCache:{
      enabled:true,
      strategy:'jwt',
      maxAge:60*24*30,
    },
  },
  plugins:[
    jwt()
  ]
  
});