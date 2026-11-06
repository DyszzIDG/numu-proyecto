import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
            id: string
            role: string
            userProfileId?: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        role: string
        userProfileId?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        userProfileId?: string
        accessToken?: string
    }
}
