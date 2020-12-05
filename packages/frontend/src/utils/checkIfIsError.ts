import { Toast, Toaster } from "@blueprintjs/core";
import { showToast } from "./toaster";

const isError = <T>(maybeError: T | { error: string }): maybeError is { error: string } => {
    return (maybeError as any)?.error !== undefined;
};

export function checkIfIsError<T>(maybeError: T | { error: string }): T | undefined {
    if (isError(maybeError)) {
        showToast({ intent: "danger", message: maybeError.error });
        return undefined;
    }

    return maybeError;
}
