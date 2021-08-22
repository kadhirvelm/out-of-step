import rewire from "rewire"
const checkIfIsError = rewire("./checkIfIsError")
const isError = checkIfIsError.__get__("isError")
// @ponicode
describe("isError", () => {
    test("0", () => {
        let callFunction: any = () => {
            isError(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isError({ error: "invalid choice" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isError({ error: "multiple errors occurred" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isError({ error: "error" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isError({ error: "error\n" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isError({ error: "" })
        }
    
        expect(callFunction).not.toThrow()
    })
})
