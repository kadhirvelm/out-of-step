import { IToastProps, Toaster } from "@blueprintjs/core";

const toast = Toaster.create();

export function showToast(props: IToastProps) {
    toast?.show(props);
}
