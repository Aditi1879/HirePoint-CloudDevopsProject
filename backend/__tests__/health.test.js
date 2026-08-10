import request from "supertest";
import app from "../app.js";

describe("Health Check", () => {
    test("GET /health should return 200 and healthy status", async () => {
        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("OK");
        expect(response.body.message).toBe("HirePoint backend is healthy");
    });
});