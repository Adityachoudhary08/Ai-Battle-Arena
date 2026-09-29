import express from "express";
import battle, { getHistory, getLeaderboard, getAvailableModels } from "./ai/graph.ai.js";
import  cors from "cors";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";



const app = express();
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
}))

type User = { email: string; passwordHash: string; salt: string };
const users = new Map<string, User>();
const sessions = new Map<string, string>();

function hashPassword(password: string, salt: string) {
    return scryptSync(password, salt, 64).toString("hex");
}

function getAuthenticatedUser(req: express.Request) {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    return token ? sessions.get(token) : undefined;
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!getAuthenticatedUser(req)) {
        res.status(401).json({ message: "Please log in to view your history and leaderboard." });
        return;
    }
    next();
}

app.post('/auth/register', (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || password.length < 6) {
        res.status(400).json({ message: "Use a valid email and a password with at least 6 characters." });
        return;
    }
    if (users.has(email)) {
        res.status(409).json({ message: "An account with this email already exists." });
        return;
    }

    const salt = randomBytes(16).toString("hex");
    users.set(email, { email, salt, passwordHash: hashPassword(password, salt) });
    const token = randomUUID();
    sessions.set(token, email);
    res.status(201).json({ token, user: { email } });
});

app.post('/auth/login', (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = users.get(email);

    if (!user) {
        res.status(401).json({ message: "Email or password is incorrect." });
        return;
    }

    const expected = Buffer.from(user.passwordHash, "hex");
    const actual = Buffer.from(hashPassword(password, user.salt), "hex");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        res.status(401).json({ message: "Email or password is incorrect." });
        return;
    }

    const token = randomUUID();
    sessions.set(token, email);
    res.json({ token, user: { email } });
});

// Get available models for the frontend dropdown
app.get('/models', (req, res) => {
    res.json({ models: getAvailableModels() });
});

// Battle endpoint - now accepts model choices
app.post("/invoke", async (req, res) => {
    const { input, model1, model2 } = req.body;

    // Default models if not specified
    const m1 = model1 || "groq:openai/gpt-oss-20b";
    const m2 = model2 || "cohere:command-a-03-2025";

    try {
        const result = await battle(input, m1, m2);
        res.status(200).json({
            message: "Battle completed successfully",
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error("Battle error:", error.message);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
});

// Get battle history
app.get('/history', requireAuth, (req, res) => {
    res.json({ history: getHistory() });
});

// Get leaderboard
app.get('/leaderboard', requireAuth, (req, res) => {
    res.json({ leaderboard: getLeaderboard() });
});



export default app;
