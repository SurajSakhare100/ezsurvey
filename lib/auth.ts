// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { getServerSession as getNextAuthServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })

        if (!user || !user?.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user'
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    newUser: "/auth/register"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      if (account?.provider === "google") {
        try {
          await connectDB()
          const existingUser = await User.findOne({ email: token.email })
          if (!existingUser) {
            const newUser = await User.create({
              email: token.email,
              name: token.name,
              password: await bcrypt.hash(Math.random().toString(36), 10),
              profile: {
                avatar: token.picture
              }
            })
            token.id = newUser._id.toString()
          } else {
            token.id = existingUser._id.toString()
          }
        } catch (error) {
          console.error('Error in Google auth:', error)
          throw new Error("Failed to create or find user")
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
}

// Helper function to get the current user's ID from the session
export async function getCurrentUserId() {
  const session = await getNextAuthServerSession(authOptions)
  return session?.user?.id
}



