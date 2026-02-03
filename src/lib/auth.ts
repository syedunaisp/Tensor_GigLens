import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(prisma), // Disabled due to Prisma binary issues
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Mock auth for now - accept any login in dev
                // In production, verify against DB
                if (!credentials?.email || !credentials?.password) return null;

                // Check if user exists, if not create mock user for dev
                // This is just for the prototype phase
                const user = { id: "1", name: "Demo User", email: credentials.email, role: "gig_worker" };
                return user;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                // session.user.id = token.sub; // Add ID to session if needed
            }
            return session;
        },
    },
};
