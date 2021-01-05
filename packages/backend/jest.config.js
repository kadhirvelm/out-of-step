export default {
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    coverageReporters: ["json", "lcov", "text", "clover"],
};
