export default {
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    roots: ["<rootDir>/src"],
    coverageReporters: ["json", "lcov", "text", "clover"],
};
